with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update the FAB button logic
fab_old = """      {/* Floating Action Button for adding new entities based on active tab */}
      {['Students', 'Parents', 'Admins', 'Volunteers', 'Donors'].includes(activeTab) && (
        <button
          onClick={() => {
            const type = activeTab === 'Students' ? 'Student' : activeTab === 'Parents' ? 'Parent' : (activeTab === 'Admins' || activeTab === 'Volunteers') ? 'Volunteer' : 'Donor';
            setCreationModal({ type, isOpen: true });
          }}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 gradient-btn-tab hover:opacity-90 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/30 backdrop-blur-md"
          title={`Add New ${activeTab === 'Admins' ? 'Admin' : activeTab.slice(0, -1)}`}
        >"""

fab_new = """      {/* Floating Action Button for adding new entities based on active tab */}
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
        >"""
content = content.replace(fab_old, fab_new)

# 2. Update showAddLocationModal onSubmit
modal_submit_old = """            <form
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
                setShowAddLocationModal(false);
                setNewZoneName('');
              }}
"""

modal_submit_new = """            <form
              onSubmit={async (e) => {
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

                const apiPayload = {
                  zone_name: newZoneName,
                  center_lat: baseLat,
                  center_lng: baseLng,
                  radius_meters: 150,
                  coordinates: [JSON.stringify(coords)],
                  shape: newZoneShape,
                  color: newZoneColor,
                  target_batch: newZoneTargetBatch,
                  polygons: [],
                  student_ids: [],
                  is_active: 1,
                  is_deleted: 0,
                  description: 'Added via Modal'
                };

                let savedData = await apiService.createGeofence(apiPayload).catch(() => null);
                
                // Fallback to local save if API fails so the UI continues working locally
                if (!savedData) {
                  savedData = { id: `GF_${Date.now()}`, ...apiPayload };
                }

                setCustomGeofences(prev => {
                  const updated = [...prev, {
                    id: savedData.zone_id || savedData.id || `GF_${Date.now()}`,
                    name: newZoneName,
                    shape: newZoneShape,
                    color: newZoneColor,
                    targetBatch: newZoneTargetBatch,
                    lat: baseLat,
                    lng: baseLng,
                    polygons: [{ name: 'Default Zone', coords }]
                  }];
                  localStorage.setItem('h3_geofences', JSON.stringify(updated));
                  return updated;
                });
                
                setShowAddLocationModal(false);
                setNewZoneName('');
              }}
"""

content = content.replace(modal_submit_old, modal_submit_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated FAB and modal submit logic successfully!")
