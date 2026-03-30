function scoreResumePrompt(applicantData, requirements) {
  return `
You are an expert technical HR evaluator and recruiter.

JOB REQUIREMENTS:
${requirements}

APPLICANT DATA (Email Cover Letter + Attached Resume/CV Text):
${applicantData}

TASK:
Critically evaluate the applicant based on the provided Job Requirements. 
Do NOT just perform simple keyword similarity matching. Read and deeply analyze the applicant's actual experience, past projects, problem-solving capabilities, and overall context to determine if they are truly capable of fulfilling the job requirements.

Assess both their introductory email text and any attached PDF resume text.

Score the applicant from 0 to 100 based on their holistic, real-world fit:
- 0-40: Missing core requirements, no relevant projects or experience.
- 41-70: Has some foundational skills, but lacks deep experience or impressive relevant projects.
- 71-100: Strong candidate, clearly demonstrates matching expertise, great projects, and substantial experience.

Return valid JSON with ONLY this exact format:

{
  "score": <number between 0 and 100>,
  "matches": ["list the candidate's actual skills, project experiences, or domain knowledge that match the role"],
  "reasoning": "A brief 1-2 sentence explanation of why this score was given, focusing on their practical experience and projects.",
  "verdict": "shortlist" | "reject" 
}

Make sure "verdict" is ONLY either "shortlist" or "reject". Typically, a score of 60 or higher is a "shortlist", otherwise "reject".
`;
}

module.exports = scoreResumePrompt;
