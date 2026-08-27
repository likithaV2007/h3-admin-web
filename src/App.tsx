import { useState, useEffect, useRef } from 'react';
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
  Search,
  MapPin,
  Navigation,
  Building,
  GraduationCap,
  Home,
  ShieldCheck,
  Radio,
  Check,
  Compass,
  ArrowLeft,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowUp,
  CalendarDays,
  Camera,
  Shield,
  LogOut,
  Building2,
  BadgeCheck,
  Mail,
  Undo,
  Save
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
  type LeaveRequest,
  type Activity
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

function getWhatsAppLink(phone?: string, text?: string): string {
  if (!phone) return '#';
  const clean = phone.replace(/[^0-9]/g, '');
  if (!clean || clean === '0000000000') return '#';
  const fullPhone = clean.length === 10 ? `91${clean}` : clean;
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://api.whatsapp.com/send?phone=${fullPhone}${textParam}`;
}

import { Login } from './components/Login';


// Helper to extract a displayable image URL from drive links if a photo link is missing
const getDriveImageUrl = (photoLink?: string | null, driveLink?: string | null) => {
  const linkToUse = photoLink || driveLink;
  if (!linkToUse || typeof linkToUse !== 'string') return null;
  
  const clean = linkToUse.trim();
  if (clean === 'null' || clean === 'undefined' || clean === 'string' || clean === '') return null;

  if (clean.includes('drive.google.com') || clean.includes('googleusercontent.com')) {
    const match = clean.match(/\/d\/([a-zA-Z0-9_-]+)/) || clean.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  
  return clean || null;
};


const ProfileAvatar = ({ url, name, className, fallbackClassName }: { url?: string | null, name?: string | null, className: string, fallbackClassName: string }) => {
  const [error, setError] = useState(false);
  const parsedUrl = getDriveImageUrl(url);

  if (!parsedUrl || error) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div className={fallbackClassName}>
        {initial}
      </div>
    );
  }

  return (
    <img referrerPolicy="no-referrer" 
      src={parsedUrl} 
      alt={name || "Profile"} 
      className={className} 
      onError={() => setError(true)}
    />
  );
};

const AchievementImage = ({ url, className = "w-12 h-12 object-contain rounded-lg shrink-0", fallbackClassName = "w-12 h-12 rounded-lg bg-[#cbb4d4]/20 flex items-center justify-center shrink-0" }: { url: string, className?: string, fallbackClassName?: string }) => {
  const [error, setError] = useState(false);
  const parsedUrl = getDriveImageUrl(url);

  if (!parsedUrl || error) {
    return (
      <div className={fallbackClassName}>
        <span className="text-4xl drop-shadow-sm">🏆</span>
      </div>
    );
  }

  return (
    <img referrerPolicy="no-referrer" 
      src={parsedUrl} 
      alt="Badge" 
      className={className} 
      onError={() => setError(true)}
    />
  );
};

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
  const [students, setStudents] = useState<Student[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [adminCount, setAdminCount] = useState<number>(3);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [expenseSubTab, setExpenseSubTab] = useState<'records' | 'analytics'>('records');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('ALL');
  const [expenseSearchQuery, setExpenseSearchQuery] = useState<string>('');


  const [isExpenseSearchExpanded, setIsExpenseSearchExpanded] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [newExpenseTitle, setNewExpenseTitle] = useState<string>('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>('snacks');
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');
  const [newExpenseTargetGroup, setNewExpenseTargetGroup] = useState<string>('ALL');
  const [newExpenseRefund, setNewExpenseRefund] = useState<boolean>(true);
  const [newExpenseFoundationPaid, setNewExpenseFoundationPaid] = useState<boolean>(true);
  const [newExpenseReceipt, setNewExpenseReceipt] = useState<string>('');
  const [isSubmittingExpense, setIsSubmittingExpense] = useState<boolean>(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{ status: 'CONNECTED' | 'UNAUTHORIZED' | 'ERROR' | 'LOADING'; url: string }>({
    status: 'LOADING',
    url: 'https://h3apps-api.hope3.org'
  });

  // Finance Module: Fetch Real Expenses from API
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${apiStatus.url}/api/v1/expenses/?skip=0&limit=100&_t=${Date.now()}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('authToken') || localStorage.getItem('authToken')}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
          setExpenses(sorted.length > 0 ? sorted : []);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        console.error("Failed to load live expenses", err);
        setExpenses([]);
      }
    };
    fetchExpenses();
  }, [isAuthenticated, apiStatus.url]);

  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [customTokenInput, setCustomTokenInput] = useState<string>(localStorage.getItem('authToken') || '');
  const [editingGeofenceGroup, setEditingGeofenceGroup] = useState<any | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState<boolean>(false);
  const [mergeTargetName, setMergeTargetName] = useState<string>('');
  const [selectedFencesToMerge, setSelectedFencesToMerge] = useState<string[]>([]);

  const [showAddLocationModal, setShowAddLocationModal] = useState<boolean>(false);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState<boolean>(false);
  const [newZoneName, setNewZoneName] = useState<string>('');
  const [newZoneShape, setNewZoneShape] = useState<'polygon' | 'pentagon' | 'hexagon' | 'circle'>('pentagon');
  const [newZoneColor, setNewZoneColor] = useState<string>('#cbb4d4');
  const [newZoneTargetBatch, setNewZoneTargetBatch] = useState<string>('ALL');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('ALL');
  const [selectedGeofenceFilter, setSelectedGeofenceFilter] = useState<string>('ALL');
  const [modalBatchFilter, setModalBatchFilter] = useState<string>('ALL');
  const [fenceTypeTab, setFenceTypeTab] = useState<'single' | 'grouped'>('single');
  const [pendingGeofenceDetails, setPendingGeofenceDetails] = useState<{name: string, color: string, targetBatch: string} | null>(null);
  const [pendingDrawnShape, setPendingDrawnShape] = useState<{
    layer: any;
    coords: Array<[number, number]>;
    center: { lat: number; lng: number };
    defaultName: string;
  } | null>(null);
  const [isDrawingActive, setIsDrawingActive] = useState<boolean>(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'hybrid' | 'streets'>('hybrid');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollGeofences = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  // Default Koviloor Campus API Geofence Records Fallback
  const defaultApiGeofences = [
    {
      id: '06d77b3b-bf43-4bbc-b841-ed68db46665b',
      name: 'Hope3 Office Polygon',
      shape: 'polygon',
      color: '#cbb4d4',
      targetBatch: 'ALL',
      lat: 10.0815515,
      lng: 78.7463343,
      coords: [
        [10.081505, 78.746123],
        [10.081663, 78.746152],
        [10.081603, 78.746549],
        [10.081435, 78.746513],
        [10.081505, 78.746123]
      ],
      description: 'Koviloor Campus Office'
    },
    {
      id: '0b96fd76-81ec-4674-a036-ac747c5b476f',
      name: 'Boys Hostel',
      shape: 'polygon',
      color: '#10b981',
      targetBatch: 'ALL',
      lat: 10.0830310,
      lng: 78.7458130,
      coords: [
        [10.082823, 78.745596],
        [10.082724, 78.745852],
        [10.083239, 78.746033],
        [10.083339, 78.745773],
        [10.082823, 78.745596]
      ],
      description: 'Boys Hostel Building'
    },
    {
      id: 'a66949fd-a120-43f6-a8ef-e3d5e962e4a1',
      name: 'Girls Hostel',
      shape: 'polygon',
      color: '#ec4899',
      targetBatch: 'ALL',
      lat: 10.0831700,
      lng: 78.7453330,
      coords: [
        [10.083044, 78.745112],
        [10.082784, 78.745426],
        [10.083379, 78.745571],
        [10.083473, 78.745222],
        [10.083044, 78.745112]
      ],
      description: 'Girls Hostel Building'
    },
    {
      id: '0f75dba9-c33f-445c-ac4b-3039dc80ac8f',
      name: 'College',
      shape: 'polygon',
      color: '#8b5cf6',
      targetBatch: 'ALL',
      lat: 10.0803070,
      lng: 78.7503070,
      coords: [
        [10.079907, 78.749875],
        [10.080029, 78.750856],
        [10.080687, 78.750761],
        [10.080604, 78.749734],
        [10.079907, 78.749875]
      ],
      description: 'Main College Campus'
    },
    {
      id: '48a241d2-c07f-46e6-839c-f6260313fc15',
      name: 'Boundary #6',
      shape: 'polygon',
      color: '#f59e0b',
      targetBatch: 'ALL',
      lat: 10.0821494,
      lng: 78.7460618,
      coords: [
        [10.0818085, 78.7459535],
        [10.0825794, 78.7461144],
        [10.0823946, 78.7467525],
        [10.0817134, 78.7467043],
        [10.0812065, 78.7466882],
        [10.0812646, 78.7456693],
        [10.0816659, 78.7446827],
        [10.0823365, 78.7451224],
        [10.0828012, 78.7454978],
        [10.0828012, 78.7463396],
        [10.0826357, 78.7472147],
        [10.0825847, 78.7460018]
      ],
      description: 'Campus Boundary'
    }
  ];

  const [customGeofences, setCustomGeofences] = useState<Array<{
    id: string;
    name: string;
    shape: string;
    color: string;
    targetBatch: string;
    lat: number;
    lng: number;
    polygons: Array<{ name: string; coords: Array<[number, number]> }>;
    studentIds?: string[];
  }>>(() => {
    try {
      const saved = localStorage.getItem('h3_geofences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Restore any missing default single fences that were deleted during past merges
          const existingIds = parsed.map(p => p.id);
          const missingDefaults = defaultApiGeofences
            .filter(d => !existingIds.includes(d.id))
            .map(d => ({
              ...d,
              polygons: (d as any).polygons || (d.coords ? [{ name: d.name, coords: d.coords }] : []),
              studentIds: (d as any).studentIds || []
            }));

          const combined = [...parsed, ...missingDefaults];
          return combined.map((gf: any) => {
            const mappedPolys = (gf.polygons || []).map((p: any, idx: number) => {
              if (Array.isArray(p)) {
                return { name: `${gf.name} (Area ${idx + 1})`, coords: p };
              }
              return p;
            });
            return {
              ...gf,
              polygons: mappedPolys.length > 0 ? mappedPolys : (gf.coords ? [{ name: gf.name, coords: gf.coords }] : []),
              studentIds: gf.studentIds || []
            };
          });
        }
      }
    } catch { }
    return defaultApiGeofences.map((gf: any) => ({
      ...gf,
      polygons: gf.polygons || (gf.coords ? [{ name: gf.name, coords: gf.coords }] : []),
      studentIds: gf.studentIds || []
    }));
  });

  // Persist geofences changes locally so drawn fences never vanish
  useEffect(() => {
    try {
      if (customGeofences.length > 0) {
        localStorage.setItem('h3_geofences', JSON.stringify(customGeofences));
      }
    } catch { }
  }, [customGeofences]);

  const loadDataFromApi = async () => {
    setIsLoadingApi(true);
    setApiStatus(prev => ({ ...prev, status: 'LOADING' }));
    try {
      const health = await apiService.checkApiHealth();
      setApiStatus({ status: health.status, url: health.url });

      const fetchedStudents = await apiService.getStudents();

      const [fetchedVolunteers, fetchedParents, fetchedDonors, fetchedExpenses, fetchedGeofences, fetchedSessions, fetchedAdminCount, fetchedDashboardStats, fetchedActivities, fetchedClasses, fetchedStudentRequests, fetchedLeaveRequests] = await Promise.all([
        apiService.getVolunteers(),
        apiService.getParents(fetchedStudents),
        apiService.getDonors(),
        apiService.getExpenses(),
        apiService.getGeofences(),
        apiService.getTrackingSessions(),
        apiService.getAdminsCount(),
        apiService.getAdminDashboard(),
        apiService.getActivities(),
        apiService.getClasses(),
        apiService.getStudentRequests(),
        apiService.getLeaveRequests()
      ]);

      setAdminCount(fetchedAdminCount);
      setDashboardStats(fetchedDashboardStats);
      setActivities(fetchedActivities);

      let studentsWithLiveLocations = fetchedStudents || [];
      if (fetchedStudents && fetchedStudents.length > 0) {
        if (fetchedSessions && fetchedSessions.length > 0) {
          const latestSessionMap = new Map<string, any>();
          fetchedSessions.forEach(s => {
            if (!s.student_id) return;
            const existing = latestSessionMap.get(s.student_id);
            if (!existing || new Date(s.recorded_at) > new Date(existing.recorded_at)) {
              latestSessionMap.set(s.student_id, s);
            }
          });

          studentsWithLiveLocations = fetchedStudents.map(student => {
            const dbId = student.id || student.student_code;
            const session = latestSessionMap.get(dbId as string);
            if (session) {
              const lat = parseFloat(session.lat);
              const lng = parseFloat(session.lng);
              if (!isNaN(lat) && !isNaN(lng)) {
                let statusName: 'In Hostel' | 'In College' | 'Out of Bounds' | 'On Leave' = 'Out of Bounds';
                let locationStatus: 'Hostel' | 'College' | 'Office' | 'Out' | 'HQ' | 'On Leave' | 'Out of Bounds' = 'Out of Bounds';

                if (session.is_inside_geofence) {
                  const gfZone = (fetchedGeofences || []).find((g: any) => (g.zone_id === session.geofence_zone_id || g.id === session.geofence_zone_id));
                  const zoneNameLower = gfZone ? (gfZone.zone_name || gfZone.name || '').toLowerCase() : '';

                  if (zoneNameLower.includes('hostel')) {
                    statusName = 'In Hostel';
                    locationStatus = 'Hostel';
                  } else if (zoneNameLower.includes('college') || zoneNameLower.includes('campus')) {
                    statusName = 'In College';
                    locationStatus = 'College';
                  } else if (zoneNameLower.includes('office') || zoneNameLower.includes('ngo') || zoneNameLower.includes('hub') || zoneNameLower.includes('hq')) {
                    statusName = 'In College';
                    locationStatus = 'Office';
                  } else {
                    statusName = 'In Hostel';
                    locationStatus = 'Hostel';
                  }
                }

                return {
                  ...student,
                  locationStatus,
                  location: {
                    ...student.location,
                    status: statusName,
                    coordinates: `${lat}, ${lng}`,
                    lastUpdated: session.recorded_at ? new Date(session.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
                  }
                };
              }
            }
            return student;
          });
        }
        setStudents(studentsWithLiveLocations);
      }

      if (fetchedVolunteers && fetchedVolunteers.length > 0) setVolunteers(fetchedVolunteers);
      if (fetchedParents && fetchedParents.length > 0) setParents(fetchedParents);
      if (fetchedDonors && fetchedDonors.length > 0) setDonors(fetchedDonors);
      if (fetchedExpenses && fetchedExpenses.length > 0) setExpenses(fetchedExpenses);
      
      setClasses(fetchedClasses || []);
      setStudentRequests(fetchedStudentRequests || []);
      setLeaveRequests(fetchedLeaveRequests || []);

      if (fetchedGeofences && fetchedGeofences.length > 0) {
        const mappedGeofences: any[] = [];

        fetchedGeofences.forEach((gf: any, idx: number) => {
          const name = gf.zone_name || gf.name || gf.title || gf.location_name || `Geofence ${idx + 1}`;
          if (!name || name === 'string') return;

          let coords: Array<[number, number]> = [];
          if (Array.isArray(gf.coordinates) && gf.coordinates.length > 0) {
            coords = gf.coordinates.map((cStr: string) => {
              if (typeof cStr === 'string' && cStr.includes(',')) {
                const [lat, lng] = cStr.split(',').map(parseFloat);
                if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
              } else if (Array.isArray(cStr) && cStr.length >= 2) {
                return [parseFloat(cStr[0] as any), parseFloat(cStr[1] as any)];
              }
              return null;
            }).filter(Boolean) as Array<[number, number]>;
          }

          const centerLat = parseFloat(gf.center_lat || (coords.length > 0 ? coords[0][0] : 10.0815515));
          const centerLng = parseFloat(gf.center_lng || (coords.length > 0 ? coords[0][1] : 78.7463343));

          if (coords.length === 0) {
            const rad = (gf.radius_meters || 100) / 111320;
            coords = [
              [centerLat + rad, centerLng - rad],
              [centerLat + rad, centerLng + rad],
              [centerLat - rad, centerLng + rad],
              [centerLat - rad, centerLng - rad]
            ];
          }

          const colors = ['#ef4444', '#10b981', '#cbb4d4', '#a855f7', '#f59e0b', '#ec4899'];
          const color = colors[idx % colors.length];

          mappedGeofences.push({
            id: gf.zone_id || gf.id || `GF_API_${idx}`,
            name: name,
            shape: 'polygon',
            color: color,
            targetBatch: 'ALL',
            lat: centerLat,
            lng: centerLng,
            polygons: gf.polygons || [coords],
            studentIds: gf.studentIds || gf.assigned_students || [],
            description: gf.description || ''
          });
        });

        if (mappedGeofences.length > 0) {
          setCustomGeofences(mappedGeofences);
          try {
            localStorage.setItem('h3_geofences', JSON.stringify(mappedGeofences));
          } catch { }
        }
      }
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

  // Poll Dashboard Stats every 5 seconds for live updates
  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'Dashboard') return;
    
    const intervalId = setInterval(async () => {
      try {
        const liveStats = await apiService.getAdminDashboard();
        setDashboardStats(liveStats);
      } catch (err) {
        console.error("Failed to fetch live dashboard stats", err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, activeTab]);

  // Ray-Casting algorithm to check if GPS coordinate is within Geofence perimeter
  const isPointInPolygon = (point: [number, number], polygon: Array<[number, number]>) => {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Live Geofence Violation Alert Monitor
  useEffect(() => {
    if (!students || students.length === 0 || !customGeofences || customGeofences.length === 0) return;

    let stateChanged = false;
    const updatedStudents = students.map(student => {
      const assignedFence = customGeofences.find(gf => gf.studentIds && gf.studentIds.includes(student.id));
      if (!assignedFence) return student;

      if (student.location && student.location.coordinates) {
        const parts = student.location.coordinates.split(',').map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          const polygonsList = assignedFence.polygons || [];
          const isInside = polygonsList.length > 0
            ? polygonsList.some(poly => {
              const coords = Array.isArray(poly) ? poly : (poly as any).coords;
              return isPointInPolygon([parts[0], parts[1]], coords);
            })
            : false;
          if (!isInside && student.location.status !== 'Out of Bounds' && student.location.status !== 'On Leave') {
            stateChanged = true;
            const alertMsg = `🚨 Geofence Violation: ${student.name} is outside the ${assignedFence.name} perimeter!`;
            setNotifications(prev => {
              if (prev.some(n => n.text === alertMsg)) return prev;
              return [
                {
                  id: `GF_ALERT_${Date.now()}_${student.id}`,
                  text: alertMsg,
                  time: 'Just Now',
                  read: false
                },
                ...prev
              ];
            });

            return {
              ...student,
              location: {
                ...student.location,
                status: 'Out of Bounds'
              }
            };
          } else if (isInside && student.location.status === 'Out of Bounds') {
            stateChanged = true;
            return {
              ...student,
              location: {
                ...student.location,
                status: 'In Hostel'
              }
            };
          }
        }
      }
      return student;
    });

    if (stateChanged) {
      setStudents(updatedStudents);
    }
  }, [students, customGeofences]);

  // Leaflet OpenStreetMap & Full-Screen Google Maps Initialization
  useEffect(() => {
    if (activeTab !== 'Location' && !isFullScreenMapOpen) return;

    const timer = setTimeout(() => {
      const containerId = isFullScreenMapOpen ? 'fullscreen-google-map-container' : 'open-street-map-container';
      const mapContainer = document.getElementById(containerId);
      if (!mapContainer || !(window as any).L) return;

      const L = (window as any).L;

      // Clear previous map instance if initialized
      if ((mapContainer as any)._leaflet_id) {
        (mapContainer as any)._leaflet_id = null;
        mapContainer.innerHTML = '';
      }

      // Default Map Instance initialized
      const initialCenter: [number, number] = customGeofences.length > 0
        ? [customGeofences[0].lat, customGeofences[0].lng]
        : [10.0815515, 78.7463343];

      const map = L.map(containerId, {
        center: initialCenter,
        zoom: customGeofences.length > 0 ? 17 : 14,
        zoomControl: true
      });

      (window as any).leafletMapInstance = map;

      // Auto-detect Admin's Live Real GPS Location via Browser Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            map.setView([userLat, userLng], 15);

            const myLocMarker = L.marker([userLat, userLng]).addTo(map);
            myLocMarker.bindPopup('<b>📍 Your Current Live Location</b><br/>Super Admin GPS Position').openPopup();
          },
          (error) => {
            console.warn('Geolocation permission denied or unavailable:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }

      // Add Google Maps High-Definition Satellite & Hybrid Terrain Tiles Layer
      const googleTileUrl = mapType === 'hybrid'
        ? 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
        : 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

      L.tileLayer(googleTileUrl, {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
      }).addTo(map);

      // Render User-Created Geofence Shapes Filtered Group-Wise
      const visibleGeofences = selectedGeofenceFilter === 'ALL'
        ? customGeofences
        : customGeofences.filter(gf => gf.id === selectedGeofenceFilter);

      // Helper function to remove a geofence
      (window as any).deleteGeofenceById = async (geofenceId: string, event: Event) => {
        if (event) {
          event.stopPropagation();
        }
        if (confirm('Are you sure you want to delete this geofence boundary?')) {
          map.closePopup();
          const success = await apiService.deleteGeofence(geofenceId);
          if (success) {
            setCustomGeofences(prev => {
              const updated = prev.filter(g => g.id !== geofenceId);
              try {
                localStorage.setItem('h3_geofences', JSON.stringify(updated));
              } catch { }
              return updated;
            });
          } else {
            alert('Failed to delete geofence from server.');
          }
        }
      };

      // Initialize Leaflet FeatureGroup for user-drawn items
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      visibleGeofences.forEach(gf => {
        const polygonsList = gf.polygons || [];
        polygonsList.forEach(polyObj => {
          const coords = Array.isArray(polyObj) ? polyObj : (polyObj as any).coords;
          const name = Array.isArray(polyObj) ? gf.name : ((polyObj as any).name || gf.name);
          if (!coords || coords.length === 0) return;
          const poly = L.polygon(coords, {
            color: gf.color,
            fillColor: gf.color,
            fillOpacity: 0.25,
            weight: 2.5
          }).addTo(map);

          drawnItems.addLayer(poly);

          poly.bindPopup(`
            <div style="font-family: sans-serif; padding: 2px; text-align: left;">
              <b style="font-size: 13px; color: #1e293b;">${name}</b><br/>
              <span style="font-size: 11px; color: #64748b;">Parent Fence: <b>${gf.name}</b></span><br/>
              <span style="font-size: 11px; color: #64748b;">Batch: <b>${gf.targetBatch || 'All Batches'}</b></span><br/>
              <span style="font-size: 11px; font-weight: bold; color: ${gf.color};">🛡️ Geofence Active</span>
              <div style="margin-top: 8px; pt-2; border-top: 1px solid #e2e8f0;">
                <button 
                  onclick="window.deleteGeofenceById('${gf.id}', event)"
                  style="background-color: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;"
                >
                  🗑️ Delete Geofence Area
                </button>
              </div>
            </div>
          `);
        });
      });

      // Render Student Location Pins on the Map (matching selected geofence filter)
      const studentPins = selectedGeofenceFilter === 'ALL'
        ? students
        : (() => {
          const selectedFence = customGeofences.find(gf => gf.id === selectedGeofenceFilter);
          const assignedIds = selectedFence?.studentIds || [];
          return students.filter(s => assignedIds.includes(s.id));
        })();

      // Student pin offsets around Koviloor campus
      const campusOffsetLat = [0.0012, -0.0008, 0.0018, -0.0014, 0.0005, -0.0020, 0.0022];
      const campusOffsetLng = [-0.0005, 0.0015, -0.0012, 0.0008, 0.0021, -0.0010, 0.0003];

      studentPins.forEach((student, idx) => {
        let lat = 10.0815515 + campusOffsetLat[idx % campusOffsetLat.length];
        let lng = 78.7463343 + campusOffsetLng[idx % campusOffsetLng.length];

        if (student.location && student.location.coordinates) {
          const parts = student.location.coordinates.split(',').map(p => parseFloat(p.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            lat = parts[0];
            lng = parts[1];
          }
        }

        const studentIcon = L.divIcon({
          className: 'custom-student-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; items-center: center;">
              <div style="background-color: #20002c; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; white-space: nowrap; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                👤 ${student.name.split(' ')[0]} (${student.batch || '2026'})
              </div>
              <div style="width: 10px; h-10px; background-color: #20002c; transform: rotate(45deg); margin: -4px auto 0 auto; border-right: 1.5px solid white; border-bottom: 1.5px solid white;"></div>
            </div>
          `,
          iconSize: [80, 30],
          iconAnchor: [40, 30]
        });

        const pinMarker = L.marker([lat, lng], { icon: studentIcon }).addTo(map);
        pinMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 3px;">
            <b style="font-size: 13px; color: #1e293b;">${student.name}</b><br/>
            <span style="font-size: 11px; color: #64748b;">Roll No: <b>${student.rollNo}</b></span><br/>
            <span style="font-size: 11px; color: #64748b;">Batch: <b>${student.batch || student.current_year || '2026'}</b></span><br/>
            <span style="font-size: 11px; color: #64748b;">College: <b>${student.college}</b></span><br/>
            <span style="font-size: 11px; font-weight: bold; color: #059669;">📍 ${student.location?.status || 'In Hostel'}</span>
          </div>
        `);
      });

      // Add Leaflet Draw Toolbar EXCLUSIVELY in Full Screen Map Mode
      if (isFullScreenMapOpen && L.Control && L.Control.Draw) {
        const drawControl = new L.Control.Draw({
          draw: {
            polyline: false,
            polygon: {
              allowIntersection: true,
              showArea: true,
              guidelineDistance: 10,
              shapeOptions: {
                color: '#cbb4d4',
                fillColor: '#cbb4d4',
                fillOpacity: 0.35,
                weight: 3
              }
            },
            rectangle: {
              shapeOptions: {
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.25
              }
            },
            circle: {
              shapeOptions: {
                color: '#8b5cf6',
                fillColor: '#8b5cf6',
                fillOpacity: 0.25
              }
            },
            marker: false,
            circlemarker: false
          },
          edit: {
            featureGroup: drawnItems,
            remove: true
          }
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, (e: any) => {
          setIsDrawingActive(false);
          const layer = e.layer;
          const type = e.layerType;
          drawnItems.addLayer(layer);

          // Extract coordinates of drawn shape & ensure closed loop polygon
          let latlngs: any = layer.getLatLngs ? layer.getLatLngs() : [];
          if (Array.isArray(latlngs) && latlngs.length > 0 && Array.isArray(latlngs[0])) {
            latlngs = latlngs[0];
          }

          let coords: Array<[number, number]> = Array.isArray(latlngs) ? latlngs.map((pt: any) => [pt.lat, pt.lng]) : [];

          // Automatic polygon closure check: ensure first and last vertex point match
          if (coords.length >= 3) {
            const first = coords[0];
            const last = coords[coords.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              coords.push([first[0], first[1]]); // Auto-close polygon loop
            }
          }

          const center = layer.getBounds ? layer.getBounds().getCenter() : { lat: 10.0815515, lng: 78.7463343 };

          // Auto-generate a clean default name
          const defaultCount = customGeofences.length + 1;
          const defaultName = `Marked Geofence #${defaultCount}`;

          setPendingGeofenceDetails(prevDetails => {
            if (prevDetails) {
              // We came from the FAB modal, so AUTO-SAVE immediately!
              const autoSave = async () => {
                const apiPayload = {
                  zone_name: prevDetails.name,
                  center_lat: center.lat,
                  center_lng: center.lng,
                  radius_meters: 100,
                  coordinates: [JSON.stringify(coords)],
                  shape: 'polygon',
                  color: prevDetails.color,
                  target_batch: prevDetails.targetBatch,
                  polygons: [],
                  student_ids: [],
                  is_active: 1,
                  is_deleted: 0,
                  description: 'Added via Map Drawing'
                };
                
                let savedData = await apiService.createGeofence(apiPayload).catch(() => null);
                if (!savedData) savedData = { id: `GF_DRAWN_${Date.now()}`, ...apiPayload };

                setCustomGeofences(prev => {
                  const updated = [...prev, {
                    id: savedData.zone_id || savedData.id || `GF_DRAWN_${Date.now()}`,
                    name: prevDetails.name,
                    shape: 'polygon',
                    color: prevDetails.color,
                    targetBatch: prevDetails.targetBatch,
                    lat: center.lat,
                    lng: center.lng,
                    polygons: [{ name: 'Default Zone', coords }]
                  }];
                  localStorage.setItem('h3_geofences', JSON.stringify(updated));
                  return updated;
                });
                
                // Clear the pending details so it doesn't trigger again
                setNewZoneName('');
              };
              autoSave();
              return null; // Reset pending details
            } else {
              // We came from clicking the Pencil directly, so show the Confirm Custom Map Drawing UI
              setPendingDrawnShape({
                layer,
                coords,
                center,
                defaultName
              });
              setNewZoneName(defaultName);
              return null;
            }
          });
        });

        map.on(L.Draw.Event.DRAWSTOP, () => {
          setIsDrawingActive(false);
        });

        // Deletion Event via Leaflet Draw Toolbar Trash button
        map.on(L.Draw.Event.DELETED, () => {
          // Re-sync remaining layers
          const remainingCoords: any[] = [];
          drawnItems.eachLayer((layer: any) => {
            if (layer.getLatLngs) {
              let pts = layer.getLatLngs();
              if (Array.isArray(pts) && pts.length > 0 && Array.isArray(pts[0])) pts = pts[0];
              const c = pts.map((pt: any) => [pt.lat, pt.lng]);
              remainingCoords.push(c);
            }
          });

          setCustomGeofences(prev => {
            const filtered = prev.filter(g =>
              remainingCoords.some(rc => (g.polygons || []).some(poly => {
                const coords = Array.isArray(poly) ? poly : (poly as any).coords;
                return coords.length === rc.length;
              }))
            );
            try {
              localStorage.setItem('h3_geofences', JSON.stringify(filtered));
            } catch { }
            return filtered;
          });
        });
      }

      // Force Map Container Resize Calculation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeTab, students, customGeofences, mapType, isFullScreenMapOpen, selectedGeofenceFilter]);

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

  // Removed legacy handleCreateEntity mock handler
  // New Data State for Mind Map Features
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);

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

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);


  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Column Filters
  const [studentColFilters, setStudentColFilters] = useState<Record<string, string>>({});
  const [parentColFilters, setParentColFilters] = useState<Record<string, string>>({});
  const [adminColFilters, setAdminColFilters] = useState<Record<string, string>>({});
  const [donorColFilters, setDonorColFilters] = useState<Record<string, string>>({});


  // Selected Student Profile State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentLeaveRequests, setStudentLeaveRequests] = useState<any[]>([]);
  const [studentFeeRequests, setStudentFeeRequests] = useState<any[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<any[]>([]);
  const [studentSemesters, setStudentSemesters] = useState<any[]>([]);

  useEffect(() => {
    if (selectedStudent) {
      const id = (selectedStudent as any).student_id || selectedStudent.id;
      if (id) {
        apiService.getLeaveRequestsByStudent(id).then(setStudentLeaveRequests);
        apiService.getFeeRequestsByStudent(id).then(setStudentFeeRequests);
        apiService.getStudentAchievementsByStudent(id).then(setStudentAchievements);
        apiService.getSemestersByStudent(id).then(setStudentSemesters);
      }
    } else {
      setStudentLeaveRequests([]);
      setStudentFeeRequests([]);
      setStudentAchievements([]);
      setStudentSemesters([]);
    }
  }, [selectedStudent]);

  const [profileTab, setProfileTab] = useState<'Overview' | 'Attendance' | 'Fees Requests' | 'Leave Requests' | 'Academic Details' | 'Achievements' | 'Notes'>('Overview');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteType, setNewNoteType] = useState<string>('academic');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [studentBatchFilter, setStudentBatchFilter] = useState<string>('ALL');

  // Compute dynamic unique batches list from API students data
  const availableBatches = Array.from(
    new Set(
      students.map(s => s.batch || s.current_year || s.year || (s.grade && s.grade.includes('2nd Year') ? '2026' : s.grade && s.grade.includes('3rd Year') ? '2025' : '2024')).filter(Boolean)
    )
  ).sort().reverse();

  // Filtered Students List with Search & Batch Filter
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.grade && student.grade.toLowerCase().includes(searchQuery.toLowerCase()));

    const studentBatch = student.batch || student.current_year || student.year || (student.grade && student.grade.includes('2nd Year') ? '2026' : student.grade && student.grade.includes('3rd Year') ? '2025' : '2024');
    const matchesBatch = studentBatchFilter === 'ALL' || studentBatch === studentBatchFilter;

        const matchesColFilters = Object.entries(studentColFilters).every(([key, value]) => {
      if (!value) return true;
      const v = value.toLowerCase();
      if (key === 'name') return student.name.toLowerCase().includes(v);
      if (key === 'rollNo') return (student.rollNo || '').toLowerCase().includes(v);
      if (key === 'batch') return studentBatch.toLowerCase().includes(v);
      if (key === 'course') return (student.grade || '').toLowerCase().includes(v) || (student.course || '').toLowerCase().includes(v);
      if (key === 'college') return (student.college || '').toLowerCase().includes(v);
      if (key === 'location') return (student.location?.status || '').toLowerCase().includes(v);
      return true;
    });

    return matchesSearch && matchesBatch && matchesColFilters;

  });

  const handleDownloadPDF = (reportName: string) => {
    // Generate a simple valid mock PDF from base64
    const pdfBase64 = "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osSQTz93MTMvOIM/eLEnNLchMxE3fTE5EyFjMScHIWUzLz01DyFzLyS1FSF1OSS0qLU4mKFjBwwH1whuKTYwMAgNhdoUa4CV25iZp5Cbn56qh5QrgSoTig/PzOvxLwEKF5QnJmXWlysoJdYmgtUoJqTk6+QnJ+cWlySmZ+nkJuYmafgl5pYkpmXqpCTmZqTk6+QVVKUmZcK1G1sYAAAMK4z8QplbmRzdHJlYW0KZW5kb2JqCjMgMCBvYmoKNjEKZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDYgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nF3MTQ6CMBCE4f2ewmkMg0z/YFcTXyIUTXyA4WIBtQW5vl6RxsSdue+bN83I1VvjCjG7fG3T2Fh0pI5aK1Q7tUGXpQxSK+U1k2b0Uq+Uj8k2T31/z0/O5BzpQ5t1o+7O0X6Z1TtzP2f44vEB364cjwplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKNzgKZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCA1OTUuMjggODQxLjg5XS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgMSAwIFI+Pj4+L0NvbnRlbnRzIDIgMCBSL1BhcmVudCA3IDAgUj4+CmVuZG9iago3IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iago4IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA3IDAgUj4+CmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYS9FbmNvZGluZy9XaW5BbnNpRW5jb2Rpbmc+PgplbmRvYmoKOSAwIG9iago8PC9DcmVhdG9yKER1bW15IFBERiBEb3dubG9hZCkvUHJvZHVjZXIoRHVtbXkgUERGKj4+CmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDM5IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDE0OCAwMDAwMCBuIAowMDAwMDAwMjk2IDAwMDAwIG4gCjAwMDAwMDAxNjkgMDAwMDAgbiAKMDAwMDAwMDI3NSAwMDAwMCBuIAowMDAwMDAwMzkzIDAwMDAwIG4gCjAwMDAwMDA0NDggMDAwMDAgbiAKMDAwMDAwMDQ5MyAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgMTAvUm9vdCA4IDAgUi9JbmZvIDkgMCBSPj4Kc3RhcnR4cmVmCjU2NAolJUVPRgo=";
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

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
        return ['Dashboard'].includes(tabName);
      case 'Parent':
        return ['Dashboard', 'Students'].includes(tabName);
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
    { name: 'Activities', icon: CalendarDays },
    { name: 'Location', icon: MapPin },
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
  const handleFeeAction = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    const apiStatus = newStatus === 'Approved' ? 'approved' : 'rejected';
    const result = await apiService.updateFeeRequestStatus(id, apiStatus);
    if (result) {
      setStudentFeeRequests(prev => prev.map(fr => fr.fee_request_id === id ? { ...fr, status: newStatus } : fr));
    }
  };

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

  // Entity Creation Handler (Student, Parent, Volunteer, Donor) with FastAPI Integration
  const handleCreateEntitySubmit = async (type: string, data: any) => {
    if (type === 'Student') {
      const payload = {
        student_name: data.name,
        rollNo: data.rollNo || `STU_${Date.now()}`,
        age: parseInt(data.age) || 19,
        batch: data.batch || 'Batch 2026',
        year: data.grade || '2nd Year',
        grade: data.grade || '2nd Year',
        college: data.college || 'Government College',
        school_name: data.college || 'Government College',
        location_status: 'In Hostel'
      };
      await apiService.createStudent(payload);
      await loadDataFromApi();
    } else if (type === 'Parent') {
      const payload = {
        parent_name: data.name,
        relation: data.relationship,
        phone: data.phone,
        occupation: data.occupation,
        student_id: data.childId
      };
      await apiService.createParent(payload);
      await loadDataFromApi();
    } else if (type === 'Volunteer') {
      const payload = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        specialization: data.specialization,
        availability: data.availability
      };
      await apiService.createVolunteer(payload);
      await loadDataFromApi();
    } else if (type === 'activity') {
      const payload: Partial<Activity> = {
        title: data.title,
        activity_type: data.activity_type,
        description: data.description,
        audience: data.audience || 'Everyone',
        images: data.image_url ? [data.image_url] : []
      };

      const result = await apiService.createActivity(payload);
      if (result) {
        // Assume API format vs frontend format mismatch for images handling:
        // The endpoint schema takes `images: string[]`, but GET returns `images: {image_url: string}[]`
        // So we just re-fetch or map manually here. For instant UI update:
        const uiActivity: Activity = {
          ...result,
          images: data.image_url ? [{ caption: 'Activity Image', image_url: data.image_url, sort_order: 1 }] : []
        };
        setActivities(prev => [uiActivity, ...prev]);
      }
    }
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
    if (!newExpenseTitle || !newExpenseAmount || isSubmittingExpense) return;

    setIsSubmittingExpense(true);
    try {
      const amountVal = parseFloat(newExpenseAmount) || 0;
      const payload = {
        title: newExpenseTitle,
        category: newExpenseCategory,
        amount: amountVal,
        date: new Date().toISOString(),
        refund_requested: newExpenseRefund,
        is_private: true,
        is_foundation_paid: newExpenseFoundationPaid,
        target_group: newExpenseTargetGroup,
        receipt_photo_link: newExpenseReceipt
      };

      const result = await apiService.createExpense(payload);
      const expenseId = result?.id || result?.expense_id;
      if (expenseId && receiptFile) {
        try {
          await apiService.uploadReceipt(expenseId, receiptFile);
        } catch (uploadErr) {
          console.warn("Could not upload receipt to API:", uploadErr);
        }
      }

      const newEntry: Expense = {
        id: expenseId || `EXP_${Date.now()}`,
        title: newExpenseTitle,
        category: newExpenseCategory,
        amount: amountVal,
        date: new Date().toISOString(),
        refund_requested: newExpenseRefund,
        is_foundation_paid: newExpenseFoundationPaid,
        status: 'PENDING',
        target_group: newExpenseTargetGroup,
        created_by_name: activeRole === 'Volunteer' ? 'Volunteer Staff' : 'System Admin',
        receipt_photo_link: newExpenseReceipt
      };

      setExpenses(prev => [newEntry, ...prev]);
      setShowExpenseModal(false);
      setNewExpenseTitle('');
      setNewExpenseAmount('');
      setNewExpenseReceipt('');
      setReceiptFile(null);
    } catch (err) {
      console.error("Error submitting expense:", err);
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    await apiService.deleteExpense(id);
  };

  const handleApproveExpense = async (id: string, approve: boolean) => {
    const newStatus = approve ? 'APPROVED' : 'REJECTED';
    const approverName = activeRole === 'Admin' ? 'Super Admin' : 'System Admin';

    setExpenses(prev => prev.map(exp => {
      if (exp.id === id) {
        return {
          ...exp,
          status: newStatus,
          approved_by_name: approve ? approverName : null
        };
      }
      return exp;
    }));

    setSelectedExpense(prev => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          status: newStatus,
          approved_by_name: approve ? approverName : null
        };
      }
      return prev;
    });

    await apiService.updateExpenseStatus(id, newStatus, approve ? approverName : null);
  };

  // Calculated Stats
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;
  const avgAttendance = parseFloat((students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1));

  // Filtered Lists

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

      {/* MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION - MODERN PREMIUM REDESIGN */}
      <aside className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${sidebarOpen ? 'w-64 lg:w-[280px]' : 'w-0 lg:w-24 -translate-x-full lg:translate-x-0'} 
        h-[100dvh] lg:h-[calc(100vh-2rem)] lg:my-4 lg:ml-4 lg:rounded-[2.5rem] overflow-hidden
        bg-white/80 dark:bg-[#060913]/80 backdrop-blur-2xl border border-white/60 dark:border-white/5 
        shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(32,0,44,0.4)] ring-1 ring-black/5 dark:ring-white/5`}>

        {/* Brand/Logo Header */}
        <div className={`p-6 pt-8 flex items-center shrink-0 ${sidebarOpen ? 'justify-between' : 'justify-center'} pb-6`}>
          <div className="flex items-center gap-3 w-full">
            <div className="relative cursor-pointer shrink-0 mx-auto lg:mx-0">
              <img src="/hope3_logo-removebg-preview.png" alt="Hope3 Logo" className={`relative object-contain animate-[spin_8s_linear_infinite] transition-all duration-300 ${sidebarOpen ? 'w-11 h-11' : 'w-12 h-12 '}`} />
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in pl-1.5 overflow-hidden flex-1">
                <h1 className="font-extrabold text-[1.4rem] leading-tight bg-gradient-to-r from-[#20002c] to-[#cbb4d4] bg-clip-text text-transparent truncate">Hope3</h1>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-black tracking-[0.2em] uppercase block -mt-0.5">Admin Portal</span>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shrink-0">
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto scrollbar-none hide-scrollbar">
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
                  setSelectedStudent(null);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                title={!sidebarOpen ? item.name : undefined}
                className={`w-full flex items-center group relative rounded-2xl font-bold text-[13px] transition-all duration-300 overflow-hidden
                  ${!sidebarOpen ? 'justify-center p-3.5 mx-auto w-12 h-12' : 'gap-3.5 p-3.5 px-4.5'}
                  ${isActive
                    ? 'gradient-btn-tab text-white shadow-lg shadow-[#20002c]/20 scale-100'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50 hover:scale-[1.02]'}`}
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                )}
                <Icon
                  size={sidebarOpen ? 18 : 22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`shrink-0 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:-translate-y-0.5'} ${!sidebarOpen && isActive && 'scale-110'}`}
                />

                {sidebarOpen && (
                  <span className="tracking-wide relative z-10 truncate text-left flex-1" style={{ textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                    {item.name}
                  </span>
                )}

                {/* Active indicator dot for completely collapsed state */}
                {!sidebarOpen && isActive && (
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Widget (Bottom of Sidebar) */}
        <div className={`p-5 mb-2 mt-2 shrink-0 relative z-20 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center bg-slate-50 dark:bg-[#0c1222] rounded-[1.25rem] border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md p-2.5 ${sidebarOpen ? 'gap-3' : 'justify-center w-14 h-14'}`}
          >
            <div className="relative shrink-0">
              <div className={`${sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-[#20002c] to-[#cbb4d4] flex items-center justify-center text-white font-bold border-2 border-white dark:border-[#0c1222]`}>A</div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0c1222] rounded-full"></div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100 truncate tracking-tight">Super Admin</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate mt-0.5">Workspace</p>
              </div>
            )}
          </div>
        </div>
      </aside>


      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">



        {/* MOBILE ONLY NAVIGATION HEADER */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/70 dark:bg-[#060913]/70 backdrop-blur-3xl px-4 py-3 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2 rounded-xl gradient-btn-tab shadow-md active:scale-95 transition-transform"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              {activeTab}
            </h2>
          </div>
          <div className="relative cursor-pointer shrink-0 animate-[spin_8s_linear_infinite]">
            <img src="/hope3_logo-removebg-preview.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-6 space-y-6">

          {/* MODULE: DASHBOARD */}
          {activeTab === 'Dashboard' && !selectedStudent && (
            <div className="space-y-6">



              {/* ANALYTICS METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Metric 1 */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-[25vh] min-h-[160px]">
                  
                  {/* Decorative Static Wave */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
                    <div className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] origin-bottom-right">
                      {/* Secondary Wave */}
                      <svg className="absolute bottom-0 right-0 w-[110%] h-[110%] text-[#bcacc4] opacity-100" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 150,300 200,200 400,250 L 400,400 Z" />
                      </svg>
                      {/* Base Wave */}
                      <svg className="absolute bottom-0 right-0 w-full h-full text-[#573f64] opacity-60" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 100,250 250,350 400,200 L 400,400 Z" />
                      </svg>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-[#cbb4d4] text-white flex items-center justify-center shadow-inner shrink-0">
                      <Users size={26} strokeWidth={2} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        Total Enrolled
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#20002c] tracking-tight">
                        {dashboardStats?.total_students ?? students.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-[#cbb4d4]/15 dark:bg-[#cbb4d4]/30 text-[#cbb4d4] dark:text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                      <ArrowUp size={12} strokeWidth={3} />
                      12%
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                      vs last semester
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-[25vh] min-h-[160px]">
                  
                  {/* Decorative Static Wave */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
                    <div className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] origin-bottom-right">
                      {/* Secondary Wave */}
                      <svg className="absolute bottom-0 right-0 w-[110%] h-[110%] text-[#bcacc4] opacity-100" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 150,300 200,200 400,250 L 400,400 Z" />
                      </svg>
                      {/* Base Wave */}
                      <svg className="absolute bottom-0 right-0 w-full h-full text-[#573f64] opacity-60" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 100,250 250,350 400,200 L 400,400 Z" />
                      </svg>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-[#cbb4d4] text-white flex items-center justify-center shadow-inner shrink-0">
                      {activeRole === 'Student' ? <Calendar size={26} strokeWidth={2} /> : <ShieldCheck size={26} strokeWidth={2} />}
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        {activeRole === 'Student' ? 'My Attendance' : 'Total Volunteers'}
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#20002c] tracking-tight">
                        {activeRole === 'Student' ? '94.5%' : (dashboardStats?.total_volunteers ?? volunteers.length)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    {activeRole === 'Student' ? (
                      <>
                        <span className="inline-flex items-center gap-1 bg-[#cbb4d4]/15 dark:bg-[#cbb4d4]/30 text-[#cbb4d4] dark:text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <ArrowUp size={12} strokeWidth={3} />
                          Target 90%
                        </span>
                        <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">met successfully</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 bg-[#cbb4d4]/15 dark:bg-[#cbb4d4]/30 text-[#cbb4d4] dark:text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                          Active
                        </span>
                        <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Managing operations</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-[25vh] min-h-[160px]">
                  
                  {/* Decorative Static Wave */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
                    <div className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] origin-bottom-right">
                      {/* Secondary Wave */}
                      <svg className="absolute bottom-0 right-0 w-[110%] h-[110%] text-[#bcacc4] opacity-100" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 150,300 200,200 400,250 L 400,400 Z" />
                      </svg>
                      {/* Base Wave */}
                      <svg className="absolute bottom-0 right-0 w-full h-full text-[#573f64] opacity-60" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 100,250 250,350 400,200 L 400,400 Z" />
                      </svg>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-[#cbb4d4] text-white flex items-center justify-center shadow-inner shrink-0">
                      <Heart size={26} strokeWidth={2} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        {activeRole === 'Student' ? 'Sponsor' : 'Total Donors'}
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#20002c] tracking-tight">
                        {activeRole === 'Student' ? 'Hope3 Foundation' : (dashboardStats?.total_donors ?? donors.length)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    {activeRole === 'Student' ? (
                      <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Full tuition & hostel covered</span>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 bg-[#cbb4d4]/15 dark:bg-[#cbb4d4]/30 text-[#cbb4d4] dark:text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                          Active
                        </span>
                        <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Sponsoring education</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-[25vh] min-h-[160px]">
                  
                  {/* Decorative Static Wave */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
                    <div className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] origin-bottom-right">
                      {/* Secondary Wave */}
                      <svg className="absolute bottom-0 right-0 w-[110%] h-[110%] text-[#bcacc4] opacity-100" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 150,300 200,200 400,250 L 400,400 Z" />
                      </svg>
                      {/* Base Wave */}
                      <svg className="absolute bottom-0 right-0 w-full h-full text-[#573f64] opacity-60" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 100,250 250,350 400,200 L 400,400 Z" />
                      </svg>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-[#cbb4d4] text-white flex items-center justify-center shadow-inner shrink-0">
                      <MapPin size={26} strokeWidth={2} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        Out of Fence
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#20002c] tracking-tight">
                        {students.filter(s => s.location.status === 'Out of Bounds').length}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                      Requires urgent review
                    </span>
                  </div>
                </div>

              </div>



              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

                {/* Visual Chart Column */}
                <div className="flex flex-col gap-3 w-full lg:col-span-2">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                    Monthly Expenses Chart
                  </h4>
                  <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full">

                  {/* CUSTOM BAR/LINE CHART USING SVG */}
                  {(() => {
                    // Dynamically get the last 6 months up to current month
                    let monthIndices: number[] = [];
                    let monthLabels: string[] = [];
                    let monthlyCosts: number[] = [];

                    const currentMonth = new Date().getMonth();
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    for (let i = 11; i >= 0; i--) {
                      let d = new Date(new Date().getFullYear(), currentMonth - i, 1);
                      monthIndices.push(d.getMonth());
                      monthLabels.push(monthNames[d.getMonth()]);
                    }

                    if (dashboardStats?.monthly_expenses) {
                      monthlyCosts = monthLabels.map(label => {
                        const found = dashboardStats.monthly_expenses.find((m: any) => m.month === label);
                        return found ? found.amount : 0;
                      });
                    } else {
                      monthlyCosts = monthIndices.map(monthIdx => {
                        return expenses.filter(e => {
                          if (!e.date) return false;
                          const d = new Date(e.date);
                          return d.getMonth() === monthIdx;
                        }).reduce((sum, e) => sum + e.amount, 0);
                      });
                    }

                    const maxChartValue = 100000;
                    const yStep = 25000;

                    const formatK = (val: number) => {
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val.toFixed(0)}`;
                    };

                    const chartHeight = 500;
                    const chartYStart = 550;

                    const costPoints = monthlyCosts.map((val, i) => {
                      const x = 30 + (i * 48); // 12 points spanning from 30 to 558
                      const y = chartYStart - (Math.min(val, maxChartValue) / maxChartValue) * chartHeight;
                      return { x, y };
                    });

                    let costPath = '';
                    if (costPoints.length > 0) {
                      costPath = `M ${costPoints[0].x},${costPoints[0].y}`;
                      for (let i = 0; i < costPoints.length - 1; i++) {
                        const xMid = (costPoints[i].x + costPoints[i + 1].x) / 2;
                        costPath += ` C ${xMid},${costPoints[i].y} ${xMid},${costPoints[i + 1].y} ${costPoints[i + 1].x},${costPoints[i + 1].y}`;
                      }
                    }

                    const lastX = costPoints.length > 0 ? costPoints[costPoints.length - 1].x : 558;
                    const firstX = costPoints.length > 0 ? costPoints[0].x : 30;
                    const costPolygonPath = `${costPath} L ${lastX},550 L ${firstX},550 Z`;

                    return (
                      <div className="relative pt-4 h-[52vh] min-h-[300px] w-full mx-auto flex flex-col">
                        <div className="relative flex-1 w-full">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 580" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <defs>
                              <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map(offset => (
                              <line key={`grid-${offset}`} x1="40" y1={50 + offset} x2="580" y2={50 + offset} stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                            ))}
                            <line x1="40" y1="550" x2="580" y2="550" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                            {/* Chart Areas */}
                            <path d={costPolygonPath} fill="url(#costsGrad)" />

                            {/* Chart Lines */}
                            <path d={costPath} fill="none" stroke="#20002c" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-sm" />

                            {/* Data Points */}
                            {costPoints.map((p, i) => (
                              <circle key={`c-${i}`} cx={p.x} cy={p.y} r="4" fill="#20002c" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            ))}

                            {/* X Axis line */}
                            <line x1="40" y1="550" x2="580" y2="550" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                          </svg>

                          {/* Y Labels as HTML (prevent stretch) */}
                          <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between py-[12px] text-[10px] font-bold text-slate-800 dark:text-slate-200 pointer-events-none">
                            {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map(val => (
                              <span key={val} className="text-right pr-2">{val === 0 ? '0' : `₹${val}k`}</span>
                            ))}
                          </div>
                        </div>

                        {/* X Labels as HTML (prevent stretch) */}
                        <div className="relative w-full h-8 flex items-center mt-2 px-10">
                          {monthLabels.map((label, idx) => (
                            <div key={idx} className="flex-1 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Expense Distribution Donut Chart */}
                <div className="flex flex-col gap-3 w-full lg:col-span-1">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                    Expense Distribution
                  </h4>
                  {(() => {
                    const distributionData = [
                      { name: 'snacks', icon: <Coffee size={14} />, color: '#cbb4d4', bg: 'bg-[#cbb4d4]/10 text-[#cbb4d4]' },
                      { name: 'groceries', icon: <BookOpen size={14} />, color: '#573f64', bg: 'bg-[#573f64]/10 text-[#573f64]' },
                      { name: 'sports', icon: <Heart size={14} />, color: '#745c80', bg: 'bg-[#745c80]/10 text-[#745c80]' },
                      { name: 'medical', icon: <Users size={14} />, color: '#91799c', bg: 'bg-[#91799c]/10 text-[#91799c]' },
                      { name: 'travel', icon: <Bus size={14} />, color: '#ae96b8', bg: 'bg-[#ae96b8]/10 text-[#ae96b8]' },
                      { name: 'stationary', icon: <Pencil size={14} />, color: '#cbb4d4', bg: 'bg-[#cbb4d4]/20 text-[#cbb4d4]' }
                    ];

                    let calculatedData: any[] = distributionData.map(cat => {
                      if (dashboardStats?.expense_distribution) {
                        const stat = dashboardStats.expense_distribution.find((e: any) => e.category.toLowerCase() === cat.name);
                        return { ...cat, amount: stat ? stat.amount : 0 };
                      }
                      return {
                        ...cat,
                        amount: expenses.filter(e => e.category && e.category.toLowerCase() === cat.name).reduce((sum, e) => sum + e.amount, 0)
                      };
                    });
                    const totalExpenses = calculatedData.reduce((sum, cat) => sum + cat.amount, 0);

                    if (totalExpenses === 0) {
                      calculatedData = [
                        { ...distributionData[0], amount: 71, pct: 39 },
                        { ...distributionData[1], amount: 53, pct: 29 },
                        { ...distributionData[2], amount: 22, pct: 12 },
                        { ...distributionData[3], amount: 18, pct: 10 },
                        { ...distributionData[4], amount: 12, pct: 7 },
                        { ...distributionData[5], amount: 5, pct: 3 }
                      ];
                    } else {
                      calculatedData = calculatedData.map(cat => ({
                        ...cat,
                        pct: Math.round((cat.amount / totalExpenses) * 100)
                      })).sort((a, b) => b.pct - a.pct);
                    }

                    return (
                      <div className="glass-panel rounded-2xl bg-[#f4f8f4] dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full flex-1 flex flex-col">

                      <div className="flex-1 flex flex-col items-center justify-center pt-2">
                        <div className="relative w-[26vh] h-[26vh] min-w-[180px] min-h-[180px] mb-6">
                          {/* SVG Donut Chart */}
                          <svg viewBox="-50 -50 100 100" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-sm">
                            <g transform="rotate(-90)">
                              {(() => {
                                let currentPct = 0;
                                return calculatedData.map((cat, i) => {
                                  if (cat.pct <= 0) return null;
                                  const strokeDasharray = `${cat.pct} ${100 - cat.pct}`;
                                  const strokeDashoffset = -currentPct;
                                  currentPct += cat.pct;
                                  
                                  return (
                                    <circle
                                      key={i}
                                      cx="0"
                                      cy="0"
                                      r="40"
                                      fill="transparent"
                                      stroke={cat.color}
                                      strokeWidth="20"
                                      pathLength="100"
                                      strokeDasharray={strokeDasharray}
                                      strokeDashoffset={strokeDashoffset}
                                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                    >
                                      <title>{cat.name}: ₹{cat.amount} ({cat.pct}%)</title>
                                    </circle>
                                  );
                                });
                              })()}
                            </g>
                            
                            {/* Percentage Labels */}
                            {(() => {
                              let currentAngle = 0;
                              return calculatedData.map((cat, i) => {
                                if (cat.pct <= 0) return null;
                                const sliceAngle = (cat.pct / 100) * 360;
                                const midAngle = currentAngle + sliceAngle / 2;
                                const rad = midAngle * (Math.PI / 180);
                                const radius = 40; // middle of the stroke
                                const x = Math.sin(rad) * radius;
                                const y = -Math.cos(rad) * radius;
                                currentAngle += sliceAngle;
                                
                                if (cat.pct < 5) return null;

                                return (
                                  <text key={`label-${i}`} x={x} y={y} fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }} className="pointer-events-none">
                                    {cat.pct}%
                                  </text>
                                );
                              });
                            })()}
                          </svg>

                          {/* Center Donut Hole Text */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[60%] h-[60%] bg-[#f4f8f4] dark:bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-inner relative z-10 pointer-events-auto border border-slate-200/50 dark:border-slate-700/50">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total</span>
                              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                                ₹{totalExpenses === 0 ? 181 : totalExpenses.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-white dark:bg-slate-950 rounded-2xl p-4 shadow-sm space-y-3 mt-auto border border-slate-100 dark:border-slate-800">
                          {calculatedData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${cat.bg}`}>
                                  {cat.icon}
                                </div>
                                <span className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">{cat.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹{cat.amount}</span>
                                <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.pct}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* TWO COLUMN SUMMARY SECTIONS */}
              {activeRole !== 'Admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* VOLUNTEER VIEW: student requests approval & expense posting */}
                {activeRole === 'Volunteer' && (
                  <>
                    {/* Student Requests Pending */}
                    <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                                  <span className="text-[9px] font-semibold text-slate-800 dark:text-purple-400 font-mono">{req.type}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{req.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-350"><strong>{req.title}:</strong> {req.details}</p>
                              {req.amount && <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Requested: ₹{req.amount}</span>}

                              <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => handleStudentRequestAction(req.id, 'Approved')} className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors">
                                  Approve
                                </button>
                                <button onClick={() => handleStudentRequestAction(req.id, 'Rejected')} className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors">
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
                    <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                        <button type="submit" className="w-full gradient-btn-tab hover:brightness-110 font-bold p-2 rounded-lg text-xs transition-all shadow-sm">
                          Send Request to Volunteer
                        </button>
                      </form>
                    </div>

                    {/* Request history status list */}
                    <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                            <h5 className="font-bold text-xs mt-2 text-white">{req.title}</h5>
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
                    <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">My Child's Residency status</h4>
                        <p className="text-[11px] text-slate-400">Track checkins and geofence locations of Aravind Swamy</p>
                      </div>
                      <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Node:</span>
                          <span className="font-bold text-white">Block B Main Residency Portal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Attendance Ratio:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">95.4% Approved Checkins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Weekly GPAs:</span>
                          <span className="font-bold text-slate-800 dark:text-purple-400">9.1/10 (Excellent)</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Academic Counseling Mentor</h4>
                        <p className="text-[11px] text-slate-400">Reach out to your child's guide counselor directly</p>
                      </div>
                      <div className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white dark:bg-slate-900/30 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">AS</div>
                        <div>
                          <h5 className="font-bold text-xs text-white">Prof. Ananya Sen</h5>
                          <span className="text-[10px] text-slate-400 block">Senior Mentor Counselor</span>
                          <span className="text-[10px] text-slate-800 dark:text-purple-400 block mt-1 font-mono">ananya.sen@hope3.org</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}





              </div>
              )}
            </div>
          )}

          {/* MODULE: STUDENTS (DATA TABLE & DETAILS CONTAINER) */}
          {activeTab === 'Students' && (
            <div className="space-y-6">

              {!selectedStudent ? (
                /* MAIN STUDENT LIST */
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base">Student Database</h4>
                      <p className="text-xs text-slate-400">Total {students.length} students enrolled in active programs</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      {/* Batch Filter Dropdown */}
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
                        <Filter size={14} className="text-purple-500" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Batch:</span>
                        <select
                          value={studentBatchFilter}
                          onChange={(e) => setStudentBatchFilter(e.target.value)}
                          className="bg-transparent font-bold text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                        >
                          <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">All Batches (Overall)</option>
                          {availableBatches.map(b => (
                            <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Batch {b} Scholars</option>
                          ))}
                        </select>
                      </div>

                      {/* Search */}
                      <input
                        type="text"
                        placeholder="Search student, college, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-purple-500/20 w-full sm:w-64 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* DATA TABLE */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-black dark:text-white font-bold">
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Student</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setStudentColFilters(prev => ({...prev, 'name': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Roll ID</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setStudentColFilters(prev => ({...prev, 'rollNo': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Batch</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setStudentColFilters(prev => ({...prev, 'batch': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Course</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setStudentColFilters(prev => ({...prev, 'course': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>College Name</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setStudentColFilters(prev => ({...prev, 'college': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Status</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'status': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Location Status</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setStudentColFilters(prev => ({...prev, 'location': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                          <th className="p-4 text-right align-top">Actions</th>
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
                              <ProfileAvatar url={student.avatar || student.profile_photo_link} name={student.name || (student as any).student_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-[#20002c] to-[#cbb4d4] text-white font-black text-lg shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{student.name}</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-medium text-black/70 dark:text-white/70">{student.rollNo}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono bg-[#cbb4d4]/10 dark:bg-[#cbb4d4]/60 text-black dark:text-white border border-[#cbb4d4]/20 dark:border-[#cbb4d4]/80">
                                {student.batch || student.current_year || (student.grade && student.grade.includes('2nd Year') ? '2026' : student.grade && student.grade.includes('3rd Year') ? '2025' : '2024')}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="block font-medium text-slate-700 dark:text-slate-350">{student.grade ? student.grade.replace(/\s*-\s*\d+[a-zA-Z]{2}\s*Year\s*/i, ' ').trim() : ''}</span>
                            </td>
                            <td className="p-4">
                              <span className="block font-medium text-slate-700 dark:text-slate-350 max-w-[180px] truncate" title={student.college}>{student.college}</span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px] bg-[#cbb4d4]/10 text-black dark:bg-[#cbb4d4]/20 dark:text-white">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#cbb4d4]"></span>
                                {(student as any).status || 'Active'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[10px] bg-[#cbb4d4]/10 text-black dark:bg-[#cbb4d4]/20 dark:text-white">
                                <span className={`w-1.5 h-1.5 rounded-full bg-[#cbb4d4] ${student.location.status === 'Out of Bounds' ? 'animate-ping' : ''}`}></span>
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
                                  className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
                                >
                                  <PhoneCall size={14} />
                                </a>

                                {/* WHATSAPP MESSAGE ICON BUTTON */}
                                <a 
                                  href={getWhatsAppLink(student.parentPhone, `Hello, regarding student ${student.name} from Hope3 NGO.`)} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  title={`Message ${student.name} / Parent on WhatsApp (${student.parentPhone})`}
                                  className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
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
                  <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Back to Database"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-center gap-5">
                      <ProfileAvatar url={selectedStudent.avatar || selectedStudent.profile_photo_link || selectedStudent.profilePhotoUrl} name={selectedStudent.name || (selectedStudent as any).student_name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md shrink-0" fallbackClassName="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md bg-gradient-to-br from-[#20002c] to-[#cbb4d4] text-white font-black text-3xl shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedStudent.name}</h3>
                          <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">{selectedStudent.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{selectedStudent.grade}</p>

                        {/* Basic badges */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/20 text-slate-800 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-200/30">
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
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-purple-200/50 text-slate-800 hover:bg-purple-50 transition-colors"
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
                    {(['Overview', 'Attendance', 'Fees Requests', 'Leave Requests', 'Academic Details', 'Achievements', 'Notes'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setProfileTab(tab)}
                        className={`px-4 py-2 font-bold text-xs shrink-0 border-b-2 transition-all duration-200
                          ${profileTab === tab
                            ? 'border-violet-600 text-slate-800 dark:text-purple-400'
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
                        <div className="grid grid-cols-1 gap-6">

                          {/* Card 1: Personal Profile */}
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <User size={16} className="text-purple-500" />
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 lg:col-span-2">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                              <Award size={16} className="text-purple-500" />
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
                                <span className="font-bold text-slate-800 dark:text-slate-200">{(selectedStudent as any).hostel_room || selectedStudent.hostelRoom || 'N/A'}</span>
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                                  <a href={selectedStudent.folder_link} target="_blank" rel="noreferrer" className="text-slate-800 dark:text-purple-400 font-semibold underline truncate block">
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
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                            <Clock size={16} className="text-purple-500" />
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
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 flex flex-col items-center justify-center text-center space-y-4">
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
                                stroke="#cbb4d4"
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
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 md:col-span-2 space-y-4">
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

                    {/* PROFILE TAB: FEES REQUESTS */}
                    {profileTab === 'Fees Requests' && (
                      <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm">Fees Requests</h4>
                        </div>

                        <div className="space-y-3">
                          {studentFeeRequests.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No fee requests found.</p>
                          ) : (
                            studentFeeRequests.map(req => (
                              <div key={req.fee_request_id} className="p-5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
                                <div className="space-y-3 w-full">
                                  <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-base text-slate-900 dark:text-white">{req.fee_type} <span className="text-slate-500 font-normal">(₹{req.amount})</span></h5>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border
                                        ${req.status?.toLowerCase() === 'approved' || req.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                          req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                            'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                                      >
                                        {req.status}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block font-mono">Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg italic border border-slate-100 dark:border-slate-800/80">
                                    "{req.reason || 'No reason provided'}"
                                  </p>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] pt-1">
                                    {req.due_date && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Due Date</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.due_date}</span></div>
                                    )}
                                    {req.payment_mode && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Payment Mode</span><span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{req.payment_mode.replace('_', ' ')}</span></div>
                                    )}
                                    {req.course && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Course</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.course}</span></div>
                                    )}
                                    {req.email && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Email</span><span className="font-bold text-slate-700 dark:text-slate-300 truncate block" title={req.email}>{req.email}</span></div>
                                    )}
                                    {req.contact_number && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Contact</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.contact_number}</span></div>
                                    )}
                                    {req.review_note && (
                                      <div className="col-span-full"><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Admin Note</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.review_note}</span></div>
                                    )}
                                  </div>

                                  {(req.submitted_marksheets === 1 || req.submitted_payment_receipts === 1 || req.drive_link) && (
                                    <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                                      {req.drive_link && (
                                        <a href={req.drive_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors">
                                          <span>📎</span> View Attachments
                                        </a>
                                      )}
                                      {req.submitted_marksheets === 1 && (
                                        <span className="text-[10px] font-bold text-slate-700 bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/10 dark:text-[#cbb4d4] border border-[#cbb4d4]/40 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Marksheet</span>
                                      )}
                                      {req.submitted_payment_receipts === 1 && (
                                        <span className="text-[10px] font-bold text-slate-700 bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/10 dark:text-[#cbb4d4] border border-[#cbb4d4]/40 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Receipt</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Decision actions directly on profile */}
                                {req.status?.toLowerCase() === 'pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full justify-end">
                                    <button
                                      onClick={() => handleFeeAction(req.fee_request_id, 'Approved')}
                                      className="px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold transition-colors"
                                    >
                                      Approve Request
                                    </button>
                                    <button
                                      onClick={() => handleFeeAction(req.fee_request_id, 'Rejected')}
                                      className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors"
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

                    {/* PROFILE TAB: LEAVE REQUESTS */}
                    {profileTab === 'Leave Requests' && (
                      <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm">Leave Applications</h4>
                        </div>

                        <div className="space-y-3">
                          {studentLeaveRequests.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No leave applications lodged yet.</p>
                          ) : (
                            studentLeaveRequests.map(req => (
                              <div key={req.leave_request_id} className="p-5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
                                <div className="space-y-3 w-full">
                                  <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-base text-slate-900 dark:text-white">{req.reason || 'Leave Request'}</h5>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border
                                        ${req.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                          req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                            'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                                      >
                                        {req.status}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block font-mono">Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-[11px] pt-1">
                                    <div>
                                      <span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Leave Start Date</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">📅 {req.leave_date}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Return/Resume Date</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">📅 {req.resume_date}</span>
                                    </div>
                                    {req.review_note && (
                                      <div className="col-span-full">
                                        <span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Admin Note</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{req.review_note}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Decision actions directly on profile */}
                                {req.status?.toLowerCase() === 'pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full justify-end">
                                    <button
                                      onClick={() => handleLeaveAction(req.leave_request_id, 'Approved')}
                                      className="px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold transition-colors"
                                    >
                                      Approve Leave
                                    </button>
                                    <button
                                      onClick={() => handleLeaveAction(req.leave_request_id, 'Rejected')}
                                      className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors"
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
                      <div className="space-y-4 w-full">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3 mb-6">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                          Semesters & Academic Records
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {studentSemesters.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 col-span-full text-center">No academic records found.</p>
                          ) : (
                            studentSemesters.map(sem => (
                              <div key={sem.semester_id} className="glass-panel rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-[#cbb4d4]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col p-5">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h5 className="font-bold text-base leading-tight text-slate-900 dark:text-white mb-1">{sem.semester_name}</h5>
                                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Year: {sem.academic_year}</span>
                                  </div>
                                  {sem.is_active === 1 && (
                                    <span className="text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold bg-[#cbb4d4]/10 text-slate-800 dark:text-white rounded-full border border-[#cbb4d4]/30">Active</span>
                                  )}
                                </div>
                                {sem.subject && sem.subject.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {sem.subject.map((sub: string, idx: number) => (
                                      <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                        {sub}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                  {sem.marksheetImageLink && sem.marksheetImageLink !== 'string' ? (
                                    <a href={sem.marksheetImageLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#cbb4d4] hover:text-[#20002c] dark:hover:text-white hover:underline inline-flex items-center gap-1.5 transition-colors">
                                      📄 View Marksheet
                                    </a>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-400 inline-flex items-center gap-1.5">
                                      📄 No Marksheet
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* PROFILE TAB: ACHIEVEMENTS */}
                    {profileTab === 'Achievements' && (
                      <div className="space-y-4 w-full">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3 mb-6">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                          Student Achievements
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {studentAchievements.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 col-span-full text-center">No achievements recorded yet.</p>
                          ) : (
                            studentAchievements.map(ach => (
                              <div key={ach.id} className="glass-panel rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-[#cbb4d4]/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                  <AchievementImage 
                                    url={ach.photo_drive_link || ach.badge_image_url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    fallbackClassName="w-full h-full bg-[#cbb4d4]/10 flex items-center justify-center shrink-0" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">{ach.date}</span>
                                    {ach.status && ach.status !== 'string' && (
                                      <span className="text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold bg-[#cbb4d4]/10 text-slate-800 dark:text-white rounded-full border border-[#cbb4d4]/30">{ach.status}</span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-base leading-tight text-slate-900 dark:text-white mb-2">{ach.title}</h5>
                                  <p className="text-xs text-slate-500 line-clamp-2">{ach.description}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    {/* PROFILE TAB: NOTES */}
                    {profileTab === 'Notes' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Note feed */}
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 md:col-span-2 space-y-4">
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
                                    ${note.type === 'academic' ? 'bg-purple-100 text-purple-700' :
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
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                          <h4 className="font-bold text-sm">Add Counsel Note</h4>

                          {/* Note type selection */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                              <select
                                value={newNoteType}
                                onChange={(e) => setNewNoteType(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white mt-1 focus:outline-none"
                              >
                                <option value="academic" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Academic Counseling</option>
                                <option value="personal" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Personal / Family</option>
                                <option value="health" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Medical & Wellbeing</option>
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
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 focus:outline-none focus:border-purple-500"
                              ></textarea>
                            </div>

                            <button
                              onClick={() => handleAddNote(selectedStudent.id)}
                              className="w-full gradient-btn-tab hover:opacity-90 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
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
            <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                  className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-purple-500/20 w-full sm:w-64 transition-all shadow-sm"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-black dark:text-white font-bold">
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Parent / Guardian Name</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setParentColFilters(prev => ({...prev, 'name': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Relationship</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setParentColFilters(prev => ({...prev, 'relationship': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Child Scholar</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setParentColFilters(prev => ({...prev, 'child': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Occupation</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setParentColFilters(prev => ({...prev, 'occupation': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4 text-right align-top">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParents.map(par => (
                      <tr key={par.id} className="border-b border-slate-150 dark:border-slate-850 hover:bg-slate-100/30 dark:hover:bg-slate-800/25">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar url={par.profile_photo_link || par.avatar} name={par.name || (par as any).parent_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-[#20002c] to-[#cbb4d4] text-white font-black text-lg shrink-0" />
                            <div>
                              <span className="font-bold text-black dark:text-white block">{par.name}</span>
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-mono">{par.email || 'parent@hope3.org'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-black dark:text-white">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#cbb4d4]/10 dark:bg-[#cbb4d4]/20 text-black dark:text-white border border-transparent">
                            {par.guardianName || par.relationship || par.relation || 'Guardian'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              const std = students.find(s => s.id === par.childId || (s as any).student_id === par.childId || s.student_code === par.childId);
                              if (std) { setSelectedStudent(std); setActiveTab('Students'); setProfileTab('Overview'); }
                            }}
                            className="font-bold text-black dark:text-white hover:underline"
                          >
                            {par.childName}
                          </button>
                        </td>
                        <td className="p-4 text-black dark:text-white">{par.occupation}</td>
                        <td className="p-4 font-mono text-black dark:text-white">{par.phone}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WHATSAPP PHONE CALL ICON BUTTON */}
                            <a 
                              href={getWhatsAppLink(par.phone)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Call ${par.name} via WhatsApp (${par.phone})`}
                              className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
                            >
                              <PhoneCall size={15} />
                            </a>

                            {/* WHATSAPP MESSAGE ICON BUTTON */}
                            <a 
                              href={getWhatsAppLink(par.phone, `Hello ${par.name}, greetings from Hope3 NGO.`)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Message ${par.name} on WhatsApp (${par.phone})`}
                              className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
                            >
                              <MessageSquare size={15} />
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
                  className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 w-full sm:w-64 transition-all shadow-sm"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-black dark:text-white font-bold">
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Admin Name</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'name': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Assigned Department</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'department': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Total Service Hours</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'hours': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Phone Number</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'phone': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Status</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'status': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 text-right align-top">Actions</th>
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
                            <ProfileAvatar url={vol.profile_photo_link || vol.avatar} name={vol.name || (vol as any).volunteer_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-[#20002c] to-[#cbb4d4] text-white font-black text-lg shrink-0" />
                            <div>
                              <span className="font-bold text-black dark:text-white block hover:text-black dark:text-white transition-colors">{vol.name}</span>
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-mono">{vol.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-black dark:text-white">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-black dark:text-white">
                            {vol.specialization || vol.program}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-black dark:text-white">{vol.hoursContributed} Hours</td>
                        <td className="p-4 font-mono text-black dark:text-white">{vol.phone}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px]
                            ${vol.status === 'Active' ? 'bg-[#cbb4d4]/10 text-black dark:text-white dark:bg-[#cbb4d4]/20 dark:text-white text-black' : 'bg-amber-100 text-amber-700'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${vol.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            {vol.status}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedVolunteer(vol)}
                              className="text-xs bg-[#cbb4d4]/10 dark:bg-[#cbb4d4]/50 hover:bg-[#cbb4d4]/20 text-black dark:text-white  font-bold px-3 py-1.5 rounded-xl transition-colors border border-[#cbb4d4]/20 dark:border-[#cbb4d4]/60"
                            >
                              View Profile
                            </button>
                            <a 
                              href={getWhatsAppLink(vol.phone)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Call ${vol.name} via WhatsApp (${vol.phone})`}
                              className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
                            >
                              <PhoneCall size={14} />
                            </a>
                            <a 
                              href={getWhatsAppLink(vol.phone, `Hello ${vol.name}, greetings from Hope3 NGO.`)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Message ${vol.name} on WhatsApp (${vol.phone})`}
                              className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
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
            <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                  className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-purple-500/20 w-full sm:w-64 transition-all shadow-sm"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-black dark:text-white font-bold">
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Donor Name</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setDonorColFilters(prev => ({...prev, 'name': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Donor Category</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setDonorColFilters(prev => ({...prev, 'category': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Total Contribution</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setDonorColFilters(prev => ({...prev, 'contribution': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Phone Number</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'phone': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 align-top"><div className="flex flex-col gap-1.5"><span>Status</span><input type="text" placeholder="Filter..." onClick={(e)=>e.stopPropagation()} onChange={(e) => setAdminColFilters(prev => ({...prev, 'status': e.target.value}))} className="w-full min-w-[80px] px-2 py-1 text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-normal focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200" /></div></th>
                      <th className="p-4 text-right align-top">Actions</th>
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
                            <ProfileAvatar url={donor.profile_photo_link || donor.avatar} name={donor.name || (donor as any).donor_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-[#20002c] to-[#cbb4d4] text-white font-black text-lg shrink-0" />
                            <div>
                              <span className="font-bold text-black dark:text-white block hover:text-black dark:text-white transition-colors">{donor.name}</span>
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-mono">{donor.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-black dark:text-white">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#cbb4d4]/10 dark:bg-[#cbb4d4]/40 text-black dark:text-white border border-[#cbb4d4]/20">
                            {donor.donorType}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-black dark:text-white  text-sm">
                          {donor.formattedAmount}
                        </td>
                        <td className="p-4 font-mono text-black dark:text-white">{donor.phone}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px] bg-[#cbb4d4]/10 text-black dark:text-white dark:bg-[#cbb4d4]/20 dark:text-white text-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {donor.status}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedDonor(donor)}
                              className="text-xs bg-[#cbb4d4]/10 dark:bg-[#cbb4d4]/50 hover:bg-[#cbb4d4]/20 text-black dark:text-white  font-bold px-3 py-1.5 rounded-xl transition-colors border border-[#cbb4d4]/20 dark:border-[#cbb4d4]/60"
                            >
                              View Profile
                            </button>
                            <a 
                              href={getWhatsAppLink(donor.phone)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Call ${donor.name} via WhatsApp (${donor.phone})`}
                              className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
                            >
                              <PhoneCall size={14} />
                            </a>
                            <a 
                              href={getWhatsAppLink(donor.phone, `Hello ${donor.name}, thank you for supporting Hope3 NGO scholars.`)} 
                              target="_blank" 
                              rel="noreferrer"
                              title={`Message ${donor.name} on WhatsApp (${donor.phone})`}
                              className="p-2 bg-[#cbb4d4]/10 hover:bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/40 dark:hover:bg-[#cbb4d4]/60 text-black dark:text-white  rounded-xl transition-all border outline-none focus:ring-2 focus:ring-[#cbb4d4]/50 border-[#cbb4d4]/20 dark:border-none flex items-center justify-center"
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
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Total Spend Card - Left Side */}
                <div className="w-full lg:w-1/2 relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-8 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[160px]">
                  {/* Decorative wavy background */}
                  <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" fill-opacity="0.1" d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,154.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>

                  {/* Decorative Wallet Icon */}
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-100 pointer-events-none hidden sm:block">
                    <div className="w-[120px] h-[100px] flex items-center justify-center">
                      <Wallet size={80} className="text-[#cbb4d4]/40 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="space-y-1 relative z-10">
                    <span className="text-slate-500 dark:text-slate-400 text-[12px] font-bold uppercase tracking-widest inline-block mb-1">
                      TOTAL SPEND
                    </span>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-3xl font-semibold text-slate-700 dark:text-slate-200">₹</span>
                      <h3 className="text-[2.75rem] leading-none font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
                        {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="mt-8 relative z-10">
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="gradient-btn-tab hover:brightness-110 font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-95 w-max"
                    >
                      <Plus size={18} className="text-white" />
                      Add Record
                    </button>
                  </div>
                </div>

                {/* Mini Stats - Right Side */}
                <div className="w-full lg:w-1/2 flex flex-col">
                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 flex-1 h-full">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-center items-center text-center">
                      <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Pending Approvals</span>
                      <strong className="text-5xl text-slate-900 dark:text-white font-bold">{expenses.filter(e => e.status === 'PENDING').length}</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-center items-center text-center">
                      <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Refund Requests</span>
                      <strong className="text-5xl text-slate-900 dark:text-white font-bold">{expenses.filter(e => e.refund_requested).length}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTROLS HEADER: SUB-TABS (All Records | Analytics), CATEGORY FILTERS */}
              <div className="glass-panel rounded-3xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                  {/* Mobile-Style Pill Switcher: All Records vs Analytics */}
                  <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1 shrink-0">
                    <button
                      onClick={() => setExpenseSubTab('records')}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${expenseSubTab === 'records'
                        ? 'gradient-btn-tab shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900'
                        }`}
                    >
                      All Records
                    </button>
                    <button
                      onClick={() => setExpenseSubTab('analytics')}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${expenseSubTab === 'analytics'
                        ? 'gradient-btn-tab shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900'
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
                            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 capitalize border ${isActive
                              ? 'bg-white text-slate-800 border-violet-200 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                              }`}
                          >
                            {cat === 'ALL' ? 'All' : cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* EXPANDABLE SEARCH BAR BUTTON & INPUT */}
                    <div className="relative flex items-center shrink-0">
                      <div className={`flex items-center transition-all duration-300 ${isExpenseSearchExpanded || expenseSearchQuery ? 'w-64 sm:w-72' : 'w-10'
                        }`}>
                        <button
                          onClick={() => {
                            setIsExpenseSearchExpanded(!isExpenseSearchExpanded);
                            if (isExpenseSearchExpanded) setExpenseSearchQuery('');
                          }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0 z-10 ${isExpenseSearchExpanded || expenseSearchQuery
                            ? 'gradient-btn-tab shadow-md'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900'
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
                        {expenseSearchQuery && <span className="text-slate-800 dark:text-teal-400 font-semibold ml-1.5">(Filtered by "{expenseSearchQuery}")</span>}
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
                          } catch { }

                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedExpense(item)}
                              className="p-5 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:shadow-md transition-all flex flex-col justify-between gap-5 group relative overflow-hidden cursor-pointer animate-fade-in"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3.5">
                                  {/* Icon/Image Thumbnail */}
                                  {(item.receipt_photo_link || item.receipt_drive_link) ? (
                                    <div className="w-11 h-11 rounded-2xl shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                      <img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link) || "https://placehold.co/44"} alt="Receipt" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-[8px] font-bold text-slate-400 p-1 text-center leading-tight">Private Image</span>'; }} />
                                    </div>
                                  ) : (
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm bg-[#cbb4d4]/10 text-[#cbb4d4] border-[#cbb4d4]/20`}>
                                      <CategoryIcon size={20} />
                                    </div>
                                  )}

                                  <div className="space-y-1.5 w-full">
                                    <h5 className="font-bold text-[15px] text-slate-900 dark:text-white leading-snug group-hover:text-[#cbb4d4] dark:group-hover:text-violet-400 transition-colors">
                                      {item.title}
                                    </h5>
                                    {item.uploaded_by && (
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400" style={{wordBreak: "break-all", whiteSpace: "normal"}}>By {item.uploaded_by} | P: {String(item.receipt_photo_link).substring(0, 30)}... | D: {String(item.receipt_drive_link).substring(0, 10)}</p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 tracking-wider">
                                        {item.category}
                                      </span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                        🗓 {formattedDate}
                                      </span>

                                      {/* Extra badges to make card richer */}
                                      {item.refund_requested && (
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[4px] bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 tracking-wider flex items-center gap-1">
                                          <RefreshCw size={10} /> Refund
                                        </span>
                                      )}
                                      {item.is_foundation_paid ? (
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[4px] bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 tracking-wider flex items-center gap-1">
                                          🏦 H3 Paid
                                        </span>
                                      ) : (
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[4px] bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 tracking-wider flex items-center gap-1">
                                          👤 Self Paid
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Status Badge (e.g. PENDING in amber/orange) */}
                                <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] tracking-widest uppercase shrink-0
                                  ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : item.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400'}`}
                                >
                                  {item.status}
                                </span>
                              </div>

                              {/* Footer: Creator & Amount */}
                              <div className="flex flex-col pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 mt-1 gap-4">
                                <div className="flex items-end justify-between">
                                  <div className="flex flex-col gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    <div className="flex items-center gap-1.5">
                                      <User size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                                      <span>By: <strong className="text-slate-700 dark:text-slate-300">{item.created_by_name || 'System Admin'}</strong></span>
                                      <span className="text-slate-300 dark:text-slate-600">|</span>
                                      <span>For: <strong className="text-slate-700 dark:text-slate-200 font-bold">{item.target_group || 'ALL'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 pl-[19px]">
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Approved By:</span>
                                      <span className={`text-[10px] font-bold ${item.status === 'APPROVED'
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : item.status === 'REJECTED'
                                          ? 'text-rose-600 dark:text-rose-400'
                                          : 'text-orange-500 dark:text-amber-500 bg-orange-50 dark:bg-orange-950/30 px-1.5 rounded'
                                        }`}>
                                        {item.status === 'APPROVED' ? (item.approved_by_name || 'System Admin') : item.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className="text-lg font-black text-emerald-600 dark:text-purple-400 font-mono">
                                      ₹ {item.amount.toLocaleString('en-IN')}
                                    </span>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteExpense(item.id);
                                      }}
                                      title="Delete expense entry"
                                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={15} strokeWidth={2} />
                                    </button>
                                  </div>
                                </div>

                                {/* Uploaded Receipt Display */}
                                {(item.receipt_photo_link || item.receipt_drive_link) && (
                                  <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Receipt</span>
                                    </div>
                                    {getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link) ? (
                                      <a href={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt thumbnail" className="w-full h-auto max-h-48 object-cover rounded-lg bg-white dark:bg-slate-950" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="py-4 text-center border-2 border-dashed border-red-200 rounded-lg text-xs font-bold text-red-500">Image is Private or Blocked. Click to open in Drive.</div>'; }} />
                                      </a>
                                    ) : (
                                      <a href={item.receipt_drive_link!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-full py-3 text-center border-2 border-dashed border-purple-200 dark:border-purple-900/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Open Document</span>
                                      </a>
                                    )}
                                  </div>
                                )}
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
              {/* DOUBLE CHART & MAP SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

                {/* Visual Chart Column */}
                <div className="flex flex-col gap-3 w-full lg:col-span-2">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                    Monthly Expenses Chart
                  </h4>
                  <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full">

                  {/* CUSTOM BAR/LINE CHART USING SVG */}
                  {(() => {
                    // Dynamically get the last 6 months up to current month
                    let monthIndices: number[] = [];
                    let monthLabels: string[] = [];
                    let monthlyCosts: number[] = [];

                    const currentMonth = new Date().getMonth();
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    for (let i = 11; i >= 0; i--) {
                      let d = new Date(new Date().getFullYear(), currentMonth - i, 1);
                      monthIndices.push(d.getMonth());
                      monthLabels.push(monthNames[d.getMonth()]);
                    }

                    if (dashboardStats?.monthly_expenses) {
                      monthlyCosts = monthLabels.map(label => {
                        const found = dashboardStats.monthly_expenses.find((m: any) => m.month === label);
                        return found ? found.amount : 0;
                      });
                    } else {
                      monthlyCosts = monthIndices.map(monthIdx => {
                        return expenses.filter(e => {
                          if (!e.date) return false;
                          const d = new Date(e.date);
                          return d.getMonth() === monthIdx;
                        }).reduce((sum, e) => sum + e.amount, 0);
                      });
                    }

                    const maxChartValue = 100000;
                    const yStep = 25000;

                    const formatK = (val: number) => {
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val.toFixed(0)}`;
                    };

                    const chartHeight = 500;
                    const chartYStart = 550;

                    const costPoints = monthlyCosts.map((val, i) => {
                      const x = 30 + (i * 48); // 12 points spanning from 30 to 558
                      const y = chartYStart - (Math.min(val, maxChartValue) / maxChartValue) * chartHeight;
                      return { x, y };
                    });

                    let costPath = '';
                    if (costPoints.length > 0) {
                      costPath = `M ${costPoints[0].x},${costPoints[0].y}`;
                      for (let i = 0; i < costPoints.length - 1; i++) {
                        const xMid = (costPoints[i].x + costPoints[i + 1].x) / 2;
                        costPath += ` C ${xMid},${costPoints[i].y} ${xMid},${costPoints[i + 1].y} ${costPoints[i + 1].x},${costPoints[i + 1].y}`;
                      }
                    }

                    const lastX = costPoints.length > 0 ? costPoints[costPoints.length - 1].x : 558;
                    const firstX = costPoints.length > 0 ? costPoints[0].x : 30;
                    const costPolygonPath = `${costPath} L ${lastX},550 L ${firstX},550 Z`;

                    return (
                      <div className="relative pt-4 h-[52vh] min-h-[300px] w-full mx-auto flex flex-col">
                        <div className="relative flex-1 w-full">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 580" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <defs>
                              <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map(offset => (
                              <line key={`grid-${offset}`} x1="40" y1={50 + offset} x2="580" y2={50 + offset} stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                            ))}
                            <line x1="40" y1="550" x2="580" y2="550" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                            {/* Chart Areas */}
                            <path d={costPolygonPath} fill="url(#costsGrad)" />

                            {/* Chart Lines */}
                            <path d={costPath} fill="none" stroke="#20002c" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-sm" />

                            {/* Data Points */}
                            {costPoints.map((p, i) => (
                              <circle key={`c-${i}`} cx={p.x} cy={p.y} r="4" fill="#20002c" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            ))}

                            {/* X Axis line */}
                            <line x1="40" y1="550" x2="580" y2="550" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                          </svg>

                          {/* Y Labels as HTML (prevent stretch) */}
                          <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between py-[12px] text-[10px] font-bold text-slate-800 dark:text-slate-200 pointer-events-none">
                            {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map(val => (
                              <span key={val} className="text-right pr-2">{val === 0 ? '0' : `₹${val}k`}</span>
                            ))}
                          </div>
                        </div>

                        {/* X Labels as HTML (prevent stretch) */}
                        <div className="relative w-full h-8 flex items-center mt-2 px-10">
                          {monthLabels.map((label, idx) => (
                            <div key={idx} className="flex-1 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Expense Distribution Donut Chart */}
                <div className="flex flex-col gap-3 w-full lg:col-span-1">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                    Expense Distribution
                  </h4>
                  {(() => {
                    const distributionData = [
                      { name: 'snacks', icon: <Coffee size={14} />, color: '#cbb4d4', bg: 'bg-[#cbb4d4]/10 text-[#cbb4d4]' },
                      { name: 'groceries', icon: <BookOpen size={14} />, color: '#573f64', bg: 'bg-[#573f64]/10 text-[#573f64]' },
                      { name: 'sports', icon: <Heart size={14} />, color: '#745c80', bg: 'bg-[#745c80]/10 text-[#745c80]' },
                      { name: 'medical', icon: <Users size={14} />, color: '#91799c', bg: 'bg-[#91799c]/10 text-[#91799c]' },
                      { name: 'travel', icon: <Bus size={14} />, color: '#ae96b8', bg: 'bg-[#ae96b8]/10 text-[#ae96b8]' },
                      { name: 'stationary', icon: <Pencil size={14} />, color: '#cbb4d4', bg: 'bg-[#cbb4d4]/20 text-[#cbb4d4]' }
                    ];

                    let calculatedData: any[] = distributionData.map(cat => {
                      if (dashboardStats?.expense_distribution) {
                        const stat = dashboardStats.expense_distribution.find((e: any) => e.category.toLowerCase() === cat.name);
                        return { ...cat, amount: stat ? stat.amount : 0 };
                      }
                      return {
                        ...cat,
                        amount: expenses.filter(e => e.category && e.category.toLowerCase() === cat.name).reduce((sum, e) => sum + e.amount, 0)
                      };
                    });
                    const totalExpenses = calculatedData.reduce((sum, cat) => sum + cat.amount, 0);

                    if (totalExpenses === 0) {
                      calculatedData = [
                        { ...distributionData[0], amount: 71, pct: 39 },
                        { ...distributionData[1], amount: 53, pct: 29 },
                        { ...distributionData[2], amount: 22, pct: 12 },
                        { ...distributionData[3], amount: 18, pct: 10 },
                        { ...distributionData[4], amount: 12, pct: 7 },
                        { ...distributionData[5], amount: 5, pct: 3 }
                      ];
                    } else {
                      calculatedData = calculatedData.map(cat => ({
                        ...cat,
                        pct: Math.round((cat.amount / totalExpenses) * 100)
                      })).sort((a, b) => b.pct - a.pct);
                    }

                    return (
                      <div className="glass-panel rounded-2xl bg-[#f4f8f4] dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full flex-1 flex flex-col">

                      <div className="flex-1 flex flex-col items-center justify-center pt-2">
                        <div className="relative w-[26vh] h-[26vh] min-w-[180px] min-h-[180px] mb-6">
                          {/* SVG Donut Chart */}
                          <svg viewBox="-50 -50 100 100" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-sm">
                            <g transform="rotate(-90)">
                              {(() => {
                                let currentPct = 0;
                                return calculatedData.map((cat, i) => {
                                  if (cat.pct <= 0) return null;
                                  const strokeDasharray = `${cat.pct} ${100 - cat.pct}`;
                                  const strokeDashoffset = -currentPct;
                                  currentPct += cat.pct;
                                  
                                  return (
                                    <circle
                                      key={i}
                                      cx="0"
                                      cy="0"
                                      r="40"
                                      fill="transparent"
                                      stroke={cat.color}
                                      strokeWidth="20"
                                      pathLength="100"
                                      strokeDasharray={strokeDasharray}
                                      strokeDashoffset={strokeDashoffset}
                                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                    >
                                      <title>{cat.name}: ₹{cat.amount} ({cat.pct}%)</title>
                                    </circle>
                                  );
                                });
                              })()}
                            </g>
                            
                            {/* Percentage Labels */}
                            {(() => {
                              let currentAngle = 0;
                              return calculatedData.map((cat, i) => {
                                if (cat.pct <= 0) return null;
                                const sliceAngle = (cat.pct / 100) * 360;
                                const midAngle = currentAngle + sliceAngle / 2;
                                const rad = midAngle * (Math.PI / 180);
                                const radius = 40; // middle of the stroke
                                const x = Math.sin(rad) * radius;
                                const y = -Math.cos(rad) * radius;
                                currentAngle += sliceAngle;
                                
                                if (cat.pct < 5) return null;

                                return (
                                  <text key={`label-${i}`} x={x} y={y} fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }} className="pointer-events-none">
                                    {cat.pct}%
                                  </text>
                                );
                              });
                            })()}
                          </svg>

                          {/* Center Donut Hole Text */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[60%] h-[60%] bg-[#f4f8f4] dark:bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-inner relative z-10 pointer-events-auto border border-slate-200/50 dark:border-slate-700/50">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total</span>
                              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                                ₹{totalExpenses === 0 ? 181 : totalExpenses.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-white dark:bg-slate-950 rounded-2xl p-4 shadow-sm space-y-3 mt-auto border border-slate-100 dark:border-slate-800">
                          {calculatedData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${cat.bg}`}>
                                  {cat.icon}
                                </div>
                                <span className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">{cat.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹{cat.amount}</span>
                                <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.pct}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
              </div>
            )}

              </div>

            </div>
          )}

          {/* MODULE: ACTIVITIES */}
          {activeTab === 'Activities' && (
            <div className="space-y-6">
              {/* Grid of Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-slate-500 font-medium">
                    No activities found.
                  </div>
                ) : (
                  activities.map(activity => (
                    <div key={activity.activity_id} className="glass-panel rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-[#cbb4d4]/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                      {activity.images && activity.images.length > 0 ? (
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img 
                            src={formatAvatarUrl(activity.images[0].image_url)} 
                            alt={activity.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          {activity.images.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                              +{activity.images.length - 1} More
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative h-20 w-full bg-gradient-to-r from-[#20002c]/80 to-[#cbb4d4]/80 shrink-0"></div>
                      )}
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
                            {activity.title}
                          </h4>
                          <span className="shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            {activity.activity_type}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays size={14} className="text-[#cbb4d4]" />
                            {new Date(activity.activity_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {activity.audience && (
                            <div className="flex items-center gap-1.5">
                              <Users size={14} className="text-[#cbb4d4]" />
                              {activity.audience}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-4 mt-auto">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Floating Action Button for Create Activity */}
              <button
                onClick={() => setCreationModal({ type: 'activity', isOpen: true })}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-[#20002c] to-[#cbb4d4] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#20002c]/30 transition-transform hover:scale-110"
                title="Create Activity"
              >
                <Plus size={24} />
              </button>
            </div>
          )}


          {/* MODULE: LOCATION & GEOFENCING */}
          {activeTab === 'Location' && (
            <>
            <div className="space-y-6">
              {/* Header Removed */}

              <div className="grid grid-cols-1 gap-6">

                {/* MAP GRAPHIC CANVAS SIMULATOR */}
                <div className="lg:col-span-2 glass-panel rounded-3xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 relative min-h-[380px] flex flex-col justify-between overflow-hidden">
                  {/* Google Street Map Location Search Bar & Geofencer Header */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-slate-800 dark:text-purple-400" />
                      <h4 className="font-bold text-sm text-white">Google Maps Geofence Radar</h4>
                    </div>

                    {/* Place Name Search & Auto-Geofence Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!locationSearchQuery.trim()) return;
                        setIsSearchingLocation(true);
                        try {
                          // Query GeoJSON polygon boundaries from Nominatim
                          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(locationSearchQuery.trim())}`);
                          const data = await res.json();
                          if (data && data.length > 0) {
                            const result = data[0];
                            const lat = parseFloat(result.lat);
                            const lon = parseFloat(result.lon);
                            const map = (window as any).leafletMapInstance;
                            const L = (window as any).L;

                            if (map && L) {
                              // Center HD Satellite map onto searched place
                              map.setView([lat, lon], 16);

                              // Extract polygon / multi-polygon boundary coordinates if available
                              let polygonCoords: Array<[number, number]> = [];
                              if (result.geojson && (result.geojson.type === 'Polygon' || result.geojson.type === 'MultiPolygon')) {
                                const rawCoords = result.geojson.type === 'Polygon' ? result.geojson.coordinates[0] : result.geojson.coordinates[0][0];
                                polygonCoords = rawCoords.map((c: [number, number]) => [c[1], c[0]]);
                              } else if (result.boundingbox) {
                                // Fallback: construct bounding perimeter rectangle fence from bounding box
                                const [sLat, nLat, wLng, eLng] = result.boundingbox.map(parseFloat);
                                polygonCoords = [
                                  [nLat, wLng],
                                  [nLat, eLng],
                                  [sLat, eLng],
                                  [sLat, wLng]
                                ];
                              }

                              if (polygonCoords.length > 0) {
                                // Save & Draw Geofence Boundary over HD Satellite Imagery
                                const newGeofence = {
                                  id: `GF_SEARCH_${Date.now()}`,
                                  name: result.display_name.split(',')[0] + ' Geofence',
                                  shape: 'polygon',
                                  color: '#cbb4d4',
                                  lat,
                                  lng: lon,
                                  targetBatch: 'ALL',
                                  polygons: [{ name: 'Default Zone', coords: polygonCoords }]
                                };

                                setCustomGeofences(prev => [...prev, newGeofence]);
                                try {
                                  await apiService.createGeofence(newGeofence);
                                } catch { }

                                // Draw interactive boundary layer
                                const poly = L.polygon(polygonCoords, {
                                  color: '#ef4444',
                                  fillColor: '#ef4444',
                                  fillOpacity: 0.25,
                                  weight: 3,
                                  dashArray: '5, 10'
                                }).addTo(map);

                                poly.bindPopup(`
                                  <div style="font-family: sans-serif; padding: 2px;">
                                    <b style="font-size: 13px; color: #1e293b;">📍 ${result.display_name.split(',')[0]}</b><br/>
                                    <span style="font-size: 11px; color: #64748b;">${result.display_name}</span><br/>
                                    <span style="font-size: 11px; font-weight: bold; color: #ef4444;">🛡️ Automatic Location Geofence Active</span>
                                  </div>
                                `).openPopup();
                              }
                            }
                          } else {
                            alert('Location not found. Try searching a specific town or place (e.g., "Koviloor", "Indiranagar", "PSG College")');
                          }
                        } catch (err) {
                          console.error('Error geocoding location:', err);
                        } finally {
                          setIsSearchingLocation(false);
                        }
                      }}
                      className="flex items-center gap-2 w-full sm:w-96"
                    >
                      <div className="relative w-full">
                        <input
                          type="text"
                          placeholder="Search place name to fence (e.g. Koviloor)..."
                          value={locationSearchQuery}
                          onChange={(e) => setLocationSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-purple-500/20 shadow-sm font-semibold"
                        />
                        {isSearchingLocation ? (
                          <RefreshCw size={14} className="absolute left-2.5 top-2 text-purple-500 animate-spin" />
                        ) : (
                          <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                        )}
                      </div>
                    </form>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
                    <Filter size={14} className="text-purple-500" />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Group Filter:</span>
                    <select
                      value={selectedGeofenceFilter}
                      onChange={(e) => setSelectedGeofenceFilter(e.target.value)}
                      className="bg-transparent font-bold text-xs text-white focus:outline-none cursor-pointer max-w-[160px]"
                    >
                      <option value="ALL">All Fences</option>
                      {customGeofences.map(gf => (
                        <option key={gf.id} value={gf.id}>{gf.name}</option>
                      ))}
                    </select>
                  </div>
                    
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                const map = (window as any).leafletMapInstance;
                                const L = (window as any).L;
                                if (map && L) {
                                  map.setView([latitude, longitude], 16);
                                  L.circleMarker([latitude, longitude], {
                                    radius: 8,
                                    color: '#cbb4d4',
                                    fillColor: '#cbb4d4',
                                    fillOpacity: 0.5
                                  }).addTo(map).bindPopup('You are here!').openPopup();
                                }
                              },
                              (err) => {
                                alert('Unable to retrieve your location. ' + err.message);
                              }
                            );
                          } else {
                            alert('Geolocation is not supported by your browser.');
                          }
                        }}
                        className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:hover:bg-purple-900/60 dark:text-purple-400 rounded-xl border border-purple-200 dark:border-purple-800 transition-all shadow-sm flex items-center justify-center"
                        title="Find My Location"
                      >
                        <Navigation size={18} />
                      </button>



                    {/* Satellite / Streets Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                      <button
                        onClick={() => setMapType('hybrid')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapType === 'hybrid' ? 'gradient-btn-tab shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-900'}`}
                      >
                        🛰️ Satellite
                      </button>
                      <button
                        onClick={() => setMapType('streets')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapType === 'streets' ? 'gradient-btn-tab shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-900'}`}
                      >
                        🗺️ Map
                      </button>
                    </div>
                  
                      <button
                      onClick={() => setIsFullScreenMapOpen(true)}
                      className="px-4 py-2.5 gradient-btn-tab hover:opacity-90 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                      title="Open full screen map to draw, add, or delete geofences"
                    >
                      <Compass size={16} />
                      <span>Open Full Screen Geofence Editor</span>
                    </button>
                    </div>

                  {/* Live OpenStreetMap Leaflet Container */}
                  <div className="w-full h-80 rounded-2xl bg-slate-100 dark:bg-slate-900 relative overflow-hidden border border-slate-200 dark:border-slate-800 z-0">
                    <div id="open-street-map-container" className="w-full h-full rounded-2xl z-0"></div>
                  </div>
                </div>
                </div>
          

{/* GEOFENCE ZONE CARDS & SUMMARY */}
              <div className="relative mt-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                      Active Geofence Zones ({customGeofences.length})
                    </h4>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/50">
                      <button
                        onClick={() => setFenceTypeTab('single')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide uppercase transition-all ${fenceTypeTab === 'single' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-purple-400 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Single ({customGeofences.filter(gf => !gf.polygons || gf.polygons.length <= 1).length})
                      </button>
                      <button
                        onClick={() => setFenceTypeTab('grouped')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide uppercase transition-all ${fenceTypeTab === 'grouped' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-purple-400 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Grouped ({customGeofences.filter(gf => gf.polygons && gf.polygons.length > 1).length})
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Geofence Group Filter */}
                  
                    <button
                      onClick={() => {
                        setSelectedFencesToMerge([]);
                        setMergeTargetName('');
                        setIsMergeModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                      title="Merge existing separate fences into a single geofence group"
                    >
                      <Layers size={16} />
                      <span>Merge / Group Fences</span>
                    </button>
                  </div>
                </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
                  {customGeofences
                    .filter(gf => {
                      const isGrouped = gf.polygons && gf.polygons.length > 1;
                      return fenceTypeTab === 'grouped' ? isGrouped : !isGrouped;
                    })
                    .map((gf) => {
                      const assignedStudentIds = gf.studentIds || [];
                      const assignedStudents = students.filter(s => assignedStudentIds.includes(s.id));
                      const hasViolation = assignedStudents.some(s => s.location?.status === 'Out of Bounds');
                      const insideCount = assignedStudents.filter(s => s.location?.status !== 'Out of Bounds' && s.location?.status !== 'On Leave').length;

                      const getGeofenceIcon = (name: string) => {
                        const nameLower = name.toLowerCase();
                        if (nameLower.includes('hostel')) return <Home size={20} />;
                        if (nameLower.includes('college') || nameLower.includes('campus')) return <GraduationCap size={20} />;
                        if (nameLower.includes('office') || nameLower.includes('ngo') || nameLower.includes('hub')) return <Building size={20} />;
                        return <Compass size={20} />;
                      };

                      const accentColor = hasViolation ? '#ef4444' : (gf.color || '#cbb4d4');

                      return (
                        <div
                          key={gf.id}
                          className={`w-full glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 relative overflow-hidden group transition-all border-l-4 ${hasViolation ? 'animate-pulse' : ''}`}
                          style={{ borderLeftColor: accentColor }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                            >
                              {getGeofenceIcon(gf.name)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the geofence "${gf.name}"?`)) {
                                    setCustomGeofences(prev => {
                                      const updated = prev.filter(g => g.id !== gf.id);
                                      localStorage.setItem('h3_geofences', JSON.stringify(updated));
                                      return updated;
                                    });
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                                title="Delete Geofence"
                              >
                                <Trash2 size={13} />
                              </button>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${hasViolation
                                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-650 dark:text-red-400'
                                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-250/30 text-emerald-600 dark:text-emerald-450'
                                  }`}
                              >
                                {hasViolation ? (
                                  <>⚠️ Out of Bounds Alert</>
                                ) : (
                                  <><ShieldCheck size={12} /> Geofence Active</>
                                )}
                              </span>
                            </div>
                          </div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate" title={gf.name}>{gf.name}</h4>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            {gf.shape === 'circle' ? 'Radius' : 'Polygon'} | {gf.lat ? `${gf.lat.toFixed(4)}° N, ${gf.lng ? gf.lng.toFixed(4) : 0}° E` : 'Dynamic Zone'}
                          </p>

                          {assignedStudents.length > 0 ? (
                            <div className="flex items-center gap-1.5 mt-3">
                              <div className="flex -space-x-2 overflow-hidden">
                                {assignedStudents.slice(0, 4).map(s => (
                                  s.profile_photo_link || s.avatar ? (
                                    <img
                                      key={s.id}
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover bg-white"
                                      src={s.profile_photo_link || s.avatar}
                                      alt={s.name}
                                      title={s.name}
                                    />
                                  ) : (
                                    <div
                                      key={s.id}
                                      className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-br from-[#20002c] to-[#cbb4d4] text-white text-[10px] font-black"
                                      title={s.name}
                                    >
                                      {s.name ? s.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                  )
                                ))}
                                {assignedStudents.length > 4 && (
                                  <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 ring-2 ring-white dark:ring-slate-900">
                                    +{assignedStudents.length - 4}
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-450 dark:text-slate-350 font-extrabold font-mono">
                                {insideCount}/{assignedStudents.length} Inside
                              </span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 mt-3 font-medium italic">No students assigned to group</p>
                          )}

                          <div
                            className="mt-4 pt-3 border-t flex justify-between items-center text-xs"
                            style={{ borderColor: `${accentColor}15` }}
                          >
                            <button
                              onClick={() => setEditingGeofenceGroup(gf)}
                              className="text-[10px] font-bold text-slate-800 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
                            >
                              <Users size={12} />
                              <span>Manage Group</span>
                            </button>

                            <span className="text-[10px] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider font-mono">
                              {gf.targetBatch || 'ALL'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            </>
          )}

        </main>

        {/* BOTTOM METRIC BAR OR FOOTER */}
        <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 py-4 px-6 text-center text-[10px] text-white/70 font-medium">
          Hope3 NGO Student Management System • Powered by React.js & Tailwind CSS v4
        </footer>

      </div>

      {/* VOLUNTEER PROFILE MODAL */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Header Banner */}
            <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl p-6 pt-5 pb-6 flex flex-col justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center w-full mb-3">
                <span className="bg-white/20 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  Admin Profile
                </span>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-1.5 bg-black/20 hover:bg-black/40 text-slate-900 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar & Profile Title inside Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {selectedVolunteer.profile_photo_link && formatAvatarUrl(selectedVolunteer.profile_photo_link) ? (
                      <img
                        src={formatAvatarUrl(selectedVolunteer.profile_photo_link)}
                        alt={selectedVolunteer.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-xl bg-white/20 backdrop-blur-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl border-2 border-white/80 shadow-xl bg-[#cbb4d4] flex items-center justify-center text-white text-3xl font-bold">
                        {selectedVolunteer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#cbb4d4] border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      {selectedVolunteer.name}
                      <CheckCircle2 size={18} className="text-[#cbb4d4]" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedVolunteer.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={getWhatsAppLink(selectedVolunteer.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#cbb4d4] hover:bg-[#cbb4d4]/90 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PhoneCall size={14} />
                    <span>Call</span>
                  </a>
                  <a
                    href={getWhatsAppLink(selectedVolunteer.phone, `Hello ${selectedVolunteer.name}, greetings from Hope3 NGO.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-white"
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
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-purple-400 block">{selectedVolunteer.hoursContributed} Hours Contributed</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Joined Date</span>
                  <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{selectedVolunteer.joined_date || '2026-06-01'}</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Account Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-[10px] bg-[#cbb4d4]/20 text-slate-800 dark:text-[#cbb4d4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbb4d4]"></span>
                    {selectedVolunteer.status}
                  </span>
                </div>
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
            <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl p-6 pt-5 pb-6 flex flex-col justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center w-full mb-3">
                <span className="bg-white/20 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  Donor Benefactor Profile
                </span>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="p-1.5 bg-black/20 hover:bg-black/40 text-slate-900 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar & Profile Title inside Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {selectedDonor.profile_photo_link && formatAvatarUrl(selectedDonor.profile_photo_link) ? (
                      <img
                        src={formatAvatarUrl(selectedDonor.profile_photo_link)}
                        alt={selectedDonor.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-xl bg-white/20 backdrop-blur-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl border-2 border-white/80 shadow-xl bg-[#cbb4d4] flex items-center justify-center text-white text-3xl font-bold">
                        {selectedDonor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#cbb4d4] border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      {selectedDonor.name}
                      <CheckCircle2 size={18} className="text-[#cbb4d4]" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedDonor.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={getWhatsAppLink(selectedDonor.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#cbb4d4] hover:bg-[#cbb4d4]/90 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PhoneCall size={14} />
                    <span>Call</span>
                  </a>
                  <a
                    href={getWhatsAppLink(selectedDonor.phone, `Hello ${selectedDonor.name}, thank you for supporting Hope3 NGO scholars.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-white"
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
              <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-[#cbb4d4] uppercase tracking-wider block">Total Financial Contribution</span>
                  <span className="text-2xl font-black text-[#cbb4d4] font-mono">{selectedDonor.formattedAmount}</span>
                </div>
                <span className="bg-[#cbb4d4] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
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
            </div>
          </div>
        </div>
      )}

      <EntityCreationModal
        type={creationModal.type}
        isOpen={creationModal.isOpen}
        onClose={() => setCreationModal({ type: '', isOpen: false })}
        onSubmit={(type, data) => {
          handleCreateEntitySubmit(type, data);
          setCreationModal({ type: '', isOpen: false });
        }}
      />

      {/* CREATE EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-slate-800 flex items-center justify-center font-bold">
                  <Plus size={16} />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Add Expense Record</h4>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 rounded-full">
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

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Receipt Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReceiptFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewExpenseReceipt(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold focus:outline-none focus:border-teal-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-950/40 dark:file:text-teal-400 cursor-pointer"
                />

                {/* PREVIEW NEWLY UPLOADED RECEIPT */}
                {newExpenseReceipt && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-1">Selected Receipt Preview</span>
                    <div className="flex justify-center">
                      <img src={newExpenseReceipt} alt="New Receipt Preview" className="max-h-32 object-contain rounded-lg" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExpenseRefund}
                    onChange={(e) => setNewExpenseRefund(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-800 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Refund Requested</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExpenseFoundationPaid}
                    onChange={(e) => setNewExpenseFoundationPaid(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-800 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Foundation Paid</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmittingExpense}
                className="w-full py-3 gradient-btn-tab hover:opacity-90 font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs disabled:cursor-not-allowed"
              >
                {isSubmittingExpense ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                <span>{isSubmittingExpense ? 'Saving...' : 'Save Expense Record'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EXPENSE DETAIL / APPROVAL MODAL */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Receipt size={16} />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Expense Details</h4>
              </div>
              <button onClick={() => setSelectedExpense(null)} className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1 scrollbar-none">
              <div className="text-center py-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">TOTAL AMOUNT</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-purple-400 font-mono">
                  ₹ {selectedExpense.amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Title / Description</span>
                  <span className="font-extrabold text-sm text-white mt-0.5 block">{selectedExpense.title}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Category</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5 block uppercase">{selectedExpense.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Date Submitted</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {new Date(selectedExpense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">For Scholar Group</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
                    {selectedExpense.target_group || 'ALL'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Refund Requested</span>
                  <span className={`inline-block font-extrabold text-[10px] mt-0.5 px-2 py-0.5 rounded-full ${selectedExpense.refund_requested ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400' : 'bg-slate-100 text-slate-500'}`}>
                    {selectedExpense.refund_requested ? 'YES' : 'NO'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Foundation Paid</span>
                  <span className={`inline-block font-extrabold text-[10px] mt-0.5 px-2 py-0.5 rounded-full ${selectedExpense.is_foundation_paid ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400' : 'bg-slate-100 text-slate-500'}`}>
                    {selectedExpense.is_foundation_paid ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Submitted By</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedExpense.created_by_name || 'System Admin'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Status</span>
                  <span className={`inline-block font-extrabold text-[10px] mt-0.5 px-2 py-0.5 rounded-full ${selectedExpense.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                    selectedExpense.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                    {selectedExpense.status}
                  </span>
                </div>
              </div>

              {selectedExpense.status === 'APPROVED' && (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-250/20 rounded-2xl p-3 flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Approved By:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{selectedExpense.approved_by_name || 'System Admin'}</strong>
                </div>
              )}

              {(selectedExpense.receipt_photo_link || selectedExpense.receipt_drive_link) && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 pb-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Receipt Attachment</span>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2">
                    {getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link) ? (
                      <img
                        src={getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link) || "https://placehold.co/400"}
                        alt="Expense Receipt"
                        className="w-full max-h-48 object-contain hover:scale-[1.03] transition-transform cursor-zoom-in rounded-xl"
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<a href="' + (selectedExpense.receipt_drive_link || selectedExpense.receipt_photo_link) + '" target="_blank" class="block w-full py-4 text-center border-2 border-dashed border-red-200 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50">Private Google Drive Image. Click to view externally.</a>'; }}
                        onClick={() => {
                          const w = window.open();
                          if (w) w.document.write(`<img src="${getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />
                    ) : (
                      <a href={selectedExpense.receipt_drive_link!} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center border-2 border-dashed border-purple-200 dark:border-purple-900/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">View Document in Google Drive</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SUPER ADMIN APPROVAL/DISAPPROVAL CONTROLS */}
            {activeRole === 'Admin' && (
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 shrink-0">
                <button
                  onClick={() => handleApproveExpense(selectedExpense.id, false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedExpense.status === 'REJECTED'
                    ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 border-rose-200 dark:border-rose-900 cursor-not-allowed'
                    : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 dark:border-rose-800 dark:bg-slate-900 dark:hover:bg-rose-950/20'
                    }`}
                  disabled={selectedExpense.status === 'REJECTED'}
                >
                  Reject / Disapprove
                </button>
                <button
                  onClick={() => handleApproveExpense(selectedExpense.id, true)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedExpense.status === 'APPROVED'
                    ? 'bg-emerald-150 dark:bg-emerald-950/30 text-emerald-700 border-emerald-250/30 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-slate-900 border-transparent shadow-lg shadow-emerald-600/25'
                    }`}
                  disabled={selectedExpense.status === 'APPROVED'}
                >
                  Approve Expense
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE CUSTOM GEOFENCE SHAPE MODAL FOR OPENSTREETMAP */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-slate-800 flex items-center justify-center font-bold">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Create Geofence Zone</h4>
                  <p className="text-[10px] text-slate-400">Map custom polygon shapes on OpenStreetMap</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddLocationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newZoneName) return;

                setPendingGeofenceDetails({
                  name: newZoneName,
                  color: newZoneColor,
                  targetBatch: newZoneTargetBatch
                });

                setShowAddLocationModal(false);
                setIsFullScreenMapOpen(true);

                // Trigger Drawing Mode after modal closes
                setTimeout(() => {
                  const map = (window as any).leafletMapInstance;
                  const L = (window as any).L;
                  if (map && L && L.Draw && L.Draw.Polygon) {
                    if ((window as any).activePolygonDrawer) {
                      try { (window as any).activePolygonDrawer.disable(); } catch { }
                    }
                    const polygonDrawer = new L.Draw.Polygon(map, {
                      shapeOptions: {
                        color: newZoneColor || '#cbb4d4',
                        fillColor: newZoneColor || '#cbb4d4',
                        fillOpacity: 0.3,
                        weight: 3
                      }
                    });
                    (window as any).activePolygonDrawer = polygonDrawer;
                    polygonDrawer.enable();
                    setIsDrawingActive(true);
                  }
                }, 500);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1">GEOFENCE ZONE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hostel Block B - Batch 2026 Fence"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1">ALLOCATE TO STUDENT BATCH</label>
                <select
                  value={newZoneTargetBatch}
                  onChange={(e) => setNewZoneTargetBatch(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">All Batches (ALL)</option>
                  {availableBatches.map(b => (
                    <option key={b} value={b}>Batch {b} Scholars</option>
                  ))}
                </select>
              </div>



              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1">MAP BOUNDARY COLOR</label>
                <div className="flex items-center gap-3">
                  {['#cbb4d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewZoneColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${newZoneColor === col ? 'scale-110 border-slate-900 dark:border-white shadow-md' : 'border-transparent opacity-80'}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 gradient-btn-tab hover:opacity-90 font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <MapPin size={16} />
                  <span>Mark Geofence on Map</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE GEOFENCE GROUP MODAL */}
      {editingGeofenceGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-slate-800 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Users size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Manage Group</h4>
                  <p className="text-[10px] text-slate-400">Add/remove students from {editingGeofenceGroup.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingGeofenceGroup(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-1 space-y-4 flex flex-col shrink-0">
              {/* Geofence Group Naming */}
              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-wider">Geofence Group Name</label>
                <input
                  type="text"
                  required
                  value={editingGeofenceGroup.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setEditingGeofenceGroup({ ...editingGeofenceGroup, name: newName });
                    setCustomGeofences(prev => {
                      const updated = prev.map(gf => gf.id === editingGeofenceGroup.id ? { ...gf, name: newName } : gf);
                      localStorage.setItem('h3_geofences', JSON.stringify(updated));
                      return updated;
                    });
                  }}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl font-bold focus:outline-none focus:border-purple-500 text-xs"
                />
              </div>

              {/* Batch Filter inside Modal */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 gap-2 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filter Students:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={modalBatchFilter}
                    onChange={(e) => setModalBatchFilter(e.target.value)}
                    className="p-1 px-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl font-bold text-[10px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">All Batches</option>
                    {availableBatches.map(b => (
                      <option key={b} value={b}>Batch {b}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      const filteredStudents = students.filter(student => modalBatchFilter === 'ALL' || (student.batch || student.current_year || '2026') === modalBatchFilter);
                      const filteredIds = filteredStudents.map(s => s.id);
                      const currentlyAssigned = editingGeofenceGroup.studentIds || [];
                      const allSelected = filteredIds.every(id => currentlyAssigned.includes(id));

                      let newStudentIds: string[];
                      if (allSelected) {
                        newStudentIds = currentlyAssigned.filter((id: string) => !filteredIds.includes(id));
                      } else {
                        newStudentIds = Array.from(new Set([...currentlyAssigned, ...filteredIds]));
                      }

                      setEditingGeofenceGroup({ ...editingGeofenceGroup, studentIds: newStudentIds });
                      setCustomGeofences(prev => prev.map(gf => gf.id === editingGeofenceGroup.id ? { ...gf, studentIds: newStudentIds } : gf));
                    }}
                    className="p-1 px-2.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 text-slate-800 dark:text-purple-400 rounded-xl text-[10px] font-bold transition-all border border-purple-200/40"
                  >
                    {(() => {
                      const filteredStudents = students.filter(student => modalBatchFilter === 'ALL' || (student.batch || student.current_year || '2026') === modalBatchFilter);
                      const filteredIds = filteredStudents.map(s => s.id);
                      const currentlyAssigned = editingGeofenceGroup.studentIds || [];
                      const allSelected = filteredIds.every(id => currentlyAssigned.includes(id));
                      return allSelected ? 'Deselect All' : 'Select All';
                    })()}
                  </button>
                </div>
              </div>
            </div>

            {/* Student checklist */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none py-2 border-b border-slate-100 dark:border-slate-800/80">
              {students
                .filter(student => modalBatchFilter === 'ALL' || (student.batch || student.current_year || '2026') === modalBatchFilter)
                .map(student => {
                  const isAssigned = (editingGeofenceGroup.studentIds || []).includes(student.id);
                  return (
                    <label
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition-all animate-fade-in"
                    >
                      <div className="flex items-center gap-3">

                        <div>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">{student.name}</span>
                          <span className="text-[9px] text-slate-400">{student.grade} - {student.college}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCustomGeofences(prev => prev.map(gf => {
                            if (gf.id === editingGeofenceGroup.id) {
                              const currentIds = gf.studentIds || [];
                              const updatedIds = checked
                                ? [...currentIds, student.id]
                                : currentIds.filter(id => id !== student.id);

                              setEditingGeofenceGroup({ ...editingGeofenceGroup, studentIds: updatedIds });
                              return { ...gf, studentIds: updatedIds };
                            }
                            return gf;
                          }));
                        }}
                        className="w-4 h-4 rounded text-slate-800 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
                      />
                    </label>
                  );
                })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 shrink-0">
              <button
                onClick={async () => {
                  const payload = {
                    zone_name: editingGeofenceGroup.name,
                    studentIds: editingGeofenceGroup.studentIds || []
                  };
                  const success = await apiService.updateGeofence(editingGeofenceGroup.id, payload);
                  if (success) {
                    setEditingGeofenceGroup(null);
                  } else {
                    alert('Failed to save group assignment to server');
                  }
                }}
                className="w-full py-2.5 gradient-btn-tab hover:opacity-90 font-extrabold rounded-2xl shadow-lg transition-all text-xs"
              >
                Save Group Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MERGE GEOFENCES MODAL */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-slate-800 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Layers size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Merge / Group Fences</h4>
                  <p className="text-[10px] text-slate-400">Combine multiple fences under a single name</p>
                </div>
              </div>
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs flex-1 overflow-y-auto pr-1 scrollbar-none">
              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-wider">Unified Geofence Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Combined Hostel & Office Perimeter"
                  value={mergeTargetName}
                  onChange={(e) => setMergeTargetName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1.5 uppercase tracking-wider">Select Fences to Merge (Min. 2)</label>
                <div className="space-y-2">
                  {(() => {
                    const isCoordMatch = (poly1: Array<[number, number]>, poly2: Array<[number, number]>) => {
                      if (!poly1 || !poly2 || poly1.length !== poly2.length) return false;
                      return poly1.every((pt, idx) => pt[0] === poly2[idx][0] && pt[1] === poly2[idx][1]);
                    };

                    const singleFences = customGeofences.filter(gf => !gf.polygons || gf.polygons.length <= 1);

                    return singleFences.map(gf => {
                      const isChecked = selectedFencesToMerge.includes(gf.id);

                      const gfCoords = gf.polygons && gf.polygons[0]
                        ? (Array.isArray(gf.polygons[0]) ? gf.polygons[0] : (gf.polygons[0] as any).coords)
                        : [];

                      const containingGroups = customGeofences
                        .filter(g => (g.polygons || []).length > 1)
                        .filter(g =>
                          (g.polygons || []).some(p => {
                            const coords = Array.isArray(p) ? p : (p as any).coords;
                            return isCoordMatch(coords, gfCoords);
                          })
                        )
                        .map(g => g.name);

                      return (
                        <label
                          key={gf.id}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: gf.color }} />
                            <div>
                              <span className="font-bold text-xs text-slate-850 dark:text-slate-200 block">{gf.name}</span>
                              {containingGroups.length > 0 && (
                                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-medium block mt-0.5 animate-fade-in">
                                  Already in: {containingGroups.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedFencesToMerge(prev =>
                                checked
                                  ? [...prev, gf.id]
                                  : prev.filter(id => id !== gf.id)
                              );
                            }}
                            className="w-4 h-4 rounded text-slate-800 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
                          />
                        </label>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                onClick={async () => {
                  if (!mergeTargetName.trim() || selectedFencesToMerge.length < 2) return;

                  const fencesToMerge = customGeofences.filter(gf => selectedFencesToMerge.includes(gf.id));
                  if (fencesToMerge.length === 0) return;

                  let mergedPolygons = fencesToMerge.map(gf => {
                    const polyObj = gf.polygons && gf.polygons[0] ? gf.polygons[0] : null;
                    const coords = polyObj ? (Array.isArray(polyObj) ? polyObj : (polyObj as any).coords) : [];
                    return {
                      name: gf.name,
                      coords: coords
                    };
                  }).filter(p => p.coords && p.coords.length > 0);

                  let mergedStudentIds: string[] = [];
                  fencesToMerge.forEach(gf => {
                    if (gf.studentIds) {
                      gf.studentIds.forEach(id => {
                        if (!mergedStudentIds.includes(id)) {
                          mergedStudentIds.push(id);
                        }
                      });
                    }
                  });

                  const baseParent = fencesToMerge[0];

                  const apiPayload = {
                    zone_name: mergeTargetName.trim(),
                    center_lat: baseParent.lat,
                    center_lng: baseParent.lng,
                    radius_meters: 100,
                    coordinates: mergedPolygons.map(p => JSON.stringify(p.coords)),
                    is_active: 1,
                    description: `Merged group: ${fencesToMerge.map(f => f.name).join(', ')}`,
                    studentIds: mergedStudentIds
                  };

                  const savedData = await apiService.createGeofence(apiPayload);

                  if (savedData) {
                    const newMergedGeofence = {
                      id: savedData.zone_id || savedData.id || `GF_MERGED_${Date.now()}`,
                      name: mergeTargetName.trim(),
                      shape: 'polygon',
                      color: baseParent.color || '#cbb4d4',
                      targetBatch: 'ALL',
                      lat: baseParent.lat,
                      lng: baseParent.lng,
                      polygons: mergedPolygons,
                      studentIds: mergedStudentIds,
                      description: apiPayload.description
                    };

                    setCustomGeofences(prev => {
                      const updated = [newMergedGeofence, ...prev];
                      localStorage.setItem('h3_geofences', JSON.stringify(updated));
                      return updated;
                    });

                    setIsMergeModalOpen(false);
                    setMergeTargetName('');
                    setSelectedFencesToMerge([]);
                    setFenceTypeTab('grouped');
                  } else {
                    alert('Failed to save merged geofence to the server.');
                  }
                }}
                disabled={!mergeTargetName.trim() || selectedFencesToMerge.length < 2}
                className="w-full py-2.5 gradient-btn-tab hover:opacity-90 font-extrabold rounded-2xl shadow-lg transition-all text-xs disabled:cursor-not-allowed"
              >
                Merge Selected Fences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN GOOGLE MAP MODAL */}
      {isFullScreenMapOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
          {/* Header Control Bar */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullScreenMapOpen(false)}
                className="px-3.5 py-2 gradient-btn-tab hover:opacity-90 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all border border-transparent"
                title="Back to Dashboard"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  Full Screen Satellite Geofencing Radar
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                    Batch Mode
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Search place names, draw polygons, and map student batches live on HD Satellite</p>
              </div>
            </div>

            {/* Batch Selector & View Controls inside Fullscreen Header */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                <Filter size={14} className="text-purple-400" />
                <span className="text-xs font-bold text-slate-300">Filter Batch:</span>
                <select
                  value={selectedBatchFilter}
                  onChange={(e) => setSelectedBatchFilter(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900">All Batches</option>
                  {availableBatches.map(b => (
                    <option key={b} value={b} className="bg-slate-900">Batch {b}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setMapType(prev => prev === 'hybrid' ? 'streets' : 'hybrid')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 border border-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                {mapType === 'hybrid' ? '🛰️ Satellite HD' : '🗺️ Google Streets'}
              </button>

              <button
                onClick={() => setIsFullScreenMapOpen(false)}
                className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-slate-900 rounded-xl transition-all"
                title="Exit full screen map"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Full Screen Google Map Canvas */}
          <div className="flex-1 w-full relative">
            <div id="fullscreen-google-map-container" className="w-full h-full z-0"></div>

            {/* FLOATING PENCIL BUTTON TO MARK GEOFENCE & CANCEL DRAWING BUTTON */}
            <div className="absolute bottom-10 right-10 z-[9999] flex items-center gap-3 pointer-events-auto">
              {isDrawingActive && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const drawer = (window as any).activePolygonDrawer;
                      if (drawer && typeof drawer.deleteLastVertex === 'function') {
                        drawer.deleteLastVertex();
                      }
                    }}
                    className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg border-2 border-white/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    title="Revert last point"
                  >
                    <Undo size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const drawer = (window as any).activePolygonDrawer;
                      if (drawer && typeof drawer.completeShape === 'function') {
                        drawer.completeShape();
                      }
                    }}
                    className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg border-2 border-white/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    title="Finish drawing shape"
                  >
                    <Save size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const drawer = (window as any).activePolygonDrawer;
                      if (drawer && typeof drawer.disable === 'function') {
                        drawer.disable();
                      }
                      setIsDrawingActive(false);
                    }}
                    className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg border-2 border-white/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    title="Cancel drawing fence"
                  >
                    <X size={20} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  const map = (window as any).leafletMapInstance;
                  const L = (window as any).L;
                  if (map && L && L.Draw && L.Draw.Polygon) {
                    // Disable previous drawer if any
                    if ((window as any).activePolygonDrawer) {
                      try { (window as any).activePolygonDrawer.disable(); } catch { }
                    }
                    const polygonDrawer = new L.Draw.Polygon(map, {
                      shapeOptions: {
                        color: '#cbb4d4',
                        fillColor: '#cbb4d4',
                        fillOpacity: 0.3,
                        weight: 3
                      }
                    });
                    (window as any).activePolygonDrawer = polygonDrawer;
                    polygonDrawer.enable();
                    setIsDrawingActive(true);
                    alert('🖊️ Pencil Draw Mode Active!\n\n1. Click points on the satellite map to outline your fence perimeter.\n2. Click the VERY FIRST marker point (or double-click) to CLOSE the fence!\n3. The Save Modal will appear to save your fence boundary.');
                  } else {
                    alert('Click points on the map to mark your geofence boundary!');
                  }
                }}
                className={`w-14 h-14 ${isDrawingActive ? 'bg-slate-300 opacity-60 pointer-events-none' : 'gradient-btn-tab hover:scale-105 active:scale-95'} rounded-full shadow-lg flex items-center justify-center border-2 border-white/40 transition-all cursor-pointer`}
                title="Click to draw geofence perimeter"
                disabled={isDrawingActive}
              >
                <Pencil size={24} className="text-slate-900" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWN GEOFENCE NAMING & SAVE DIALOG MODAL */}
      {pendingDrawnShape && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/15 text-slate-800 flex items-center justify-center font-bold">
                  <Pencil size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Save Marked Geofence</h4>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    ✓ Closed Polygon Loop ({pendingDrawnShape.coords.length} points)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPendingDrawnShape(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const nameToSave = newZoneName.trim() || pendingDrawnShape.defaultName;

                const apiPayload = {
                  zone_name: nameToSave,
                  center_lat: pendingDrawnShape.center.lat,
                  center_lng: pendingDrawnShape.center.lng,
                  radius_meters: 100,
                  coordinates: [JSON.stringify(pendingDrawnShape.coords)],
                  is_active: 1,
                  description: 'Marked on Map',
                  studentIds: []
                };

                let savedData = await apiService.createGeofence(apiPayload).catch(() => null);
                
                // Fallback to local save if API fails so the UI continues working
                if (!savedData) {
                  savedData = { id: `GF_DRAWN_${Date.now()}`, ...apiPayload };
                }

                if (savedData) {
                  const newShape = {
                    id: savedData.zone_id || savedData.id || `GF_DRAWN_${Date.now()}`,
                    name: nameToSave,
                    shape: 'polygon',
                    color: newZoneColor || '#cbb4d4',
                    targetBatch: newZoneTargetBatch || 'ALL',
                    lat: pendingDrawnShape.center.lat,
                    lng: pendingDrawnShape.center.lng,
                    polygons: [{ name: 'Default Zone', coords: pendingDrawnShape.coords }],
                    studentIds: []
                  };

                  setCustomGeofences(prev => {
                    const updated = [...prev, newShape];
                    try {
                      localStorage.setItem('h3_geofences', JSON.stringify(updated));
                    } catch { }
                    return updated;
                  });

                  if (pendingDrawnShape.layer && pendingDrawnShape.layer.bindPopup) {
                    pendingDrawnShape.layer.bindPopup(`
                      <div style="font-family: sans-serif; padding: 4px; text-align: left;">
                        <b style="font-size: 13px; color: #1e293b;">📍 ${nameToSave}</b><br/>
                        <span style="font-size: 11px; color: #64748b;">Allocated Batch: <b>${newZoneTargetBatch || 'ALL'}</b></span><br/>
                        <span style="font-size: 11px; font-weight: bold; color: #059669;">✓ Boundary Closed & Active</span>
                        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                          <button 
                            onclick="window.deleteGeofenceById('${newShape.id}', event)"
                            style="background-color: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;"
                          >
                            🗑️ Delete Geofence Area
                          </button>
                        </div>
                      </div>
                    `).openPopup();
                  }

                  setPendingDrawnShape(null);
                  setNewZoneName('');
                } else {
                  alert('Failed to save drawn geofence to server.');
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-wider">GEOFENCE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koviloor Hostel Perimeter"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-wider">ALLOCATE TO STUDENT BATCH</label>
                <select
                  value={newZoneTargetBatch}
                  onChange={(e) => setNewZoneTargetBatch(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl font-bold focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">All Batches (ALL)</option>
                  {availableBatches.map(b => (
                    <option key={b} value={b}>Batch {b} Scholars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-wider">BOUNDARY COLOR</label>
                <div className="flex items-center gap-3">
                  {['#cbb4d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewZoneColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${newZoneColor === col ? 'scale-110 border-slate-900 dark:border-white shadow-md' : 'border-transparent opacity-80'}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 gradient-btn-tab hover:opacity-90 font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Check size={16} />
                  <span>Save Geofence Boundary</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENTITY CREATION MODAL (STUDENT, PARENT, VOLUNTEER, DONOR) */}
      <EntityCreationModal
        type={creationModal.type}
        isOpen={creationModal.isOpen}
        onClose={() => setCreationModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleCreateEntitySubmit}
      />

      {/* FLOATING ACTION BUTTON FOR QUICK ADD */}
      {['Students', 'Parents', 'Admins', 'Volunteers', 'Donors', 'Location'].includes(activeTab) && (
        <button
          onClick={() => {
            if (activeTab === 'Location') {
              setShowAddLocationModal(true);
            } else {
              const type = activeTab === 'Students' ? 'Student' : activeTab === 'Parents' ? 'Parent' : (activeTab === 'Admins' || activeTab === 'Volunteers') ? 'Volunteer' : 'Donor';
              setCreationModal({ type, isOpen: true });
            }
          }}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 gradient-btn-tab hover:opacity-90 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/30 backdrop-blur-md"
          title={`Add New ${activeTab === 'Location' ? 'Geofence' : activeTab === 'Admins' ? 'Admin' : activeTab.slice(0, -1)}`}
        >
          <Plus size={22} />
        </button>
      )}

      {/* USER PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-br from-[#20002c] to-[#cbb4d4] relative">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="px-8 pb-8 pt-0 relative flex flex-col items-center">
              {/* Avatar overlapping banner */}
              <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800 -mt-12 relative z-10 shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#20002c] to-[#cbb4d4] flex items-center justify-center text-white text-5xl font-black shadow-inner">
                  A
                </div>
                <div className="absolute bottom-[-4px] right-[-4px] w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              
              {/* Profile Info */}
              <div className="text-center mt-4 mb-8 w-full">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Hope3 Admin</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5">Super Administrator</p>
                <div className="mt-6 px-5 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Email</span>
                    <span className="font-semibold">admin@hope3.org</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Role</span>
                    <span className="font-semibold">{activeRole}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="w-full space-y-2">
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Manage Account
                </button>
                <button 
                  onClick={() => { sessionStorage.removeItem('isAuthenticated'); setIsAuthenticated(false); }}
                  className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={16} /> Secure Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
