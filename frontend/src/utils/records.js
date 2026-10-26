export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function applicationError({ candidateId, jobId, candidates, jobs, applications }) {
  if (!candidates.some(candidate => candidate.id === candidateId)) return 'Select a candidate profile.';
  if (!jobs.some(job => job.id === jobId && job.status === 'OPEN')) return 'Select an open job.';
  if (applications.some(application => application.candidateId === candidateId && application.jobId === jobId)) {
    return 'This candidate has already applied to this job.';
  }
  return null;
}

export function interviewError({ candidateId, applicationId, interviewDate, applications, today = localDate() }) {
  if (!candidateId || !applications.some(application => application.id === applicationId && application.candidateId === candidateId)) {
    return 'Select an application belonging to this candidate.';
  }
  if (!interviewDate || interviewDate < today) return 'Choose today or a future interview date.';
  return null;
}

export function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
