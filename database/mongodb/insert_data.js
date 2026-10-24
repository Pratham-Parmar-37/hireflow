// ==============================================================================
// HireFlow Database Setup: 03 - Insert Initial Data
// Seeds pre-built, idempotent sample data across all domain databases
// ==============================================================================

print('=== [HireFlow DB] Seeding Initial Pre-built Data ===');

// 1. user_db -> users
const userDb = db.getSiblingDB('user_db');
if (userDb.users.countDocuments() === 0) {
  userDb.users.insertMany([
    {
      _id: 'usr_admin_01',
      fullName: 'Pratham Parmar',
      email: 'pratham@hireflow.ai',
      role: 'ADMIN',
      _class: 'com.hireflow.userservice.entity.User'
    },
    {
      _id: 'usr_recruiter_01',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@hireflow.ai',
      role: 'RECRUITER',
      _class: 'com.hireflow.userservice.entity.User'
    },
    {
      _id: 'usr_cand_01',
      fullName: 'Alina Vance',
      email: 'alina.v@starlight.tech',
      role: 'CANDIDATE',
      _class: 'com.hireflow.userservice.entity.User'
    }
  ]);
  print('[HireFlow DB] Seeded user_db.users');
} else {
  print('[HireFlow DB] user_db.users already populated. Skipping.');
}

// 2. company_job_db -> companies & jobs
const compJobDb = db.getSiblingDB('company_job_db');
if (compJobDb.companies.countDocuments() === 0) {
  compJobDb.companies.insertOne({
    _id: 'cmp_starlight_01',
    companyName: 'Starlight Technologies',
    industry: 'Distributed Cloud Systems',
    location: 'San Francisco, CA & Remote',
    website: 'https://starlight.tech',
    description: 'Enterprise cloud infrastructure and distributed platform engineering.',
    _class: 'com.hireflow.companyjobservice.entity.Company'
  });
  print('[HireFlow DB] Seeded company_job_db.companies');
} else {
  print('[HireFlow DB] company_job_db.companies already populated. Skipping.');
}

if (compJobDb.jobs.countDocuments() === 0) {
  compJobDb.jobs.insertMany([
    {
      _id: 'job_arch_01',
      title: 'Senior Java & Spring Cloud Architect',
      description: 'Architect and scale fault-tolerant microservices using Spring Boot 3, Spring Cloud Gateway, Eureka discovery, and Docker Compose.',
      salary: '18-28 LPA ($140,000)',
      experienceRequired: '4-7 years',
      employmentType: 'REMOTE',
      status: 'OPEN',
      companyId: 'cmp_starlight_01',
      postedByUserId: 'usr_admin_01',
      _class: 'com.hireflow.companyjobservice.entity.Job'
    },
    {
      _id: 'job_fullstack_02',
      title: 'Full Stack Distributed Systems Engineer',
      description: 'Develop reactive Netty endpoints, high-throughput MongoDB data models, and modern user-centric interfaces.',
      salary: '14-22 LPA ($110,000)',
      experienceRequired: '2-5 years',
      employmentType: 'FULL_TIME',
      status: 'OPEN',
      companyId: 'cmp_starlight_01',
      postedByUserId: 'usr_admin_01',
      _class: 'com.hireflow.companyjobservice.entity.Job'
    }
  ]);
  print('[HireFlow DB] Seeded company_job_db.jobs');
} else {
  print('[HireFlow DB] company_job_db.jobs already populated. Skipping.');
}

// 3. candidate_db -> candidates
const candDb = db.getSiblingDB('candidate_db');
if (candDb.candidates.countDocuments() === 0) {
  candDb.candidates.insertMany([
    {
      _id: 'cnd_pratham_01',
      userId: 'usr_admin_01',
      fullName: 'Pratham Parmar',
      email: 'pratham@hireflow.ai',
      resumeUrl: 'https://github.com/Pratham-Parmar-37/hireflow',
      skills: ['Java 17', 'Spring Boot 3', 'Spring Cloud Gateway', 'Docker', 'MongoDB', 'Jenkins CI/CD'],
      experience: '4 years backend microservices engineering',
      education: 'B.Tech in Computer Science',
      _class: 'com.hireflow.candidateservice.entity.Candidate'
    },
    {
      _id: 'cnd_alina_02',
      userId: 'usr_cand_01',
      fullName: 'Alina Vance',
      email: 'alina.v@starlight.tech',
      resumeUrl: 'https://starlight.tech/resumes/alina.pdf',
      skills: ['Spring Cloud', 'Kubernetes', 'Reactive WebFlux', 'MongoDB', 'Kafka'],
      experience: '5 years cloud-native engineering',
      education: 'M.S. Software Systems',
      _class: 'com.hireflow.candidateservice.entity.Candidate'
    }
  ]);
  print('[HireFlow DB] Seeded candidate_db.candidates');
} else {
  print('[HireFlow DB] candidate_db.candidates already populated. Skipping.');
}

// 4. application_db -> applications
const appDb = db.getSiblingDB('application_db');
if (appDb.applications.countDocuments() === 0) {
  appDb.applications.insertMany([
    {
      _id: 'app_pratham_01',
      candidateId: 'cnd_pratham_01',
      jobId: 'job_arch_01',
      applicationDate: '2026-10-19',
      status: 'SHORTLISTED',
      _class: 'com.hireflow.applicationservice.entity.Application'
    },
    {
      _id: 'app_alina_02',
      candidateId: 'cnd_alina_02',
      jobId: 'job_fullstack_02',
      applicationDate: '2026-10-19',
      status: 'UNDER_REVIEW',
      _class: 'com.hireflow.applicationservice.entity.Application'
    }
  ]);
  print('[HireFlow DB] Seeded application_db.applications');
} else {
  print('[HireFlow DB] application_db.applications already populated. Skipping.');
}

// 5. interview_db -> interviews
const intDb = db.getSiblingDB('interview_db');
if (intDb.interviews.countDocuments() === 0) {
  intDb.interviews.insertOne({
    _id: 'int_pratham_01',
    applicationId: 'app_pratham_01',
    candidateId: 'cnd_pratham_01',
    interviewDate: '2026-10-28',
    interviewType: 'TECHNICAL',
    status: 'SCHEDULED',
    feedback: 'Candidate demonstrated strong mastery of Eureka registry, Feign composition, and Docker CI/CD.',
    _class: 'com.hireflow.interviewservice.entity.Interview'
  });
  print('[HireFlow DB] Seeded interview_db.interviews');
} else {
  print('[HireFlow DB] interview_db.interviews already populated. Skipping.');
}

// 6. notification_db -> notifications
const notifDb = db.getSiblingDB('notification_db');
if (notifDb.notifications.countDocuments() === 0) {
  notifDb.notifications.insertOne({
    _id: 'notif_pratham_01',
    userId: 'usr_admin_01',
    message: 'Application for Senior Java Architect moved to SHORTLISTED',
    type: 'APPLICATION',
    status: 'UNREAD',
    createdAt: '10:00 AM',
    _class: 'com.hireflow.notificationservice.entity.Notification'
  });
  print('[HireFlow DB] Seeded notification_db.notifications');
} else {
  print('[HireFlow DB] notification_db.notifications already populated. Skipping.');
}

print('=== [HireFlow DB] Pre-built data seeding finished ===');
