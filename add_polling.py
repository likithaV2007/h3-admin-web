import re

with open("src/App.tsx", "r") as f:
    content = f.read()

anchor = '''  useEffect(() => {
    if (isAuthenticated) {
      loadDataFromApi();
    }
  }, [isAuthenticated]);'''

polling_effect = '''

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
  }, [isAuthenticated, activeTab]);'''

content = content.replace(anchor, anchor + polling_effect)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("done")
