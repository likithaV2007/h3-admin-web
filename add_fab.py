with open('src/App.tsx', 'r') as f:
    content = f.read()

fab_old = """      {/* FLOATING ACTION BUTTON FOR QUICK ADD */}
      {['Students', 'Parents', 'Admins', 'Volunteers', 'Donors'].includes(activeTab) && ("""

fab_new = """      {/* FLOATING ACTION BUTTON FOR QUICK ADD */}
      {['Students', 'Parents', 'Admins', 'Volunteers', 'Donors', 'Location'].includes(activeTab) && ("""

content = content.replace(fab_old, fab_new)

fab_click_old = """        <button
          onClick={() => {
            const type = activeTab === 'Students' ? 'Student' : activeTab === 'Parents' ? 'Parent' : (activeTab === 'Admins' || activeTab === 'Volunteers') ? 'Volunteer' : 'Donor';
            setCreationModal({ type, isOpen: true });
          }}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 gradient-btn-tab hover:opacity-90 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/30 backdrop-blur-md"
          title={`Add New ${activeTab === 'Admins' ? 'Admin' : activeTab.slice(0, -1)}`}
        >"""

fab_click_new = """        <button
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

content = content.replace(fab_click_old, fab_click_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Fixed FAB!")
