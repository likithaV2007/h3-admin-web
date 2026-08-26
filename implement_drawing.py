import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add pendingGeofenceDetails state
if 'const [pendingGeofenceDetails, setPendingGeofenceDetails]' not in content:
    state_anchor = "const [pendingDrawnShape, setPendingDrawnShape]"
    new_state = "  const [pendingGeofenceDetails, setPendingGeofenceDetails] = useState<{name: string, color: string, targetBatch: string} | null>(null);\n  " + state_anchor
    content = content.replace(state_anchor, new_state)

# 2. Modify showAddLocationModal to trigger drawing instead of auto-generating
modal_old = r"""              onSubmit=\{\(e\) => \{
                e\.preventDefault\(\);
                if \(\!newZoneName\) return;

                // Center around map view with vertex points for shape
                const baseLat = 12\.9740 \+ \(Math\.random\(\) \* 0\.006 - 0\.003\);
                const baseLng = 77\.5950 \+ \(Math\.random\(\) \* 0\.006 - 0\.003\);

                let coords: Array<\[number, number\]> = \[\];
                const radius = 0\.0015;

                if \(newZoneShape === 'pentagon'\) \{
                  // 5 sides
                  for \(let i = 0; i < 5; i\+\+\) \{
                    const angle = \(i \* 2 \* Math\.PI\) / 5 - Math\.PI / 2;
                    coords\.push\(\[baseLat \+ radius \* Math\.sin\(angle\), baseLng \+ radius \* Math\.cos\(angle\)\]\);
                  \}
                \} else if \(newZoneShape === 'hexagon'\) \{
                  // 6 sides
                  for \(let i = 0; i < 6; i\+\+\) \{
                    const angle = \(i \* 2 \* Math\.PI\) / 6;
                    coords\.push\(\[baseLat \+ radius \* Math\.sin\(angle\), baseLng \+ radius \* Math\.cos\(angle\)\]\);
                  \}
                \} else \{
                  // Quad Polygon
                  coords = \[
                    \[baseLat \+ 0\.001, baseLng - 0\.001\],
                    \[baseLat \+ 0\.001, baseLng \+ 0\.001\],
                    \[baseLat - 0\.001, baseLng \+ 0\.001\],
                    \[baseLat - 0\.001, baseLng - 0\.001\]
                  \];
                \}

                setCustomGeofences\(prev => \[
                  \.\.\.prev,
                  \{
                    id: `GF_$\{Date\.now\(\)\}`,
                    name: newZoneName,
                    shape: newZoneShape,
                    color: newZoneColor,
                    targetBatch: newZoneTargetBatch,
                    lat: baseLat,
                    lng: baseLng,
                    polygons: \[\{ name: 'Default Zone', coords \}\]
                  \}
                \]\);

                setNewZoneName\(''\);
                setShowAddLocationModal\(false\);
              \}\}"""

modal_new = """              onSubmit={(e) => {
                e.preventDefault();
                if (!newZoneName) return;

                setPendingGeofenceDetails({
                  name: newZoneName,
                  color: newZoneColor,
                  targetBatch: newZoneTargetBatch
                });
                
                setShowAddLocationModal(false);
                
                // Trigger Drawing Mode
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
                  alert('🖊️ Draw Mode Active!\n\n1. Click points on the map to outline your geofence.\n2. Click the VERY FIRST marker point to CLOSE the fence!\n3. It will automatically save using the details you just provided.');
                }
              }}"""

content = re.sub(modal_old, modal_new, content)

# 3. Remove Shape Selection Dropdown
shape_div_old = r"""              <div>
                <label className="text-\[10px\] text-slate-400 block font-bold mb-1">SHAPE TYPE</label>
                <div className="flex gap-2">
                  <button type="button" onClick=\(\(\) => setNewZoneShape\('pentagon'\)\} className=\{`flex-1 py-2 rounded-xl text-xs font-bold transition-all $\{newZoneShape === 'pentagon' \? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-transparent'\}`\}>Pentagon</button>
                  <button type="button" onClick=\(\(\) => setNewZoneShape\('hexagon'\)\} className=\{`flex-1 py-2 rounded-xl text-xs font-bold transition-all $\{newZoneShape === 'hexagon' \? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-transparent'\}`\}>Hexagon</button>
                  <button type="button" onClick=\(\(\) => setNewZoneShape\('polygon'\)\} className=\{`flex-1 py-2 rounded-xl text-xs font-bold transition-all $\{newZoneShape === 'polygon' \? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-transparent'\}`\}>Quad</button>
                </div>
              </div>"""
content = re.sub(shape_div_old, "", content)

# 4. Change Create Zone button text to "Mark Geofence on Map"
btn_old = r"""                <button type="submit" className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm tracking-wide shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
                  Create Zone Shape
                </button>"""
btn_new = """                <button type="submit" className="w-full py-3 bg-[#cbb4d4] text-slate-900 rounded-xl font-black text-sm tracking-wide shadow-xl shadow-[#cbb4d4]/30 hover:scale-105 active:scale-95 transition-all">
                  Mark Geofence on Map
                </button>"""
content = re.sub(btn_old, btn_new, content)


# 5. Handle DRAW.CREATED event to check pendingGeofenceDetails and auto-save via API
created_event_old = r"""        map\.on\(L\.Draw\.Event\.CREATED, \(e: any\) => \{
          setIsDrawingActive\(false\);
          const layer = e\.layer;
          const type = e\.layerType;
          drawnItems\.addLayer\(layer\);

          // Extract coordinates of drawn shape & ensure closed loop polygon
          let coords = layer\.getLatLngs\(\)\[0\]\.map\(\(latlng: any\) => \[latlng\.lat, latlng\.lng\]\);
          if \(coords\[0\]\[0\] !== coords\[coords\.length - 1\]\[0\] || coords\[0\]\[1\] !== coords\[coords\.length - 1\]\[1\]\) \{
            coords\.push\(coords\[0\]\);
          \}

          const fixedCoords = coords;
          const center = layer\.getBounds\(\)\.getCenter\(\);
          const defaultName = `Fence - $\{new Date\(\)\.toLocaleString\(\)\}`;

          setPendingDrawnShape\(\{
            layer,
            coords: fixedCoords,
            center: \{ lat: center\.lat, lng: center\.lng \},
            defaultName: defaultName
          \}\);
          setNewZoneName\(defaultName\);
        \}\);"""

created_event_new = """        map.on(L.Draw.Event.CREATED, async (e: any) => {
          setIsDrawingActive(false);
          const layer = e.layer;
          drawnItems.addLayer(layer);

          // Extract coordinates of drawn shape & ensure closed loop polygon
          let coords = layer.getLatLngs()[0].map((latlng: any) => [latlng.lat, latlng.lng]);
          if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
            coords.push(coords[0]);
          }

          const fixedCoords = coords;
          const center = layer.getBounds().getCenter();
          const defaultName = `Fence - ${new Date().toLocaleString()}`;

          setPendingGeofenceDetails(prevDetails => {
            if (prevDetails) {
              // We came from the FAB modal, so AUTO-SAVE immediately!
              const autoSave = async () => {
                const apiPayload = {
                  zone_name: prevDetails.name,
                  center_lat: center.lat,
                  center_lng: center.lng,
                  radius_meters: 100,
                  coordinates: [JSON.stringify(fixedCoords)],
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
                    polygons: [{ name: 'Default Zone', coords: fixedCoords }]
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
                coords: fixedCoords,
                center: { lat: center.lat, lng: center.lng },
                defaultName: defaultName
              });
              setNewZoneName(defaultName);
              return null;
            }
          });
        });"""

content = re.sub(created_event_old, created_event_new, content)


with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated Drawing flow!")
