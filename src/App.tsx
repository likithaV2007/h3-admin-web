import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Heart,
  Award,
  Calendar,
  Clock,
  FileText,
  Settings,
  Bell,
  Sun,
  Moon,
  User,
  Send,
  Menu,
  X,
  ClipboardList,
  Plus,
  Database,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Phone,
  PhoneCall,
  MessageCircle,
  MessageSquare,
  HeartHandshake,
  DollarSign,
  Receipt,
  ShoppingBag,
  Coffee,
  Trophy,
  Bus,
  Stethoscope,
  BookOpen,
  Wallet,
  Filter,
  Trash2,
  Search
} from 'lucide-react';
import { EntityCreationModal } from './components/EntityCreationModal';
import { apiService, formatAvatarUrl } from './services/api';
import {
  initialStudents,
  initialVolunteers,
  initialParents,
  initialDonors,
  initialActivityLogs,
  type Student,
  type Volunteer,
  type Parent,
  type Donor,
  type Expense,
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

export function getWhatsAppLink(phone?: string, text?: string): string {
  if (!phone) return '#';
  const clean = phone.replace(/[^0-9]/g, '');
  if (!clean || clean === '0000000000') return '#';
  const fullPhone = clean.length === 10 ? `91${clean}` : clean;
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://api.whatsapp.com/send?phone=${fullPhone}${textParam}`;
}

import { Login } from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  // App-wide state
  const activeRole = 'Admin' as 'Admin' | 'Student' | 'Parent' | 'Volunteer';
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  // Data State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseSubTab, setExpenseSubTab] = useState<'records' | 'analytics'>('records');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('ALL');
  const [expenseSearchQuery, setExpenseSearchQuery] = useState<string>('');
  const [isExpenseSearchExpanded, setIsExpenseSearchExpanded] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [newExpenseTitle, setNewExpenseTitle] = useState<string>('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>('snacks');
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');
  const [newExpenseTargetGroup, setNewExpenseTargetGroup] = useState<string>('ALL');
  const [newExpenseRefund, setNewExpenseRefund] = useState<boolean>(true);
  const [newExpenseFoundationPaid, setNewExpenseFoundationPaid] = useState<boolean>(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{ status: 'CONNECTED' | 'UNAUTHORIZED' | 'ERROR' | 'LOADING'; url: string }>({
    status: 'LOADING',
    url: 'https://h3apps-api.hope3.org'
  });
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [customTokenInput, setCustomTokenInput] = useState<string>(localStorage.getItem('authToken') || '');

  const loadDataFromApi = async () => {
    setIsLoadingApi(true);
    setApiStatus(prev => ({ ...prev, status: 'LOADING' }));
    try {
      const health = await apiService.checkApiHealth();
      setApiStatus({ status: health.status, url: health.url });

      const fetchedStudents = await apiService.getStudents();
      if (fetchedStudents && fetchedStudents.length > 0) setStudents(fetchedStudents);

      const [fetchedVolunteers, fetchedParents, fetchedDonors, fetchedExpenses] = await Promise.all([
        apiService.getVolunteers(),
        apiService.getParents(fetchedStudents),
        apiService.getDonors(),
        apiService.getExpenses()
      ]);
      if (fetchedVolunteers && fetchedVolunteers.length > 0) setVolunteers(fetchedVolunteers);
      if (fetchedParents && fetchedParents.length > 0) setParents(fetchedParents);
      if (fetchedDonors && fetchedDonors.length > 0) setDonors(fetchedDonors);
      if (fetchedExpenses && fetchedExpenses.length > 0) setExpenses(fetchedExpenses);
    } catch (err) {
      console.error("Error loading data from Hope3 API:", err);
      setApiStatus(prev => ({ ...prev, status: 'ERROR' }));
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDataFromApi();
    }
  }, [isAuthenticated]);

  const handleSaveToken = () => {
    const cleanToken = customTokenInput.trim();
    if (cleanToken) {
      localStorage.setItem('authToken', cleanToken);
      sessionStorage.setItem('authToken', cleanToken);
    } else {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
    setShowTokenModal(false);
    if (isAuthenticated) {
      loadDataFromApi();
    }
  };

  const [creationModal, setCreationModal] = useState<{ type: string; isOpen: boolean }>({ type: '', isOpen: false });

  const handleCreateEntity = (type: string, data: any) => {
    switch (type) {
      case 'Student':
        setStudents([{ id: `STU00${students.length + 1}`, ...data, attendance: 100, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', location: { status: 'In Hostel', lastUpdated: 'Just now', coordinates: '0,0', hostelDistance: '0', collegeDistance: '0' }, leaveRequests: [], academicProgress: [], subjects: [], notes: [], parentName: '', parentPhone: '', hostelRoom: '' }, ...students]);
        break;
      case 'Parent':
        setParents([{ id: `PAR00${parents.length + 1}`, ...data }, ...parents]);
        break;
      case 'Volunteer':
        setVolunteers([{ id: `VOL00${volunteers.length + 1}`, ...data, hoursContributed: 0, status: 'Active' }, ...volunteers]);
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

  // Form States for Class Creation
  const [newClassName, setNewClassName] = useState('');
  
  const [selectedClassVolunteer, setSelectedClassVolunteer] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState('');
  const [selectedClassStudents, setSelectedClassStudents] = useState<string[]>([]);

  // Form States for Student Request
  const [newStudentRequestType, setNewStudentRequestType] = useState<'Leave' | 'Fee Support' | 'Achievement'>('Leave');
  const [newStudentRequestTitle, setNewStudentRequestTitle] = useState('');
  const [newStudentRequestDetails, setNewStudentRequestDetails] = useState('');
  const [newStudentRequestAmount, setNewStudentRequestAmount] = useState('');

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    return initialStudents.flatMap(s => s.leaveRequests);
  });


  // Selected Student Profile State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<'Overview' | 'Attendance' | 'Current Location' | 'Leave Requests' | 'Academic Details' | 'Notes'>('Overview');
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
  // Admins can see all tabs. Others get curated views.
  const isTabVisibleForRole = (tabName: string) => {
    if (activeRole === 'Admin' || activeRole === 'Volunteer') return true;
    switch (activeRole) {
      case 'Student':
        return ['Dashboard', 'Settings'].includes(tabName);
      case 'Parent':
        return ['Dashboard', 'Students', 'Settings'].includes(tabName);
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
    { name: 'Admins', icon: Award },
    { name: 'Donors', icon: HeartHandshake },
    { name: 'Finance', icon: DollarSign },
    { name: 'Settings', icon: Settings },
  ];

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
      author: activeRole === 'Volunteer' ? 'Prof. Ananya Sen' : 'Administrator',
      note: newNoteText,
      type: newNoteType
    };

    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedStudent = {
          ...student,
          notes: [newNote, ...student.notes]
        };
        setSelectedStudent(updatedStudent);
        return updatedStudent;
      }
      return student;
    }));

    // Add activity log
    const newLog: ActivityLog = {
      id: `ACT${Date.now()}`,
      user: activeRole === 'Volunteer' ? 'Prof. Ananya Sen' : 'Administrator',
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

  // Expense Handlers
  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseTitle || !newExpenseAmount) return;
    
    const amountVal = parseFloat(newExpenseAmount) || 0;
    const payload = {
      title: newExpenseTitle,
      category: newExpenseCategory,
      amount: amountVal,
      date: new Date().toISOString(),
      refund_requested: newExpenseRefund,
      is_private: true,
      is_foundation_paid: newExpenseFoundationPaid,
      target_group: newExpenseTargetGroup
    };

    const result = await apiService.createExpense(payload);
    const newEntry: Expense = {
      id: result?.id || `EXP_${Date.now()}`,
      title: newExpenseTitle,
      category: newExpenseCategory,
      amount: amountVal,
      date: new Date().toISOString(),
      refund_requested: newExpenseRefund,
      is_foundation_paid: newExpenseFoundationPaid,
      status: 'PENDING',
      target_group: newExpenseTargetGroup,
      created_by_name: activeRole === 'Volunteer' ? 'Volunteer Staff' : 'System Admin'
    };

    setExpenses(prev => [newEntry, ...prev]);
    setShowExpenseModal(false);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    await apiService.deleteExpense(id);
  };

  // Calculated Stats
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;
  const avgAttendance = parseFloat((students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1));

  // Filtered Lists
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (parent.childName && parent.childName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredVolunteers = volunteers.filter(vol =>
    vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vol.email && vol.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vol.program && vol.program.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // Main UI Render helper
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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
                <h3 className="text-xl font-bold mb-1">Welcome back, {activeRole === 'Admin' ? 'Super Admin' : activeRole}!</h3>
                <p className="text-blue-100 text-xs max-w-xl">
                  {activeRole === 'Admin' && 'Here is your operational snapshot of Hope3 NGO. Monitor real-time student check-ins, approve pending leaves, and track fundraising.'}
                  {activeRole === 'Student' && 'Review your overall attendance records, submit new leaves, and view comments left by your mentor.'}
                  {activeRole === 'Parent' && 'Monitor your child academic performance, check their hostel residency logs, and contact their mentor.'}
                  {activeRole === 'Volunteer' && 'Contribute to tutorials, record your session hours, and support student development.'}
                </p>
              </div>

              {/* ANALYTICS METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Total Students
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {students.length} Enrolled
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
                      {activeRole === 'Student' ? 'Sponsor' : 'Total Volunteers'}
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {activeRole === 'Student' ? 'Hope3 Foundation' : `${volunteers.length} Active`}
                    </h4>
                    <span className="text-[10px] text-blue-500 flex items-center gap-1 mt-2 font-medium">
                      {activeRole === 'Student' ? 'Full tuition & hostel covered' : 'Dedicated to supporting students'}
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
                                log.category === 'general' ? 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400' :
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
                              <img 
                                src={student.avatar} 
                                alt={student.name} 
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120';
                                }}
                              />
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
                              <div className="flex items-center justify-end gap-2">
                                {/* WHATSAPP PHONE CALL ICON BUTTON */}
                                <a 
                                  href={getWhatsAppLink(student.parentPhone)} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  title={`Call ${student.name} / Parent via WhatsApp (${student.parentPhone})`}
                                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                                >
                                  <PhoneCall size={14} />
                                </a>

                                {/* WHATSAPP MESSAGE ICON BUTTON */}
                                <a 
                                  href={getWhatsAppLink(student.parentPhone, `Hello, regarding student ${student.name} from Hope3 NGO.`)} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  title={`Message ${student.name} / Parent on WhatsApp (${student.parentPhone})`}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                                >
                                  <MessageSquare size={14} />
                                </a>
                              </div>
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
                      <img 
                        src={selectedStudent.avatar} 
                        alt={selectedStudent.name} 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120';
                        }}
                      />
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

                    {/* Quick simulation buttons (Admin role check) */}
                    {(activeRole === 'Admin') && (
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
                    {(['Overview', 'Attendance', 'Current Location', 'Leave Requests', 'Academic Details', 'Notes'] as const).map(tab => (
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
                      <div className="space-y-6">
                        
                        {/* 1. PERSONAL INFORMATION & ACADEMIC SUMMARY */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Card 1: Personal Profile */}
                          <div className="glass-panel rounded-2xl p-5 space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <User size={16} className="text-blue-500" />
                              Personal Information
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Student Code</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedStudent.student_code || selectedStudent.rollNo || selectedStudent.id}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Date of Birth</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.date_of_birth || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Gender</span>
                                <span className="font-bold capitalize text-slate-800 dark:text-slate-200">{selectedStudent.gender || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Blood Group</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.blood_group || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Religion</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.religion || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Community</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.community || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Physically Challenged</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.physically_challenged ? 'Yes' : 'No'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Marital Status</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.is_married ? 'Married' : 'Single'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Academic & School/College Info */}
                          <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-2">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <Award size={16} className="text-indigo-500" />
                              Academic & Education Details
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">College / Institution</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.college || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Course & Major</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.course || selectedStudent.major ? `${selectedStudent.course || ''} (${selectedStudent.major || ''})` : 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Year & Mode</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.current_year || selectedStudent.year || 'N/A'} ({selectedStudent.mode || 'Full-Time'})</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Batch</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.batch || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">10th School</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.school_name_10th || selectedStudent.school_name || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">12th School</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.school_name_12th || selectedStudent.school_name || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Accommodation Type</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.hostel_or_dayscholar || 'Day Scholar'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Hostel Room</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.hostel_room || selectedStudent.hostelRoom || 'N/A'}</span>
                              </div>
                              <div className="sm:col-span-2 lg:col-span-3">
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">College Address</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.college_address || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* 2. FAMILY & LOCATION INFORMATION */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                          {/* Card 3: Family & Parent Info */}
                          <div className="glass-panel rounded-2xl p-5 space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <Users size={16} className="text-emerald-500" />
                              Family & Parent Details
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Parent Status</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.parent_status || 'Both Alive'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Number of Siblings</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.number_of_siblings ?? 0}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Father's Name</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.father_name || selectedStudent.parentName || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Father's Occupation & Contact</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.father_occupation || 'N/A'} ({selectedStudent.father_contact_number || selectedStudent.parentPhone || 'N/A'})</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Mother's Name</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.mother_name || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Mother's Occupation & Contact</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.mother_occupation || 'N/A'} ({selectedStudent.mother_contact_number || 'N/A'})</span>
                              </div>
                              {selectedStudent.guardian_name && (
                                <div className="sm:col-span-2">
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Guardian Details</span>
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.guardian_name} - {selectedStudent.guardian_occupation} ({selectedStudent.guardian_contact_number})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card 4: Address & Residential Location */}
                          <div className="glass-panel rounded-2xl p-5 space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <FileText size={16} className="text-purple-500" />
                              Address & Residential Details
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="sm:col-span-2">
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Address</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.address || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Landmark & Area</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.landmark || ''} {selectedStudent.area ? `(${selectedStudent.area})` : ''}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">City & District</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.city || ''}, {selectedStudent.district || ''}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">State & Pincode</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.state || ''} - {selectedStudent.pincode || ''}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Area Type</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.area_type || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* 3. FINANCIAL, BANK & SCHOLARSHIP DETAILS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                          {/* Card 5: Bank Account Info */}
                          <div className="glass-panel rounded-2xl p-5 space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <ClipboardList size={16} className="text-amber-500" />
                              Bank Account Details
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Bank Name</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.bank_name || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Student A/C Number</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedStudent.bank_account_number || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Bank IFSC Code</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedStudent.bank_ifsc || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Parent A/C & IFSC</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedStudent.parent_account_number || 'N/A'} ({selectedStudent.parent_ifsc || 'N/A'})</span>
                              </div>
                            </div>
                          </div>

                          {/* Card 6: Funding, Sponsorship & Documents */}
                          <div className="glass-panel rounded-2xl p-5 space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <Heart size={16} className="text-rose-500" />
                              Scholarship, Funding & Documents
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Funding Status / Maturity</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.academic_funding_maturity || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Funding Percentage & Approx Amount</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.funding_percentage ? `${selectedStudent.funding_percentage}%` : 'N/A'} (₹{selectedStudent.amount_approx || '0'})</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Funders / Organization</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.funders || 'Hope3 Foundation'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Documents Status</span>
                                <span className={`font-bold ${selectedStudent.is_document_uploaded ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {selectedStudent.is_document_uploaded ? 'Uploaded' : 'Pending'}
                                </span>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Documents Collected</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.documents_collected || 'N/A'}</span>
                              </div>
                              {selectedStudent.folder_link && (
                                <div className="sm:col-span-2">
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Google Drive Folder</span>
                                  <a href={selectedStudent.folder_link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold underline truncate block">
                                    {selectedStudent.folder_link}
                                  </a>
                                </div>
                              )}
                              {selectedStudent.remarks && (
                                <div className="sm:col-span-2">
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Remarks</span>
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{selectedStudent.remarks}</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* 4. TRACKING, VOLUNTEERING & NOTES */}
                        <div className="glass-panel rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            Tracking, Emergency & Notes
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Emergency Contact</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.emergency_contact || selectedStudent.parentPhone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Willing to Volunteer</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.willing_to_do_volunteering ? 'Yes' : 'No'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">On Track Status</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.are_you_on_track ? 'On Track' : 'Needs Review'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Currently Working</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.currently_working ? `Working (${selectedStudent.designation || ''})` : 'Student'}</span>
                            </div>
                            {selectedStudent.other_notes && (
                              <div className="sm:col-span-2 lg:col-span-4">
                                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Other Notes</span>
                                <p className="font-medium text-slate-700 dark:text-slate-300 pt-0.5">{selectedStudent.other_notes}</p>
                              </div>
                            )}
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
                                {req.status === 'Pending' && (activeRole === 'Admin') && (
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

                    {/* PROFILE TAB: NOTES */}
                    {profileTab === 'Notes' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Note feed */}
                        <div className="glass-panel rounded-2xl p-5 md:col-span-2 space-y-4">
                          <h4 className="font-bold text-sm">Counseling & Guidance Log</h4>
                          
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {selectedStudent.notes.length === 0 ? (
                              <p className="text-xs text-slate-400 py-4 text-center">No counseling logs filed yet.</p>
                            ) : (
                              selectedStudent.notes.map(note => (
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-base">Parent Database</h4>
                  <p className="text-xs text-slate-400">Manage linkages between student scholars and guardians</p>
                </div>

                {/* Search / Filter */}
                <input
                  type="text"
                  placeholder="Filter by parent or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Parent / Guardian Name</th>
                      <th className="p-4">Relationship</th>
                      <th className="p-4">Child Scholar</th>
                      <th className="p-4">Occupation</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParents.map(par => (
                      <tr key={par.id} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25">
                        <td className="p-4 font-bold text-slate-800 dark:text-white">{par.name}</td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/40">
                            {par.guardianName || par.relationship || par.relation || 'Guardian'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              const std = students.find(s => s.id === par.childId || (s as any).student_id === par.childId || s.student_code === par.childId);
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
                          <div className="flex items-center justify-end gap-2">
                            {/* WHATSAPP PHONE CALL ICON BUTTON */}
                            <a 
                              href={getWhatsAppLink(par.phone)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Call ${par.name} via WhatsApp (${par.phone})`}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                            >
                              <PhoneCall size={16} />
                            </a>

                            {/* WHATSAPP MESSAGE ICON BUTTON */}
                            <a 
                              href={getWhatsAppLink(par.phone, `Hello ${par.name}, greetings from Hope3 NGO.`)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Message ${par.name} on WhatsApp (${par.phone})`}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                            >
                              <MessageSquare size={16} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: VOLUNTEERS (ADMINS) */}
          {(activeTab === 'Admins' || activeTab === 'Volunteers') && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-base">Active Admin Network</h4>
                  <p className="text-xs text-slate-400">Coordinating operations, student mentoring, and program administration</p>
                </div>

                {/* Search / Filter */}
                <input
                  type="text"
                  placeholder="Filter by admin name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Admin Name</th>
                      <th className="p-4">Assigned Department</th>
                      <th className="p-4">Total Service Hours</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVolunteers.map(vol => (
                      <tr 
                        key={vol.id} 
                        className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/40 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedVolunteer(vol)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={vol.profile_photo_link || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'} 
                              alt={vol.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120');
                              }}
                            />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-white block hover:text-blue-600 transition-colors">{vol.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{vol.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {vol.specialization || vol.program}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{vol.hoursContributed} Hours</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{vol.phone}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px]
                            ${vol.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-amber-100 text-amber-700'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${vol.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            {vol.status}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedVolunteer(vol)}
                              className="text-xs bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold px-3 py-1.5 rounded-xl transition-colors border border-blue-200/50 dark:border-blue-800/40"
                            >
                              View Profile
                            </button>
                            <a 
                              href={getWhatsAppLink(vol.phone)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Call ${vol.name} via WhatsApp (${vol.phone})`}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                            >
                              <PhoneCall size={14} />
                            </a>
                            <a 
                              href={getWhatsAppLink(vol.phone, `Hello ${vol.name}, greetings from Hope3 NGO.`)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Message ${vol.name} on WhatsApp (${vol.phone})`}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                            >
                              <MessageSquare size={14} />
                            </a>
                          </div>
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
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-base">Donors & Financial Benefactors</h4>
                  <p className="text-xs text-slate-400">Tracking contributions, CSR sponsors, and individual education funds</p>
                </div>

                {/* Search / Filter */}
                <input
                  type="text"
                  placeholder="Filter by donor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Donor Category</th>
                      <th className="p-4">Total Contribution</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonors.map(donor => (
                      <tr 
                        key={donor.id} 
                        className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/40 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedDonor(donor)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={formatAvatarUrl(donor.profile_photo_link)} 
                              alt={donor.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                              }}
                            />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-white block hover:text-blue-600 transition-colors">{donor.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{donor.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50">
                            {donor.donorType}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {donor.formattedAmount}
                        </td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{donor.phone}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px] bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {donor.status}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedDonor(donor)}
                              className="text-xs bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold px-3 py-1.5 rounded-xl transition-colors border border-blue-200/50 dark:border-blue-800/40"
                            >
                              View Profile
                            </button>
                            <a 
                              href={getWhatsAppLink(donor.phone)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Call ${donor.name} via WhatsApp (${donor.phone})`}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                            >
                              <PhoneCall size={14} />
                            </a>
                            <a 
                              href={getWhatsAppLink(donor.phone, `Hello ${donor.name}, thank you for supporting Hope3 NGO scholars.`)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Message ${donor.name} on WhatsApp (${donor.phone})`}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
                            >
                              <MessageSquare size={14} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: FINANCE CENTER */}
          {activeTab === 'Finance' && (
            <div className="space-y-6">

              {/* TOP HERO BANNER & STATS CARD (MATCHING MOBILE SCREENSHOT) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Total Spend Card (Cyan/Teal Gradient Card like Mobile app) */}
                <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-600 to-emerald-600 rounded-3xl p-7 text-white shadow-xl shadow-teal-500/20 flex flex-col justify-between min-h-[160px]">
                  {/* Decorative Translucent Wallet Icon */}
                  <div className="absolute right-6 top-6 opacity-20 pointer-events-none">
                    <Wallet size={120} className="text-white" />
                  </div>

                  <div className="space-y-2 relative z-10">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border border-white/20 inline-block shadow-sm">
                      TOTAL SPEND
                    </span>

                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-2xl font-black text-cyan-100">₹</span>
                      <h3 className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white">
                        {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}
                      </h3>
                    </div>
                    <p className="text-xs text-teal-100/90 font-medium pt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                      Updated live from mobile app expenses feed • {expenses.length} Total Records
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-white/15 relative z-10">
                    <div className="flex gap-3 text-xs font-semibold">
                      <span className="text-cyan-100">Pending Approvals: <strong className="text-white font-mono">{expenses.filter(e => e.status === 'PENDING').length}</strong></span>
                      <span className="text-cyan-100">|</span>
                      <span className="text-cyan-100">Refund Requests: <strong className="text-white font-mono">{expenses.filter(e => e.refund_requested).length}</strong></span>
                    </div>

                    <button 
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-white hover:bg-cyan-50 text-teal-800 font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                      <Plus size={16} className="text-teal-600" />
                      <span>Add Record</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Stats Summary Box */}
                <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Financial Overview</span>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Volunteer Spend Tracker</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Real-time expense logs submitted by field volunteers & system staff across scholarship batches.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Top Category:</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 uppercase font-mono">Snacks & Food</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Audit Compliance:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">100% Verified</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CONTROLS HEADER: SUB-TABS (All Records | Analytics), CATEGORY FILTERS */}
              <div className="glass-panel rounded-3xl p-5 space-y-4">

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                  {/* Mobile-Style Pill Switcher: All Records vs Analytics */}
                  <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1 shrink-0">
                    <button 
                      onClick={() => setExpenseSubTab('records')}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                        expenseSubTab === 'records'
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      All Records
                    </button>
                    <button 
                      onClick={() => setExpenseSubTab('analytics')}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                        expenseSubTab === 'analytics'
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Analytics
                    </button>
                  </div>

                  {/* Category Filter Pills & Expandable Search Bar */}
                  <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                    {/* Category Filter Pills (Transport, Classes, Food, Sports, Medical...) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
                      {['ALL', 'snacks', 'groceries', 'sports', 'travel', 'medical', 'stationary'].map((cat) => {
                        const isActive = expenseCategoryFilter === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setExpenseCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize ${
                              isActive
                                ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                            }`}
                          >
                            {cat === 'ALL' ? 'All' : cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* EXPANDABLE SEARCH BAR BUTTON & INPUT */}
                    <div className="relative flex items-center shrink-0">
                      <div className={`flex items-center transition-all duration-300 ${
                        isExpenseSearchExpanded || expenseSearchQuery ? 'w-64 sm:w-72' : 'w-10'
                      }`}>
                        <button
                          onClick={() => {
                            setIsExpenseSearchExpanded(!isExpenseSearchExpanded);
                            if (isExpenseSearchExpanded) setExpenseSearchQuery('');
                          }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0 z-10 ${
                            isExpenseSearchExpanded || expenseSearchQuery
                              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30'
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="Search expenses by volunteer name or batch"
                        >
                          <Search size={18} />
                        </button>

                        {(isExpenseSearchExpanded || expenseSearchQuery) && (
                          <div className="relative w-full -ml-10 pl-11">
                            <input
                              type="text"
                              placeholder="Search volunteer, batch (RCD 2)..."
                              value={expenseSearchQuery}
                              onChange={(e) => setExpenseSearchQuery(e.target.value)}
                              autoFocus
                              className="w-full pl-3 pr-8 py-2 text-xs rounded-2xl border border-teal-500/50 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-md transition-all"
                            />
                            {expenseSearchQuery && (
                              <button
                                onClick={() => setExpenseSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-TAB 1: ALL RECORDS (EXPENSES CARDS SORTED REVERSE CHRONOLOGICALLY BY TIME) */}
                {expenseSubTab === 'records' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-slate-500">
                        Showing {
                          expenses.filter(e => {
                            const catMatch = expenseCategoryFilter === 'ALL' || e.category.toLowerCase() === expenseCategoryFilter.toLowerCase();
                            const query = expenseSearchQuery.trim().toLowerCase();
                            const searchMatch = !query || 
                              (e.created_by_name && e.created_by_name.toLowerCase().includes(query)) ||
                              (e.target_group && e.target_group.toLowerCase().replace(/_/g, ' ').includes(query)) ||
                              (e.title && e.title.toLowerCase().includes(query)) ||
                              (e.category && e.category.toLowerCase().includes(query));
                            return catMatch && searchMatch;
                          }).length
                        } of {expenses.length} Expense Logs
                        {expenseSearchQuery && <span className="text-teal-600 dark:text-teal-400 font-semibold ml-1.5">(Filtered by "{expenseSearchQuery}")</span>}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {expenses
                        .filter(e => {
                          const catMatch = expenseCategoryFilter === 'ALL' || e.category.toLowerCase() === expenseCategoryFilter.toLowerCase();
                          const query = expenseSearchQuery.trim().toLowerCase();
                          const searchMatch = !query || 
                            (e.created_by_name && e.created_by_name.toLowerCase().includes(query)) ||
                            (e.target_group && e.target_group.toLowerCase().replace(/_/g, ' ').includes(query)) ||
                            (e.title && e.title.toLowerCase().includes(query)) ||
                            (e.category && e.category.toLowerCase().includes(query));
                          return catMatch && searchMatch;
                        })
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(item => {
                          // Pick icon based on category
                          const catLower = item.category.toLowerCase();
                          const CategoryIcon = 
                            catLower.includes('snack') || catLower.includes('food') ? Coffee :
                            catLower.includes('sport') ? Trophy :
                            catLower.includes('travel') || catLower.includes('transport') ? Bus :
                            catLower.includes('med') ? Stethoscope :
                            catLower.includes('station') ? BookOpen :
                            catLower.includes('groc') ? ShoppingBag : Receipt;

                          // Format Date e.g. "23 Jul 2026"
                          let formattedDate = item.date;
                          try {
                            const d = new Date(item.date);
                            if (!isNaN(d.getTime())) {
                              formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                            }
                          } catch {}

                          return (
                            <div 
                              key={item.id} 
                              className="p-5 border border-slate-200/60 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col justify-between gap-4 group relative overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3.5">
                                  {/* Icon Thumbnail */}
                                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-sm">
                                    <CategoryIcon size={22} />
                                  </div>

                                  <div className="space-y-1">
                                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-cyan-600 transition-colors">
                                      {item.title}
                                    </h5>
                                    
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                                        {item.category}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {formattedDate}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Badge (e.g. PENDING in amber) */}
                                <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] tracking-wider uppercase shrink-0
                                  ${item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50'}`}
                                >
                                  {item.status}
                                </span>
                              </div>

                              {/* Footer: Creator & Amount */}
                              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                  <User size={13} className="text-slate-400" />
                                  <span>By {item.created_by_name || 'System Admin'}</span>
                                  {item.target_group && item.target_group !== 'ALL' && (
                                    <span className="text-[9px] font-mono bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-200/40">
                                      {item.target_group}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono">
                                    ₹ {item.amount.toLocaleString('en-IN')}
                                  </span>

                                  <button 
                                    onClick={() => handleDeleteExpense(item.id)}
                                    title="Delete expense entry"
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: ANALYTICS */}
                {expenseSubTab === 'analytics' && (
                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Category Spend Breakdown</h5>
                        
                        <div className="space-y-3">
                          {['snacks', 'groceries', 'sports', 'travel', 'medical', 'stationary'].map(cat => {
                            const catTotal = expenses
                              .filter(e => e.category.toLowerCase() === cat)
                              .reduce((sum, e) => sum + e.amount, 0);
                            const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0) || 1;
                            const pct = Math.round((catTotal / totalAll) * 100);

                            return (
                              <div key={cat} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="capitalize text-slate-800 dark:text-slate-200">{cat}</span>
                                  <span className="font-mono text-cyan-600">₹{catTotal.toLocaleString('en-IN')} ({pct}%)</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Audited Expenditure Reports</h5>
                        <div className="space-y-3">
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
                            <div>
                              <h6 className="font-bold text-xs">Monthly Field Expense Audit</h6>
                              <p className="text-[10px] text-slate-400">July 2026 volunteer refunds & receipts</p>
                            </div>
                            <button onClick={() => handleDownloadPDF('July_Expense_Audit')} className="text-cyan-600 text-xs font-bold hover:underline">Download PDF</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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

      {/* VOLUNTEER PROFILE MODAL */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl p-6 pt-5 pb-6 flex flex-col justify-between">
              <div className="flex justify-between items-center w-full mb-3">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  Volunteer User Profile
                </span>
                <button 
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar & Profile Title inside Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={formatAvatarUrl(selectedVolunteer.profile_photo_link)} 
                      alt={selectedVolunteer.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-xl bg-white/20 backdrop-blur-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedVolunteer.name}
                      <CheckCircle2 size={18} className="text-blue-200 fill-blue-500/40" />
                    </h3>
                    <p className="text-xs text-blue-100 font-medium">{selectedVolunteer.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={getWhatsAppLink(selectedVolunteer.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PhoneCall size={14} />
                    <span>Call</span>
                  </a>
                  <a 
                    href={getWhatsAppLink(selectedVolunteer.phone, `Hello ${selectedVolunteer.name}, greetings from Hope3 NGO.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md border border-white/20"
                  >
                    <MessageSquare size={14} />
                    <span>Message</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="p-6 space-y-6">

              {/* Bio */}
              {selectedVolunteer.bio && (
                <div className="glass-panel p-4 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biography</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedVolunteer.bio}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Specialization / Department</span>
                  <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedVolunteer.specialization || selectedVolunteer.program}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Availability Schedule</span>
                  <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedVolunteer.availability || 'Weekends'}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone Number</span>
                  <span className="font-mono font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedVolunteer.phone}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Service Hours</span>
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 block">{selectedVolunteer.hoursContributed} Hours Contributed</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Joined Date</span>
                  <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedVolunteer.joined_date || '2026-06-01'}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Account Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-[10px] bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {selectedVolunteer.status}
                  </span>
                </div>
              </div>

              {/* System Technical Identifiers */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-[10px] text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Volunteer ID:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">{selectedVolunteer.id}</span>
                </div>
                {selectedVolunteer.user_id && (
                  <div className="flex justify-between">
                    <span>User Account ID:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">{selectedVolunteer.user_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DONOR PROFILE MODAL */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-t-3xl p-6 pt-5 pb-6 flex flex-col justify-between">
              <div className="flex justify-between items-center w-full mb-3">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  Donor Benefactor Profile
                </span>
                <button 
                  onClick={() => setSelectedDonor(null)}
                  className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar & Profile Title inside Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={formatAvatarUrl(selectedDonor.profile_photo_link)} 
                      alt={selectedDonor.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-xl bg-white/20 backdrop-blur-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedDonor.name}
                      <CheckCircle2 size={18} className="text-emerald-200 fill-emerald-500/40" />
                    </h3>
                    <p className="text-xs text-emerald-100 font-medium">{selectedDonor.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={getWhatsAppLink(selectedDonor.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PhoneCall size={14} />
                    <span>Call</span>
                  </a>
                  <a 
                    href={getWhatsAppLink(selectedDonor.phone, `Hello ${selectedDonor.name}, thank you for supporting Hope3 NGO scholars.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md border border-white/20"
                  >
                    <MessageSquare size={14} />
                    <span>Message</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">

              {/* Highlight Contribution Box */}
              <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/40 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Total Financial Contribution</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{selectedDonor.formattedAmount}</span>
                </div>
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                  {selectedDonor.donorType}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Donor Type</span>
                  <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedDonor.donorType}</span>
                </div>

                {selectedDonor.organizationName && (
                  <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Organization / Trust Name</span>
                    <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedDonor.organizationName}</span>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone Number</span>
                  <span className="font-mono font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedDonor.phone}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Joined Date</span>
                  <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedDonor.joined_date || '2026-05-30'}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sponsorship Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-bold text-[10px] bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {selectedDonor.status}
                  </span>
                </div>
              </div>

              {/* System Technical Identifiers */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-[10px] text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Donor ID:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">{selectedDonor.id}</span>
                </div>
                {selectedDonor.user_id && (
                  <div className="flex justify-between">
                    <span>User Account ID:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">{selectedDonor.user_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <EntityCreationModal 
        type={creationModal.type} 
        isOpen={creationModal.isOpen} 
        onClose={() => setCreationModal({ type: '', isOpen: false })} 
        onSubmit={handleCreateEntity} 
      />

      {/* CREATE EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                  <Plus size={16} />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Add Expense Record</h4>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">EXPENSE TITLE / DESCRIPTION</label>
                <input 
                  type="text" 
                  placeholder="e.g. Shuttle transport, Refreshments, Stationery" 
                  value={newExpenseTitle} 
                  onChange={(e) => setNewExpenseTitle(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:outline-none focus:border-teal-500" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">CATEGORY</label>
                  <select 
                    value={newExpenseCategory} 
                    onChange={(e) => setNewExpenseCategory(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:outline-none focus:border-teal-500"
                  >
                    <option value="snacks">Snacks / Food</option>
                    <option value="groceries">Groceries</option>
                    <option value="sports">Sports</option>
                    <option value="travel">Travel / Transport</option>
                    <option value="medical">Medical</option>
                    <option value="stationary">Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">AMOUNT (₹)</label>
                  <input 
                    type="number" 
                    placeholder="1000" 
                    value={newExpenseAmount} 
                    onChange={(e) => setNewExpenseAmount(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono font-bold focus:outline-none focus:border-teal-500" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">TARGET SCHOLAR GROUP</label>
                <select 
                  value={newExpenseTargetGroup} 
                  onChange={(e) => setNewExpenseTargetGroup(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:outline-none focus:border-teal-500"
                >
                  <option value="ALL">All Batches (ALL)</option>
                  <option value="RCD_1">Batch RCD 1</option>
                  <option value="RCD_2">Batch RCD 2</option>
                  <option value="RCD_3">Batch RCD 3</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newExpenseRefund} 
                    onChange={(e) => setNewExpenseRefund(e.target.checked)} 
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Refund Requested</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newExpenseFoundationPaid} 
                    onChange={(e) => setNewExpenseFoundationPaid(e.target.checked)} 
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Foundation Paid</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Plus size={16} />
                <span>Save Expense Record</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON FOR STUDENTS, PARENTS, ADMINS/VOLUNTEERS, AND DONORS */}
      {['Students', 'Parents', 'Admins', 'Volunteers', 'Donors'].includes(activeTab) && (
        <button
          onClick={() => {
            const type = activeTab === 'Students' ? 'Student' : activeTab === 'Parents' ? 'Parent' : (activeTab === 'Admins' || activeTab === 'Volunteers') ? 'Volunteer' : 'Donor';
            setCreationModal({ type, isOpen: true });
          }}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all group"
          title={`Add New ${activeTab === 'Admins' ? 'Admin' : activeTab.slice(0, -1)}`}
        >
          <Plus size={24} className="transition-transform group-hover:rotate-90" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pr-1">
            Add {activeTab === 'Admins' ? 'Admin' : activeTab.slice(0, -1)}
          </span>
        </button>
      )}

    </div>
  );
}

export default App;
