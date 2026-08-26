with open('src/services/api.ts', 'r') as f:
    content = f.read()

new_api_methods = """  // Update Fee Request Status
  updateFeeRequestStatus: async (feeRequestId: string, status: string): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/feerequests/${feeRequestId}/status?status=${status.toLowerCase()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ status: status.toLowerCase() }) // Sending both query and body to be safe based on FastAPI varying patterns
      });
      if (res.ok) return await res.json();
      return null;
    } catch (error) {
      console.error("Failed to update fee request status:", error);
      return null;
    }
  },

  // Update Leave Request Status
  updateLeaveRequestStatus: async (leaveRequestId: string, status: string): Promise<any> => {
    try {
      const authHeaders = await getAuthHeader();
      const res = await fetch(`${BASE_URL}/api/v1/leaverequests/${leaveRequestId}/status?status=${status.toLowerCase()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ status: status.toLowerCase() }) // Sending both query and body to be safe
      });
      if (res.ok) return await res.json();
      return null;
    } catch (error) {
      console.error("Failed to update leave request status:", error);
      return null;
    }
  },

"""

content = content.replace("export const apiService = {", "export const apiService = {\n" + new_api_methods)

with open('src/services/api.ts', 'w') as f:
    f.write(content)
