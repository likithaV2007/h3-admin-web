import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Heart,
  Award,
  BookOpen,
  GraduationCap,
  Landmark,
  Calendar,
  Clock,
  FileText,
  Settings,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  XCircle,
  User,
  Send,
  Menu,
  X,
  ClipboardList,
  Plus,
  Mail
} from 'lucide-react';
import { EntityCreationModal } from './components/EntityCreationModal';
import {
  initialStudents,
  initialDonors,
  initialVolunteers,
  initialMentors,
  initialParents,
  initialAlumni,
  initialBoardMembers,
  initialActivityLogs,
  type Student,
  type Donor,
  type Volunteer,
  type Mentor,
  type Parent,
  type Alumnus,
  type BoardMember,
  type ActivityLog,
  type LeaveRequest
} from './mockData';
export interface SchoolClass {
  id: string;
  name: string;
  mentorId: string;
  mentorName: string;
  volunteerId: string;
  volunteerName: string;
  studentIds: string[];
  description: string;
  schedule: string;
}

export interface AlumniClassRequest {
  id: string;
  alumnusName: string;
  alumnusId: string;
  subject: string;
  skills: string[];
  gradeTarget: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface StudentRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Leave' | 'Fee Support' | 'Achievement';
  title: string;
  details: string;
  amount?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface ExpenseReport {
  id: string;
  volunteerName: string;
  donorId: string;
  donorName: string;
  amount: number;
  category: string;
  description: string;
  status: 'Pending' | 'Funded' | 'Rejected';
  date: string;
}

export interface BoardPoll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  status: 'Active' | 'Closed';
  createdBy: string;
  date: string;
  votedUsers: string[];
}

function App() {
  // App-wide state
  const [activeRole, setActiveRole] = useState<'Admin' | 'Student' | 'Parent' | 'Donor' | 'Volunteer' | 'Mentor' | 'Alumni' | 'Board Member'>('Admin');
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  // Data State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [alumni, setAlumni] = useState<Alumnus[]>(initialAlumni);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(initialBoardMembers);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  const [creationModal, setCreationModal] = useState<{ type: string; isOpen: boolean }>({ type: '', isOpen: false });

  const handleCreateEntity = (type: string, data: any) => {
    switch (type) {
      case 'Student':
        setStudents([{ id: `STU00${students.length + 1}`, ...data, attendance: 100, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', location: { status: 'In Hostel', lastUpdated: 'Just now', coordinates: '0,0', hostelDistance: '0', collegeDistance: '0' }, leaveRequests: [], academicProgress: [], subjects: [], mentorNotes: [], donorId: '', donorName: '', mentorId: '', mentorName: '', parentName: '', parentPhone: '', hostelRoom: '' }, ...students]);
        break;
      case 'Parent':
        setParents([{ id: `PAR00${parents.length + 1}`, ...data }, ...parents]);
        break;
      case 'Donor':
        setDonors([{ id: `DON00${donors.length + 1}`, ...data, activeSponsorships: 0, totalDonated: 0, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', history: [] }, ...donors]);
        break;
      case 'Volunteer':
        setVolunteers([{ id: `VOL00${volunteers.length + 1}`, ...data, hoursContributed: 0, status: 'Active' }, ...volunteers]);
        break;
      case 'Mentor':
        setMentors([{ id: `MEN00${mentors.length + 1}`, ...data, menteesCount: 0 }, ...mentors]);
        break;
      case 'Alumnus':
        setAlumni([{ id: `ALU00${alumni.length + 1}`, ...data, contributions: '' }, ...alumni]);
        break;
      case 'Board Member':
        setBoardMembers([{ id: `BM00${boardMembers.length + 1}`, ...data, joinedDate: new Date().toISOString().split('T')[0] }, ...boardMembers]);
        break;
    }
  };

  // New Data State for Mind Map Features
  const [classes, setClasses] = useState<SchoolClass[]>([
    {
      id: 'CLS001',
      name: 'Intro to Javascript',
      mentorId: 'MEN001',
      mentorName: 'Prof. Ananya Sen',
      volunteerId: 'VOL002',
      volunteerName: 'Meera Deshpande',
      studentIds: ['STU001', 'STU003'],
      description: 'Foundations of web development, covering DOM operations, functions, variables, and arrays.',
      schedule: 'Saturdays, 10:00 AM - 12:00 PM'
    },
    {
      id: 'CLS002',
      name: 'English Speaking Clinic',
      mentorId: 'MEN002',
      mentorName: 'Dr. Suresh Nair',
      volunteerId: 'VOL001',
      volunteerName: 'Rahul Sen',
      studentIds: ['STU002', 'STU004'],
      description: 'Communication practice focusing on pronunciation, daily dialogues, and public speaking confidence.',
      schedule: 'Sundays, 2:00 PM - 4:00 PM'
    }
  ]);

  const [alumniRequests, setAlumniRequests] = useState<AlumniClassRequest[]>([
    {
      id: 'REQ001',
      alumnusName: 'Vikram Seth',
      alumnusId: 'ALU001',
      subject: 'Data Structures Practicum',
      skills: ['C++', 'Algorithms'],
      gradeTarget: 'B.Tech - 2nd Year',
      description: 'Interactive session focusing on complex data structures, trees, and graphs for coding interviews.',
      status: 'Pending'
    },
    {
      id: 'REQ002',
      alumnusName: 'Sneha Reddy',
      alumnusId: 'ALU002',
      subject: 'Nursing Hygiene & Sanitation Methods',
      skills: ['Clinical Nursing', 'Hygiene'],
      gradeTarget: 'B.Sc - 1st Year (Nursing)',
      description: 'A practical demonstration of hospital hygiene protocols, bed-making, and primary care.',
      status: 'Approved'
    }
  ]);

  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([
    {
      id: 'SREQ001',
      studentId: 'STU001',
      studentName: 'Aravind Swamy',
      type: 'Fee Support',
      title: 'Exam Registration Fee Support',
      details: 'Requesting ₹1,500 for registering in semester exam. The university portal closes on 25th May.',
      amount: 1500,
      status: 'Pending',
      date: '2026-05-18'
    },
    {
      id: 'SREQ002',
      studentId: 'STU003',
      studentName: 'Mohamed Rehan',
      type: 'Achievement',
      title: 'Inter-College Debate Winner',
      details: 'Won 1st prize at Loyola Commerce Fest Debate. Submitting certificate for hostel records.',
      status: 'Approved',
      date: '2026-05-15'
    }
  ]);

  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([
    {
      id: 'EXP001',
      volunteerName: 'Meera Deshpande',
      donorId: 'DON001',
      donorName: 'Dr. Ramesh Kumar',
      amount: 8500,
      category: 'Study Materials',
      description: 'Purchasing 12 copies of JavaScript Programming textbooks and notebook bundles for CLS001 students.',
      status: 'Pending',
      date: '2026-05-19'
    },
    {
      id: 'EXP002',
      volunteerName: 'Rahul Sen',
      donorId: 'DON002',
      donorName: 'Deepa Foundation',
      amount: 3200,
      category: 'Lab Kits',
      description: 'Purchasing primary stethoscope kits and disposable gloves for nursing clinical mock labs.',
      status: 'Funded',
      date: '2026-05-14'
    }
  ]);

  const [boardPolls, setBoardPolls] = useState<BoardPoll[]>([
    {
      id: 'POL001',
      question: 'Should we allocate ₹5,00,000 from reserves for upgrading the Block B Computer Lab network infrastructure?',
      options: [
        { text: 'Yes, proceed immediately', votes: 4 },
        { text: 'Yes, but delay to next term', votes: 1 },
        { text: 'No, seek direct donor mapping instead', votes: 2 }
      ],
      status: 'Active',
      createdBy: 'Justice (Retd.) G. Raghavan',
      date: '2026-05-18',
      votedUsers: ['Admin', 'Board Member']
    },
    {
      id: 'POL002',
      question: 'Select final date for Annual Board Governance & Progress Meeting:',
      options: [
        { text: 'June 10, 2026', votes: 5 },
        { text: 'June 15, 2026', votes: 3 }
      ],
      status: 'Closed',
      createdBy: 'V. Srikant Iyer',
      date: '2026-05-10',
      votedUsers: ['Board Member']
    }
  ]);

  // Form States for Class Creation
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassMentor, setSelectedClassMentor] = useState('');
  const [selectedClassVolunteer, setSelectedClassVolunteer] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState('');
  const [selectedClassStudents, setSelectedClassStudents] = useState<string[]>([]);

  // Form States for Alumni Class Request
  const [newAlumniSubject, setNewAlumniSubject] = useState('');
  const [newAlumniDescription, setNewAlumniDescription] = useState('');
  const [newAlumniGrade, setNewAlumniGrade] = useState('');
  const [selectedAlumniSkills, setSelectedAlumniSkills] = useState<string[]>([]);

  // Form States for Student Request
  const [newStudentRequestType, setNewStudentRequestType] = useState<'Leave' | 'Fee Support' | 'Achievement'>('Leave');
  const [newStudentRequestTitle, setNewStudentRequestTitle] = useState('');
  const [newStudentRequestDetails, setNewStudentRequestDetails] = useState('');
  const [newStudentRequestAmount, setNewStudentRequestAmount] = useState('');

  // Form States for Volunteer Expenses
  const [newExpenseDonor, setNewExpenseDonor] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Study Materials');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');

  // Form States for Board Polls
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOption1, setNewPollOption1] = useState('');
  const [newPollOption2, setNewPollOption2] = useState('');

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    return initialStudents.flatMap(s => s.leaveRequests);
  });


  // Selected Student Profile State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [profileTab, setProfileTab] = useState<'Overview' | 'Attendance' | 'Current Location' | 'Leave Requests' | 'Donor Information' | 'Academic Details' | 'Mentor Notes'>('Overview');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteType, setNewNoteType] = useState<string>('academic');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDownloadPDF = (reportName: string) => {
    // Generate a simple valid mock PDF from base64
    const pdfBase64 = "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osSQTz93MTMvOIM/eLEnNLchMxE3fTE5EyFjMScHIWUzLz01DyFzLyS1FSF1OSS0qLU4mKFjBwwH1whuKTYwMAgNhdoUa4CV25iZp5Cbn56qh5QrgSoTig/PzOvxLwEKF5QnJmXWlysoJdYmgtUoJqTk6+QnJ+cWlySmZ+nkJuYmafgl5pYkpmXqpCTmZqTk6+QVVKUmZcK1G1sYAAAMK4z8QplbmRzdHJlYW0KZW5kb2JqCjMgMCBvYmoKNjEKZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDYgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nF3MTQ6CMBCE4f2ewmkMg0z/YFcTXyIUTXyA4WIBtQW5vl6RxsSdue+bN83I1VvjCjG7fG3T2Fh0pI5aK1Q7tUGXpQxSK+U1k2b0Uq+Uj8k2T31/z0/O5BzpQ5t1o+7O0X6Z1TtzP2f44vEB364cjwplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKNzgKZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCA1OTUuMjggODQxLjg5XS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgMSAwIFI+Pj4+L0NvbnRlbnRzIDIgMCBSL1BhcmVudCA3IDAgUj4+CmVuZG9iago3IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iago4IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA3IDAgUj4+CmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYS9FbmNvZGluZy9XaW5BbnNpRW5jb2Rpbmc+PgplbmRvYmoKOSAwIG9iago8PC9DcmVhdG9yKER1bW15IFBERiBEb3dubG9hZCkvUHJvZHVjZXIoRHVtbXkgUERGKj4+CmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDM5IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDE0OCAwMDAwMCBuIAowMDAwMDAwMjk2IDAwMDAwIG4gCjAwMDAwMDAxNjkgMDAwMDAgbiAKMDAwMDAwMDI3NSAwMDAwMCBuIAowMDAwMDAwMzkzIDAwMDAwIG4gCjAwMDAwMDA0NDggMDAwMDAgbiAKMDAwMDAwMDQ5MyAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgMTAvUm9vdCA4IDAgUi9JbmZvIDkgMCBSPj4Kc3RhcnR4cmVmCjU2NAolJUVPRgo=";
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "application/pdf"});
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Notification Drawer
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: '1', text: 'New leave request submitted by Aravind Swamy', time: '10 mins ago', read: false },
    { id: '2', text: 'Dr. Ramesh Kumar sent quarterly sponsorship payment', time: '2 hours ago', read: false },
    { id: '3', text: 'Student Mohamed Rehan is currently out of geofenced area', time: '1 hour ago', read: false },
    { id: '4', text: 'System update: Biometric sync completed for Block B', time: '5 hours ago', read: true }
  ]);

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle active role logic mapping modules
  // Admins & Board members can see all tabs. Others get curated views.
  const isTabVisibleForRole = (tabName: string) => {
    if (activeRole === 'Admin' || activeRole === 'Board Member') return true;
    switch (activeRole) {
      case 'Student':
        return ['Dashboard', 'Class Management', 'Settings'].includes(tabName);
      case 'Parent':
        return ['Dashboard', 'Students', 'Settings'].includes(tabName);
      case 'Donor':
        return ['Dashboard', 'Students', 'Reports', 'Settings'].includes(tabName);
      case 'Volunteer':
        return ['Dashboard', 'Students', 'Class Management', 'Settings'].includes(tabName);
      case 'Mentor':
        return ['Dashboard', 'Students', 'Class Management', 'Settings'].includes(tabName);
      case 'Alumni':
        return ['Dashboard', 'Class Management', 'Reports', 'Settings'].includes(tabName);
      default:
        return true;
    }
  };

  // If active tab becomes invisible when switching roles, redirect to Dashboard
  useEffect(() => {
    if (!isTabVisibleForRole(activeTab)) {
      setActiveTab('Dashboard');
    }
  }, [activeRole]);

  // Sidebar Menu Items
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Parents', icon: User },
    { name: 'Donors', icon: Heart },
    { name: 'Volunteers', icon: Award },
    { name: 'Mentors', icon: BookOpen },
    { name: 'Alumni', icon: GraduationCap },
    { name: 'Board Members', icon: Landmark },
    { name: 'Class Management', icon: ClipboardList },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  // Vote on Board Poll
  const handleVote = (pollId: string, optionIndex: number) => {
    setBoardPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        if (p.votedUsers.includes(activeRole)) return p;
        const updatedOptions = [...p.options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          votes: updatedOptions[optionIndex].votes + 1
        };
        return {
          ...p,
          options: updatedOptions,
          votedUsers: [...p.votedUsers, activeRole]
        };
      }
      return p;
    }));
  };

  // Create Board Poll
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion || !newPollOption1 || !newPollOption2) return;
    const newPoll: BoardPoll = {
      id: `POL00${boardPolls.length + 1}`,
      question: newPollQuestion,
      options: [
        { text: newPollOption1, votes: 0 },
        { text: newPollOption2, votes: 0 }
      ],
      status: 'Active',
      createdBy: activeRole === 'Board Member' ? 'Justice (Retd.) G. Raghavan' : 'Admin Staff',
      date: new Date().toISOString().split('T')[0],
      votedUsers: []
    };
    setBoardPolls(prev => [...prev, newPoll]);
    setNewPollQuestion('');
    setNewPollOption1('');
    setNewPollOption2('');
  };

  // Submit Student Request to Volunteer
  const handleStudentRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentRequestTitle || !newStudentRequestDetails) return;
    const newReq: StudentRequest = {
      id: `SREQ00${studentRequests.length + 1}`,
      studentId: 'STU001',
      studentName: 'Aravind Swamy',
      type: newStudentRequestType,
      title: newStudentRequestTitle,
      details: newStudentRequestDetails,
      amount: newStudentRequestType === 'Fee Support' ? parseFloat(newStudentRequestAmount) || 0 : undefined,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setStudentRequests(prev => [...prev, newReq]);

    // Also add to logs
    const newLog: ActivityLog = {
      id: `ACT${Date.now()}`,
      user: 'Aravind Swamy',
      role: 'Student',
      action: `Submitted a ${newStudentRequestType} request: "${newStudentRequestTitle}"`,
      time: 'Just now',
      category: 'general'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    setNewStudentRequestTitle('');
    setNewStudentRequestDetails('');
    setNewStudentRequestAmount('');
  };

  // Volunteer approves/rejects student requests
  const handleStudentRequestAction = (reqId: string, status: 'Approved' | 'Rejected') => {
    setStudentRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
    
    // Add activity log
    const target = studentRequests.find(r => r.id === reqId);
    const newLog: ActivityLog = {
      id: `ACT${Date.now()}`,
      user: 'Meera Deshpande',
      role: 'Volunteer',
      action: `${status} student request "${target?.title}" from ${target?.studentName}`,
      time: 'Just now',
      category: target?.type === 'Leave' ? 'leave' : 'general'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Submit Volunteer Expense Report to Donor
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDonor || !newExpenseAmount || !newExpenseDescription) return;
    const donorObj = donors.find(d => d.id === newExpenseDonor);
    const newExp: ExpenseReport = {
      id: `EXP00${expenseReports.length + 1}`,
      volunteerName: 'Meera Deshpande',
      donorId: newExpenseDonor,
      donorName: donorObj?.name || 'Sponsor',
      amount: parseFloat(newExpenseAmount) || 0,
      category: newExpenseCategory,
      description: newExpenseDescription,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setExpenseReports(prev => [...prev, newExp]);

    // Add activity log
    const newLog: ActivityLog = {
      id: `ACT${Date.now()}`,
      user: 'Meera Deshpande',
      role: 'Volunteer',
      action: `Posted expense report of ₹${newExpenseAmount} to Donor ${donorObj?.name}`,
      time: 'Just now',
      category: 'donation'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    setNewExpenseAmount('');
    setNewExpenseDescription('');
  };

  // Donor funds / rejects volunteer expense reports
  const handleExpenseAction = (expId: string, status: 'Funded' | 'Rejected') => {
    setExpenseReports(prev => prev.map(e => e.id === expId ? { ...e, status } : e));
    
    // Add activity log
    const target = expenseReports.find(e => e.id === expId);
    const newLog: ActivityLog = {
      id: `ACT${Date.now()}`,
      user: 'Dr. Ramesh Kumar',
      role: 'Donor',
      action: `${status} expense report of ₹${target?.amount} posted by volunteer ${target?.volunteerName}`,
      time: 'Just now',
      category: 'donation'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Leave Request Action handlers
  const handleLeaveAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    // Update global leave list
    setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status: newStatus } : lr));
    
    // Find associated student and update their inner leave list
    const targetLeave = leaveRequests.find(lr => lr.id === id);
    if (targetLeave) {
      setStudents(prevStudents => prevStudents.map(student => {
        if (student.id === targetLeave.studentId) {
          const updatedRequests = student.leaveRequests.map(lr => 
            lr.id === id ? { ...lr, status: newStatus } : lr
          );
          
          // Also dynamically modify student location if leave is approved and today falls in range
          let updatedLocation = student.location;
          if (newStatus === 'Approved') {
            updatedLocation = {
              ...student.location,
              status: 'On Leave'
            };
          }

          const updatedStudent = {
            ...student,
            leaveRequests: updatedRequests,
            location: updatedLocation
          };

          // If current details view is active, update selected student
          if (selectedStudent && selectedStudent.id === student.id) {
            setSelectedStudent(updatedStudent);
          }

          return updatedStudent;
        }
        return student;
      }));

      // Add audit log
      const newLog: ActivityLog = {
        id: `ACT${Date.now()}`,
        user: activeRole === 'Admin' ? 'Admin Staff' : `${activeRole} User`,
        role: activeRole,
        action: `${newStatus} leave request ${id} for ${targetLeave.studentName}`,
        time: 'Just now',
        category: 'leave'
      };
      setActivityLogs(prev => [newLog, ...prev]);

      // Remove from unread notification count
      setNotifications(prev => [
        { id: `N${Date.now()}`, text: `Leave request ${id} has been ${newStatus.toLowerCase()}`, time: 'Just now', read: false },
        ...prev
      ]);
    }
  };

  // Add Mentor Note Handler
  const handleAddNote = (studentId: string) => {
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `N-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: activeRole === 'Mentor' ? 'Prof. Ananya Sen' : 'Administrator',
      note: newNoteText,
      type: newNoteType
    };

    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedStudent = {
          ...student,
          mentorNotes: [newNote, ...student.mentorNotes]
        };
        setSelectedStudent(updatedStudent);
        return updatedStudent;
      }
      return student;
    }));

    // Add activity log
    const newLog: ActivityLog = {
      id: `ACT${Date.now()}`,
      user: activeRole === 'Mentor' ? 'Prof. Ananya Sen' : 'Administrator',
      role: activeRole,
      action: `Added a ${newNoteType} note for student ${selectedStudent?.name}`,
      time: 'Just now',
      category: 'academic'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    setNewNoteText('');
  };

  // Simulated location update trigger
  const handleSimulateLocationUpdate = (studentId: string, status: 'In Hostel' | 'In College' | 'Out of Bounds' | 'On Leave') => {
    let coordinates = '12.9716° N, 77.5946° E';
    let hostelDistance = '0.0 km';
    let collegeDistance = '0.0 km';

    if (status === 'In Hostel') {
      coordinates = '12.9680° N, 77.6010° E';
      hostelDistance = '0.0 km (In Room)';
      collegeDistance = '1.8 km';
    } else if (status === 'In College') {
      coordinates = '12.9716° N, 77.5946° E';
      hostelDistance = '3.2 km';
      collegeDistance = '0.1 km (On Campus)';
    } else if (status === 'Out of Bounds') {
      coordinates = '12.9920° N, 77.5620° E (Mall)';
      hostelDistance = '5.4 km';
      collegeDistance = '4.9 km';
    } else {
      coordinates = '18.5204° N, 73.8567° E (Hometown)';
      hostelDistance = 'Over 800 km';
      collegeDistance = 'Over 800 km';
    }

    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updated = {
          ...student,
          location: {
            status,
            lastUpdated: 'Just now (Simulated)',
            coordinates,
            hostelDistance,
            collegeDistance
          }
        };
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(updated);
        }
        return updated;
      }
      return student;
    }));

    // Alert if student goes out of bounds
    if (status === 'Out of Bounds') {
      const alertNotification = {
        id: `N${Date.now()}`,
        text: `Geofence Violation: ${selectedStudent?.name || 'Student'} is Out of Bounds`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [alertNotification, ...prev]);
    }
  };

  // Calculated Stats
  const totalSponsorship = donors.reduce((sum, d) => sum + d.totalDonated, 0);
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;
  const avgAttendance = parseFloat((students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1));

  // Filtered Lists
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonors = donors.filter(donor => {
    return donor.name.toLowerCase().includes(searchQuery.toLowerCase()) || donor.email.toLowerCase().includes(searchQuery.toLowerCase());
  });



  // Main UI Render helper
  return (
    <div className={`min-h-screen transition-colors duration-300 flex ${darkMode ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`glass-sidebar fixed lg:static top-0 bottom-0 left-0 z-40 transition-all duration-300 flex flex-col h-screen
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'} overflow-hidden shadow-xl lg:shadow-none`}>
        
        {/* Brand/Logo Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <img src="/hope3_logo-removebg-preview.png" alt="Hope3 Logo" className="w-9 h-9 object-contain rounded-xl" />
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-base leading-none text-blue-600 dark:text-blue-400">Hope3</h1>
                <span className="text-[10px] text-slate-500 font-medium">ADMIN PORTAL</span>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isVisible = isTabVisibleForRole(item.name);
            if (!isVisible) return null;

            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSelectedStudent(null); // Clear selected profile when switching modules
                  setSelectedDonor(null); // Clear selected donor
                  if (window.innerWidth < 1024) setSidebarOpen(false); // Auto close sidebar on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'} />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </aside>


      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* HEADER BAR */}
        <header className="sticky top-0 z-30 glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            
            {/* Title / Module Name */}
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {activeTab}
                {selectedStudent && (
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    / Profile / {selectedStudent.name}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* LIGHT/DARK MODE TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATIONS TRIGGER */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-sm">Notifications</span>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {notifications.map(noti => (
                        <div 
                          key={noti.id} 
                          className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800/40 text-xs flex flex-col gap-1 transition-colors
                            ${noti.read ? 'opacity-70' : 'bg-blue-50/20 dark:bg-blue-950/10'}`}
                        >
                          <p className="font-medium text-slate-800 dark:text-slate-200">{noti.text}</p>
                          <span className="text-[10px] text-slate-400">{noti.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-6 space-y-6">

          {/* MODULE: DASHBOARD */}
          {activeTab === 'Dashboard' && !selectedStudent && (
            <div className="space-y-6">
              
              {/* HEADING ACCENT */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h3 className="text-xl font-bold mb-1">Welcome back, {activeRole}!</h3>
                <p className="text-blue-100 text-xs max-w-xl">
                  {activeRole === 'Admin' && 'Here is your operational snapshot of Hope3 NGO. Monitor real-time student check-ins, approve pending leaves, and track fundraising.'}
                  {activeRole === 'Student' && 'Review your overall attendance records, submit new leaves, and view comments left by your mentor.'}
                  {activeRole === 'Parent' && 'Monitor your child academic performance, check their hostel residency logs, and contact their mentor.'}
                  {activeRole === 'Donor' && 'Track the impact of your sponsorships, view detailed report summaries, and manage active fundings.'}
                  {activeRole === 'Mentor' && 'Coordinate with your assigned mentees, review and recommend leaves, and add counseling notes.'}
                  {activeRole === 'Board Member' && 'Access strategic governance metrics, verify donation volumes, and review quarterly NGO output logs.'}
                  {['Volunteer', 'Alumni'].includes(activeRole) && 'Contribute to tutorials, record your session hours, and support student development.'}
                </p>
              </div>

              {/* ANALYTICS METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {activeRole === 'Donor' ? 'Total Sponsored' : 'Total Students'}
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {activeRole === 'Donor' ? '2 Students' : `${students.length} Enrolled`}
                    </h4>
                    <span className="text-[10px] text-green-500 flex items-center gap-1 mt-2 font-medium">
                      <span className="bg-green-500/10 p-0.5 rounded">+12%</span> vs last semester
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {activeRole === 'Student' ? 'My Attendance' : 'Avg Attendance'}
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {activeRole === 'Student' ? '94.5%' : `${avgAttendance}%`}
                    </h4>
                    <span className={`text-[10px] flex items-center gap-1 mt-2 font-medium ${avgAttendance >= 90 ? 'text-green-500' : 'text-amber-500'}`}>
                      <span className="bg-green-500/10 p-0.5 rounded">Target 90%</span> met successfully
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Calendar size={22} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {activeRole === 'Donor' ? 'My Funding' : activeRole === 'Student' ? 'Sponsor' : 'Total Donations'}
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {activeRole === 'Donor' ? '₹12.5L' : activeRole === 'Student' ? 'Dr. Ramesh K' : `₹${(totalSponsorship / 100000).toFixed(1)}L`}
                    </h4>
                    <span className="text-[10px] text-blue-500 flex items-center gap-1 mt-2 font-medium">
                      {activeRole === 'Student' ? 'Full tuition & hostel covered' : '98.5% allocated to students'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                    <Heart size={22} />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Pending Approvals
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {pendingLeaves} Requests
                    </h4>
                    <span className="text-[10px] text-amber-500 flex items-center gap-1 mt-2 font-medium">
                      Requires urgent review
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock size={22} />
                  </div>
                </div>

              </div>

              {/* DOUBLE CHART & MAP SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Chart Card */}
                <div className={`glass-panel rounded-2xl p-5 space-y-4 w-full ${activeRole === 'Admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">Monthly Fundraising vs Student Costs</h4>
                      <p className="text-[11px] text-slate-400">Comparing donor funds against hostel and academic expenditures</p>
                    </div>
                    <div className="flex gap-2 text-[10px] font-semibold">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></span>Donations</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-sky-400 rounded-sm"></span>Support Cost</span>
                    </div>
                  </div>

                  {/* CUSTOM BAR/LINE CHART USING SVG */}
                  <div className="relative pt-4 h-60 max-w-xl mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                      <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                      <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                      <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                      {/* Chart Bars - Donation volumes (Blue) */}
                      {/* Jan */}
                      <rect x="80" y="60" width="14" height="110" rx="2" fill="#001780" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Feb */}
                      <rect x="160" y="45" width="14" height="125" rx="2" fill="#001780" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Mar */}
                      <rect x="240" y="80" width="14" height="90" rx="2" fill="#001780" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Apr */}
                      <rect x="320" y="30" width="14" height="140" rx="2" fill="#001780" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* May */}
                      <rect x="400" y="50" width="14" height="120" rx="2" fill="#001780" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Jun */}
                      <rect x="480" y="25" width="14" height="145" rx="2" fill="#001780" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />

                      {/* Chart Bars - Student Costs (Indigo light) */}
                      {/* Jan */}
                      <rect x="96" y="85" width="14" height="85" rx="2" fill="#38bdf8" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Feb */}
                      <rect x="176" y="80" width="14" height="90" rx="2" fill="#38bdf8" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Mar */}
                      <rect x="256" y="75" width="14" height="95" rx="2" fill="#38bdf8" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Apr */}
                      <rect x="336" y="70" width="14" height="100" rx="2" fill="#38bdf8" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* May */}
                      <rect x="416" y="65" width="14" height="105" rx="2" fill="#38bdf8" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />
                      {/* Jun */}
                      <rect x="496" y="60" width="14" height="110" rx="2" fill="#38bdf8" opacity="0.85" className="transition-all hover:opacity-100 cursor-pointer" />

                      {/* X Axis line */}
                      <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />

                      {/* X Labels */}
                      <text x="95" y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Jan</text>
                      <text x="175" y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Feb</text>
                      <text x="255" y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Mar</text>
                      <text x="335" y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Apr</text>
                      <text x="415" y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">May</text>
                      <text x="495" y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Jun</text>

                      {/* Y Labels */}
                      <text x="30" y="24" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">₹15L</text>
                      <text x="30" y="74" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">₹10L</text>
                      <text x="30" y="124" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">₹5L</text>
                      <text x="30" y="174" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">0</text>
                    </svg>
                  </div>
                </div>

                {/* Recent Activity Logs (Right side of the chart) */}
                {activeRole === 'Admin' && (
                  <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-1 w-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-sm">Recent Activity Logs</h4>
                          <p className="text-[11px] text-slate-400">Timeline events across the NGO networks</p>
                        </div>
                      </div>

                      <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                        {activityLogs.slice(0, 4).map(log => (
                          <div key={log.id} className="flex gap-4 relative">
                            <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10
                              ${log.category === 'leave' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' :
                                log.category === 'donation' ? 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400' :
                                log.category === 'academic' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' :
                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
                            >
                              {log.role.substring(0, 1)}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-slate-700 dark:text-slate-300">
                                <span className="font-bold text-slate-900 dark:text-white">{log.user}</span> ({log.role}): {log.action}
                              </p>
                              <span className="text-[9px] text-slate-400 block mt-0.5">{log.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* TWO COLUMN SUMMARY SECTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* VOLUNTEER VIEW: student requests approval & expense posting */}
                {activeRole === 'Volunteer' && (
                  <>
                    {/* Student Requests Pending */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Scholars requests pending review</h4>
                        <p className="text-[11px] text-slate-400">Review student leave, fees, and achievements</p>
                      </div>

                      <div className="space-y-3">
                        {studentRequests.filter(r => r.status === 'Pending').length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400">No pending scholar requests!</div>
                        ) : (
                          studentRequests.filter(r => r.status === 'Pending').map(req => (
                            <div key={req.id} className="p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-xs">{req.studentName}</h5>
                                  <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 font-mono">{req.type}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{req.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-350"><strong>{req.title}:</strong> {req.details}</p>
                              {req.amount && <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Requested: ₹{req.amount}</span>}
                              
                              <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => handleStudentRequestAction(req.id, 'Approved')} className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors">
                                  Approve
                                </button>
                                <button onClick={() => handleStudentRequestAction(req.id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors">
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Post Expense Report Form */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Post Expense to Donor</h4>
                        <p className="text-[11px] text-slate-400">Log educational & medical expenses for Donor funding approvals</p>
                      </div>

                      <form onSubmit={handleExpenseSubmit} className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">SELECT MAPPED DONOR</label>
                          <select value={newExpenseDonor} onChange={(e) => setNewExpenseDonor(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required>
                            <option value="">Select Donor...</option>
                            {donors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.level})</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1">CATEGORY</label>
                            <select value={newExpenseCategory} onChange={(e) => setNewExpenseCategory(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none">
                              <option value="Study Materials">Study Materials</option>
                              <option value="Lab Kits">Lab Kits</option>
                              <option value="Medical Bills">Medical Bills</option>
                              <option value="Travel Allowance">Travel Allowance</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1">AMOUNT (₹)</label>
                            <input type="number" placeholder="₹ Value" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">DESCRIPTION DETAILS</label>
                          <textarea rows={2} placeholder="Explain what the expense is for..." value={newExpenseDescription} onChange={(e) => setNewExpenseDescription(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold p-2 rounded-lg text-xs transition-all shadow-sm">
                          Post Expense Report to Donor
                        </button>
                      </form>
                    </div>
                  </>
                )}

                {/* DONOR VIEW: approve expense reports & view mapped student progress */}
                {activeRole === 'Donor' && (
                  <>
                    {/* Expense Approvals */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Expenses Pending Funding Approvals</h4>
                        <p className="text-[11px] text-slate-400">Review expenses logged by your mapped student volunteers</p>
                      </div>

                      <div className="space-y-3">
                        {expenseReports.filter(e => e.status === 'Pending').length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400">No pending expenses. Thank you for your support!</div>
                        ) : (
                          expenseReports.filter(e => e.status === 'Pending').map(exp => (
                            <div key={exp.id} className="p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-xs">{exp.volunteerName} (Volunteer)</h5>
                                  <span className="text-[9px] font-semibold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded mt-1 inline-block">{exp.category}</span>
                                </div>
                                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">₹{exp.amount}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-normal">{exp.description}</p>
                              <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => handleExpenseAction(exp.id, 'Funded')} className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg transition-all shadow-sm">
                                  Fund / Approve
                                </button>
                                <button onClick={() => handleExpenseAction(exp.id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1 rounded-lg transition-colors">
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Mapped Scholar Progress */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Sponsored Scholars Progress Log</h4>
                        <p className="text-[11px] text-slate-400">Live academic and attendance telemetry overview</p>
                      </div>

                      <div className="space-y-3">
                        {students.slice(0, 2).map(st => (
                          <div key={st.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={st.avatar} className="w-8.5 h-8.5 rounded-full object-cover" />
                              <div>
                                <h5 className="font-bold text-xs text-slate-800 dark:text-white">{st.name}</h5>
                                <span className="text-[9px] text-slate-400">{st.college}</span>
                              </div>
                            </div>
                            <div className="text-right text-[10px] space-y-1">
                              <div><strong>GPA:</strong> <span className="text-blue-600 dark:text-blue-400 font-bold">{st.academicProgress[st.academicProgress.length - 1]?.gpa || 0}</span></div>
                              <div><strong>Attendance:</strong> <span className="text-green-600 dark:text-green-400 font-bold">{st.attendance}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* STUDENT VIEW: Request submission form & requests status */}
                {activeRole === 'Student' && (
                  <>
                    {/* Submit request form */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Submit Request to Volunteer</h4>
                        <p className="text-[11px] text-slate-400">Apply for leaves, fee support registration, or achievement recognition</p>
                      </div>

                      <form onSubmit={handleStudentRequestSubmit} className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">REQUEST TYPE</label>
                          <select value={newStudentRequestType} onChange={(e) => setNewStudentRequestType(e.target.value as any)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none">
                            <option value="Leave">Leave Request</option>
                            <option value="Fee Support">Fee Support Request</option>
                            <option value="Achievement">Achievement Log</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">TITLE / SUBJECT</label>
                          <input type="text" placeholder="e.g. SEM 4 Lab Materials Fee" value={newStudentRequestTitle} onChange={(e) => setNewStudentRequestTitle(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        {newStudentRequestType === 'Fee Support' && (
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1">FEE AMOUNT (₹)</label>
                            <input type="number" placeholder="₹ Amount" value={newStudentRequestAmount} onChange={(e) => setNewStudentRequestAmount(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                          </div>
                        )}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">ADDITIONAL DESCRIPTION DETAILS</label>
                          <textarea rows={2} placeholder="Outline details of your request..." value={newStudentRequestDetails} onChange={(e) => setNewStudentRequestDetails(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold p-2 rounded-lg text-xs transition-all shadow-sm">
                          Send Request to Volunteer
                        </button>
                      </form>
                    </div>

                    {/* Request history status list */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">My Active Requests & Statuses</h4>
                        <p className="text-[11px] text-slate-400">Track approvals of leave and financial requests submitted to volunteers</p>
                      </div>

                      <div className="space-y-3">
                        {studentRequests.map(req => (
                          <div key={req.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] bg-slate-200 dark:bg-slate-800 font-bold px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{req.type}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                                ${req.status === 'Approved' ? 'bg-green-150 text-green-700' :
                                  req.status === 'Pending' ? 'bg-amber-150 text-amber-700' : 'bg-red-150 text-red-700'}`}
                              >
                                {req.status}
                              </span>
                            </div>
                            <h5 className="font-bold text-xs mt-2 text-slate-800 dark:text-white">{req.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-1 leading-normal">{req.details}</p>
                            {req.amount && <div className="text-[10px] font-bold text-slate-600 mt-1">Requested Amount: ₹{req.amount}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* BOARD MEMBER VIEW: Vote on governance polls & create new poll */}
                {(activeRole === 'Board Member') && (
                  <>
                    {/* View Governance Polls */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Board Governance & Directives Polls</h4>
                        <p className="text-[11px] text-slate-400">Cast votes on strategic reserve funding and directive schedules</p>
                      </div>

                      <div className="space-y-4">
                        {boardPolls.map(poll => {
                          const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
                          const hasVoted = poll.votedUsers.includes(activeRole);

                          return (
                            <div key={poll.id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-white dark:bg-slate-900/30 space-y-3">
                              <div className="flex justify-between items-start">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${poll.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{poll.status}</span>
                                <span className="text-[9px] text-slate-400">Posted by {poll.createdBy}</span>
                              </div>
                              <h5 className="font-bold text-xs text-slate-800 dark:text-white leading-normal">{poll.question}</h5>
                              
                              <div className="space-y-2">
                                {poll.options.map((opt, oIdx) => {
                                  const percentage = Math.round((opt.votes / totalVotes) * 100);
                                  return (
                                    <div key={oIdx} className="space-y-1">
                                      <div className="flex justify-between text-[11px]">
                                        <span className="font-medium text-slate-700 dark:text-slate-350">{opt.text}</span>
                                        <span className="font-bold">{opt.votes} votes ({percentage}%)</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        {poll.status === 'Active' && !hasVoted && (
                                          <button onClick={() => handleVote(poll.id, oIdx)} className="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded text-[10px] transition-colors">
                                            Vote
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Propose/Create New Poll */}
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Propose Strategic Poll Option</h4>
                        <p className="text-[11px] text-slate-400">Publish a new binary policy query for board voting</p>
                      </div>

                      <form onSubmit={handleCreatePoll} className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">POLL QUESTION</label>
                          <textarea rows={2} placeholder="e.g. Approve the renewal of the rental agreement for Block C hostel?" value={newPollQuestion} onChange={(e) => setNewPollQuestion(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">OPTION 1</label>
                          <input type="text" placeholder="e.g. Yes, approve lease renewal" value={newPollOption1} onChange={(e) => setNewPollOption1(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1">OPTION 2</label>
                          <input type="text" placeholder="e.g. No, seek alternative layouts" value={newPollOption2} onChange={(e) => setNewPollOption2(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold p-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 shadow-sm">
                          <Plus size={14} /> Propose Board Poll
                        </button>
                      </form>
                    </div>
                  </>
                )}

                {/* PARENT VIEW: child telemetry overview & mentor contacts */}
                {activeRole === 'Parent' && (
                  <>
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">My Child's Residency status</h4>
                        <p className="text-[11px] text-slate-400">Track checkins and geofence locations of Aravind Swamy</p>
                      </div>
                      <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Node:</span>
                          <span className="font-bold text-slate-800 dark:text-white">Block B Main Residency Portal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Attendance Ratio:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">95.4% Approved Checkins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Weekly GPAs:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">9.1/10 (Excellent)</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Academic Counseling Mentor</h4>
                        <p className="text-[11px] text-slate-400">Reach out to your child's guide counselor directly</p>
                      </div>
                      <div className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white dark:bg-slate-900/30 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">AS</div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-800 dark:text-white">Prof. Ananya Sen</h5>
                          <span className="text-[10px] text-slate-400 block">Senior Mentor Counselor</span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 block mt-1 font-mono">ananya.sen@hope3.org</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* MENTOR VIEW: mentee list & counsel activities */}
                {activeRole === 'Mentor' && (
                  <>
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Assigned Mentees Summary</h4>
                        <p className="text-[11px] text-slate-400">Overall academic progress for students under your guidance</p>
                      </div>
                      <div className="space-y-3">
                        {students.slice(0, 2).map(st => (
                          <div key={st.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={st.avatar} className="w-8.5 h-8.5 rounded-full object-cover" />
                              <div>
                                <h5 className="font-bold text-xs text-slate-800 dark:text-white">{st.name}</h5>
                                <span className="text-[9px] text-slate-400 font-mono">{st.id}</span>
                              </div>
                            </div>
                            <div className="text-right text-[10px]">
                              <div>GPA: <span className="font-bold text-blue-600">{st.academicProgress[st.academicProgress.length - 1]?.gpa || 0}</span></div>
                              <div>Attendance: <span className="font-bold text-green-600">{st.attendance}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Timeline Counsel Events</h4>
                        <p className="text-[11px] text-slate-400">Review guidance triggers logged across classes</p>
                      </div>
                      <div className="space-y-3 text-xs text-slate-500">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50 rounded-xl">
                          <strong>Aravind Swamy:</strong> Volunteer Meera marked homework as fully complete with distinction.
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50 rounded-xl">
                          <strong>Mohamed Rehan:</strong> Left campus limits for library checkouts yesterday.
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ALUMNI VIEW: Propose training link & class statuses */}
                {activeRole === 'Alumni' && (
                  <>
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Alumni Class Proposals Status</h4>
                        <p className="text-[11px] text-slate-400">See status of requests submitted to the Admin for teaching classes</p>
                      </div>
                      <div className="space-y-3">
                        {alumniRequests.map(r => (
                          <div key={r.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-xs block">{r.subject}</span>
                              <span className="text-[10px] text-slate-400">{r.gradeTarget}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                              ${r.status === 'Approved' ? 'bg-green-150 text-green-700' :
                                r.status === 'Pending' ? 'bg-amber-150 text-amber-700' : 'bg-red-150 text-red-700'}`}
                            >
                              {r.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm">Technical Training Seminars</h4>
                        <p className="text-[11px] text-slate-400">Conduct special skill transfer and career preparation bootcamps for active students.</p>
                      </div>
                      <button onClick={() => setActiveTab('Class Management')} className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold p-2.5 rounded-lg text-xs transition-all text-center shadow-sm">
                        Propose New Class Track
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* MODULE: STUDENTS (DATA TABLE & DETAILS CONTAINER) */}
          {activeTab === 'Students' && (
            <div className="space-y-6">
              
              {!selectedStudent ? (
                /* MAIN STUDENT LIST */
                <div className="glass-panel rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base">Student Database</h4>
                      <p className="text-xs text-slate-400">Total {students.length} students enrolled in active programs</p>
                    </div>
                    <button onClick={() => setCreationModal({ type: 'Student', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                      <Plus size={14} /> Add Student
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search */}
                      <input
                        type="text"
                        placeholder="Search student, college, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                      />
                    </div>
                  </div>

                  {/* DATA TABLE */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                          <th className="p-4">Student</th>
                          <th className="p-4">Roll ID</th>
                          <th className="p-4">Course / College</th>
                          <th className="p-4">Attendance</th>
                          <th className="p-4">Location Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map(student => (
                          <tr 
                            key={student.id} 
                            onClick={() => { setSelectedStudent(student); setProfileTab('Overview'); }}
                            className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25 transition-colors cursor-pointer"
                          >
                            <td className="p-4 flex items-center gap-3">
                              <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{student.name}</span>
                                <span className="text-[10px] text-slate-400">Age: {student.age} yrs</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-medium text-slate-500">{student.rollNo}</td>
                            <td className="p-4">
                              <span className="block font-medium text-slate-700 dark:text-slate-350">{student.grade}</span>
                              <span className="text-[10px] text-slate-400 block max-w-[180px] truncate">{student.college}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${student.attendance}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold">{student.attendance}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[10px]
                                ${student.location.status === 'In College' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                  student.location.status === 'In Hostel' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                  student.location.status === 'On Leave' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                  'bg-red-500/10 text-red-600 dark:text-red-400'}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full
                                  ${student.location.status === 'In College' ? 'bg-blue-500' :
                                    student.location.status === 'In Hostel' ? 'bg-purple-500' :
                                    student.location.status === 'On Leave' ? 'bg-amber-500' :
                                    'bg-red-500 animate-ping'}`}
                                ></span>
                                {student.location.status}
                              </span>
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => { setSelectedStudent(student); setProfileTab('Overview'); }}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                
                /* DETAILED STUDENT PROFILE */
                <div className="space-y-6">
                  
                  {/* PROFILE HEADER PANEL */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <button 
                      onClick={() => setSelectedStudent(null)} 
                      className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Back to Database"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-center gap-5">
                      <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedStudent.name}</h3>
                          <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">{selectedStudent.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{selectedStudent.grade}</p>
                        
                        {/* Basic badges */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200/30">
                            Hostel Room: {selectedStudent.hostelRoom}
                          </span>
                          <span className="text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-200/30">
                            GPA: {selectedStudent.academicProgress[selectedStudent.academicProgress.length - 1].gpa}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick simulation buttons (Admin/Mentor role check) */}
                    {(activeRole === 'Admin' || activeRole === 'Mentor') && (
                      <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block w-full">Simulate Check-in:</span>
                        <button 
                          onClick={() => handleSimulateLocationUpdate(selectedStudent.id, 'In Hostel')}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-purple-200/50 text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          Hostel
                        </button>
                        <button 
                          onClick={() => handleSimulateLocationUpdate(selectedStudent.id, 'In College')}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-blue-200/50 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          College
                        </button>
                        <button 
                          onClick={() => handleSimulateLocationUpdate(selectedStudent.id, 'Out of Bounds')}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-red-200/50 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Out
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PROFILE TAB BUTTONS */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 pb-1 scrollbar-none">
                    {(['Overview', 'Attendance', 'Current Location', 'Leave Requests', 'Donor Information', 'Academic Details', 'Mentor Notes'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setProfileTab(tab)}
                        className={`px-4 py-2 font-bold text-xs shrink-0 border-b-2 transition-all duration-200
                          ${profileTab === tab 
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* PROFILE TAB CONTAINER DETAILS */}
                  <div className="space-y-6">
                    
                    {/* PROFILE TAB: OVERVIEW */}
                    {profileTab === 'Overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Left Card: Academic & Enrollment info */}
                        <div className="glass-panel rounded-2xl p-5 space-y-4 md:col-span-2">
                          <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Academic & Enrollment Summary</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">College</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.college}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Grade & Specialization</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.grade}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Roll Number</span>
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{selectedStudent.rollNo}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Sponsor Donor</span>
                              <span className="font-bold text-blue-600 dark:text-blue-400">{selectedStudent.donorName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Mentor Counselor</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.mentorName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Age</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.age} Years</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Card: Contact Details */}
                        <div className="glass-panel rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Parent & Contact Info</h4>
                          <div className="space-y-3 text-xs">
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Parent Name</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.parentName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Parent Contact Phone</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.parentPhone}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Biometric ID Mapping</span>
                              <span className="font-mono text-slate-500 font-semibold text-[10px]">BIO_SYS_#{selectedStudent.id}_XF</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* PROFILE TAB: ATTENDANCE */}
                    {profileTab === 'Attendance' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Metric Indicator Circular bar */}
                        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4">
                          <h4 className="font-bold text-sm self-start">Attendance Rate</h4>
                          
                          {/* Circular SVG Progress */}
                          <div className="relative w-36 h-36">
                            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="8" />
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="#3b82f6" 
                                strokeWidth="8" 
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={2 * Math.PI * 40 * (1 - selectedStudent.attendance / 100)}
                                strokeLinecap="round" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-black">{selectedStudent.attendance}%</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Average Rate</span>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                            ${selectedStudent.attendance >= 90 ? 'bg-green-150 text-green-700' : 'bg-amber-150 text-amber-700'}`}
                          >
                            {selectedStudent.attendance >= 90 ? 'Excellent Standing' : 'Needs Supervision'}
                          </span>
                        </div>

                        {/* Attendance daily history */}
                        <div className="glass-panel rounded-2xl p-5 md:col-span-2 space-y-4">
                          <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Recent Attendance Logs</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800/40 pb-2">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">May 19, 2026</span>
                                <span className="text-[10px] text-slate-400 block">Hostel Exit: 08:12 AM | Entry: 05:40 PM</span>
                              </div>
                              <span className="bg-green-500/10 text-green-600 font-bold px-2 py-0.5 rounded">Present</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800/40 pb-2">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">May 18, 2026</span>
                                <span className="text-[10px] text-slate-400 block">Hostel Exit: 08:05 AM | Entry: 05:45 PM</span>
                              </div>
                              <span className="bg-green-500/10 text-green-600 font-bold px-2 py-0.5 rounded">Present</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800/40 pb-2">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">May 17, 2026</span>
                                <span className="text-[10px] text-slate-400 block">Out on approved weekend home travel</span>
                              </div>
                              <span className="bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded">On Leave</span>
                            </div>
                            <div className="flex justify-between items-center text-xs pb-1">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">May 16, 2026</span>
                                <span className="text-[10px] text-slate-400 block">Hostel Exit: 08:10 AM | Entry: 06:10 PM</span>
                              </div>
                              <span className="bg-green-500/10 text-green-600 font-bold px-2 py-0.5 rounded">Present</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* PROFILE TAB: CURRENT LOCATION */}
                    {profileTab === 'Current Location' && (
                      <div className="max-w-2xl">
                        
                        {/* Map Details telemetries */}
                        <div className="glass-panel rounded-2xl p-6 space-y-4">
                          <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Location Telemetry</h4>
                          
                          <div className="space-y-4 text-xs">
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Current Geofence Zone</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`w-3 h-3 rounded-full inline-block
                                  ${selectedStudent.location.status === 'In College' ? 'bg-blue-500' :
                                    selectedStudent.location.status === 'In Hostel' ? 'bg-purple-500' :
                                    selectedStudent.location.status === 'On Leave' ? 'bg-amber-500' :
                                    'bg-red-500 pulse-green'}`}
                                ></span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.location.status}</span>
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">GPS Coordinates</span>
                              <span className="font-mono font-bold block text-slate-700 dark:text-slate-200 mt-0.5">{selectedStudent.location.coordinates}</span>
                            </div>

                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Distance to Hostel Room</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.location.hostelDistance}</span>
                            </div>

                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Distance to College Campus</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedStudent.location.collegeDistance}</span>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                              <span className="text-slate-400 block font-semibold text-[9px]">LAST HEARTBEAT</span>
                              <span className="font-semibold text-slate-500 text-[10px]">{selectedStudent.location.lastUpdated} via SIM-Geofence Node v2</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* PROFILE TAB: LEAVE REQUESTS */}
                    {profileTab === 'Leave Requests' && (
                      <div className="glass-panel rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm">Leave Applications</h4>
                        </div>

                        <div className="space-y-3">
                          {selectedStudent.leaveRequests.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No leave applications lodged yet.</p>
                          ) : (
                            selectedStudent.leaveRequests.map(req => (
                              <div key={req.id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold">{req.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold
                                      ${req.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                                        req.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}
                                    >
                                      {req.status}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-350">{req.type} ({req.days} Days)</p>
                                  <p className="text-xs text-slate-500">{req.reason}</p>
                                  <span className="text-[10px] text-slate-400 block">Dates: {req.fromDate} to {req.toDate} | Submitted: {req.requestedAt}</span>
                                </div>

                                {/* Decision actions directly on profile */}
                                {req.status === 'Pending' && (activeRole === 'Admin' || activeRole === 'Mentor') && (
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleLeaveAction(req.id, 'Approved')}
                                      className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-750 text-white text-xs font-bold transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleLeaveAction(req.id, 'Rejected')}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-750 text-white text-xs font-bold transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* PROFILE TAB: DONOR INFORMATION */}
                    {profileTab === 'Donor Information' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Mapped Donor Details */}
                        <div className="glass-panel rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-sm">Sponsor Profile</h4>
                          
                          <div className="flex flex-col items-center text-center p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-xl mb-3 border border-blue-500/20">
                              {selectedStudent.donorName.substring(0, 2)}
                            </div>
                            <h5 className="font-bold text-sm">{selectedStudent.donorName}</h5>
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold mt-1">Platinum Level Donor</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-semibold text-[10px]">DONOR CODE</span>
                              <span className="font-mono font-bold">{selectedStudent.donorId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-semibold text-[10px]">SPONSORSHIP TYPE</span>
                              <span className="font-bold">Full Academic + Lodging</span>
                            </div>
                          </div>
                        </div>

                        {/* Funding Ledger History */}
                        <div className="glass-panel rounded-2xl p-5 md:col-span-2 space-y-4">
                          <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Tuition Funding Disbursements</h4>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs p-2 border-b border-slate-100 dark:border-slate-800/40">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">Sem 4 Enrollment Fees</span>
                                <span className="text-[10px] text-slate-400 block">Disbursed on April 10, 2026</span>
                              </div>
                              <span className="font-bold text-green-600 dark:text-green-400">₹75,000.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2 border-b border-slate-100 dark:border-slate-800/40">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">Sem 4 Hostel Residency Fees</span>
                                <span className="text-[10px] text-slate-400 block">Disbursed on April 10, 2026</span>
                              </div>
                              <span className="font-bold text-green-600 dark:text-green-400">₹75,000.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2 border-b border-slate-100 dark:border-slate-800/40">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">Sem 3 Tuition & Exam Registration</span>
                                <span className="text-[10px] text-slate-400 block">Disbursed on October 12, 2025</span>
                              </div>
                              <span className="font-bold text-green-600 dark:text-green-400">₹1,20,000.00</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* PROFILE TAB: ACADEMIC DETAILS */}
                    {profileTab === 'Academic Details' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* GPA Progress chart */}
                        <div className="glass-panel rounded-2xl p-5 md:col-span-2 space-y-4">
                          <h4 className="font-bold text-sm">Semester-wise GPA Progression</h4>
                          
                          {/* GPA Line Chart */}
                          <div className="relative pt-2 h-44">
                            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                              {/* Horizontal Grid lines */}
                              <line x1="30" y1="20" x2="380" y2="20" stroke="rgba(148, 163, 184, 0.1)" />
                              <line x1="30" y1="50" x2="380" y2="50" stroke="rgba(148, 163, 184, 0.1)" />
                              <line x1="30" y1="80" x2="380" y2="80" stroke="rgba(148, 163, 184, 0.1)" />

                              {/* Progression Polyline */}
                              {selectedStudent.academicProgress.length === 4 ? (
                                <>
                                  <polyline 
                                    fill="none" 
                                    stroke="#3b82f6" 
                                    strokeWidth="2.5" 
                                    points="50,85 150,75 250,55 350,30" 
                                  />
                                  {/* Circles */}
                                  <circle cx="50" cy="85" r="4.5" fill="#3b82f6" className="cursor-pointer" />
                                  <circle cx="150" cy="75" r="4.5" fill="#3b82f6" className="cursor-pointer" />
                                  <circle cx="250" cy="55" r="4.5" fill="#3b82f6" className="cursor-pointer" />
                                  <circle cx="350" cy="30" r="4.5" fill="#3b82f6" className="cursor-pointer" />
                                </>
                              ) : (
                                <>
                                  <polyline 
                                    fill="none" 
                                    stroke="#3b82f6" 
                                    strokeWidth="2.5" 
                                    points="50,90 200,85 350,60" 
                                  />
                                  {/* Circles */}
                                  <circle cx="50" cy="90" r="4.5" fill="#3b82f6" />
                                  <circle cx="200" cy="85" r="4.5" fill="#3b82f6" />
                                  <circle cx="350" cy="60" r="4.5" fill="#3b82f6" />
                                </>
                              )}

                              {/* X labels */}
                              {selectedStudent.academicProgress.map((item, idx) => {
                                const step = 300 / (selectedStudent.academicProgress.length - 1);
                                const x = 50 + idx * step;
                                return (
                                  <text key={idx} x={x} y="112" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                                    {item.semester} ({item.gpa})
                                  </text>
                                );
                              })}
                            </svg>
                          </div>
                        </div>

                        {/* Subject marks listing */}
                        <div className="glass-panel rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-sm">Current Semester Subjects</h4>
                          
                          <div className="space-y-3">
                            {selectedStudent.subjects.map((sub, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 dark:border-slate-800/40">
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[140px]">{sub.name}</span>
                                  <span className="text-[10px] text-slate-400">Score: {sub.score}/100</span>
                                </div>
                                <span className={`font-black text-xs px-2 py-0.5 rounded
                                  ${sub.grade === 'O' ? 'bg-green-100 text-green-700' :
                                    sub.grade === 'A+' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'}`}
                                >
                                  {sub.grade}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* PROFILE TAB: MENTOR NOTES */}
                    {profileTab === 'Mentor Notes' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Note feed */}
                        <div className="glass-panel rounded-2xl p-5 md:col-span-2 space-y-4">
                          <h4 className="font-bold text-sm">Counseling & Guidance Log</h4>
                          
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {selectedStudent.mentorNotes.length === 0 ? (
                              <p className="text-xs text-slate-400 py-4 text-center">No counseling logs filed yet.</p>
                            ) : (
                              selectedStudent.mentorNotes.map(note => (
                                <div key={note.id} className="p-3.5 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-slate-800 dark:text-slate-350">{note.author}</span>
                                    <span className="text-slate-400">{note.date}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">{note.note}</p>
                                  <span className={`inline-block text-[9px] uppercase font-bold px-1.5 py-0.25 rounded mt-2
                                    ${note.type === 'academic' ? 'bg-blue-100 text-blue-700' :
                                      note.type === 'health' ? 'bg-red-100 text-red-700' :
                                      'bg-amber-100 text-amber-700'}`}
                                  >
                                    {note.type}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add note interface (counselor / admin roles) */}
                        <div className="glass-panel rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-sm">Add Counsel Note</h4>
                          
                          {/* Note type selection */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                              <select 
                                value={newNoteType}
                                onChange={(e) => setNewNoteType(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                              >
                                <option value="academic">Academic Counseling</option>
                                <option value="personal">Personal / Family</option>
                                <option value="health">Medical & Wellbeing</option>
                              </select>
                            </div>

                            {/* Note Text */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Note details</label>
                              <textarea
                                rows={4}
                                placeholder="Type counselor observations, notes..."
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 focus:outline-none focus:border-blue-500"
                              ></textarea>
                            </div>

                            <button
                              onClick={() => handleAddNote(selectedStudent.id)}
                              className="w-full bg-blue-600 hover:bg-blue-705 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                            >
                              <Send size={12} />
                              Save Counseling Note
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

          {/* MODULE: PARENTS */}
          {activeTab === 'Parents' && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">Parent Database</h4>
                  <p className="text-xs text-slate-400">Manage linkages between student scholars and guardians</p>
                </div>
                <button onClick={() => setCreationModal({ type: 'Parent', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                  <Plus size={14} /> Add Parent
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Parent Name</th>
                      <th className="p-4">Guardian ID</th>
                      <th className="p-4">Child Scholar</th>
                      <th className="p-4">Occupation</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parents.map(par => (
                      <tr key={par.id} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25">
                        <td className="p-4 font-bold text-slate-800 dark:text-white">{par.name}</td>
                        <td className="p-4 font-mono font-medium text-slate-500">{par.id}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              const std = students.find(s => s.id === par.childId);
                              if (std) { setSelectedStudent(std); setActiveTab('Students'); setProfileTab('Overview'); }
                            }}
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {par.childName}
                          </button>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{par.occupation}</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{par.phone}</td>
                        <td className="p-4 text-right">
                          <a href={`tel:${par.phone}`} className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg transition-colors inline-block">
                            Call Guardian
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: DONORS */}
          {activeTab === 'Donors' && (
            <div className="space-y-6">
              
              {!selectedDonor ? (
                <div className="glass-panel rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base">Donor Registry</h4>
                      <p className="text-xs text-slate-400">Total active fundraising capital: ₹{(totalSponsorship/100000).toFixed(1)}L</p>
                    </div>
                    <button onClick={() => setCreationModal({ type: 'Donor', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                      <Plus size={14} /> Add Donor
                    </button>
                    

                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                          <th className="p-4">Donor</th>
                          <th className="p-4">Sponsored Scholars</th>
                          <th className="p-4">Total Funding</th>
                          <th className="p-4">Verification</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonors.map(don => (
                          <tr key={don.id} onClick={() => setSelectedDonor(don)} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25 cursor-pointer">
                            <td className="p-4 flex items-center gap-3">
                              <img src={don.avatar} alt={don.name} className="w-8.5 h-8.5 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white block">{don.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{don.email}</span>
                              </div>
                            </td>

                            <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{don.activeSponsorships} Student Scholars</td>
                            <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">₹{don.totalDonated.toLocaleString()}</td>
                            <td className="p-4">
                              <span className="text-[10px] text-green-600 bg-green-500/10 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 max-w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified Tax exemption
                              </span>
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg transition-colors">
                                Send Statement
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* DETAILED DONOR PROFILE */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <button 
                      onClick={() => setSelectedDonor(null)} 
                      className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Back to Registry"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-center gap-5">
                      <img src={selectedDonor.avatar} alt={selectedDonor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedDonor.name}</h3>
                          <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">{selectedDonor.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{selectedDonor.email}</p>
                        
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-[10px] font-semibold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded border border-green-200/30">
                            Verified Tax Exemption
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-800/50">
                      <a 
                        href={`mailto:${selectedDonor.email}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Mail size={14} />
                        Contact Donor
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Donation Overview</h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">Active Sponsored Scholars</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">{selectedDonor.activeSponsorships}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">Total Lifetime Donated</span>
                          <span className="font-bold text-green-600 dark:text-green-400 text-lg">₹{selectedDonor.totalDonated.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Donation History</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {selectedDonor.history.length === 0 ? (
                          <p className="text-xs text-slate-400 py-4 text-center">No donation history recorded yet.</p>
                        ) : (
                          selectedDonor.history.map((record, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800/40 pb-2">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{record.date}</span>
                                <span className="text-[10px] text-slate-400 block">{record.purpose}</span>
                              </div>
                              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">₹{record.amount.toLocaleString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MODULE: VOLUNTEERS */}
          {activeTab === 'Volunteers' && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">Active Volunteer Network</h4>
                  <p className="text-xs text-slate-400">Coordinating community hours for tutoring, career counselling, and coaching</p>
                </div>
                <button onClick={() => setCreationModal({ type: 'Volunteer', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                  <Plus size={14} /> Add Volunteer
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Volunteer Name</th>
                      <th className="p-4">Assigned Department</th>
                      <th className="p-4">Total Service Hours</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.map(vol => (
                      <tr key={vol.id} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25">
                        <td className="p-4">
                          <span className="font-bold text-slate-800 dark:text-white block">{vol.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{vol.email}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{vol.program}</td>
                        <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{vol.hoursContributed} Hours</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{vol.phone}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-[10px]
                            ${vol.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${vol.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            {vol.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg transition-colors">
                            Log Hours
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: MENTORS */}
          {activeTab === 'Mentors' && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">Mentor Counselors</h4>
                  <p className="text-xs text-slate-400">Assigned academics, health advisors, and life coaches</p>
                </div>
                <button onClick={() => setCreationModal({ type: 'Mentor', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                  <Plus size={14} /> Add Mentor
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Mentor Name</th>
                      <th className="p-4">Expertise Area</th>
                      <th className="p-4">Active Mentees</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map(men => (
                      <tr key={men.id} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25">
                        <td className="p-4">
                          <span className="font-bold text-slate-800 dark:text-white block">{men.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{men.email}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-350">{men.expertise}</td>
                        <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">{men.menteesCount} Mentees</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{men.phone}</td>
                        <td className="p-4 text-right">
                          <button className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg transition-colors">
                            Schedule Call
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: ALUMNI */}
          {activeTab === 'Alumni' && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">Alumni Impact Network</h4>
                  <p className="text-xs text-slate-400">Former students paying it forward through contributions and careers mentoring</p>
                </div>
                <button onClick={() => setCreationModal({ type: 'Alumnus', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                  <Plus size={14} /> Add Alumnus
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Alumnus Name</th>
                      <th className="p-4">Graduation</th>
                      <th className="p-4">Company & Role</th>
                      <th className="p-4">Impact / Support Contribution</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumni.map(alu => (
                      <tr key={alu.id} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25">
                        <td className="p-4">
                          <span className="font-bold text-slate-800 dark:text-white block">{alu.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{alu.email}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-500">{alu.graduationYear}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block">{alu.currentCompany}</span>
                          <span className="text-[10px] text-slate-400 block">{alu.designation}</span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 max-w-[280px] leading-normal">{alu.contributions}</td>
                        <td className="p-4 text-right">
                          <button className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg transition-colors">
                            Send Invite
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: BOARD MEMBERS */}
          {activeTab === 'Board Members' && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">Board of Directors & Governance</h4>
                  <p className="text-xs text-slate-400">NGO strategic advisory board representing law, audit, bank, and social works</p>
                </div>
                <button onClick={() => setCreationModal({ type: 'Board Member', isOpen: true })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                  <Plus size={14} /> Add Board Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {boardMembers.map(bm => (
                  <div key={bm.id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-white dark:bg-slate-900 flex flex-col justify-between h-44 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 font-bold block uppercase">{bm.id}</span>
                      <h5 className="font-extrabold text-sm mt-1">{bm.name}</h5>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mt-1">{bm.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] border-t border-slate-100 dark:border-slate-800 pt-3 text-slate-500">
                      <span>Joined: {bm.joinedDate}</span>
                      <span className="font-mono">{bm.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE: CLASS MANAGEMENT */}
          {activeTab === 'Class Management' && (
            <div className="space-y-6">
              {/* HEADER ROW */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class & Training Programs</h3>
                  <p className="text-xs text-slate-400">
                    {activeRole === 'Admin' ? 'Create new classes, enroll students, and review teaching applications' :
                     activeRole === 'Alumni' ? 'Request to lead a technical training or skill seminar' :
                     activeRole === 'Student' ? 'My enrolled learning tracks and daily courses' :
                     'Assigned schedules and classes tracker'}
                  </p>
                </div>
              </div>

              {/* ADMIN VIEW */}
              {(activeRole === 'Admin' || activeRole === 'Board Member') && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Classes List */}
                  <div className="glass-panel rounded-2xl p-5 lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm">Active Programs & Classes</h4>
                    
                    <div className="space-y-4">
                      {classes.map(cls => (
                        <div key={cls.id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-white dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{cls.name}</h5>
                              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">{cls.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 max-w-xl">{cls.description}</p>
                            <div className="flex gap-4 mt-2 flex-wrap text-[10px] text-slate-400">
                              <span><strong>Mentor:</strong> {cls.mentorName}</span>
                              <span><strong>Volunteer:</strong> {cls.volunteerName}</span>
                              <span><strong>Schedule:</strong> {cls.schedule}</span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-2 text-right shrink-0">
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                              {cls.studentIds.length} Enrolled Scholars
                            </span>
                            <div className="flex gap-1.5 flex-wrap max-w-[200px] justify-end">
                              {cls.studentIds.map(sid => {
                                const st = students.find(s => s.id === sid);
                                return st ? (
                                  <span key={sid} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-1.5 py-0.5 rounded">
                                    {st.name.split(' ')[0]}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Create Class Form (Admin Only) */}
                  <div className="glass-panel rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-sm">{activeRole === 'Admin' ? 'Create Class & Program' : 'Active Classes Summary'}</h4>
                    {activeRole === 'Admin' ? (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newClassName || !selectedClassMentor || !selectedClassVolunteer) return;
                        
                        const mentorObj = mentors.find(m => m.id === selectedClassMentor);
                        const volunteerObj = volunteers.find(v => v.id === selectedClassVolunteer);
                        
                        const newClass: SchoolClass = {
                          id: `CLS00${classes.length + 1}`,
                          name: newClassName,
                          mentorId: selectedClassMentor,
                          mentorName: mentorObj?.name || 'Assigned Mentor',
                          volunteerId: selectedClassVolunteer,
                          volunteerName: volunteerObj?.name || 'Assigned Volunteer',
                          studentIds: selectedClassStudents,
                          description: newClassDescription || 'Custom classes structured for development support.',
                          schedule: newClassSchedule || 'Saturdays, 3:00 PM - 5:00 PM'
                        };

                        setClasses(prev => [...prev, newClass]);
                        
                        // Add activity log
                        const newLog: ActivityLog = {
                          id: `ACT${Date.now()}`,
                          user: 'Admin Staff',
                          role: 'Admin',
                          action: `Created new class "${newClassName}" assigned to volunteer ${volunteerObj?.name}`,
                          time: 'Just now',
                          category: 'general'
                        };
                        setActivityLogs(prev => [newLog, ...prev]);

                        // Reset
                        setNewClassName('');
                        setNewClassDescription('');
                        setNewClassSchedule('');
                        setSelectedClassStudents([]);
                      }} className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">CLASS/PROGRAM NAME</label>
                          <input type="text" placeholder="e.g. Intermediate Algebra" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">ASSIGN MENTOR COUNSELOR</label>
                          <select value={selectedClassMentor} onChange={(e) => setSelectedClassMentor(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required>
                            <option value="">Select Mentor...</option>
                            {mentors.map(m => <option key={m.id} value={m.id}>{m.name} ({m.expertise.split(',')[0]})</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">ASSIGN VOLUNTEER TEACHER</label>
                          <select value={selectedClassVolunteer} onChange={(e) => setSelectedClassVolunteer(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required>
                            <option value="">Select Volunteer...</option>
                            {volunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">SCHEDULE / TIMINGS</label>
                          <input type="text" placeholder="e.g. Saturdays, 4:00 PM" value={newClassSchedule} onChange={(e) => setNewClassSchedule(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">PROGRAM OUTLINE DESCRIPTION</label>
                          <textarea rows={2} placeholder="Class objectives and syllabi..." value={newClassDescription} onChange={(e) => setNewClassDescription(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">ENROLL STUDENTS</label>
                          <div className="max-h-24 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-2 space-y-1.5">
                            {students.map(s => (
                              <label key={s.id} className="flex items-center gap-2 text-xs">
                                <input type="checkbox" checked={selectedClassStudents.includes(s.id)} onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedClassStudents(prev => [...prev, s.id]);
                                  } else {
                                    setSelectedClassStudents(prev => prev.filter(id => id !== s.id));
                                  }
                                }} />
                                {s.name}
                              </label>
                            ))}
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold p-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1 shadow-sm">
                          <Plus size={14} /> Create Class & Assign
                        </button>
                      </form>
                    ) : (
                      <div className="text-xs text-slate-400 py-6 text-center space-y-2">
                        <p>NGO active classrooms are fully operational. Double-click on any class cards to view details.</p>
                      </div>
                    )}
                  </div>

                  {/* Alumni Requests Approval Table */}
                  <div className="glass-panel rounded-2xl p-5 lg:col-span-3 space-y-4">
                    <h4 className="font-bold text-sm">Alumni Class & Seminar Requests</h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                            <th className="p-4">Alumni Requestor</th>
                            <th className="p-4">Requested Subject</th>
                            <th className="p-4">Skills / Expertise</th>
                            <th className="p-4">Target Program</th>
                            <th className="p-4">Outlines</th>
                            <th className="p-4">Status</th>
                            {activeRole === 'Admin' && <th className="p-4 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {alumniRequests.map(req => (
                            <tr key={req.id} className="border-b border-slate-150 dark:border-slate-850">
                              <td className="p-4 font-bold text-slate-800 dark:text-white">{req.alumnusName}</td>
                              <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">{req.subject}</td>
                              <td className="p-4">
                                <div className="flex gap-1 flex-wrap">
                                  {req.skills.map(sk => <span key={sk} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{sk}</span>)}
                                </div>
                              </td>
                              <td className="p-4 text-slate-500">{req.gradeTarget}</td>
                              <td className="p-4 text-slate-500 max-w-[200px] truncate" title={req.description}>{req.description}</td>
                              <td className="p-4">
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded
                                  ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
                                >
                                  {req.status}
                                </span>
                              </td>
                              {activeRole === 'Admin' && (
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  {req.status === 'Pending' ? (
                                    <div className="flex justify-end gap-2">
                                      <button onClick={() => {
                                        setAlumniRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
                                        
                                        // Turn it into a live class automatically
                                        const newClass: SchoolClass = {
                                          id: `CLS00${classes.length + 1}`,
                                          name: req.subject,
                                          mentorId: 'MEN001',
                                          mentorName: 'Prof. Ananya Sen',
                                          volunteerId: 'VOL001',
                                          volunteerName: req.alumnusName,
                                          studentIds: ['STU001', 'STU002'],
                                          description: req.description,
                                          schedule: 'Saturdays, 2:00 PM'
                                        };
                                        setClasses(prev => [...prev, newClass]);
                                      }} className="bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition-colors">
                                        Approve
                                      </button>
                                      <button onClick={() => {
                                        setAlumniRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r));
                                      }} className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition-colors">
                                        Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400">Decided</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ALUMNI VIEW */}
              {activeRole === 'Alumni' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Requests list */}
                  <div className="glass-panel rounded-2xl p-5 lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm">My Class Proposals & Status</h4>
                    
                    <div className="space-y-4">
                      {alumniRequests.map(req => (
                        <div key={req.id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-white dark:bg-slate-900/30 flex justify-between items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm">{req.subject}</h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                                ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                  req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
                              >
                                {req.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{req.description}</p>
                            <span className="text-[10px] text-slate-400 block mt-2">Target Class: {req.gradeTarget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form to submit class request */}
                  <div className="glass-panel rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-sm">Propose Training / Subject Class</h4>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAlumniSubject || !newAlumniDescription) return;

                      const newReq: AlumniClassRequest = {
                        id: `REQ00${alumniRequests.length + 1}`,
                        alumnusId: 'ALU001',
                        alumnusName: 'Vikram Seth',
                        subject: newAlumniSubject,
                        skills: selectedAlumniSkills,
                        gradeTarget: newAlumniGrade || 'All Scholars',
                        description: newAlumniDescription,
                        status: 'Pending'
                      };

                      setAlumniRequests(prev => [...prev, newReq]);

                      // Reset
                      setNewAlumniSubject('');
                      setNewAlumniDescription('');
                      setNewAlumniGrade('');
                      setSelectedAlumniSkills([]);
                    }} className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">PROPOSED SUBJECT/SKILL</label>
                        <input type="text" placeholder="e.g. Introduction to Git & GitHub" value={newAlumniSubject} onChange={(e) => setNewAlumniSubject(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">TARGET GRADE / STUDENT GROUP</label>
                        <input type="text" placeholder="e.g. B.Tech 2nd Year / Engineering group" value={newAlumniGrade} onChange={(e) => setNewAlumniGrade(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">SKILL CATEGORIES (Comma-separated)</label>
                        <input type="text" placeholder="e.g. Git, Version Control, Coding" onChange={(e) => setSelectedAlumniSkills(e.target.value.split(',').map(s => s.trim()))} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">SYLLABUS & LESSON FOCUS</label>
                        <textarea rows={3} placeholder="Describe the topics covered..." value={newAlumniDescription} onChange={(e) => setNewAlumniDescription(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" required />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow-sm">
                        Send Class Request to Admin
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* STUDENT VIEW */}
              {activeRole === 'Student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classes.filter(c => c.studentIds.includes('STU001')).map(cls => (
                    <div key={cls.id} className="glass-panel rounded-2xl p-5 space-y-4">
                      <div>
                        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">{cls.id}</span>
                        <h4 className="font-extrabold text-base mt-2">{cls.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-normal">{cls.description}</p>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Timings & Schedule:</span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">{cls.schedule}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Class Mentor:</span>
                          <span className="font-semibold">{cls.mentorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Volunteer Teacher:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{cls.volunteerName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VOLUNTEER & MENTOR VIEW */}
              {(activeRole === 'Volunteer' || activeRole === 'Mentor') && (
                <div className="space-y-4">
                  {classes.filter(c => activeRole === 'Volunteer' ? c.volunteerName.includes('Meera') || c.volunteerName.includes('Rahul') : c.mentorName.includes('Ananya')).map(cls => (
                    <div key={cls.id} className="glass-panel rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-[10px] font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded font-bold">{cls.id}</span>
                          <h4 className="font-extrabold text-base mt-2">{cls.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-normal max-w-2xl">{cls.description}</p>
                        </div>
                        <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full shrink-0">
                          Schedule: {cls.schedule}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                        <h5 className="font-bold text-xs">Enrolled Scholars ({cls.studentIds.length})</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {cls.studentIds.map(sid => {
                            const st = students.find(s => s.id === sid);
                            return st ? (
                              <div key={sid} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-3">
                                <img src={st.avatar} className="w-8 h-8 rounded-full object-cover" />
                                <div>
                                  <span className="font-bold text-xs text-slate-800 dark:text-white block">{st.name}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">{st.id}</span>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* MODULE: REPORTS */}
          {activeTab === 'Reports' && (
            <div className="space-y-6">
              
              {/* Strategic overview stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="glass-panel rounded-2xl p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Strategic Expenditure</span>
                  <h4 className="text-xl font-extrabold">₹3,40,000.00 / Term</h4>
                  <p className="text-[11px] text-slate-400">Total cost calculated for tuition and hostel allocations.</p>
                </div>
                
                <div className="glass-panel rounded-2xl p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Donors Mapped</span>
                  <h4 className="text-xl font-extrabold">{donors.length} Organization Entities</h4>
                  <p className="text-[11px] text-slate-400">97% of scholars mapped successfully to platinum/gold patrons.</p>
                </div>

                <div className="glass-panel rounded-2xl p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Geofence Compliance</span>
                  <h4 className="text-xl font-extrabold">98.2% Success</h4>
                  <p className="text-[11px] text-slate-400">Percentage of student checkins residing inside limits.</p>
                </div>

              </div>

              {/* Detailed Financial & operational graphs mock */}
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-sm">Quarterly Activity Reports</h4>
                
                <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">Q1 2026 Financial & Operational Audit Report</span>
                    <button onClick={() => handleDownloadPDF('Q1_2026_Audit_Report')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Download PDF</button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    This document summarizes total incoming capital, tax-exemption receipts under section 80G, scholar lists, and grade improvements. Verified by Board Treasurer Srikant Iyer.
                  </p>
                </div>

                <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">Annual Academic Performance & Mentorship Report</span>
                    <button onClick={() => handleDownloadPDF('Annual_Academic_Mentorship_Report')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Download PDF</button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Grade analytics highlighting the correlation between mentor counseling hours and subject grade growth curves.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* MODULE: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="glass-panel rounded-2xl p-5 space-y-6">
              
              <div>
                <h4 className="font-bold text-base">Configuration Settings</h4>
                <p className="text-xs text-slate-400">Manage admin modules, biometric sensors, and geofence parameters</p>
              </div>

              <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                
                {/* Organization Profile */}
                <div className="pt-2 pb-2 space-y-4">
                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">Organization Profile</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold mb-1">NGO REGISTERED NAME</label>
                      <input type="text" defaultValue="Hope3 Foundation" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold mb-1">TAX EXEMPTION ID (80G)</label>
                      <input type="text" defaultValue="H3-80G-2024-8899" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-mono focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 block font-semibold mb-1">OFFICIAL CONTACT EMAIL</label>
                      <input type="email" defaultValue="admin@hope3.org" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div className="pt-6 pb-2 space-y-4">
                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">System Configuration</h5>
                  <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                    <div>
                      <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">Enable Maintenance Mode</h6>
                      <p className="text-[10px] text-slate-400">Suspend access for donors and students during updates.</p>
                    </div>
                    <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold mb-1">DEFAULT CURRENCY</label>
                      <select className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-blue-500">
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold mb-1">DATA BACKUP FREQUENCY</label>
                      <select className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-blue-500">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="pt-6 pb-2 space-y-4">
                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">Notification & Alert Preferences</h5>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                      <div>
                        <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">Email Activity Summaries</h6>
                        <p className="text-[10px] text-slate-400">Receive weekly digests of all volunteer and mentor logs.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                      <div>
                        <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">Donor Contribution Alerts</h6>
                        <p className="text-[10px] text-slate-400">Get instant notifications when a new donation is processed.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                      <div>
                        <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">SMS Emergency Alerts</h6>
                        <p className="text-[10px] text-slate-400">Enable text alerts for severe location out-of-bounds events.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save action */}
                <div className="pt-6 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>

        {/* BOTTOM METRIC BAR OR FOOTER */}
        <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 py-4 px-6 text-center text-[10px] text-slate-400 font-medium">
          Hope3 NGO Student Management System • Powered by React.js & Tailwind CSS v4
        </footer>

      </div>

      <EntityCreationModal 
        type={creationModal.type} 
        isOpen={creationModal.isOpen} 
        onClose={() => setCreationModal({ type: '', isOpen: false })} 
        onSubmit={handleCreateEntity} 
      />

    </div>
  );
}

export default App;
