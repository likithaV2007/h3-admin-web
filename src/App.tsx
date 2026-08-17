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
  Layers
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
  const [students, setStudents] = useState<Student[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [adminCount, setAdminCount] = useState<number>(3);
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
        const response = await fetch(`${apiStatus.url}/api/v1/expenses/?skip=0&limit=100`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('authToken') || localStorage.getItem('authToken')}`
          }
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
  const [newZoneColor, setNewZoneColor] = useState<string>('#3b82f6');
  const [newZoneTargetBatch, setNewZoneTargetBatch] = useState<string>('ALL');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('ALL');
  const [selectedGeofenceFilter, setSelectedGeofenceFilter] = useState<string>('ALL');
  const [modalBatchFilter, setModalBatchFilter] = useState<string>('ALL');
  const [fenceTypeTab, setFenceTypeTab] = useState<'single' | 'grouped'>('single');
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
      color: '#3b82f6',
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
              polygons: d.polygons || (d.coords ? [{ name: d.name, coords: d.coords }] : []),
              studentIds: d.studentIds || []
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

      const [fetchedVolunteers, fetchedParents, fetchedDonors, fetchedExpenses, fetchedGeofences, fetchedSessions, fetchedAdminCount] = await Promise.all([
        apiService.getVolunteers(),
        apiService.getParents(fetchedStudents),
        apiService.getDonors(),
        apiService.getExpenses(),
        apiService.getGeofences(),
        apiService.getTrackingSessions(),
        apiService.getAdminsCount()
      ]);

      setAdminCount(fetchedAdminCount);

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
            const dbId = student.student_id || student.id;
            const session = latestSessionMap.get(dbId);
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

          const colors = ['#ef4444', '#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'];
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
              <div style="background-color: #2563eb; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; white-space: nowrap; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                👤 ${student.name.split(' ')[0]} (${student.batch || '2026'})
              </div>
              <div style="width: 10px; h-10px; background-color: #2563eb; transform: rotate(45deg); margin: -4px auto 0 auto; border-right: 1.5px solid white; border-bottom: 1.5px solid white;"></div>
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
                color: '#3b82f6',
                fillColor: '#3b82f6',
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

          // Trigger Custom Naming Modal Dialog
          setPendingDrawnShape({
            layer,
            coords,
            center,
            defaultName
          });
          setNewZoneName(defaultName);
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

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);


  // Selected Student Profile State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<'Overview' | 'Attendance' | 'Current Location' | 'Leave Requests' | 'Academic Details' | 'Notes'>('Overview');
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

    return matchesSearch && matchesBatch;
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
    { name: 'Location', icon: MapPin },
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

      const apiResult = await apiService.createStudent(payload);

      const newStudent: Student = {
        id: apiResult?.student_code || apiResult?.id || `STU${Date.now()}`,
        name: data.name,
        rollNo: data.rollNo || `STU00${students.length + 1}`,
        age: parseInt(data.age) || 19,
        batch: data.batch || '2026',
        grade: data.grade || 'B.Tech - 2nd Year',
        college: data.college || 'State Engineering College',
        hostelRoom: 'Block B - Room 104',
        attendance: 100,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
        location: {
          status: 'In Hostel',
          lastUpdated: 'Just now',
          coordinates: '12.9716° N, 77.5946° E',
          hostelDistance: '0.0 km',
          collegeDistance: '1.2 km'
        },
        leaveRequests: [],
        academicProgress: [],
        subjects: [],
        notes: [],
        parentName: 'Parent Contact',
        parentPhone: '+91 98765 43210'
      };

      setStudents(prev => [newStudent, ...prev]);
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
                <h1 className="font-extrabold text-[1.4rem] leading-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent truncate">Hope3</h1>
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
          <div className={`flex items-center bg-slate-50 dark:bg-[#0c1222] rounded-[1.25rem] border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md p-2.5 ${sidebarOpen ? 'gap-3' : 'justify-center w-14 h-14'}`}>
            <div className="relative shrink-0">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=20002c&color=fff&rounded=true&bold=true" alt="Admin" className={`${sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'} rounded-full object-cover border-2 border-white dark:border-[#0c1222]`} />
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
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                      Total Students
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {students.length} Enrolled
                    </h4>
                    <span className="text-[10px] text-violet-500 dark:text-violet-400 flex items-center gap-1 mt-2 font-medium">
                      <span className="bg-violet-500/10 p-0.5 rounded font-bold">+12%</span> vs last semester
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                      {activeRole === 'Student' ? 'My Attendance' : 'Total Admins'}
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {activeRole === 'Student' ? '94.5%' : `${volunteers.length} Active`}
                    </h4>
                    <span className={`text-[10px] flex items-center gap-1 mt-2 font-medium text-violet-500 dark:text-violet-400`}>
                      {activeRole === 'Student' ? (
                        <><span className="bg-violet-500/10 p-0.5 rounded font-bold">Target 90%</span> met successfully</>
                      ) : (
                        'Managing system operations'
                      )}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    {activeRole === 'Student' ? <Calendar size={22} /> : <ShieldCheck size={22} />}
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                      {activeRole === 'Student' ? 'Sponsor' : 'Total Donors'}
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {activeRole === 'Student' ? 'Hope3 Foundation' : `${donors.length} Active`}
                    </h4>
                    <span className="text-[10px] text-violet-500 dark:text-violet-400 flex items-center gap-1 mt-2 font-medium">
                      {activeRole === 'Student' ? 'Full tuition & hostel covered' : 'Sponsoring education'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Heart size={22} />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                      Out of Fence
                    </span>
                    <h4 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                      {students.filter(s => s.location.status === 'Out of Bounds').length} Students
                    </h4>
                    <span className="text-[10px] text-violet-500 dark:text-violet-400 flex items-center gap-1 mt-2 font-medium">
                      Requires urgent review
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <MapPin size={22} />
                  </div>
                </div>

              </div>

              {/* DOUBLE CHART & MAP SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Chart Card */}
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full lg:col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">Monthly Expenses Chart</h4>
                    </div>
                  </div>

                  {/* CUSTOM BAR/LINE CHART USING SVG */}
                  {(() => {
                    // Dynamically get the last 6 months up to current month
                    const currentMonth = new Date().getMonth();
                    const monthIndices: number[] = [];
                    const monthLabels: string[] = [];
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    for (let i = 5; i >= 0; i--) {
                      let d = new Date(new Date().getFullYear(), currentMonth - i, 1);
                      monthIndices.push(d.getMonth());
                      monthLabels.push(monthNames[d.getMonth()]);
                    }

                    const monthlyCosts = monthIndices.map(monthIdx => {
                      return expenses.filter(e => {
                        if (!e.date) return false;
                        const d = new Date(e.date);
                        return d.getMonth() === monthIdx;
                      }).reduce((sum, e) => sum + e.amount, 0);
                    });

                    // Dynamically compute max from costs, round up to nearest nice step
                    const dataMax = Math.max(...monthlyCosts, 1000);
                    const step = Math.pow(10, Math.floor(Math.log10(dataMax)));
                    const maxChartValue = Math.ceil(dataMax / step) * step;
                    const yStep = maxChartValue / 3;

                    const formatK = (val: number) => {
                      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val}`;
                    };

                    const chartHeight = 150;
                    const chartYStart = 170;

                    const costPoints = monthlyCosts.map((val, i) => {
                      const x = 95 + (i * 80);
                      const y = chartYStart - (Math.min(val, maxChartValue) / maxChartValue) * chartHeight;
                      return { x, y };
                    });

                    const costPolyline = costPoints.map(p => `${p.x},${p.y}`).join(' ');
                    const costPolygon = `95,170 ${costPolyline} 495,170`;

                    return (
                      <div className="relative pt-4 h-60 max-w-xl mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <defs>
                            <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                          {/* Chart Areas */}
                          <polygon points={costPolygon} fill="url(#costsGrad)" />

                          {/* Chart Lines */}
                          <polyline points={costPolyline} fill="none" stroke="#8b5cf6" strokeWidth="3" className="drop-shadow-sm" />

                          {/* Data Points */}
                          {costPoints.map((p, i) => (
                            <circle key={`c-${i}`} cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                          ))}

                          {/* X Axis line */}
                          <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />

                          {/* X Labels */}
                          {monthLabels.map((label, idx) => (
                            <text key={idx} x={95 + (idx * 80)} y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                              {label}
                            </text>
                          ))}

                          {/* Y Labels */}
                          <text x="30" y="24" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{formatK(maxChartValue)}</text>
                          <text x="30" y="74" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{formatK(yStep * 2)}</text>
                          <text x="30" y="124" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{formatK(yStep)}</text>
                          <text x="30" y="174" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">0</text>
                        </svg>
                      </div>
                    );
                  })()}
                </div>

                {/* Expense Distribution Donut Chart */}
                {(() => {
                  const distributionData = [
                    { name: 'snacks', icon: <Coffee size={14} />, color: '#276738', bg: 'bg-emerald-50 text-emerald-700' },
                    { name: 'groceries', icon: <BookOpen size={14} />, color: '#3b82f6', bg: 'bg-blue-50 text-blue-600' },
                    { name: 'sports', icon: <Heart size={14} />, color: '#a855f7', bg: 'bg-purple-50 text-purple-600' },
                    { name: 'medical', icon: <Users size={14} />, color: '#f59e0b', bg: 'bg-amber-50 text-amber-600' },
                    { name: 'travel', icon: <ShoppingCart size={14} />, color: '#ef4444', bg: 'bg-red-50 text-red-500' },
                    { name: 'stationary', icon: <Check size={14} />, color: '#14b8a6', bg: 'bg-teal-50 text-teal-600' }
                  ];

                  let calculatedData = distributionData.map(cat => ({
                    ...cat,
                    amount: expenses.filter(e => e.category && e.category.toLowerCase() === cat.name).reduce((sum, e) => sum + e.amount, 0)
                  }));
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

                  let currentPct = 0;
                  const gradientStops = calculatedData.map(cat => {
                    const start = currentPct;
                    currentPct += cat.pct;
                    return `${cat.color} ${start}% ${currentPct}%`;
                  }).join(', ');

                  return (
                    <div className="glass-panel rounded-2xl bg-[#f4f8f4] dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full lg:col-span-1 flex flex-col">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 border-l-4 border-emerald-700 pl-2">
                          Expense Distribution
                        </h4>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center pt-2">
                        <div className="relative w-48 h-48 mb-6">
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              background: `conic-gradient(${gradientStops})`
                            }}
                            className="relative flex items-center justify-center"
                          >
                            <div className="w-[60%] h-[60%] bg-[#f4f8f4] dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative">
                              <div className="w-8 h-8 rounded-full bg-[#276738] flex items-center justify-center text-white">
                                <Wallet size={16} />
                              </div>
                            </div>
                            
                            {totalExpenses === 0 && (
                              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                                <text x="25" y="45" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle">29%</text>
                                <text x="50" y="20" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle">12%</text>
                                <text x="70" y="30" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle">10%</text>
                                <text x="80" y="55" fill="white" fontSize="4" fontWeight="bold" textAnchor="middle">7%</text>
                                <text x="75" y="68" fill="white" fontSize="3" fontWeight="bold" textAnchor="middle">3%</text>
                                <text x="50" y="85" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">39%</text>
                              </svg>
                            )}
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

              {/* TWO COLUMN SUMMARY SECTIONS */}
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
                                  <span className="text-[9px] font-semibold text-slate-800 dark:text-blue-400 font-mono">{req.type}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{req.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-350"><strong>{req.title}:</strong> {req.details}</p>
                              {req.amount && <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Requested: ₹{req.amount}</span>}

                              <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => handleStudentRequestAction(req.id, 'Approved')} className="bg-green-600 hover:bg-green-700 text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors">
                                  Approve
                                </button>
                                <button onClick={() => handleStudentRequestAction(req.id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors">
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
                          <span className="font-bold text-slate-800 dark:text-blue-400">9.1/10 (Excellent)</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm">Academic Counseling Mentor</h4>
                        <p className="text-[11px] text-slate-400">Reach out to your child's guide counselor directly</p>
                      </div>
                      <div className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white dark:bg-slate-900/30 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">AS</div>
                        <div>
                          <h5 className="font-bold text-xs text-white">Prof. Ananya Sen</h5>
                          <span className="text-[10px] text-slate-400 block">Senior Mentor Counselor</span>
                          <span className="text-[10px] text-slate-800 dark:text-blue-400 block mt-1 font-mono">ananya.sen@hope3.org</span>
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
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base">Student Database</h4>
                      <p className="text-xs text-slate-400">Total {students.length} students enrolled in active programs</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      {/* Batch Filter Dropdown */}
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
                        <Filter size={14} className="text-blue-500" />
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
                        className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* DATA TABLE */}
                  {/* RESPONSIVE GRID CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => { setSelectedStudent(student); setProfileTab('Overview'); }}
                        className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer flex flex-col gap-4 group"
                      >
                        <div className="flex items-start gap-3.5">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-[1.05] transition-transform"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-[13px] text-slate-900 dark:text-white truncate lg:text-sm">{student.name}</h5>
                            <span className="text-[10px] text-slate-400 block font-mono font-medium">{student.rollNo}</span>
                            <span className="inline-flex mt-1 items-center px-2 py-[2px] rounded-md text-[9px] font-extrabold font-mono bg-blue-50 dark:bg-blue-950/60 text-slate-800 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                              {student.batch || student.current_year || (student.grade && student.grade.includes('2nd Year') ? '2026' : student.grade && student.grade.includes('3rd Year') ? '2025' : '2024')}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                          <span className="block font-medium text-slate-800 dark:text-slate-200 truncate">{student.grade}</span>
                          <span className="text-[9px] font-semibold text-slate-400 block truncate uppercase tracking-widest">{student.college}</span>
                        </div>

                        <div className="flex items-end justify-end mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={getWhatsAppLink(student.parentPhone)}
                              target="_blank"
                              rel="noreferrer"
                              title={`Call ${student.name} / Parent`}
                              className="p-1.5 md:p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-[10px] transition-all"
                            >
                              <PhoneCall size={14} />
                            </a>
                            <a
                              href={getWhatsAppLink(student.parentPhone, `Hello, regarding student ${student.name} from Hope3 NGO.`)}
                              target="_blank"
                              rel="noreferrer"
                              title={`Message ${student.name} / Parent`}
                              className="p-1.5 md:p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-[10px] transition-all"
                            >
                              <MessageSquare size={14} />
                            </a>
                          </div>
                        </div>

                      </div>
                    ))}
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
                          <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/20 text-slate-800 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200/30">
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
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-blue-200/50 text-slate-800 hover:bg-blue-50 transition-colors"
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
                            ? 'border-violet-600 text-slate-800 dark:text-blue-400'
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                          <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 lg:col-span-2">
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
                                  <a href={selectedStudent.folder_link} target="_blank" rel="noreferrer" className="text-slate-800 dark:text-blue-400 font-semibold underline truncate block">
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

                    {/* PROFILE TAB: CURRENT LOCATION */}
                    {profileTab === 'Current Location' && (
                      <div className="max-w-2xl">

                        {/* Map Details telemetries */}
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
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
                      <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                                  <p className="text-xs font-bold text-slate-800 dark:text-white">{req.type} ({req.days} Days)</p>
                                  <p className="text-xs text-slate-500">{req.reason}</p>
                                  <span className="text-[10px] text-slate-400 block">Dates: {req.fromDate} to {req.toDate} | Submitted: {req.requestedAt}</span>
                                </div>

                                {/* Decision actions directly on profile */}
                                {req.status === 'Pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleLeaveAction(req.id, 'Approved')}
                                      className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-750 text-slate-900 text-xs font-bold transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleLeaveAction(req.id, 'Rejected')}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-750 text-slate-900 text-xs font-bold transition-colors"
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
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 md:col-span-2 space-y-4">
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
                        <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 focus:outline-none focus:border-blue-500"
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
                  className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {filteredParents.map(par => (
                  <div
                    key={par.id}
                    className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={formatAvatarUrl(par.profile_photo_link)}
                        alt={par.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-100 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-[13px] text-slate-900 dark:text-white truncate lg:text-sm">{par.name}</h5>
                        <span className="text-[10px] text-slate-400 block font-mono truncate">{par.email || 'parent@hope3.org'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pb-2 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded text-slate-800 dark:text-slate-300">{par.phone}</span>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-slate-500 truncate">{par.occupation}</span>
                        <span className="inline-flex items-center px-2 py-[3px] rounded-md text-[9px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40">
                          {par.guardianName || par.relationship || par.relation || 'Guardian'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-1">
                      <button
                        onClick={() => {
                          const std = students.find(s => s.id === par.childId || (s as any).student_id === par.childId || s.student_code === par.childId);
                          if (std) { setSelectedStudent(std); setActiveTab('Students'); setProfileTab('Overview'); }
                        }}
                        className="text-[11px] font-black text-violet-600 dark:text-violet-400 hover:opacity-80 max-w-[140px] truncate block text-left"
                      >
                        View Child: {par.childName}
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={getWhatsAppLink(par.phone)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Call via WhatsApp`}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-[10px] transition-all border border-emerald-200/30 dark:border-none"
                        >
                          <PhoneCall size={14} />
                        </a>
                        <a
                          href={getWhatsAppLink(par.phone, `Hello ${par.name}, greetings from Hope3 NGO.`)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Message on WhatsApp`}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-[10px] transition-all flex items-center justify-center border border-blue-200/30 dark:border-none"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE: VOLUNTEERS (ADMINS) */}
          {(activeTab === 'Admins' || activeTab === 'Volunteers') && (
            <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
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
                  className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {filteredVolunteers.map(vol => (
                  <div
                    key={vol.id}
                    className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer flex flex-col gap-4 group"
                    onClick={() => setSelectedVolunteer(vol)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={vol.profile_photo_link || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'}
                        alt={vol.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-100 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120');
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-[13px] text-slate-900 dark:text-white truncate lg:text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{vol.name}</h5>
                        <span className="text-[10px] text-slate-400 block font-mono truncate">{vol.email}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pb-2 border-b border-slate-100 dark:border-slate-800/60 flex flex-col gap-2">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded w-fit text-slate-800 dark:text-slate-300">{vol.phone}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="inline-flex items-center px-2 py-[3px] rounded-md text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                          {vol.specialization || vol.program}
                        </span>
                        <span className="font-mono font-bold text-slate-800 dark:text-blue-400">
                          {vol.hoursContributed} Hrs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-[9px] ${vol.status === 'Active' ? 'bg-green-50 dark:bg-emerald-950/30 text-green-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'}`}>
                        <span className={`w-1 h-1 rounded-full ${vol.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        {vol.status}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={getWhatsAppLink(vol.phone)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Call via WhatsApp`}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all border border-emerald-200/40 dark:border-none"
                        >
                          <PhoneCall size={14} />
                        </a>
                        <a
                          href={getWhatsAppLink(vol.phone, `Hello ${vol.name}, greetings.`)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Message on WhatsApp`}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-all flex items-center justify-center border border-blue-200/40 dark:border-none"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
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
                  className="px-4 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {filteredDonors.map(donor => (
                  <div
                    key={donor.id}
                    className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer flex flex-col gap-4 group"
                    onClick={() => setSelectedDonor(donor)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={formatAvatarUrl(donor.profile_photo_link)}
                        alt={donor.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-100 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-[13px] text-slate-900 dark:text-white truncate lg:text-sm">{donor.name}</h5>
                        <span className="text-[10px] text-slate-400 block font-mono truncate">{donor.email}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pb-2 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded">{donor.phone}</span>
                    </div>

                    <div className="flex items-center justify-between pb-3">
                      <span className="inline-flex items-center px-[8px] py-[3px] rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                        {donor.donorType}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-[9px] bg-green-50 dark:bg-emerald-950/30 text-green-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {donor.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-mono font-black text-emerald-600 dark:text-cyan-400 text-[15px]">
                        {donor.formattedAmount}
                      </span>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={getWhatsAppLink(donor.phone)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Call via WhatsApp`}
                          className="p-1.5 md:p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-[10px] transition-all"
                        >
                          <PhoneCall size={14} />
                        </a>
                        <a
                          href={getWhatsAppLink(donor.phone, `Hello ${donor.name}, thank you for supporting Hope3 NGO scholars.`)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Message on WhatsApp`}
                          className="p-1.5 md:p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-[10px] transition-all flex items-center justify-center border border-transparent dark:border-none"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE: FINANCE CENTER */}
          {activeTab === 'Finance' && (
            <div className="space-y-6">

              {/* TOP HERO BANNER & STATS CARD (MATCHING MOBILE SCREENSHOT) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Total Spend Card */}
                <div className="lg:col-span-2 relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-8 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[180px]">
                  {/* Decorative wavy background */}
                  <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" fill-opacity="0.1" d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,154.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>

                  {/* Decorative Wallet Icon */}
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-100 pointer-events-none hidden sm:block">
                    <div className="w-[120px] h-[100px] bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(167,139,250,0.3)] border border-purple-50">
                      <Wallet size={56} className="text-violet-500 stroke-[1.5]" />
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10 relative z-10">
                    <div className="flex gap-4 text-[13px] font-medium items-center">
                      <span className="text-slate-600 dark:text-slate-300">Pending Approvals: <strong className="text-slate-900 dark:text-white font-semibold">{expenses.filter(e => e.status === 'PENDING').length}</strong></span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-slate-600 dark:text-slate-300">Refund Requests: <strong className="text-slate-900 dark:text-white font-semibold">{expenses.filter(e => e.refund_requested).length}</strong></span>
                    </div>

                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="gradient-btn-tab hover:brightness-110 font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                      <Plus size={18} className="text-white" />
                      Add Record
                    </button>
                  </div>
                </div>

                {/* Financial Overview Summary Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-slate-800 dark:text-slate-100 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Financial Overview</h4>
                    <h3 className="text-[1.1rem] font-bold text-slate-800 dark:text-slate-100">Volunteer Spend Tracker</h3>
                  </div>

                  <div className="space-y-3 mt-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Top Category:</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-md uppercase tracking-wide">Snacks & Food</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Audit Compliance:</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-400/20 px-2.5 py-1 rounded-md uppercase tracking-wide">100% Verified</span>
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
                                  {/* Icon Thumbnail */}
                                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${catLower.includes('snack') || catLower.includes('food') ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                    catLower.includes('sport') ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                      catLower.includes('travel') ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                        catLower.includes('groc') ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                          catLower.includes('med') ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                            'bg-violet-50 text-violet-500 border-violet-100'
                                    }`}>
                                    <CategoryIcon size={20} />
                                  </div>

                                  <div className="space-y-1.5 w-full">
                                    <h5 className="font-bold text-[15px] text-slate-900 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                      {item.title}
                                    </h5>

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
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[4px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 tracking-wider flex items-center gap-1">
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
                                    <span className="text-lg font-black text-emerald-600 dark:text-cyan-400 font-mono">
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
                                      {item.receipt_drive_link && !item.receipt_photo_link && (
                                        <span className="text-[9px] font-bold text-blue-500">Google Drive Link</span>
                                      )}
                                    </div>
                                    {item.receipt_photo_link ? (
                                      <a href={item.receipt_photo_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <img src={item.receipt_photo_link} alt="Receipt thumbnail" className="w-full h-auto max-h-48 object-cover rounded-lg bg-white dark:bg-slate-950" />
                                      </a>
                                    ) : (
                                      <a href={item.receipt_drive_link!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-full py-3 text-center border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Open Drive Document</span>
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
                                  <span className="font-mono text-emerald-600">₹{catTotal.toLocaleString('en-IN')} ({pct}%)</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}></div>
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
                            <button onClick={() => handleDownloadPDF('July_Expense_Audit')} className="text-emerald-600 text-xs font-bold hover:underline">Download PDF</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* MODULE: LOCATION & GEOFENCING */}
          {activeTab === 'Location' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="glass-panel rounded-3xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <Radio size={12} className="animate-pulse text-emerald-500" />
                      Live GPS & Geofence Engine
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Student Geofence & Location Control
                  </h3>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Geofence Group Filter */}
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
                    <Filter size={14} className="text-blue-500" />
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

                  <div className="flex items-center gap-3">
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

                    <button
                      onClick={() => setIsFullScreenMapOpen(true)}
                      className="px-4 py-2.5 gradient-btn-tab hover:opacity-90 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                      title="Open full screen map to draw, add, or delete geofences"
                    >
                      <Compass size={16} />
                      <span>Open Full Screen Geofence Editor</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* GEOFENCE ZONE CARDS & SUMMARY */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Active Geofence Zones ({customGeofences.length})
                    </h4>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/40 dark:border-slate-700/50">
                      <button
                        onClick={() => setFenceTypeTab('single')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all ${fenceTypeTab === 'single' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-blue-400 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Single Fences ({customGeofences.filter(gf => !gf.polygons || gf.polygons.length <= 1).length})
                      </button>
                      <button
                        onClick={() => setFenceTypeTab('grouped')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all ${fenceTypeTab === 'grouped' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-blue-400 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Grouped Fences ({customGeofences.filter(gf => gf.polygons && gf.polygons.length > 1).length})
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollGeofences('left')}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                      title="Scroll Left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => scrollGeofences('right')}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                      title="Scroll Right"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
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

                      const accentColor = hasViolation ? '#ef4444' : (gf.color || '#3b82f6');

                      return (
                        <div
                          key={gf.id}
                          className={`flex-shrink-0 w-80 glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 relative overflow-hidden group transition-all snap-start border-l-4 ${hasViolation ? 'animate-pulse' : ''}`}
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
                          <h4 className="font-bold text-sm text-white truncate" title={gf.name}>{gf.name}</h4>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            {gf.shape === 'circle' ? 'Radius' : 'Polygon'} | {gf.lat ? `${gf.lat.toFixed(4)}° N, ${gf.lng ? gf.lng.toFixed(4) : 0}° E` : 'Dynamic Zone'}
                          </p>

                          {assignedStudents.length > 0 ? (
                            <div className="flex items-center gap-1.5 mt-3">
                              <div className="flex -space-x-2 overflow-hidden">
                                {assignedStudents.slice(0, 4).map(s => (
                                  <img
                                    key={s.id}
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                                    src={s.avatar}
                                    alt={s.name}
                                    title={s.name}
                                  />
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
                              className="text-[10px] font-bold text-slate-800 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
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

              {/* LIVE MAP VISUALIZER & GEOFENCE RADAR */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* MAP GRAPHIC CANVAS SIMULATOR */}
                <div className="lg:col-span-2 glass-panel rounded-3xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 relative min-h-[380px] flex flex-col justify-between overflow-hidden">
                  {/* Google Street Map Location Search Bar & Geofencer Header */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-slate-800 dark:text-blue-400" />
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
                                  color: '#3b82f6',
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
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-blue-500/20 shadow-sm font-semibold"
                        />
                        {isSearchingLocation ? (
                          <RefreshCw size={14} className="absolute left-2.5 top-2 text-blue-500 animate-spin" />
                        ) : (
                          <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                        )}
                      </div>
                    </form>

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
                  </div>

                  {/* Live OpenStreetMap Leaflet Container */}
                  <div className="w-full h-80 rounded-2xl bg-slate-100 dark:bg-slate-900 relative overflow-hidden border border-slate-200 dark:border-slate-800 z-0">
                    <div id="open-street-map-container" className="w-full h-full rounded-2xl z-0"></div>
                  </div>
                </div>

                {/* REAL-TIME STUDENT LOCATION TABLE & CHECK-IN OVERRIDE */}
                <div className="glass-panel rounded-3xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
                      <Compass size={16} className="text-red-500 animate-pulse" />
                      Out-of-Bounds Radar ({students.filter(s => s.location?.status === 'Out of Bounds').length})
                    </h4>

                    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                      {(() => {
                        const outFliers = students.filter(s => s.location?.status === 'Out of Bounds');
                        if (outFliers.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                              <span className="text-2xl mb-1">🛡️</span>
                              <span className="font-bold text-xs text-emerald-600 dark:text-emerald-455 block">All Students Safe</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">Everyone is inside their assigned boundaries.</span>
                            </div>
                          );
                        }

                        return outFliers.map(std => {
                          const assignedFence = customGeofences.find(gf => gf.studentIds && gf.studentIds.includes(std.id));
                          return (
                            <div
                              key={std.id}
                              className="p-3 rounded-2xl border border-red-200/60 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 flex items-center justify-between gap-3 hover:bg-red-50/50 transition-colors border-l-4 border-l-red-500"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={std.avatar}
                                  alt={std.name}
                                  className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                                />
                                <div>
                                  <span className="font-bold text-xs text-slate-850 dark:text-white block">{std.name}</span>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">Outside: {assignedFence ? assignedFence.name : 'Unassigned'}</span>
                                </div>
                              </div>

                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-605 bg-red-100/60 dark:bg-red-950/80 dark:text-red-400 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50">
                                Violating
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>


                </div>

              </div>
            </div>
          )}

          {/* MODULE: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-6">

              <div>
                <h4 className="font-bold text-base">Configuration Settings</h4>
                <p className="text-xs text-slate-400">Manage admin modules, biometric sensors, and geofence parameters</p>
              </div>

              <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs">

                {/* Organization Profile */}
                <div className="pt-2 pb-2 space-y-4">
                  <h5 className="font-bold text-sm text-white">Organization Profile</h5>
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
                  <h5 className="font-bold text-sm text-white">System Configuration</h5>
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
                  <h5 className="font-bold text-sm text-white">Notification & Alert Preferences</h5>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-800 focus:ring-blue-500" />
                      <div>
                        <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">Email Activity Summaries</h6>
                        <p className="text-[10px] text-slate-400">Receive weekly digests of all volunteer and mentor logs.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-800 focus:ring-blue-500" />
                      <div>
                        <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">Donor Contribution Alerts</h6>
                        <p className="text-[10px] text-slate-400">Get instant notifications when a new donation is processed.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded text-slate-800 focus:ring-blue-500" />
                      <div>
                        <h6 className="font-bold text-slate-700 dark:text-slate-300 text-xs">SMS Emergency Alerts</h6>
                        <p className="text-[10px] text-slate-400">Enable text alerts for severe location out-of-bounds events.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save action */}
                <div className="pt-6 flex justify-end">
                  <button className="gradient-btn-tab hover:opacity-90 font-bold py-2 px-6 rounded-xl text-xs transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>

              </div>

            </div>
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
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
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
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PhoneCall size={14} />
                    <span>Call</span>
                  </a>
                  <a
                    href={getWhatsAppLink(selectedVolunteer.phone, `Hello ${selectedVolunteer.name}, greetings from Hope3 NGO.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-slate-900 backdrop-blur-md rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md border border-white/20"
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
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-blue-400 block">{selectedVolunteer.hoursContributed} Hours Contributed</span>
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
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
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
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PhoneCall size={14} />
                    <span>Call</span>
                  </a>
                  <a
                    href={getWhatsAppLink(selectedDonor.phone, `Hello ${selectedDonor.name}, thank you for supporting Hope3 NGO scholars.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-slate-900 backdrop-blur-md rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md border border-white/20"
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
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Total Financial Contribution</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{selectedDonor.formattedAmount}</span>
                </div>
                <span className="bg-emerald-600 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
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
        onSubmit={handleCreateEntity}
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
                <span className="text-3xl font-black text-emerald-600 dark:text-cyan-400 font-mono">
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
                  <span className={`inline-block font-extrabold text-[10px] mt-0.5 px-2 py-0.5 rounded-full ${selectedExpense.refund_requested ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400' : 'bg-slate-100 text-slate-500'}`}>
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
                    {selectedExpense.receipt_photo_link ? (
                      <img
                        src={selectedExpense.receipt_photo_link}
                        alt="Expense Receipt"
                        className="w-full max-h-48 object-contain hover:scale-[1.03] transition-transform cursor-zoom-in rounded-xl"
                        onClick={() => {
                          const w = window.open();
                          if (w) w.document.write(`<img src="${selectedExpense.receipt_photo_link}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />
                    ) : (
                      <a href={selectedExpense.receipt_drive_link!} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">View Document in Google Drive</span>
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
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-slate-800 flex items-center justify-center font-bold">
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

                // Center around map view with vertex points for shape
                const baseLat = 12.9740 + (Math.random() * 0.006 - 0.003);
                const baseLng = 77.5950 + (Math.random() * 0.006 - 0.003);

                let coords: Array<[number, number]> = [];
                const radius = 0.0015;

                if (newZoneShape === 'pentagon') {
                  // 5 sides
                  for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    coords.push([baseLat + radius * Math.sin(angle), baseLng + radius * Math.cos(angle)]);
                  }
                } else if (newZoneShape === 'hexagon') {
                  // 6 sides
                  for (let i = 0; i < 6; i++) {
                    const angle = (i * 2 * Math.PI) / 6;
                    coords.push([baseLat + radius * Math.sin(angle), baseLng + radius * Math.cos(angle)]);
                  }
                } else {
                  // Quad Polygon
                  coords = [
                    [baseLat + 0.001, baseLng - 0.001],
                    [baseLat + 0.001, baseLng + 0.001],
                    [baseLat - 0.001, baseLng + 0.001],
                    [baseLat - 0.001, baseLng - 0.001]
                  ];
                }

                setCustomGeofences(prev => [
                  ...prev,
                  {
                    id: `GF_${Date.now()}`,
                    name: newZoneName,
                    shape: newZoneShape,
                    color: newZoneColor,
                    targetBatch: newZoneTargetBatch,
                    lat: baseLat,
                    lng: baseLng,
                    polygons: [{ name: 'Default Zone', coords }]
                  }
                ]);

                setNewZoneName('');
                setShowAddLocationModal(false);
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
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1">ALLOCATE TO STUDENT BATCH</label>
                <select
                  value={newZoneTargetBatch}
                  onChange={(e) => setNewZoneTargetBatch(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Batches (ALL)</option>
                  {availableBatches.map(b => (
                    <option key={b} value={b}>Batch {b} Scholars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1">SELECT GEOFENCE SHAPE</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pentagon', label: 'Pentagon (5-Sided)', icon: '⬟' },
                    { id: 'hexagon', label: 'Hexagon (6-Sided)', icon: '⬢' },
                    { id: 'polygon', label: 'Polygon (Custom)', icon: '⬧' }
                  ].map(sh => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setNewZoneShape(sh.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${newZoneShape === sh.id ? 'border-violet-600 bg-blue-50 dark:bg-blue-950/40 text-slate-800 dark:text-blue-400' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'}`}
                    >
                      <span className="text-lg leading-none">{sh.icon}</span>
                      <span className="text-[10px]">{sh.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1">MAP BOUNDARY COLOR</label>
                <div className="flex items-center gap-3">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map(col => (
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
                  <span>Mark & Save Batch Geofence</span>
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
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-slate-800 dark:text-blue-400 flex items-center justify-center font-bold">
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
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl font-bold focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              {/* Batch Filter inside Modal */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 gap-2 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filter Students:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={modalBatchFilter}
                    onChange={(e) => setModalBatchFilter(e.target.value)}
                    className="p-1 px-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl font-bold text-[10px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
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
                    className="p-1 px-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 text-slate-800 dark:text-blue-400 rounded-xl text-[10px] font-bold transition-all border border-blue-200/40"
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
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
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
                        className="w-4 h-4 rounded text-slate-800 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
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
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-slate-800 dark:text-blue-400 flex items-center justify-center font-bold">
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
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl font-bold focus:outline-none focus:border-blue-500"
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
                            className="w-4 h-4 rounded text-slate-800 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
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
                      color: baseParent.color || '#3b82f6',
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

              <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  Full Screen Satellite Geofencing Radar
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                    Batch Mode
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Search place names, draw polygons, and map student batches live on HD Satellite</p>
              </div>
            </div>

            {/* Batch Selector & View Controls inside Fullscreen Header */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                <Filter size={14} className="text-blue-400" />
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
                <button
                  type="button"
                  onClick={() => {
                    const drawer = (window as any).activePolygonDrawer;
                    if (drawer && typeof drawer.disable === 'function') {
                      drawer.disable();
                    }
                    setIsDrawingActive(false);
                    alert('❌ Drawing cancelled.');
                  }}
                  className="w-12 h-12 bg-red-600 hover:bg-red-700 text-slate-900 rounded-full shadow-lg border-2 border-white/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="Cancel drawing fence"
                >
                  <X size={20} />
                </button>
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
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
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
                <div className="w-9 h-9 rounded-2xl bg-blue-500/15 text-slate-800 flex items-center justify-center font-bold">
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

                const savedData = await apiService.createGeofence(apiPayload);

                if (savedData) {
                  const newShape = {
                    id: savedData.zone_id || savedData.id || `GF_DRAWN_${Date.now()}`,
                    name: nameToSave,
                    shape: 'polygon',
                    color: newZoneColor || '#3b82f6',
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
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-wider">ALLOCATE TO STUDENT BATCH</label>
                <select
                  value={newZoneTargetBatch}
                  onChange={(e) => setNewZoneTargetBatch(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl font-bold focus:outline-none focus:border-blue-500"
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
                  {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map(col => (
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
      {['Students', 'Parents', 'Admins', 'Volunteers', 'Donors'].includes(activeTab) && (
        <button
          onClick={() => {
            const type = activeTab === 'Students' ? 'Student' : activeTab === 'Parents' ? 'Parent' : (activeTab === 'Admins' || activeTab === 'Volunteers') ? 'Volunteer' : 'Donor';
            setCreationModal({ type, isOpen: true });
          }}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 gradient-btn-tab hover:opacity-90 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/30 backdrop-blur-md"
          title={`Add New ${activeTab === 'Admins' ? 'Admin' : activeTab.slice(0, -1)}`}
        >
          <Plus size={22} />
        </button>
      )}

    </div>
  );
}

export default App;
