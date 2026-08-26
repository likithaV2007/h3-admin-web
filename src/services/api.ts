import { auth } from '../lib/firebase';
import { 
  type Student, 
  type Volunteer, 
  type Parent, 
  type Donor,
  type Expense,
  type Activity
} from '../mockData';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://h3apps-api.hope3.org').replace(/\/+$/, '');

async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    // 1. Check for env static token (VITE_API_TOKEN)
    const envToken = import.meta.env.VITE_API_TOKEN || 'Hope3-Apps-Team';
    if (envToken) {
      return { 'Authorization': `Bearer ${envToken}` };
    }

    // 2. Check for stored auth token in localStorage/sessionStorage
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (storedToken) {
      return { 'Authorization': `Bearer ${storedToken}` };
    }

    // 3. Check Firebase Auth current user
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      return { 'Authorization': `Bearer ${token}` };
    }
  } catch (err) {
    console.warn('Could not retrieve auth token:', err);
  }
  return { 'Authorization': 'Bearer Hope3-Apps-Team' };
}

async function apiFetch<T>(path: string, fallback: T, retries = 1): Promise<T> {
  try {
    const authHeaders = await getAuthHeader();
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      console.warn(`API request ${path} failed with status ${response.status}. Returning empty fallback.`);
      return fallback;
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data as T;
    }
    return data ? (data as T) : fallback;
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, 1200));
      return apiFetch(path, fallback, retries - 1);
    }
    console.warn(`API request ${path} failed:`, error, '. Returning empty fallback.');
    return fallback;
  }
}

export function formatAvatarUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  if (!clean || clean === 'string' || clean === 'null' || clean === 'undefined' || clean.includes('example.com') || clean.includes('example.org')) return '';

  // Convert Google Drive view/share URLs to official Google thumbnail URLs
  if (clean.includes('drive.google.com') || clean.includes('googleusercontent.com')) {
    const match = clean.match(/\/d\/([a-zA-Z0-9_-]+)/) || clean.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=s400`;
    }
  }

  // If valid full HTTP/HTTPS URL
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  return '';
}

export const apiService = {
  // Fetch Admins Count
  getAdminsCount: async (): Promise<number> => {
    try {
      const usersData = await apiFetch<any[]>('/api/v1/users/', []);
      if (!Array.isArray(usersData)) return 3;
      
      const adminUsers = usersData.filter(u => 
        u.role === 'admin' || u.is_superuser === true || u.is_admin === true || u.user_role === 'admin'
      );
      
      return adminUsers.length > 0 ? adminUsers.length : 3;
    } catch (err) {
      return 3;
    }
  },

  // Fetch Students
  getStudents: async (): Promise<Student[]> => {
    const data = await apiFetch<any[]>('/api/v1/students/', []);
    if (!data || data.length === 0) return [];
    
    // Map backend response fields to Student type
    return data.map((item, idx) => ({
      ...item,
      id: item.student_code || item.student_id || item.id || `STU00${idx + 1}`,
      name: item.student_name || item.full_name || item.name || (item.first_name ? `${item.first_name || ''} ${item.last_name || ''}`.trim() : `Student ${idx + 1}`),
      rollNo: item.student_code || `STU00${idx + 1}`,
      age: item.age || 19,
      gender: item.gender || 'Not specified',
      batch: item.batch || item.current_year || item.year || (item.grade && item.grade.includes('2nd Year') ? '2026' : item.grade && item.grade.includes('3rd Year') ? '2025' : '2024'),
      grade: item.year || item.grade || item.class || 'Class 10',
      college: item.college || item.school_name || item.college_name || 'Government High School',
      course: item.course || item.major || 'Science & Tech',
      hostelRoom: item.hostel_room || 'Room 102',
      parentName: item.father_name || item.mother_name || item.guardian_name || item.parent_name || 'Parent Contact',
      parentPhone: item.father_contact_number || item.mother_contact_number || item.emergency_contact || '+91 98765 43210',
      attendance: item.attendance || 95,
      avatar: formatAvatarUrl(item.profile_photo_link || item.profile_photo_url || item.avatar),
      location: {
        status: item.location_status || 'In Hostel',
        lastUpdated: item.last_updated || 'Just now',
        coordinates: item.coordinates || '12.9716, 77.5946',
        hostelDistance: '0.2 km',
        collegeDistance: '1.5 km'
      },
      leaveRequests: item.leave_requests || [],
      academicProgress: item.academic_progress || [
        { term: 'Term 1', gpa: 3.8, status: 'Completed' },
        { term: 'Term 2', gpa: 3.9, status: 'In Progress' }
      ],
      subjects: item.subjects || ['Mathematics', 'Physics', 'Computer Science'],
      notes: item.notes || ['Consistently high academic performer']
    }));
  },

  // Fetch Volunteers
  getVolunteers: async (): Promise<Volunteer[]> => {
    const [volsData, usersData] = await Promise.all([
      apiFetch<any[]>('/api/v1/volunteers/', []),
      apiFetch<any[]>('/api/v1/users/', [])
    ]);

    if (!volsData || volsData.length === 0) return [];
    
    // Create lookup map of users by user_id
    const userMap: Record<string, any> = {};
    if (Array.isArray(usersData)) {
      usersData.forEach(u => {
        if (u.user_id) userMap[u.user_id] = u;
      });
    }

    return volsData.map((item, idx) => {
      const user = userMap[item.user_id] || {};
      
      // Determine real user name
      let realName = user.user_name || item.full_name || item.name;
      if (!realName || realName === 'string' || realName.trim() === '') {
        // Fallback to bio first sentence
        if (item.bio && item.bio.length > 5) {
          const match = item.bio.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
          if (match) realName = match[1];
        }
      }
      if (!realName || realName === 'string' || realName.trim() === '') {
        realName = `Volunteer ${idx + 1}`;
      } else if (realName.toLowerCase() === realName) {
        // Capitalize words (e.g. "siva kumar" -> "Siva Kumar")
        realName = realName.replace(/\b\w/g, (c: string) => c.toUpperCase());
      }

      // Determine email
      const realEmail = (user.user_email && user.user_email !== 'string') ? user.user_email : (item.email || `volunteer${idx + 1}@hope3.org`);

      // Determine phone
      const realPhone = (user.user_phone && user.user_phone !== 'string') ? user.user_phone : (item.phone || '+91 98765 12345');

      return {
        id: item.volunteer_id || item.id || `VOL00${idx + 1}`,
        volunteer_id: item.volunteer_id,
        user_id: item.user_id,
        name: realName,
        email: realEmail,
        phone: realPhone,
        program: item.specialization || item.program || 'Student Mentoring',
        specialization: item.specialization || 'Student Mentoring',
        availability: item.availability || 'Weekends',
        bio: item.bio || 'Dedicated volunteer supporting student education and mentorship.',
        profile_photo_link: formatAvatarUrl(item.profile_photo_link),
        joined_date: item.joined_date || '2026-06-01',
        fcm_token: item.fcm_token || '',
        hoursContributed: item.hours_contributed || item.hours || 40,
        status: item.status || 'Active',
        assignedStudents: item.assigned_students || ['STU001', 'STU002'],
        role: item.specialization || 'Academic Mentor'
      };
    });
  },

  // Fetch Parents
  getParents: async (studentsList?: Student[]): Promise<Parent[]> => {
    const data = await apiFetch<any[]>('/api/v1/parents/', []);
    if (!data || data.length === 0) return [];
    
    return data.map((item, idx) => {
      // Find matching student by student_id
      const matchedStudent = studentsList?.find(s => s.id === item.student_id || s.student_code === item.student_id || (s as any).student_id === item.student_id);

      // Determine real Guardian / Parent Name
      let parentName = item.parent_name || item.full_name || item.name;
      if (!parentName || parentName.trim() === '' || parentName === 'string') {
        if (matchedStudent) {
          if (item.relation === 'father') parentName = matchedStudent.father_name || matchedStudent.parentName;
          else if (item.relation === 'mother') parentName = matchedStudent.mother_name;
          else if (item.relation === 'guardian') parentName = matchedStudent.guardian_name;
          
          if (!parentName) {
            parentName = `${matchedStudent.name}'s ${item.relation ? item.relation.charAt(0).toUpperCase() + item.relation.slice(1) : 'Guardian'}`;
          }
        } else {
          parentName = item.relation ? `Guardian (${item.relation})` : `Guardian ${idx + 1}`;
        }
      }

      // Determine Child Scholar Name
      const childName = matchedStudent?.name || item.student_name || item.child_name || 'Student Scholar';
      const childId = matchedStudent?.id || item.student_id || 'STU001';

      // Determine Phone
      const phone = item.parent_phone || item.phone || matchedStudent?.parentPhone || matchedStudent?.father_contact_number || matchedStudent?.mother_contact_number || '+91 98765 67890';

      // Determine Relation / Guardian role
      const rel = item.relation ? item.relation.charAt(0).toUpperCase() + item.relation.slice(1) : 'Guardian';
      const guardianRole = item.is_primary ? `${rel} (Primary)` : rel;

      // Determine Occupation
      const occupation = item.occupation || matchedStudent?.father_occupation || matchedStudent?.mother_occupation || 'Guardian';

      return {
        ...item,
        id: item.parent_id || item.id || `PAR00${idx + 1}`,
        name: parentName,
        guardianName: guardianRole,
        phone: phone,
        childName: childName,
        childId: childId,
        relationship: rel,
        relation: rel,
        occupation: occupation,
        address: item.address || matchedStudent?.address || 'Tamil Nadu'
      };
    });
  },

  // Fetch Donors
  getDonors: async (): Promise<Donor[]> => {
    const [donorsData, usersData] = await Promise.all([
      apiFetch<any[]>('/api/v1/donors/', []),
      apiFetch<any[]>('/api/v1/users/', [])
    ]);

    if (!donorsData || donorsData.length === 0) return [];

    const userMap: Record<string, any> = {};
    if (Array.isArray(usersData)) {
      usersData.forEach(u => {
        if (u.user_id) userMap[u.user_id] = u;
      });
    }

    return donorsData.map((item, idx) => {
      const user = userMap[item.user_id] || {};

      let donorName = item.organization_name || user.user_name || item.full_name || item.name;
      if (!donorName || donorName === 'string' || donorName.trim() === '') {
        donorName = `Donor Sponsor ${idx + 1}`;
      } else if (donorName.toLowerCase() === donorName) {
        donorName = donorName.replace(/\b\w/g, (c: string) => c.toUpperCase());
      }

      const email = (user.user_email && user.user_email !== 'string') ? user.user_email : `donor${idx + 1}@hope3.org`;
      const phone = (user.user_phone && user.user_phone !== 'string') ? user.user_phone : '+91 98765 43210';
      const numAmount = parseFloat(item.total_donated) || 0;
      const formattedAmount = numAmount > 0 ? `₹${numAmount.toLocaleString('en-IN')}` : '₹0.00';
      
      const category = item.donor_type === 'organization' ? 'Corporate / Trust Sponsor' : (item.donor_type ? item.donor_type.charAt(0).toUpperCase() + item.donor_type.slice(1) : 'Individual Benefactor');

      return {
        id: item.donor_id || `DON00${idx + 1}`,
        donor_id: item.donor_id,
        user_id: item.user_id,
        name: donorName,
        email: email,
        phone: phone,
        donorType: category,
        organizationName: item.organization_name || '',
        totalDonated: numAmount,
        formattedAmount: formattedAmount,
        status: 'Active Sponsor',
        profile_photo_link: formatAvatarUrl(item.profile_photo_link || user.profile_photo_link),
        joined_date: item.created_at ? item.created_at.split('T')[0] : '2026-05-30'
      };
    });
  },

  // Fetch Expenses List
  getExpenses: async (): Promise<Expense[]> => {
    const data = await apiFetch<any[]>('/api/v1/expenses/', []);
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item) => ({
      id: item.id || item.expense_id,
      title: item.title || 'Expense Record',
      category: item.category || 'general',
      amount: parseFloat(item.amount) || 0,
      date: item.date || new Date().toISOString(),
      refund_requested: item.refund_requested ?? false,
      is_private: item.is_private ?? false,
      is_foundation_paid: item.is_foundation_paid ?? true,
      status: (item.status || 'pending').toUpperCase(),
      student_id: item.student_id || null,
      target_group: item.target_group || 'ALL',
      created_by_name: item.created_by_name || 'System Admin',
      approved_by_name: item.approved_by_name || item.approved_by || null,
      receipt_url: item.receipt_url || item.receipt || item.image_url || null,
      receipt_photo_link: item.receipt_photo_link || null,
      receipt_drive_link: item.receipt_drive_link || null,
      uploaded_by: item.uploaded_by || null
    }));
  },

  // Create Student via FastAPI Backend
  createStudent: async (payload: any): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 422) {
        const errDetail = await res.json();
        console.warn("FastAPI 422 Validation Error details:", errDetail);
      }

      return null;
    } catch (err) {
      console.error("Error creating student:", err);
      return null;
    }
  },

  // Create Volunteer
  createVolunteer: async (payload: any): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/volunteers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 422) {
        const errDetail = await res.json();
        console.warn("FastAPI 422 Validation Error details:", errDetail);
      }

      return null;
    } catch (err) {
      console.error("Error creating volunteer:", err);
      return null;
    }
  },

  // Create Parent
  createParent: async (payload: any): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/parents/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 422) {
        const errDetail = await res.json();
        console.warn("FastAPI 422 Validation Error details:", errDetail);
      }

      return null;
    } catch (err) {
      console.error("Error creating parent:", err);
      return null;
    }
  },

  // Create Expense
  createExpense: async (payload: any): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 422) {
        const errDetail = await res.json();
        console.warn("FastAPI 422 Validation Error details:", errDetail);
      }
      return null;
    } catch (err) {
      console.error("Error creating expense:", err);
      return null;
    }
  },

  // Delete Expense
  deleteExpense: async (expenseId: string): Promise<boolean> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          ...authHeaders,
        },
      });
      return res.ok;
    } catch (err) {
      console.error("Error deleting expense:", err);
      return false;
    }
  },

  // Update Expense Status & Approver
  updateExpenseStatus: async (expenseId: string, status: string, approvedBy: string | null): Promise<boolean> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          status: status.toLowerCase(),
          approved_by_name: approvedBy
        }),
      });
      return res.ok;
    } catch (err) {
      console.error("Error updating expense status:", err);
      return false;
    }
  },

  // Upload Expense Receipt File
  uploadReceipt: async (expenseId: string, file: File): Promise<boolean> => {
    try {
      const authHeaders = await getAuthHeader();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BASE_URL}/api/v1/expenses/${expenseId}/receipt`, {
        method: 'POST',
        headers: {
          ...authHeaders
        },
        body: formData
      });
      return res.ok;
    } catch (err) {
      console.error("Error uploading receipt:", err);
      return false;
    }
  },

  // Fetch API Geofences List
  getGeofences: async (): Promise<any[]> => {
    try {
      const data = await apiFetch<any[]>('/api/v1/geofences/', []);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("Could not fetch geofencezones from API:", err);
      return [];
    }
  },

  // Fetch Student Tracking Sessions
  getTrackingSessions: async (): Promise<any[]> => {
    try {
      const data = await apiFetch<any[]>('/api/v1/trackingsessions/', []);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("Could not fetch tracking sessions from API:", err);
      return [];
    }
  },

  // Create API Geofence Record
  createGeofence: async (payload: any): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/geofences/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.warn("Error posting geofencezone to API:", err);
      return null;
    }
  },

  // Update API Geofence Record
  updateGeofence: async (id: string, payload: any): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/geofences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.warn("Error updating geofencezone via API:", err);
      return null;
    }
  },

  // Delete API Geofence Record
  deleteGeofence: async (id: string): Promise<boolean> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/geofences/${id}`, {
        method: 'DELETE',
        headers: {
          ...authHeaders,
        }
      });
      return res.ok;
    } catch (err) {
      console.warn("Error deleting geofencezone via API:", err);
      return false;
    }
  },

  formatAvatarUrl: formatAvatarUrl,

  // Fetch Admin Stats Overview
  getAdminStats: async () => {
    return apiFetch('/api/v1/stats/admin-dashboard', null);
  },

  getAdminDashboard: async () => {
    return apiFetch('/api/v1/admin/admin-dashboard', null);
  },

  // Check API Connection Status
  checkApiHealth: async (): Promise<{ status: 'CONNECTED' | 'UNAUTHORIZED' | 'ERROR'; statusCode: number; url: string }> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/students/`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      if (res.ok) {
        return { status: 'CONNECTED', statusCode: res.status, url: BASE_URL };
      } else if (res.status === 401) {
        return { status: 'UNAUTHORIZED', statusCode: res.status, url: BASE_URL };
      } else {
        return { status: 'ERROR', statusCode: res.status, url: BASE_URL };
      }
    } catch (e) {
      return { status: 'ERROR', statusCode: 0, url: BASE_URL };
    }
  },

  // Fetch Activities
  getActivities: async (): Promise<Activity[]> => {
    try {
      const data = await apiFetch<any[]>('/api/v1/activities/?skip=0&limit=100', []);
      return data.map(item => ({
        ...item,
        activity_id: item.activity_id || Math.random().toString(),
        title: item.title || 'Untitled Activity',
        description: item.description || '',
        activity_date: item.activity_date || item.created_at || new Date().toISOString(),
        audience: item.audience || 'Everyone',
        images: item.images || []
      }));
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return [];
    }
  },

  // Create Activity
  createActivity: async (activityData: Partial<Activity>): Promise<Activity | null> => {
    try {
      const authHeaders = await getAuthHeader();
      
      // Fallback for missing properties as per schema
      const payload = {
        student_id: "00000000-0000-0000-0000-000000000000",
        created_by: "00000000-0000-0000-0000-000000000000",
        is_published: 0,
        is_deleted: 0,
        activity_date: new Date().toISOString(),
        images: [],
        ...activityData
      };

      const res = await fetch(`${BASE_URL}/api/v1/activities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('API request POST /api/v1/activities/ failed with status', res.status);
        return null;
      }
      
      const data = await res.json();
      return data as Activity;
    } catch (error) {
      console.error('Failed to create activity:', error);
      return null;
    }
  },

  // MOCK/STUB: Get Classes
  getClasses: async (): Promise<any[]> => {
    try {
      return await apiFetch<any[]>('/api/v1/classes/', []);
    } catch (error) {
      return [];
    }
  },

  // MOCK/STUB: Get Student Requests
  getStudentRequests: async (): Promise<any[]> => {
    try {
      return await apiFetch<any[]>('/api/v1/requests/', []);
    } catch (error) {
      return [];
    }
  },

  // MOCK/STUB: Get Leave Requests
  getLeaveRequests: async (): Promise<any[]> => {
    try {
      return await apiFetch<any[]>('/api/v1/leaves/', []);
    } catch (error) {
      return [];
    }
  },

  getLeaveRequestsByStudent: async (studentId: string): Promise<any[]> => {
    try {
      const data = await apiFetch<any[]>(`/api/v1/leaverequests/student/${studentId}`, []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch student leave requests:", error);
      return [];
    }
  },

  getFeeRequestsByStudent: async (studentId: string): Promise<any[]> => {
    try {
      const data = await apiFetch<any[]>(`/api/v1/feerequests/student/${studentId}`, []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch student fee requests:", error);
      return [];
    }
  },

  getStudentAchievementsByStudent: async (studentId: string): Promise<any[]> => {
    try {
      const data = await apiFetch<any[]>(`/api/v1/studentachievements/student/${studentId}`, []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch student achievements:", error);
      return [];
    }
  },

  getSemestersByStudent: async (studentId: string): Promise<any[]> => {
    try {
      const data = await apiFetch<any[]>(`/api/v1/semesters/student/${studentId}`, []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch student semesters:", error);
      return [];
    }
  }
};
