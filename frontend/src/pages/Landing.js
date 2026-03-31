import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  
  ArrowRightIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  DocumentMagnifyingGlassIcon,
  CpuChipIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CalendarIcon, InboxIcon, ChevronRightIcon } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('Overview');

  const handleLogin = () => {
    navigate('/auth');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: InboxIcon,
      title: 'Automated Email Parsing',
      description: 'Fetches incoming applicant emails, extracts details automatically, and stores them instantly.'
    },
    {
      icon: SparklesIcon,
      title: 'AI Resume Screening',
      description: 'Uses AI to analyze resumes, match them with job listings, and generate shortlist or rejection verdicts.'
    },
    {
      icon: CalendarIcon,
      title: 'Automated Interview Scheduling',
      description: 'Generates interview slots based on HR availability and assigns them to shortlisted candidates.'
    },
    {
      icon: EnvelopeIcon,
      title: 'Mass Email Communication',
      description: 'Send interview invitations, acceptance letters, or rejections to all or selected candidates.'
    },
    {
      icon: DocumentMagnifyingGlassIcon,
      title: 'Deep Context Search',
      description: 'Find candidates instantly via natural language queries across your entire talent pool.'
    },
    {
      icon: ChartBarSquareIcon,
      title: 'Real-time Analytics',
      description: 'Track time-to-hire, funnel drop-offs, and candidate sentiment automatically.'
    }
  ];

  const workflowSteps = [
    {
      title: 'Connect Pipeline',
      desc: 'Link your company careers inbox in seconds. We handle the OAuth securely.',
      icon: InboxIcon
    },
    {
      title: 'AI Inference',
      desc: 'Our engine processes PDFs, extracts skills, and scores them against your open roles.',
      icon: CpuChipIcon
    },
    {
      title: 'Automated Outreach',
      desc: 'Top candidates get calendar links. Others get polite rejections. Zero manual emails.',
      icon: EnvelopeIcon
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white overflow-hidden">
      
      <nav className="fixed w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <BriefcaseIcon className="h-4 w-4 text-zinc-100" />
              </div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                HR Assistant
              </h1>
            </div>
            
            <div className="flex items-center gap-8">
              <button 
                className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                onClick={() => scrollToSection('features')}
              >
                Features
              </button>
              <button 
                className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                onClick={() => scrollToSection('workflow')}
              >
                Workflow
              </button>
              <Button 
                onClick={handleLogin}
                className="bg-white text-black hover:bg-zinc-200 transition-colors px-5 py-2 rounded-full text-sm font-medium"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      
      <motion.section 
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-screen flex items-center justify-center border-b border-white/[0.05]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        <div className="absolute inset-0 bg-[#050505]" />
        
       
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
        
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 hover:bg-white/[0.05] transition-colors cursor-pointer" onClick={() => scrollToSection('workflow')}>
                <SparklesIcon className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300">Introducing Autonomous Pipelines</span>
                <ChevronRightIcon className="h-3.5 w-3.5 text-zinc-500" />
              </div>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-[88px] font-bold tracking-tighter text-white leading-[1.05] max-w-4xl mx-auto mb-8">
              Hire the best.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-400">Ignore the noise.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-light max-w-2xl mx-auto mb-12">
              The modern ATS built for velocity. We process resumes, score candidates, and schedule interviews while you focus entirely on building your company.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 px-8 py-6 rounded-full font-medium text-lg flex items-center justify-center transition-all duration-300"
              >
                Start building today
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto bg-transparent text-white border border-white/[0.1] hover:bg-white/[0.05] px-8 py-6 rounded-full font-medium text-lg flex items-center justify-center transition-all duration-300"
              >
                Explore Platform
              </Button>
            </motion.div>

            
            <motion.div 
              variants={itemVariants} 
              className="mt-20 w-full max-w-5xl rounded-t-2xl border-t border-l border-r border-white/[0.08] bg-[#0a0a0a] h-[300px] sm:h-[400px] overflow-hidden relative shadow-[0_-20px_60px_-15px_rgba(255,255,255,0.03)]"
            >
              <div className="absolute top-0 left-0 w-full h-12 border-b border-white/[0.05] flex items-center px-4 gap-2 bg-[#050505]">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="flex h-full pt-12 text-left">
                <div className="w-64 border-r border-white/[0.05] p-4 hidden md:block bg-[#050505]/50">
                  <div className="flex items-center gap-2 mb-8">
                    <BriefcaseIcon className="h-5 w-5 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-300">Workspace</span>
                  </div>
                  <div className="space-y-1">
                    {['Overview', 'Pipeline', 'Interviews', 'Analytics'].map(tab => (
                      <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-medium px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeTab === tab ? 'text-white bg-white/[0.05]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'}`}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-6 sm:p-8 bg-[#0a0a0a]">
                  {activeTab === 'Overview' && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-white font-semibold text-lg">AI Candidates Stream</h3>
                          <p className="text-zinc-500 text-sm mt-1">Live parsing and scoring against open roles.</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                          Live
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Birhan Nega', role: 'Full-Stack Developer', score: '98%', status: 'Shortlisted' },
                          { name: 'Yonas Belete', role: 'Product Manager', score: '92%', status: 'Shortlisted' },
                          { name: 'Henok Asaye', role: 'UX Designer', score: '35%', status: 'Rejected' }
                        ].map((cand, i) => (
                          <div key={i} className="flex justify-between items-center p-3 border border-white/[0.05] rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-300">
                                {cand.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-zinc-200">{cand.name}</div>
                                <div className="text-xs text-zinc-500">{cand.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-white hidden sm:block">{cand.score} Match</div>
                              <Badge variant="outline" className="hidden sm:inline-flex text-xs bg-white/[0.05] border-white/[0.05] text-zinc-400">
                                {cand.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'Pipeline' && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-white font-semibold text-lg">Active Pipeline</h3>
                          <p className="text-zinc-500 text-sm mt-1">Candidates progressing through stages.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {['Sourced', 'Interview', 'Offer'].map((col, idx) => (
                           <div key={col} className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 min-h-[200px]">
                             <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex justify-between">
                               {col} <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-300">{3 - idx}</span>
                             </div>
                             <div className="space-y-3">
                                <div className="p-3 bg-zinc-900/80 rounded-lg border border-white/[0.05]">
                                   <div className="flex justify-between items-start mb-2">
                                     <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                                     <div className="h-4 w-10 bg-zinc-800 rounded"></div>
                                   </div>
                                   <div className="h-3 w-24 bg-zinc-800 rounded"></div>
                                </div>
                                {idx === 0 && (
                                  <div className="p-3 bg-zinc-900/80 rounded-lg border border-white/[0.05]">
                                     <div className="flex justify-between items-start mb-2">
                                       <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                                     </div>
                                     <div className="h-3 w-16 bg-zinc-800 rounded"></div>
                                  </div>
                                )}
                             </div>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'Interviews' && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center justify-center h-full">
                       <div className="text-center">
                         <CalendarIcon className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
                         <h3 className="text-white font-semibold mb-2">No Interviews Today</h3>
                         <p className="text-sm text-zinc-500">Your AI agent has scheduled the next round for tomorrow.</p>
                       </div>
                    </motion.div>
                  )}
                  {activeTab === 'Analytics' && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-white font-semibold text-lg">Time-to-hire Metrics</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                          <p className="text-zinc-500 text-sm mb-2">Average Parsing Speed</p>
                          <p className="text-2xl font-bold text-white">0.4<span className="text-sm text-zinc-600 font-normal"> seconds</span></p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                          <p className="text-zinc-500 text-sm mb-2">Match Accuracy</p>
                          <p className="text-2xl font-bold text-white">96<span className="text-sm text-zinc-600 font-normal">%</span></p>
                        </div>
                        <div className="col-span-2 bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl h-24 flex items-end">
                           <div className="w-full flex items-end gap-2 h-12">
                             {[40, 20, 50, 70, 60, 90, 80].map((h, i) => (
                               <div key={i} className="flex-1 bg-gradient-to-t from-zinc-700 to-zinc-500 rounded-t-sm" style={{height: `${h}%`}}></div>
                             ))}
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      
      <section id="workflow" className="py-32 bg-[#050505] border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              A self-driving hiring pipeline.
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-zinc-500 font-light max-w-2xl mx-auto">
              From the moment an email hits your inbox to the final calendar invite, we automate the friction.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                
                {index !== workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-gradient-to-r from-zinc-800 to-transparent" />
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center mb-6 shadow-xl text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="features" className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Engineered for precision.
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-zinc-500 font-light max-w-2xl">
              We cut the bloated features found in legacy systems, focusing purely on speed, machine inference, and automated task execution.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, i) => (
              <motion.div 
                key={feature.title} 
                variants={itemVariants} 
                className="bg-[#050505] p-8 rounded-2xl border border-white/[0.05] hover:border-white/[0.15] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-white/[0.08] transition-colors">
                  <feature.icon className="h-5 w-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed font-light text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      
      <section className="py-32 bg-[#050505] border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
              Ready to upgrade your hiring?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 font-light max-w-2xl mx-auto">
              Join the modern teams saving thousands of hours per quarter with automated talent logistics.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="bg-white text-black hover:bg-zinc-200 px-10 py-5 rounded-full font-medium text-lg flex items-center transition-all"
              >
                Let's Start
                <ArrowRightIcon className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
      <footer className="bg-[#050505] text-zinc-500 pb-12 pt-12 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="h-5 w-5 text-zinc-400" />
              <span className="text-base font-medium text-zinc-400 tracking-tight">HR Assistant</span>
            </div>
            
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.05] text-center text-xs text-zinc-600">
            &copy; 2026 HR Assistant Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
