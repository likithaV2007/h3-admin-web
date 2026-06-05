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
  Plus} from 'lucide-react';
import { EntityCreationModal } from './components/EntityCreationModal';
import {
  initialStudents,
  initialVolunteers,
  initialParents,
  initialActivityLogs,
  type Student,
  type Volunteer,
  type Parent,
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
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

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
    if (activeRole === 'Admin') return true;
    switch (activeRole) {
      case 'Student':
        return ['Dashboard', 'Class Management', 'Settings'].includes(tabName);
      case 'Parent':
        return ['Dashboard', 'Students', 'Settings'].includes(tabName);
      case 'Volunteer':
        return ['Dashboard', 'Students', 'Class Management', 'Settings'].includes(tabName);
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
    { name: 'Volunteers', icon: Award },
    { name: 'Class Management', icon: ClipboardList },
    { name: 'Reports', icon: FileText },
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

  // Calculated Stats
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;
  const avgAttendance = parseFloat((students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1));

  // Filtered Lists
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.college.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h3 className="text-xl font-bold mb-1">Welcome back, {activeRole}!</h3>
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

          {/* MODULE: CLASS MANAGEMENT */}
          {activeTab === 'Class Management' && (
            <div className="space-y-6">
              {/* HEADER ROW */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class & Training Programs</h3>
                  <p className="text-xs text-slate-400">
                    {activeRole === 'Admin' ? 'Create new classes, enroll students, and review teaching applications' :
                     activeRole === 'Student' ? 'My enrolled learning tracks and daily courses' :
                     'Assigned schedules and classes tracker'}
                  </p>
                </div>
              </div>

              {/* ADMIN VIEW */}
              {(activeRole === 'Admin') && (
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
                        if (!newClassName || !selectedClassVolunteer) return;
                        
                        const volunteerObj = volunteers.find(v => v.id === selectedClassVolunteer);
                        
                        const newClass: SchoolClass = {
                          id: `CLS00${classes.length + 1}`,
                          name: newClassName,
                          mentorId: 'MEN000',
                          mentorName: 'Assigned Mentor',
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
              {(activeRole === 'Volunteer') && (
                <div className="space-y-4">
                  {classes.filter(c => c.volunteerName.includes('Meera') || c.volunteerName.includes('Rahul')).map(cls => (
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
