const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const { PDFParse } = require('pdf-parse');
const emailConfig = require('../config/email.config');
const { supabase } = require('../config/supabase.config'); 

class EmailService {
  constructor() {
    this.imap = null;
    this.isConnected = false;
    this.initializeImap();
  }

  initializeImap() {
    this.imap = new Imap({
      user: emailConfig.imap.user,
      password: emailConfig.imap.password,
      host: emailConfig.imap.host,
      port: emailConfig.imap.port,
      tls: emailConfig.imap.tls,
      tlsOptions: emailConfig.imap.tlsOptions,
      authTimeout: emailConfig.imap.authTimeout,
      connTimeout: emailConfig.imap.connTimeout,
      debug: emailConfig.imap.debug,
      keepalive: emailConfig.imap.keepalive,
      auth: {
        user: emailConfig.imap.user,
        pass: emailConfig.imap.password
      }
    });

    this.imap.on('error', (err) => {
      console.error('IMAP error:', err);
      this.isConnected = false;
    });

    this.imap.on('end', () => {
      console.log('IMAP connection ended');
      this.isConnected = false;
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        console.log('Already connected to IMAP server');
        return resolve();
      }

      this.imap.once('ready', () => {
        console.log('Successfully connected to IMAP server');
        this.isConnected = true;
        resolve();
      });

      this.imap.once('error', (err) => {
        console.error('IMAP connection error:', err);
        this.isConnected = false;
        reject(err);
      });

      console.log('Connecting to IMAP server...');
      this.imap.connect();
    });
  }


async disconnect() {
  if (!this.imap || !this.isConnected) {
    console.log('No active IMAP connection to disconnect or already disconnected');
    return;
  }
  
  console.log('Disconnecting from IMAP server...');
  
  return new Promise((resolve) => {
    const cleanup = () => {
      
      if (this.imap) {
        this.imap.removeAllListeners('end');
        try {
          
          this.imap.destroy();
        } catch (e) { /* ignore */ }
      }
      this.imap = null;
      this.isConnected = false;
      resolve();
    };

    const timeout = setTimeout(() => {
      console.log('Forcing IMAP connection close after timeout');
      cleanup();
    }, 5000);
    
    this.imap.once('end', () => {
      clearTimeout(timeout);
      console.log('IMAP connection ended cleanly');
      cleanup();
    });
    
    
    try {
      this.imap.end(); 
    } catch (err) {
      console.warn('Error during IMAP disconnect initiation (forcing cleanup):', err.message);
      cleanup();
    }
  });
}

  async fetchEmails() {
    let connectionError = null;
    
    try {
      console.log('Starting email fetch process...');
      
      
      try {
        await this.disconnect();
      } catch (disconnectError) {
        console.warn('Error during disconnect (can be ignored):', disconnectError.message);
      }
      
      this.initializeImap();
      
      
      await this.connect();
      
      
      await this.openInbox();
      
      
      
      const emails = await this.searchEmails();
      
      if (!emails || emails.length === 0) {
        console.log('No new emails found matching the criteria');
        return [];
      }
      
      console.log(`Found ${emails.length} emails to process`);
      
      const processedEmails = [];
      
      
      for (const [index, email] of emails.entries()) {
        try {
          
          const processedEmail = await this.processEmail(email);
          
          if (processedEmail) {
            
            const saved = await this.saveApplicant(processedEmail);
            
            if (saved) {
              processedEmails.push(saved);
              console.log(`Successfully processed email from: ${processedEmail.email}`);
              
              
              if (email.uid && emailConfig.markAsRead) {
                await this.markAsRead(email.uid);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing email ${index + 1}:`, error.message);
          continue;
        }
      }

      console.log(`Successfully processed ${processedEmails.length} emails`);
      return processedEmails;
      
    } catch (error) {
      console.error('Error in fetchEmails:', error);
      throw error;
      
    } finally {
      
      try {
        await this.disconnect();
      } catch (disconnectError) {
        console.error('Error during disconnect:', disconnectError);
      }
    }
  }

  openInbox() {
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async searchEmails() {
    return new Promise((resolve, reject) => {
      console.log('Searching for emails with criteria:', emailConfig.searchCriteria);
      
      
      this.imap.openBox('INBOX', true, (openErr, box) => {
        if (openErr) {
          console.error('Error opening INBOX:', openErr);
          return reject(openErr);
        }
        
        console.log(`Opened INBOX, found ${box.messages.total} messages, ${box.messages.new} new`);
        
        
        this.imap.search(emailConfig.searchCriteria, (searchErr, results) => {
          if (searchErr) {
            console.error('Error searching emails:', searchErr);
            return reject(searchErr);
          }
          
          if (!results || results.length === 0) {
            console.log('No emails found matching the search criteria');
            return resolve([]);
          }
          
          console.log(`Found ${results.length} matching emails`);
          
          
          const fetch = this.imap.fetch(results, {
            bodies: '', // fetch full email
            struct: true
          });
          
          const emails = [];
          const promises = [];
          
          fetch.on('message', (msg) => {
            const tempEmail = { uid: null, flags: null, parsed: null };
            const msgPromise = new Promise((resolveMsg) => {
              let parsedPromise = Promise.resolve();
              msg.on('body', (stream, info) => {
                parsedPromise = simpleParser(stream)
                  .then(parsed => {
                    tempEmail.parsed = parsed;
                  })
                  .catch(err => {
                    console.error('Error parsing email with simpleParser:', err);
                  });
              });
              
              msg.once('attributes', (attrs) => {
                tempEmail.uid = attrs.uid;
                tempEmail.flags = attrs.flags;
              });
              
              msg.once('end', () => {
                parsedPromise.then(() => {
                  resolveMsg(tempEmail);
                });
              });
            });
            promises.push(msgPromise);
          });
          
          fetch.once('error', (fetchErr) => {
            console.error('Error fetching emails:', fetchErr);
            reject(fetchErr);
          });
          
          fetch.once('end', () => {
            Promise.all(promises).then(resolvedEmails => {
              // Only keep ones that successfully parsed
              const validEmails = resolvedEmails.filter(e => e.parsed);
              console.log(`Successfully fetched ${validEmails.length} emails`);
              resolve(validEmails);
            }).catch(reject);
          });
        });
      });
    });
  }

  
  findAttachmentsInStructure(part, attachments = []) {
    if (!part) return attachments;

    
    const disposition = part.disposition || '';
    const isAttachment = 
      disposition.type === 'attachment' || 
      (part.parameters && part.parameters.filename) ||
      (part.dispositionParameters && part.dispositionParameters.filename) ||
      (part.type && part.type.toLowerCase() === 'application/pdf');

    if (isAttachment) {
      const filename = 
        (part.parameters && part.parameters.filename) ||
        (part.dispositionParameters && part.dispositionParameters.filename) ||
        part.name ||
        'unnamed_attachment';
      
      attachments.push({
        filename: filename,
        contentType: part.type ? `${part.type}/${part.subtype || 'octet-stream'}` : 'application/octet-stream',
        size: part.size || 0,
        contentDisposition: disposition.type || 'attachment'
      });
    }

    
    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(nestedPart => this.findAttachmentsInStructure(nestedPart, attachments));
    }
    
    return attachments;
  }

  async processEmail(email) {
    try {
      if (!email || !email.parsed) {
        console.error('No email data provided');
        return null;
      }

      const parsed = email.parsed;
      const fromHeader = parsed.from ? parsed.from.text : '';
      const toHeader = parsed.to ? parsed.to.text : '';
      const subject = parsed.subject || 'No Subject';
      
      let appliedDate = parsed.date || new Date();
      
      let emailAddress = '';
      let name = 'Unknown Sender';
      
      if (parsed.from && parsed.from.value && parsed.from.value.length > 0) {
        const sender = parsed.from.value[0];
        emailAddress = sender.address || '';
        name = sender.name || emailAddress.split('@')[0] || 'Unknown Sender';
      } else if (fromHeader) {
        try {
          const match = fromHeader.match(/^\s*"?([^"]*)"?\s*<([^>]+)>/);
          if (match) {
            name = (match[1] || name).trim();
            emailAddress = (match[2] || '').trim().toLowerCase();
          } else if (fromHeader.includes('@')) {
            const emailMatch = fromHeader.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
              emailAddress = emailMatch[0].toLowerCase();
              name = fromHeader.replace(emailMatch[0], '').replace(/[<>,"]/g, '').trim() || name;
            }
          }
        } catch (e) {
          console.warn('Error extracting sender info:', e.message);
        }
      }
      
      if (!emailAddress) {
        emailAddress = `unknown-${Date.now()}@placeholder.com`;
        console.warn(`No valid email found in headers, using placeholder: ${emailAddress}`);
      }
      
      name = name.replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ').trim() || 'Unknown Sender';
      
      const emailBody = parsed.text || parsed.html || '';
      let resumeText = '';
      let has_resume = false;
      
      // Process PDF attachments
      if (parsed.attachments && parsed.attachments.length > 0) {
        for (const att of parsed.attachments) {
          if (att.contentType === 'application/pdf' || (att.filename && att.filename.toLowerCase().endsWith('.pdf'))) {
            try {
              const parser = new PDFParse({ data: att.content }); const pdfData = await parser.getText();
              resumeText += `\n\n--- PDF EXTRACTED TEXT FROM ${att.filename} ---\n\n${pdfData.text}\n\n`;
              has_resume = true;
            } catch (err) {
              console.error('Error parsing PDF attachment:', err);
            }
          }
        }
      }
      
      const fullText = (resumeText) ? `${emailBody}\n\n${resumeText}` : emailBody;
      
      const safeHeaders = {
        from: fromHeader,
        to: toHeader,
        subject: subject,
        date: appliedDate.toISOString(),
        'message-id': parsed.messageId || ''
      };
      
      const emailData = {
        name: name,
        email: emailAddress.toLowerCase(),
        subject: subject,
        body: fullText,
        raw_email: JSON.stringify({
          date: safeHeaders.date,
          from: fromHeader,
          to: safeHeaders.to,
          subject: subject,
          'message-id': safeHeaders['message-id'],
          fullHeaders: safeHeaders,
        }),
        parsed_resume: {
          text: fullText,
          has_attachments: parsed.attachments && parsed.attachments.length > 0,
          attachment_count: parsed.attachments ? parsed.attachments.length : 0
        },
        source: 'email',
        status: 'new',
        applied_at: appliedDate.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        has_resume: has_resume
      };
      
      console.log('Processed email data:', {
        name: emailData.name,
        email: emailData.email,
        subject: emailData.subject,
        applied_at: emailData.applied_at
      });
      
      return emailData;
      
    } catch (error) {
      console.error('Error processing email:', error);
      
      
      return {
        name: 'Error Processing Email',
        email: 'error@example.com',
        subject: 'Error Processing Email',
        body: 'Error processing email content',
        raw_email: JSON.stringify({ 
          error: error.message, 
          stack: error.stack,
          timestamp: new Date().toISOString()
        }),
        parsed_resume: { text: '', has_attachments: false, attachment_count: 0 },
        source: 'email',
        status: 'error',
        applied_at: new Date().toISOString()
      };
    }
  }

  async saveApplicant(applicantData) {
    if (!applicantData) {
      console.error('Cannot save applicant: No data provided');
      throw new Error('Invalid applicant data: No data provided');
    }

    
    if (!applicantData.email || typeof applicantData.email !== 'string') {
      console.error('Cannot save applicant: Invalid or missing email');
      throw new Error('Invalid applicant data: A valid email is required');
    }

    try {
      
      const email = applicantData.email.toLowerCase();
      const name = (applicantData.name || 'Unknown Sender')
        .replace(/[^\p{L}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim() || 'Unknown Sender';

      const now = new Date().toISOString();
      const subject = applicantData.subject || 'No Subject';

      const rawEmailString = applicantData.raw_email || '{"error": "Missing raw email data"}';
      
      const parsedResumeObject = applicantData.parsed_resume || {
        text: applicantData.body || '',
        has_attachments: false,
        attachment_count: 0,
        attachments: []
      };

      
      const applicant = {
        name: name,
        email: email,
        subject: subject,
        body: applicantData.body || '',
        
        
        raw_email: rawEmailString, 
        
        
        parsed_resume: parsedResumeObject, 
        
        source: 'email',
        status: 'new',
        applied_at: applicantData.applied_at || now,
        created_at: now,
        updated_at: now,
        has_resume: applicantData.has_resume || false
      };

      console.log('Saving applicant data:', JSON.stringify({
        name: applicant.name,
        email: applicant.email,
        subject: applicant.subject,
        status: applicant.status,
        applied_at: applicant.applied_at,
        created_at: applicant.created_at,
        updated_at: applicant.updated_at,
        has_resume: applicant.has_resume,
        source: applicant.source
      }, null, 2));

      
      const { data: savedData, error } = await supabase
        .from('applicants')
        .upsert({
          email: applicant.email,
          name: applicant.name,
          subject: applicant.subject,
          body: applicant.body,
          raw_email: applicant.raw_email,
          parsed_resume: applicant.parsed_resume,
          source: applicant.source,
          status: applicant.status,
          applied_at: applicant.applied_at,
          updated_at: applicant.updated_at,
          has_resume: applicant.has_resume
        }, {
          onConflict: 'email',
          returning: 'representation' 
        });

      if (error) {
        console.error('Error saving applicant to database:', error);
        throw error;
      }

      
      const savedApplicant = savedData ? savedData[0] : null;
      
      return savedApplicant;
      
    } catch (error) {
      console.error('Error in saveApplicant:', {
        message: error.message,
        stack: error.stack,
        email: applicantData?.email,
        errorCode: error.code,
        details: error.details,
        hint: error.hint
      });
      
      
      if (error.code === '23505') {
        console.warn('Duplicate email detected, fetching existing record');
        try {
          const { data: existingApp } = await supabase
            .from('applicants')
            .select('*')
            .eq('email', applicantData.email)
            .single();
            
          if (existingApp) {
            console.log('Retrieved existing record');
            return existingApp;
          }
        } catch (fetchError) {
          console.error('Error fetching existing record:', fetchError);
        }
      }
      
      
      throw error;
    }
  }

  markAsRead(uid) {
    return new Promise((resolve, reject) => {
      this.imap.addFlags(uid, ['\\Seen'], (err) => {
        if (err) {
          console.error(`Error marking email ${uid} as read:`, err);
          return reject(err);
        }
        resolve();
      });
    });
  }
  
}

module.exports = new EmailService();