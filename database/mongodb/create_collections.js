// ==============================================================================
// HireFlow Database Setup: 02 - Create Collections & Indexes
// Pre-creates collections and indexes across all domain databases
// ==============================================================================

print('=== [HireFlow DB] Creating Collections & Indexes ===');

// 1. user_db -> users
const userDb = db.getSiblingDB('user_db');
if (!userDb.getCollectionNames().includes('users')) {
  userDb.createCollection('users');
  print('[HireFlow DB] Created collection: user_db.users');
}
userDb.users.createIndex({ email: 1 }, { unique: true });

// 2. company_job_db -> companies, jobs
const compJobDb = db.getSiblingDB('company_job_db');
if (!compJobDb.getCollectionNames().includes('companies')) {
  compJobDb.createCollection('companies');
  print('[HireFlow DB] Created collection: company_job_db.companies');
}
if (!compJobDb.getCollectionNames().includes('jobs')) {
  compJobDb.createCollection('jobs');
  print('[HireFlow DB] Created collection: company_job_db.jobs');
}
compJobDb.jobs.createIndex({ companyId: 1 });
compJobDb.jobs.createIndex({ status: 1 });

// 3. candidate_db -> candidates
const candDb = db.getSiblingDB('candidate_db');
if (!candDb.getCollectionNames().includes('candidates')) {
  candDb.createCollection('candidates');
  print('[HireFlow DB] Created collection: candidate_db.candidates');
}
candDb.candidates.createIndex({ email: 1 });
candDb.candidates.createIndex({ userId: 1 });

// 4. application_db -> applications
const appDb = db.getSiblingDB('application_db');
if (!appDb.getCollectionNames().includes('applications')) {
  appDb.createCollection('applications');
  print('[HireFlow DB] Created collection: application_db.applications');
}
appDb.applications.createIndex({ candidateId: 1, jobId: 1 });
appDb.applications.createIndex({ status: 1 });

// 5. interview_db -> interviews
const intDb = db.getSiblingDB('interview_db');
if (!intDb.getCollectionNames().includes('interviews')) {
  intDb.createCollection('interviews');
  print('[HireFlow DB] Created collection: interview_db.interviews');
}
intDb.interviews.createIndex({ candidateId: 1 });
intDb.interviews.createIndex({ applicationId: 1 });

// 6. notification_db -> notifications
const notifDb = db.getSiblingDB('notification_db');
if (!notifDb.getCollectionNames().includes('notifications')) {
  notifDb.createCollection('notifications');
  print('[HireFlow DB] Created collection: notification_db.notifications');
}
notifDb.notifications.createIndex({ userId: 1 });
notifDb.notifications.createIndex({ status: 1 });

print('=== [HireFlow DB] Collections & indexes verified successfully ===');
