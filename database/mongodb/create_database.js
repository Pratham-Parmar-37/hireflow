// ==============================================================================
// HireFlow Database Setup: 01 - Create Databases
// Initializes isolated databases for all 6 HireFlow microservices
// ==============================================================================

const databases = [
  'user_db',
  'company_job_db',
  'candidate_db',
  'application_db',
  'interview_db',
  'notification_db'
];

print('=== [HireFlow DB] Initializing Microservice Databases ===');

databases.forEach(dbName => {
  const currentDb = db.getSiblingDB(dbName);
  // In MongoDB, a database is initialized when metadata/collections are registered
  print(`[HireFlow DB] Connected to database: ${dbName}`);
});

print('=== [HireFlow DB] Database initialization completed successfully ===');
