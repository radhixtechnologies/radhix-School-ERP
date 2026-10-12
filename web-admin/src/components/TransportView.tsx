import React, { useState, useEffect, useRef } from "react";
import { Bus, MapPin, Phone, User, CheckCircle2, Navigation, Clock, Play, Pause, AlertTriangle, Plus, RefreshCw, ShieldCheck, UserCheck, FileCheck } from "lucide-react";
import L from "leaflet";

interface RouteStop {
  name: string;
  time: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
  lat: number;
  lng: number;
}

interface BusRoute {
  id: string;
  name: string;
  bus: string;
  driver: string;
  phone: string;
  speed: string;
  status: string;
  studentsCount: number;
  stops: RouteStop[];
}

export const TransportView: React.FC<{ token?: string | null }> = ({ token }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("Route #12");
  const [isSimulating, setIsSimulating] = useState(true);
  const [busProgress, setBusProgress] = useState(0.65);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(34);

  const [activeSubTab, setActiveSubTab] = useState<"tracking" | "drivers">("tracking");
  const [drivers, setDrivers] = useState<any[]>([
    {
      id: "drv-01",
      name: "Mukesh Kumar",
      phone: "+91 98712 34567",
      license_number: "DL-14-2018-HMV-8821",
      license_expiry: "24 Dec 2029",
      blood_group: "B+ve",
      assigned_bus: "Bus #12 (DL-1PB-4521)",
      route: "Rohini - Pitampura - Vasant Vihar",
      police_verification: "VERIFIED",
      police_report_date: "14 Jan 2026",
      medical_fitness: "CLEARED & FIT",
      aadhaar_verified: true,
      experience_years: 9,
      status: "ACTIVE_DUTY"
    },
    {
      id: "drv-02",
      name: "Rajender Pal",
      phone: "+91 98123 45678",
      license_number: "DL-14-2016-HMV-3310",
      license_expiry: "15 Oct 2028",
      blood_group: "O+ve",
      assigned_bus: "Bus #07 (DL-1PB-2849)",
      route: "Dwarka Sector 6 - Janakpuri",
      police_verification: "VERIFIED",
      police_report_date: "02 Feb 2026",
      medical_fitness: "CLEARED & FIT",
      aadhaar_verified: true,
      experience_years: 12,
      status: "ACTIVE_DUTY"
    },
    {
      id: "drv-03",
      name: "Surendra Singh",
      phone: "+91 98450 11223",
      license_number: "DL-14-2020-HMV-5541",
      license_expiry: "30 May 2030",
      blood_group: "A+ve",
      assigned_bus: "Bus #04 (DL-1PB-9912)",
      route: "South Extension - Lajpat Nagar",
      police_verification: "VERIFIED",
      police_report_date: "10 Mar 2026",
      medical_fitness: "CLEARED & FIT",
      aadhaar_verified: true,
      experience_years: 7,
      status: "STANDBY"
    }
  ]);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    license_number: "",
    license_expiry: "2030",
    blood_group: "B+ve",
    assigned_bus: "Bus #04",
    route: "South City Route",
    police_verification: "VERIFIED",
    medical_fitness: "FIT",
    experience_years: 5
  });


  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const stopMarkersRef = useRef<L.Marker[]>([]);

  const routes: BusRoute[] = [
    {
      id: "Route #12",
      name: "Route #12 (Rohini - Pitampura - Vasant Vihar)",
      bus: "DL-1PB-4521",
      driver: "Mukesh Kumar",
      phone: "+91 98712 34567",
      speed: "34 km/h",
      status: "ON_ROUTE",
      studentsCount: 36,
      stops: [
        { name: "Rohini Sec 14 School Gate", time: "07:15 AM", status: "COMPLETED", lat: 28.7188, lng: 77.1264 },
        { name: "Madhuban Chowk Metro", time: "07:35 AM", status: "COMPLETED", lat: 28.7032, lng: 77.1311 },
        { name: "Pitampura Club", time: "07:50 AM", status: "COMPLETED", lat: 28.6942, lng: 77.1422 },
        { name: "Dhaula Kuan Junction", time: "08:05 AM", status: "CURRENT", lat: 28.5912, lng: 77.1624 },
        { name: "Vasant Vihar H-Block (Aarav Stop)", time: "08:18 AM", status: "UPCOMING", lat: 28.5604, lng: 77.1583 },
        { name: "Delhi Public Academy Campus", time: "08:30 AM", status: "UPCOMING", lat: 28.5421, lng: 77.1692 },
      ]
    },
    {
      id: "Route #07",
      name: "Route #07 (Dwarka Sector 6 - Janakpuri)",
      bus: "DL-1PB-2849",
      driver: "Rajender Pal",
      phone: "+91 98123 45678",
      speed: "0 km/h",
      status: "ARRIVED_AT_SCHOOL",
      studentsCount: 42,
      stops: [
        { name: "Dwarka Sec 6 Market", time: "07:10 AM", status: "COMPLETED", lat: 28.5833, lng: 77.0583 },
        { name: "Janakpuri District Center", time: "07:30 AM", status: "COMPLETED", lat: 28.6297, lng: 77.0784 },
        { name: "Tilak Nagar Metro", time: "07:45 AM", status: "COMPLETED", lat: 28.6366, lng: 77.0963 },
        { name: "School Main Campus", time: "08:10 AM", status: "COMPLETED", lat: 28.5421, lng: 77.1692 },
      ]
    },
    {
      id: "Route #04",
      name: "Route #04 (South Extension - Lajpat Nagar - Campus)",
      bus: "DL-1PB-9912",
      driver: "Surendra Singh",
      phone: "+91 98450 11223",
      speed: "28 km/h",
      status: "ON_ROUTE",
      studentsCount: 38,
      stops: [
        { name: "South Extension Market", time: "07:20 AM", status: "COMPLETED", lat: 28.5729, lng: 77.2215 },
        { name: "Lajpat Nagar Metro", time: "07:40 AM", status: "COMPLETED", lat: 28.5677, lng: 77.2433 },
        { name: "Defence Colony Flyover", time: "07:55 AM", status: "CURRENT", lat: 28.5744, lng: 77.2341 },
        { name: "Delhi Public Academy Campus", time: "08:25 AM", status: "UPCOMING", lat: 28.5421, lng: 77.1692 },
      ]
    },
  ];

  const currentRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Calculate interpolated bus position
  const getBusCoordinates = () => {
    const stops = currentRoute.stops;
    const total = stops.length;
    const seg = busProgress * (total - 1);
    const idx = Math.min(Math.floor(seg), total - 2);
    const t = seg - idx;

    const p1 = stops[idx];
    const p2 = stops[idx + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * t;
    const lng = p1.lng + (p2.lng - p1.lng) * t;
    return [lat, lng] as [number, number];
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove previous map if existing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const startPos = currentRoute.stops[0];
    const map = L.map(mapContainerRef.current, {
      center: [startPos.lat, startPos.lng],
      zoom: 12,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Route coordinates polyline
    const latlngs: [number, number][] = currentRoute.stops.map(s => [s.lat, s.lng]);
    const polyline = L.polyline(latlngs, {
      color: "#059669",
      weight: 6,
      opacity: 0.85,
      dashArray: "1, 10",
      lineCap: "round",
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Add Stop markers with popups
    stopMarkersRef.current = [];
    currentRoute.stops.forEach((s, idx) => {
      const isCurrent = s.status === "CURRENT";
      const isDone = s.status === "COMPLETED";

      const stopIcon = L.divIcon({
        className: "custom-stop-div-icon",
        html: `
          <div style="
            background: ${isCurrent ? '#059669' : isDone ? '#10B981' : '#64748B'};
            color: #fff;
            font-weight: 800;
            font-size: 11px;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          ">${idx + 1}</div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([s.lat, s.lng], { icon: stopIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 2px;">
          <strong style="color: #0F172A; font-size: 13px;">Stop ${idx + 1}: ${s.name}</strong><br/>
          <span style="color: #64748B; font-size: 12px;">Scheduled: ${s.time}</span><br/>
          <span style="font-size: 11px; font-weight: 700; color: ${isCurrent ? '#059669' : isDone ? '#10B981' : '#64748B'};">
            ● ${s.status}
          </span>
        </div>
      `);
      stopMarkersRef.current.push(marker);
    });

    // Custom Bus Marker
    const initialBusPos = getBusCoordinates();
    const busIcon = L.divIcon({
      className: "custom-bus-div-icon",
      html: `
        <div style="
          background: #059669;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.5);
          cursor: pointer;
        ">
          🚌
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const busMarker = L.marker(initialBusPos, { icon: busIcon }).addTo(map);
    busMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <strong style="font-size: 14px; color: #0F172A;">${currentRoute.bus} (${currentRoute.id})</strong><br/>
        <span style="font-size: 12px; color: #475569;">Driver: ${currentRoute.driver}</span><br/>
        <span style="font-size: 12px; color: #16A34A; font-weight: 700;">● Live Speed: ${liveSpeed} km/h</span>
      </div>
    `);
    busMarkerRef.current = busMarker;

    // Fit map bounds to show route
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedRouteId]);

  // Telemetry animation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const next = prev >= 0.95 ? 0.15 : prev + 0.03;
        setLiveSpeed(30 + Math.floor(Math.random() * 12));
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Update bus marker position on map when busProgress changes
  useEffect(() => {
    if (!busMarkerRef.current || !mapInstanceRef.current) return;
    const [lat, lng] = getBusCoordinates();
    busMarkerRef.current.setLatLng([lat, lng]);

    // Send update to backend in background
    if (token) {
      fetch("http://localhost:5000/api/v1/school-features/transport/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          route_id: currentRoute.id,
          lat,
          lng,
          current_status: "ON_ROUTE",
        }),
      }).catch(() => {});
    }
  }, [busProgress]);

  const recenterOnBus = () => {
    if (!mapInstanceRef.current) return;
    const [lat, lng] = getBusCoordinates();
    mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1350px", margin: "0 auto" }}>
      {/* Top Banner */}
      <div style={{
        background: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
        borderRadius: "16px",
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
            <Bus size={14} color="#6EE7B7" /> Fleet & GPS Telematics
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0" }}>School Bus Transport & Live GPS Map Tracking</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "13px" }}>Real-time OpenStreetMap tracking for student safety, route stops, driver info, and speed alerts.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            style={{
              background: isSimulating ? "#DCFCE7" : "#FFFFFF",
              color: isSimulating ? "#166534" : "#0F172A",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            <span>{isSimulating ? "GPS Tracking Active" : "Resume GPS Sim"}</span>
          </button>

          <button
            onClick={() => setShowAddRouteModal(true)}
            style={{
              background: "#10B981",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Plus size={16} /> Add Route
          </button>
        </div>
      </div>

      {/* Sub Tabs Switcher */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveSubTab("tracking")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            background: activeSubTab === "tracking" ? "#059669" : "#FFFFFF",
            color: activeSubTab === "tracking" ? "#FFFFFF" : "#475569",
            fontWeight: 800,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: activeSubTab === "tracking" ? "0 4px 12px rgba(5, 150, 105, 0.25)" : "none",
            border: `1px solid ${activeSubTab === "tracking" ? "#059669" : "#CBD5E1"}`
          }}
        >
          Live GPS Bus Tracking & Fleet Map
        </button>

        <button
          onClick={() => setActiveSubTab("drivers")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            background: activeSubTab === "drivers" ? "#059669" : "#FFFFFF",
            color: activeSubTab === "drivers" ? "#FFFFFF" : "#475569",
            fontWeight: 800,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: activeSubTab === "drivers" ? "0 4px 12px rgba(5, 150, 105, 0.25)" : "none",
            border: `1px solid ${activeSubTab === "drivers" ? "#059669" : "#CBD5E1"}`
          }}
        >
          Drivers Directory & Document Verification ({drivers.length})
        </button>
      </div>

      {activeSubTab === "tracking" ? (
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px" }}>
        {/* Left: Routes List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#334155", margin: "0 0 4px 0" }}>Active Transport Routes:</h3>
          {routes.map((r) => {
            const isSel = r.id === selectedRouteId;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                style={{
                  background: isSel ? "#ECFDF5" : "#FFFFFF",
                  border: `2px solid ${isSel ? "#059669" : "#E2E8F0"}`,
                  borderRadius: "14px",
                  padding: "18px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bus size={18} color={isSel ? "#059669" : "#64748B"} />
                    <span style={{ fontWeight: 800, color: "#0F172A", fontSize: "15px" }}>{r.id}</span>
                  </div>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "10px",
                    background: r.status === "ON_ROUTE" ? "#DCFCE7" : "#F1F5F9",
                    color: r.status === "ON_ROUTE" ? "#16A34A" : "#475569"
                  }}>
                    {r.status === "ON_ROUTE" ? "● LIVE ON ROUTE" : "AT CAMPUS"}
                  </span>
                </div>

                <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>{r.bus}</div>
                <div style={{ fontSize: "12px", color: "#64748B", display: "flex", justifyContent: "space-between" }}>
                  <span>Driver: {r.driver}</span>
                  <span>{r.studentsCount} Students</span>
                </div>
              </div>
            );
          })}

          {/* Telematics Info Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "14px", padding: "18px", border: "1px solid #E2E8F0", marginTop: "8px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", marginBottom: "12px" }}>Assigned Driver Details</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                <User size={18} />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>{currentRoute.driver}</div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>{currentRoute.phone}</div>
              </div>
            </div>
            <a
              href={`tel:${currentRoute.phone.replace(/[^0-9+]/g, '')}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "#059669",
                color: "#fff",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700
              }}
            >
              <Phone size={14} /> Call Driver Directly
            </a>
          </div>
        </div>

        {/* Right: Interactive Leaflet Map & Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Leaflet Map Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "18px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Navigation size={18} color="#059669" />
                <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "#0F172A" }}>Live Map View • {currentRoute.name}</h3>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#166534" }}>
                  Speed: {liveSpeed} km/h
                </div>
                <button
                  onClick={recenterOnBus}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #CBD5E1",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <RefreshCw size={12} /> Recenter Bus
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div
              ref={mapContainerRef}
              style={{
                height: "380px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #CBD5E1",
                zIndex: 1,
              }}
            />
          </div>

          {/* Stops Timeline */}
          <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 16px 0", color: "#334155" }}>
              Route Stops & Estimated Arrival Times:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {currentRoute.stops.map((stop, idx) => {
                const isCurrent = stop.status === "CURRENT";
                const isDone = stop.status === "COMPLETED";

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: isCurrent ? "#ECFDF5" : "#F8FAFC",
                      border: `1px solid ${isCurrent ? "#A7F3D0" : "#E2E8F0"}`
                    }}
                  >
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isCurrent ? "#059669" : isDone ? "#10B981" : "#E2E8F0",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "12px"
                    }}>
                      {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: isCurrent ? 800 : 700, color: isCurrent ? "#059669" : "#0F172A", fontSize: "13px" }}>
                        {stop.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>
                        Time: {stop.time} {isCurrent && <strong style={{ color: "#059669" }}>• BUS IS HERE</strong>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      ) : (
        /* DRIVERS DIRECTORY TAB */
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px 0", color: "#0F172A" }}>Transport Drivers & Document Verification</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>HMV commercial driving licenses, police background reports, and annual medical fitness.</p>
            </div>
            <button
              onClick={() => setShowAddDriverModal(true)}
              style={{ background: "#059669", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} /> Register & Verify Driver
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
            {drivers.map((d) => (
              <div key={d.id} style={{ border: "1px solid #E2E8F0", borderRadius: "14px", padding: "18px", background: "#FAFAFA" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "16px" }}>
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "15px" }}>{d.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{d.assigned_bus}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "6px", background: "#DCFCE7", color: "#166534" }}>
                    ACTIVE DUTY
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Phone:</span>
                    <span style={{ fontWeight: 700 }}>{d.phone}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>HMV License No:</span>
                    <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{d.license_number}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Police Verification:</span>
                    <span style={{ fontWeight: 700, color: "#15803D" }}>{d.police_verification} ({d.police_report_date})</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Medical Fitness:</span>
                    <span style={{ fontWeight: 700, color: "#15803D" }}>{d.medical_fitness}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Aadhaar Status:</span>
                    <span style={{ fontWeight: 700, color: "#0284C7" }}>UIDAI Verified</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Driving Experience:</span>
                    <span style={{ fontWeight: 700 }}>{d.experience_years} Years (0 Incidents)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Register & Verify Driver Modal */}
      {showAddDriverModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "18px", maxWidth: "540px", width: "100%", padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={20} color="#059669" />
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>Register & Verify Driver</h3>
              </div>
              <button onClick={() => setShowAddDriverModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Driver Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Satish Chand"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Mobile Number *</label>
                  <input
                    type="text"
                    placeholder="+91 98111 22334"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>HMV License No. *</label>
                  <input
                    type="text"
                    placeholder="DL-14-2022-HMV-9912"
                    value={newDriver.license_number}
                    onChange={(e) => setNewDriver({ ...newDriver, license_number: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Assigned Bus & Route</label>
                  <input
                    type="text"
                    placeholder="Bus #05 (North Delhi Route)"
                    value={newDriver.assigned_bus}
                    onChange={(e) => setNewDriver({ ...newDriver, assigned_bus: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Police Verification Status</label>
                  <select
                    value={newDriver.police_verification}
                    onChange={(e) => setNewDriver({ ...newDriver, police_verification: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  >
                    <option value="VERIFIED">Verified & Cleared</option>
                    <option value="PENDING">Pending Background Check</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Medical / Eye Fitness</label>
                  <select
                    value={newDriver.medical_fitness}
                    onChange={(e) => setNewDriver({ ...newDriver, medical_fitness: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  >
                    <option value="FIT">Certified Fit by CMO</option>
                    <option value="AWAITING">Checkup Scheduled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newDriver.name.trim()) return;
                    setDrivers([
                      {
                        id: `drv-\${Date.now()}`,
                        name: newDriver.name,
                        phone: newDriver.phone || "+91 98000 11111",
                        license_number: newDriver.license_number || "DL-14-2023-HMV-0012",
                        license_expiry: "2031",
                        blood_group: newDriver.blood_group,
                        assigned_bus: newDriver.assigned_bus,
                        route: newDriver.route,
                        police_verification: newDriver.police_verification,
                        police_report_date: "Today",
                        medical_fitness: newDriver.medical_fitness,
                        aadhaar_verified: true,
                        experience_years: newDriver.experience_years,
                        status: "ACTIVE_DUTY"
                      },
                      ...drivers
                    ]);
                    setShowAddDriverModal(false);
                    setNewDriver({ name: "", phone: "", license_number: "", license_expiry: "2030", blood_group: "B+ve", assigned_bus: "Bus #04", route: "South City Route", police_verification: "VERIFIED", medical_fitness: "FIT", experience_years: 5 });
                  }}
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#059669", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                >
                  Confirm & Save Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showAddRouteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "480px", width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Add New Transport Route</h3>
              <button onClick={() => setShowAddRouteModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700" }}>Route Identifier (e.g. Route #09)</label>
                <input type="text" placeholder="Route #09" style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700" }}>Vehicle Registration Number</label>
                <input type="text" placeholder="DL-1PB-9988" style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700" }}>Driver Name & Phone</label>
                <input type="text" placeholder="Satish Chand (+91 98111 22334)" style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }} />
              </div>
              <button
                onClick={() => {
                  alert("Route created successfully and saved to GPS fleet system!");
                  setShowAddRouteModal(false);
                }}
                style={{
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  marginTop: "8px",
                  cursor: "pointer"
                }}
              >
                Save Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
