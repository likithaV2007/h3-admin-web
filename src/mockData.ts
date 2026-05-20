export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  age: number;
  grade: string;
  college: string;
  hostelRoom: string;
  attendance: number;
  donorId: string;
  donorName: string;
  mentorId: string;
  mentorName: string;
  avatar: string;
  location: {
    status: 'In Hostel' | 'In College' | 'Out of Bounds' | 'On Leave';
    lastUpdated: string;
    coordinates: string;
    hostelDistance: string;
    collegeDistance: string;
  };
  leaveRequests: LeaveRequest[];
  academicProgress: { semester: string; gpa: number }[];
  subjects: { name: string; score: number; grade: string }[];
  mentorNotes: { id: string; date: string; author: string; note: string; type: string }[];
  parentName: string;
  parentPhone: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  level: 'Platinum' | 'Gold' | 'Silver';
  totalDonated: number;
  activeSponsorships: number;
  avatar: string;
  history: { date: string; amount: number; purpose: string }[];
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  program: string;
  hoursContributed: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  phone: string;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  expertise: string;
  phone: string;
  menteesCount: number;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  childName: string;
  childId: string;
  occupation: string;
}

export interface Alumnus {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  currentCompany: string;
  designation: string;
  contributions: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinedDate: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  time: string;
  category: 'leave' | 'academic' | 'donation' | 'attendance' | 'general';
}

export const initialStudents: Student[] = [
  {
    id: 'STU001',
    name: 'Aravind Swamy',
    rollNo: 'H3-2024-089',
    age: 19,
    grade: 'B.Tech - 2nd Year (CSE)',
    college: 'St. Xavier Engineering College',
    hostelRoom: 'Block B - Room 204',
    attendance: 94.5,
    donorId: 'DON001',
    donorName: 'Dr. Ramesh Kumar',
    mentorId: 'MEN001',
    mentorName: 'Prof. Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    location: {
      status: 'In College',
      lastUpdated: '10 mins ago',
      coordinates: '12.9716° N, 77.5946° E',
      hostelDistance: '3.2 km',
      collegeDistance: '0.1 km (On Campus)'
    },
    leaveRequests: [
      {
        id: 'LR-101',
        studentId: 'STU001',
        studentName: 'Aravind Swamy',
        type: 'Medical Leave',
        fromDate: '2026-05-10',
        toDate: '2026-05-12',
        days: 3,
        reason: 'Severe viral fever, doctor advised rest.',
        status: 'Approved',
        requestedAt: '2026-05-09'
      },
      {
        id: 'LR-104',
        studentId: 'STU001',
        studentName: 'Aravind Swamy',
        type: 'Sick Leave',
        fromDate: '2026-05-25',
        toDate: '2026-05-26',
        days: 2,
        reason: 'Dental checkup and minor extraction procedure.',
        status: 'Pending',
        requestedAt: '2026-05-19'
      }
    ],
    academicProgress: [
      { semester: 'Sem 1', gpa: 8.2 },
      { semester: 'Sem 2', gpa: 8.5 },
      { semester: 'Sem 3', gpa: 8.9 },
      { semester: 'Sem 4', gpa: 9.1 }
    ],
    subjects: [
      { name: 'Data Structures & Algorithms', score: 92, grade: 'O' },
      { name: 'Computer Networks', score: 85, grade: 'A+' },
      { name: 'Database Management Systems', score: 88, grade: 'A+' },
      { name: 'Discrete Mathematics', score: 94, grade: 'O' },
      { name: 'Environmental Sciences', score: 78, grade: 'B+' }
    ],
    mentorNotes: [
      {
        id: 'N-201',
        date: '2026-04-18',
        author: 'Prof. Ananya Sen',
        note: 'Aravind has shown exceptional progress in programming. He is taking part in college hackathons and managing studies well.',
        type: 'academic'
      },
      {
        id: 'N-202',
        date: '2026-05-02',
        author: 'Prof. Ananya Sen',
        note: 'Spoke with him regarding his health. Recommended dietary changes for his recurring stomach issues.',
        type: 'health'
      }
    ],
    parentName: 'Venkatesh Swamy',
    parentPhone: '+91 98450 12345'
  },
  {
    id: 'STU002',
    name: 'Priya Narayanan',
    rollNo: 'H3-2023-041',
    age: 20,
    grade: 'B.Sc - 3rd Year (Nursing)',
    college: 'Apollo Institute of Nursing',
    hostelRoom: 'Block A - Room 102',
    attendance: 88.2,
    donorId: 'DON002',
    donorName: 'Deepa Foundation',
    mentorId: 'MEN002',
    mentorName: 'Dr. Suresh Nair',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    location: {
      status: 'In Hostel',
      lastUpdated: '5 mins ago',
      coordinates: '12.9680° N, 77.6010° E',
      hostelDistance: '0.0 km (In Room)',
      collegeDistance: '1.8 km'
    },
    leaveRequests: [
      {
        id: 'LR-102',
        studentId: 'STU002',
        studentName: 'Priya Narayanan',
        type: 'Festival Leave',
        fromDate: '2026-05-18',
        toDate: '2026-05-20',
        days: 3,
        reason: 'Travelling home for regional temple festival family union.',
        status: 'Approved',
        requestedAt: '2026-05-15'
      }
    ],
    academicProgress: [
      { semester: 'Sem 1', gpa: 7.8 },
      { semester: 'Sem 2', gpa: 7.9 },
      { semester: 'Sem 3', gpa: 8.3 },
      { semester: 'Sem 4', gpa: 8.4 },
      { semester: 'Sem 5', gpa: 8.7 }
    ],
    subjects: [
      { name: 'Anatomy and Physiology', score: 81, grade: 'A' },
      { name: 'Microbiology', score: 84, grade: 'A' },
      { name: 'Medical-Surgical Nursing', score: 90, grade: 'A+' },
      { name: 'Pharmacology', score: 76, grade: 'B+' },
      { name: 'Community Health Nursing', score: 89, grade: 'A+' }
    ],
    mentorNotes: [
      {
        id: 'N-203',
        date: '2026-05-10',
        author: 'Dr. Suresh Nair',
        note: 'Priya performed very well in her ward internship. Head nurse gave highly positive feedback about her empathy and work ethic.',
        type: 'academic'
      }
    ],
    parentName: 'Narayanan Pillai',
    parentPhone: '+91 97410 54321'
  },
  {
    id: 'STU003',
    name: 'Mohamed Rehan',
    rollNo: 'H3-2025-112',
    age: 18,
    grade: 'B.Com - 1st Year (General)',
    college: 'Loyola College of Commerce',
    hostelRoom: 'Block B - Room 408',
    attendance: 92.1,
    donorId: 'DON003',
    donorName: 'Global Giving Corp',
    mentorId: 'MEN003',
    mentorName: 'C.A. Rajesh Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    location: {
      status: 'Out of Bounds',
      lastUpdated: '1 hr ago',
      coordinates: '12.9800° N, 77.5850° E',
      hostelDistance: '4.8 km',
      collegeDistance: '5.2 km'
    },
    leaveRequests: [
      {
        id: 'LR-103',
        studentId: 'STU003',
        studentName: 'Mohamed Rehan',
        type: 'Personal Leave',
        fromDate: '2026-05-22',
        toDate: '2026-05-25',
        days: 4,
        reason: 'Sister wedding ceremony. Needs to assist in arrangements.',
        status: 'Pending',
        requestedAt: '2026-05-17'
      }
    ],
    academicProgress: [
      { semester: 'Sem 1', gpa: 7.2 },
      { semester: 'Sem 2', gpa: 7.5 }
    ],
    subjects: [
      { name: 'Financial Accounting', score: 79, grade: 'B+' },
      { name: 'Business Economics', score: 71, grade: 'B' },
      { name: 'Principles of Management', score: 82, grade: 'A' },
      { name: 'Business Communication', score: 88, grade: 'A+' }
    ],
    mentorNotes: [
      {
        id: 'N-204',
        date: '2026-04-20',
        author: 'C.A. Rajesh Mehta',
        note: 'Rehan is slightly struggling with Financial Accounting concepts. Initiated special remedial tutoring with senior commerce volunteers.',
        type: 'academic'
      }
    ],
    parentName: 'Shabana Begum',
    parentPhone: '+91 91234 56789'
  },
  {
    id: 'STU004',
    name: 'Divya Deshmukh',
    rollNo: 'H3-2024-063',
    age: 19,
    grade: 'B.Tech - 2nd Year (ECE)',
    college: 'St. Xavier Engineering College',
    hostelRoom: 'Block A - Room 311',
    attendance: 96.8,
    donorId: 'DON001',
    donorName: 'Dr. Ramesh Kumar',
    mentorId: 'MEN001',
    mentorName: 'Prof. Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    location: {
      status: 'On Leave',
      lastUpdated: '2 days ago',
      coordinates: '18.5204° N, 73.8567° E (Pune)',
      hostelDistance: 'Over 800 km',
      collegeDistance: 'Over 800 km'
    },
    leaveRequests: [
      {
        id: 'LR-105',
        studentId: 'STU004',
        studentName: 'Divya Deshmukh',
        type: 'Family Emergency',
        fromDate: '2026-05-17',
        toDate: '2026-05-21',
        days: 5,
        reason: 'Mother hospitalized for surgery in hometown. Need to attend to family.',
        status: 'Approved',
        requestedAt: '2026-05-16'
      }
    ],
    academicProgress: [
      { semester: 'Sem 1', gpa: 9.4 },
      { semester: 'Sem 2', gpa: 9.6 },
      { semester: 'Sem 3', gpa: 9.8 }
    ],
    subjects: [
      { name: 'Electronic Devices & Circuits', score: 97, grade: 'O' },
      { name: 'Signals & Systems', score: 95, grade: 'O' },
      { name: 'Network Theory', score: 98, grade: 'O' },
      { name: 'Digital Electronics', score: 94, grade: 'O' }
    ],
    mentorNotes: [
      {
        id: 'N-205',
        date: '2026-05-15',
        author: 'Prof. Ananya Sen',
        note: 'Divya is a top performer. Approved emergency travel to Pune to support her family due to mother surgery. Keep monitoring her emotional well-being.',
        type: 'personal'
      }
    ],
    parentName: 'Sanjay Deshmukh',
    parentPhone: '+91 88888 77777'
  }
];

export const initialDonors: Donor[] = [
  {
    id: 'DON001',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@medicare.org',
    level: 'Platinum',
    totalDonated: 1250000,
    activeSponsorships: 2,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    history: [
      { date: '2026-04-10', amount: 150000, purpose: 'Sem 4 Hostel Fees Sponsorship' },
      { date: '2026-01-15', amount: 200000, purpose: 'Annual College Tuition Sponsorship' }
    ]
  },
  {
    id: 'DON002',
    name: 'Deepa Foundation',
    email: 'trustee@deepafoundation.com',
    level: 'Gold',
    totalDonated: 750000,
    activeSponsorships: 1,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    history: [
      { date: '2026-03-05', amount: 120000, purpose: 'Nursing Lab Kits & Material Fees' }
    ]
  },
  {
    id: 'DON003',
    name: 'Global Giving Corp',
    email: 'giving@globalcorp.com',
    level: 'Platinum',
    totalDonated: 2500000,
    activeSponsorships: 1,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120',
    history: [
      { date: '2026-02-12', amount: 500000, purpose: 'NGO Hostel Infrastructure Fund' }
    ]
  }
];

export const initialVolunteers: Volunteer[] = [
  {
    id: 'VOL001',
    name: 'Rahul Sen',
    email: 'rahul.s@outlook.com',
    program: 'Weekend Academic Support (Science & Math)',
    hoursContributed: 84,
    status: 'Active',
    phone: '+91 99000 88221'
  },
  {
    id: 'VOL002',
    name: 'Meera Deshpande',
    email: 'meera.dp@gmail.com',
    program: 'Digital Literacy & Computer Coding',
    hoursContributed: 120,
    status: 'Active',
    phone: '+91 88776 65544'
  },
  {
    id: 'VOL003',
    name: 'Karan Malhotra',
    email: 'karan.m@gmail.com',
    program: 'Alumni Relations & Career Guidance',
    hoursContributed: 45,
    status: 'On Leave',
    phone: '+91 76543 21098'
  }
];

export const initialMentors: Mentor[] = [
  {
    id: 'MEN001',
    name: 'Prof. Ananya Sen',
    email: 'ananya.sen@xavier.edu',
    expertise: 'Computer Science, Career Guidance',
    phone: '+91 98321 04567',
    menteesCount: 2
  },
  {
    id: 'MEN002',
    name: 'Dr. Suresh Nair',
    email: 'suresh.nair@hospital.org',
    expertise: 'Medical & Clinical Nursing, Life Coach',
    phone: '+91 94432 09876',
    menteesCount: 1
  },
  {
    id: 'MEN003',
    name: 'C.A. Rajesh Mehta',
    email: 'rajesh.mehta@auditcorp.in',
    expertise: 'Chartered Accountancy, Finance & Taxation',
    phone: '+91 98200 44556',
    menteesCount: 1
  }
];

export const initialParents: Parent[] = [
  {
    id: 'PAR001',
    name: 'Venkatesh Swamy',
    email: 'venkatesh.swamy@gmail.com',
    phone: '+91 98450 12345',
    childName: 'Aravind Swamy',
    childId: 'STU001',
    occupation: 'Agricultural Farmer'
  },
  {
    id: 'PAR002',
    name: 'Narayanan Pillai',
    email: 'n.pillai@yahoo.com',
    phone: '+91 97410 54321',
    childName: 'Priya Narayanan',
    childId: 'STU002',
    occupation: 'Post Office Clerk'
  },
  {
    id: 'PAR003',
    name: 'Shabana Begum',
    email: 'shabana.b@gmail.com',
    phone: '+91 91234 56789',
    childName: 'Mohamed Rehan',
    childId: 'STU003',
    occupation: 'Tailor Shop Owner'
  }
];

export const initialAlumni: Alumnus[] = [
  {
    id: 'ALU001',
    name: 'Vikram Seth',
    email: 'vikram.seth@tcs.com',
    graduationYear: 2023,
    currentCompany: 'Tata Consultancy Services',
    designation: 'Software Development Engineer I',
    contributions: 'Volunteers 4 hours/month mentoring CSE sophomores. Co-donated Rs 50,000 for hostel computer laboratory upgrade.'
  },
  {
    id: 'ALU002',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@fortis.org',
    graduationYear: 2022,
    currentCompany: 'Fortis Healthcare Group',
    designation: 'Senior Ward Staff Nurse',
    contributions: 'Conducted healthcare hygiene seminars for first-year female nursing students and donated clinical stethoscope kits.'
  }
];

export const initialBoardMembers: BoardMember[] = [
  {
    id: 'BM001',
    name: 'Justice (Retd.) G. Raghavan',
    role: 'President & Chairman of the Board',
    email: 'g.raghavan@hope3.org',
    joinedDate: '2020-01-10'
  },
  {
    id: 'BM002',
    name: 'Dr. (Mrs.) Sheela Krishnan',
    role: 'Vice President & Social Worker Representative',
    email: 'sheela.krishnan@hope3.org',
    joinedDate: '2020-04-15'
  },
  {
    id: 'BM003',
    name: 'V. Srikant Iyer',
    role: 'Honorary Treasurer & Ex-Bank Director',
    email: 'srikant.iyer@hope3.org',
    joinedDate: '2021-08-20'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'ACT001',
    user: 'Prof. Ananya Sen',
    role: 'Mentor',
    action: 'Added academic progress note for student Aravind Swamy',
    time: '2 hours ago',
    category: 'academic'
  },
  {
    id: 'ACT002',
    user: 'Dr. Ramesh Kumar',
    role: 'Donor',
    action: 'Disbursed tuition scholarship amount of Rs. 1,50,000 to STU001',
    time: '5 hours ago',
    category: 'donation'
  },
  {
    id: 'ACT003',
    user: 'Biometric System',
    role: 'System',
    action: 'Priya Narayanan checked into Block A Hostel at 08:35 PM',
    time: '12 hours ago',
    category: 'attendance'
  },
  {
    id: 'ACT004',
    user: 'Admin Staff',
    role: 'Admin',
    action: 'Approved festival leave request (LR-102) for student Priya Narayanan',
    time: '1 day ago',
    category: 'leave'
  },
  {
    id: 'ACT005',
    user: 'Vol. Meera Deshpande',
    role: 'Volunteer',
    action: 'Completed coding class session: Intro to Javascript (2 hours)',
    time: '2 days ago',
    category: 'general'
  }
];
