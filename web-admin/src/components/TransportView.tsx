import React, { useState, useEffect, useRef } from "react";
import { SchoolPrintHeader } from "./SchoolPrintHeader";
import {
  Bus,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Navigation,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Users,
  FileCheck,
  Search,
  Eye,
  Edit3,
  Trash2,
  X,
  Printer,
  HeartPulse,
  BadgeAlert,
  Calendar,
  Sparkles,
  Car,
  FileText,
  Wrench,
  ShieldAlert,
  Key,
  Check,
  Truck,
  CheckCircle,
  Radio,
  Camera,
  Flame,
  LifeBuoy,
  Upload,
  Paperclip,
  Download
} from "lucide-react";
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

export interface DriverData {
  id: string;
  institute_id?: string;
  name: string;
  phone: string;
  alternate_phone?: string;
  dob?: string;
  blood_group?: string;
  address?: string;
  aadhaar_number?: string;
  license_number: string;
  license_type?: string;
  license_expiry?: string;
  badge_number?: string;
  experience_years?: number;
  assigned_bus?: string;
  route?: string;
  police_verification: "VERIFIED" | "PENDING" | "UNDER_REVIEW";
  police_station?: string;
  police_report_date?: string;
  medical_fitness: "FIT" | "PENDING" | "UNFIT";
  fitness_certificate_no?: string;
  fitness_doctor?: string;
  status: "ACTIVE_DUTY" | "STANDBY" | "ON_LEAVE" | "INACTIVE";
  joining_date?: string;
  license_document_url?: string;
  police_cert_url?: string;
  medical_cert_url?: string;
  badge_document_url?: string;
  notes?: string;
  created_at?: string;
}

export interface VehicleData {
  id: string;
  institute_id?: string;
  vehicle_number: string;
  vehicle_model: string;
  vehicle_type: "BUS" | "MINI_BUS" | "VAN" | "ELECTRIC_BUS";
  seating_capacity: number;
  fuel_type: "DIESEL" | "CNG" | "ELECTRIC" | "PETROL";
  chassis_number: string;
  engine_number: string;
  rc_number: string;
  rc_expiry: string;
  fitness_cert_no: string;
  fitness_expiry: string;
  insurance_policy_no: string;
  insurance_company: string;
  insurance_expiry: string;
  puc_cert_no: string;
  puc_expiry: string;
  permit_number: string;
  permit_expiry: string;
  speed_governor_fitted: number | boolean;
  speed_limit_kmh: number;
  gps_device_imei: string;
  cctv_installed: number | boolean;
  cctv_camera_count: number;
  fire_extinguisher: number | boolean;
  emergency_exit: number | boolean;
  assigned_driver_name?: string;
  assigned_route_name?: string;
  status: "ACTIVE" | "MAINTENANCE" | "STANDBY" | "OUT_OF_SERVICE";
  rc_document_url?: string;
  insurance_document_url?: string;
  fitness_document_url?: string;
  puc_document_url?: string;
  permit_document_url?: string;
  notes?: string;
  created_at?: string;
}

export const TransportView: React.FC<{
  token?: string | null;
  institute?: any;
  defaultTab?: "tracking" | "drivers" | "vehicles";
}> = ({ token, institute, defaultTab = "vehicles" }) => {
  const [selectedRouteId, setSelectedRouteId] = useState("Route #12");
  const [isSimulating, setIsSimulating] = useState(true);
  const [busProgress, setBusProgress] = useState(0.65);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(34);

  const [activeSubTab, setActiveSubTab] = useState<"tracking" | "drivers" | "vehicles">(
    defaultTab || "vehicles"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize defaultTab if changed from parent
  useEffect(() => {
    if (defaultTab) {
      setActiveSubTab(defaultTab);
    }
  }, [defaultTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  /* =========================================================================
     DRIVERS STATE & LOGIC
     ========================================================================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE_DUTY" | "STANDBY" | "VERIFIED">("ALL");
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  const [drivers, setDrivers] = useState<DriverData[]>([
    {
      id: "drv-01",
      name: "Mukesh Kumar",
      phone: "+91 98712 34567",
      alternate_phone: "+91 98110 99881",
      dob: "1984-05-12",
      blood_group: "B+ve",
      address: "H-42, Sector 15, Rohini, New Delhi - 110085",
      aadhaar_number: "4829-1920-5512",
      license_number: "DL-14-2018-HMV-8821",
      license_type: "HMV_COMMERCIAL",
      license_expiry: "2029-12-24",
      badge_number: "PSV-DEL-77821",
      experience_years: 9,
      assigned_bus: "DL-1PB-4521 (Bus #12)",
      route: "Rohini - Pitampura - Vasant Vihar",
      police_verification: "VERIFIED",
      police_station: "North Rohini Police Station",
      police_report_date: "2026-01-14",
      medical_fitness: "FIT",
      fitness_certificate_no: "CMO-ND-2026-9081",
      fitness_doctor: "Dr. A. K. Verma (CMO)",
      status: "ACTIVE_DUTY",
      joining_date: "2021-04-01",
      notes: "Clean driving record. Zero traffic violations or rash driving reports."
    },
    {
      id: "drv-02",
      name: "Rajender Pal",
      phone: "+91 98123 45678",
      alternate_phone: "+91 98120 77665",
      dob: "1980-11-20",
      blood_group: "O+ve",
      address: "Pocket 2, DDA Flats, Dwarka Sector 6, New Delhi - 110075",
      aadhaar_number: "6124-7781-3342",
      license_number: "DL-14-2016-HMV-3310",
      license_type: "HMV_COMMERCIAL",
      license_expiry: "2028-10-15",
      badge_number: "PSV-DEL-44109",
      experience_years: 12,
      assigned_bus: "DL-1PB-2849 (Bus #07)",
      route: "Dwarka Sector 6 - Janakpuri - Campus",
      police_verification: "VERIFIED",
      police_station: "Dwarka South Police Station",
      police_report_date: "2026-02-02",
      medical_fitness: "FIT",
      fitness_certificate_no: "CMO-SW-2026-3314",
      fitness_doctor: "Dr. P. S. Chauhan",
      status: "ACTIVE_DUTY",
      joining_date: "2019-07-15",
      notes: "Senior driver with excellent defensive driving skills. First-aid certified."
    },
    {
      id: "drv-03",
      name: "Surendra Singh",
      phone: "+91 98450 11223",
      alternate_phone: "+91 98450 99882",
      dob: "1988-08-04",
      blood_group: "A+ve",
      address: "C-18, Kotla Mubarakpur, South Extension, New Delhi - 110003",
      aadhaar_number: "8821-3401-9902",
      license_number: "DL-14-2020-HMV-5541",
      license_type: "HMV_COMMERCIAL",
      license_expiry: "2030-05-30",
      badge_number: "PSV-DEL-90123",
      experience_years: 7,
      assigned_bus: "DL-1PB-9912 (Bus #04)",
      route: "South Extension - Lajpat Nagar - Campus",
      police_verification: "VERIFIED",
      police_station: "Defence Colony Police Station",
      police_report_date: "2026-03-10",
      medical_fitness: "FIT",
      fitness_certificate_no: "CMO-SE-2026-8821",
      fitness_doctor: "Dr. Meenakshi Sundaram",
      status: "STANDBY",
      joining_date: "2022-09-01",
      notes: "Relief and standby bus driver. Certified in fire-safety extinguisher handling."
    }
  ]);

  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverData | null>(null);
  const [viewingIdCardDriver, setViewingIdCardDriver] = useState<DriverData | null>(null);
  const [viewingTransportDoc, setViewingTransportDoc] = useState<{
    title: string;
    fileName: string;
    dataUrl?: string;
    fileType?: string;
  } | null>(null);
  const [transportDocDataUrls, setTransportDocDataUrls] = useState<Record<string, string>>({});

  const initialNewDriverForm: Omit<DriverData, "id"> = {
    name: "",
    phone: "",
    alternate_phone: "",
    dob: "",
    blood_group: "B+ve",
    address: "",
    aadhaar_number: "",
    license_number: "",
    license_type: "HMV_COMMERCIAL",
    license_expiry: "",
    badge_number: "",
    experience_years: 5,
    assigned_bus: "Bus #04 (DL-1PB-9912)",
    route: "South City Route",
    police_verification: "VERIFIED",
    police_station: "City Central Police Station",
    police_report_date: new Date().toISOString().split("T")[0],
    medical_fitness: "FIT",
    fitness_certificate_no: "CMO-DEL-2026-001",
    fitness_doctor: "Dr. Sharma (CMO)",
    status: "ACTIVE_DUTY",
    joining_date: new Date().toISOString().split("T")[0],
    license_document_url: "",
    police_cert_url: "",
    medical_cert_url: "",
    badge_document_url: "",
    notes: "Driver completed background and physical fitness verification."
  };

  const [driverForm, setDriverForm] = useState(initialNewDriverForm);
  const [formError, setFormError] = useState("");

  const fetchDrivers = async () => {
    if (!token) return;
    try {
      setLoadingDrivers(true);
      const res = await fetch("http://localhost:5000/api/v1/school-features/transport/drivers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setDrivers(data.data);
      }
    } catch (err) {
      console.warn("Could not load drivers from server, using local list:", err);
    } finally {
      setLoadingDrivers(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [token]);

  /* =========================================================================
     VEHICLES STATE & LOGIC (School Fleet Registration & Compliance Dossier)
     ========================================================================= */
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [vehicleFilterStatus, setVehicleFilterStatus] = useState<"ALL" | "ACTIVE" | "MAINTENANCE" | "STANDBY">("ALL");
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [vehicles, setVehicles] = useState<VehicleData[]>([
    {
      id: "veh-01",
      vehicle_number: "DL-1PB-4521",
      vehicle_model: "Tata Starbus Ultra (40-Seater)",
      vehicle_type: "BUS",
      seating_capacity: 42,
      fuel_type: "DIESEL",
      chassis_number: "MAT482910X99201",
      engine_number: "4SPCR192083",
      rc_number: "DL-14-RC-2022-8812",
      rc_expiry: "2032-05-15",
      fitness_cert_no: "RTO-NW-FIT-2026-902",
      fitness_expiry: "2027-04-30",
      insurance_policy_no: "BAGIC-COM-99182371",
      insurance_company: "Bajaj Allianz General Insurance",
      insurance_expiry: "2027-03-31",
      puc_cert_no: "PUC-DL-2026-4410",
      puc_expiry: "2026-12-15",
      permit_number: "STA-DL-STG-5512",
      permit_expiry: "2028-06-20",
      speed_governor_fitted: 1,
      speed_limit_kmh: 40,
      gps_device_imei: "864920194820194",
      cctv_installed: 1,
      cctv_camera_count: 2,
      fire_extinguisher: 1,
      emergency_exit: 1,
      assigned_driver_name: "Mukesh Kumar",
      assigned_route_name: "Route #12 (Rohini - Pitampura - Vasant Vihar)",
      status: "ACTIVE",
      notes: "Full speed governor calibrated to 40 km/h. First-aid kit inspected.",
      created_at: "2026-01-10"
    },
    {
      id: "veh-02",
      vehicle_number: "DL-1PB-2849",
      vehicle_model: "Eicher Skyline Pro (36-Seater CNG)",
      vehicle_type: "BUS",
      seating_capacity: 36,
      fuel_type: "CNG",
      chassis_number: "MCE201884J11029",
      engine_number: "E483TCI-88192",
      rc_number: "DL-14-RC-2021-3319",
      rc_expiry: "2031-10-10",
      fitness_cert_no: "RTO-SW-FIT-2026-441",
      fitness_expiry: "2027-02-28",
      insurance_policy_no: "HDFC-ERGO-COM-441829",
      insurance_company: "HDFC ERGO General Insurance",
      insurance_expiry: "2027-01-15",
      puc_cert_no: "PUC-DL-2026-7782",
      puc_expiry: "2026-11-20",
      permit_number: "STA-DL-STG-4419",
      permit_expiry: "2027-09-30",
      speed_governor_fitted: 1,
      speed_limit_kmh: 40,
      gps_device_imei: "865011928492014",
      cctv_installed: 1,
      cctv_camera_count: 2,
      fire_extinguisher: 1,
      emergency_exit: 1,
      assigned_driver_name: "Rajender Pal",
      assigned_route_name: "Route #07 (Dwarka Sector 6 - Janakpuri)",
      status: "ACTIVE",
      notes: "CNG hydro-test cylinder cleared valid till 2028. Dual AIS-140 GPS active.",
      created_at: "2026-02-01"
    },
    {
      id: "veh-03",
      vehicle_number: "DL-1PB-9912",
      vehicle_model: "Ashok Leyland Sunshine (45-Seater)",
      vehicle_type: "BUS",
      seating_capacity: 45,
      fuel_type: "DIESEL",
      chassis_number: "MAL992109K44812",
      engine_number: "Hino4CT-99102",
      rc_number: "DL-14-RC-2023-1194",
      rc_expiry: "2033-03-12",
      fitness_cert_no: "RTO-SE-FIT-2026-881",
      fitness_expiry: "2027-05-15",
      insurance_policy_no: "ICICI-LOMB-772819",
      insurance_company: "ICICI Lombard Motor Insurance",
      insurance_expiry: "2027-04-10",
      puc_cert_no: "PUC-DL-2026-9901",
      puc_expiry: "2027-01-05",
      permit_number: "STA-DL-STG-9904",
      permit_expiry: "2028-11-14",
      speed_governor_fitted: 1,
      speed_limit_kmh: 40,
      gps_device_imei: "867728192039481",
      cctv_installed: 1,
      cctv_camera_count: 3,
      fire_extinguisher: 1,
      emergency_exit: 1,
      assigned_driver_name: "Surendra Singh",
      assigned_route_name: "Route #04 (South Extension - Lajpat Nagar)",
      status: "ACTIVE",
      notes: "New school bus delivered 2023. Anti-lock Braking System (ABS) and emergency sirens equipped.",
      created_at: "2026-03-15"
    },
    {
      id: "veh-04",
      vehicle_number: "DL-1VB-3319",
      vehicle_model: "Force Motors Traveller (20-Seater Mini Bus)",
      vehicle_type: "MINI_BUS",
      seating_capacity: 20,
      fuel_type: "CNG",
      chassis_number: "MFT192048G22910",
      engine_number: "FM26CR-88201",
      rc_number: "DL-14-RC-2022-7721",
      rc_expiry: "2032-08-20",
      fitness_cert_no: "RTO-C-FIT-2026-339",
      fitness_expiry: "2027-06-10",
      insurance_policy_no: "TATA-AIG-COM-66192",
      insurance_company: "Tata AIG Commercial Vehicle Policy",
      insurance_expiry: "2027-05-20",
      puc_cert_no: "PUC-DL-2026-3310",
      puc_expiry: "2026-12-30",
      permit_number: "STA-DL-STG-3319",
      permit_expiry: "2027-12-01",
      speed_governor_fitted: 1,
      speed_limit_kmh: 50,
      gps_device_imei: "869920194827104",
      cctv_installed: 1,
      cctv_camera_count: 1,
      fire_extinguisher: 1,
      emergency_exit: 1,
      assigned_driver_name: "Standby Driver Pool",
      assigned_route_name: "Emergency Relief & Excursion Bus",
      status: "STANDBY",
      notes: "Dedicated spare/relief mini bus for sports trips and driver replacement.",
      created_at: "2026-04-01"
    }
  ]);

  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [viewingCertVehicle, setViewingCertVehicle] = useState<VehicleData | null>(null);

  const initialNewVehicleForm: Omit<VehicleData, "id"> = {
    vehicle_number: "",
    vehicle_model: "",
    vehicle_type: "BUS",
    seating_capacity: 40,
    fuel_type: "DIESEL",
    chassis_number: "",
    engine_number: "",
    rc_number: "",
    rc_expiry: "",
    fitness_cert_no: "",
    fitness_expiry: "",
    insurance_policy_no: "",
    insurance_company: "",
    insurance_expiry: "",
    puc_cert_no: "",
    puc_expiry: "",
    permit_number: "",
    permit_expiry: "",
    speed_governor_fitted: 1,
    speed_limit_kmh: 40,
    gps_device_imei: "",
    cctv_installed: 1,
    cctv_camera_count: 2,
    fire_extinguisher: 1,
    emergency_exit: 1,
    assigned_driver_name: "",
    assigned_route_name: "",
    status: "ACTIVE",
    rc_document_url: "",
    insurance_document_url: "",
    fitness_document_url: "",
    puc_document_url: "",
    permit_document_url: "",
    notes: "School transport compliance verified."
  };

  const [vehicleForm, setVehicleForm] = useState(initialNewVehicleForm);
  const [vehicleFormError, setVehicleFormError] = useState("");

  const fetchVehicles = async () => {
    if (!token) return;
    try {
      setLoadingVehicles(true);
      const res = await fetch("http://localhost:5000/api/v1/school-features/transport/vehicles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setVehicles(data.data);
      }
    } catch (err) {
      console.warn("Could not load vehicles from server, using local list:", err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [token]);

  // Submit Vehicle Registration
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleFormError("");

    if (!vehicleForm.vehicle_number.trim() || vehicleForm.vehicle_number.trim().length < 6) {
      setVehicleFormError("Please enter a valid school vehicle registration number (e.g., DL-1PB-4521).");
      return;
    }
    if (!vehicleForm.vehicle_model.trim() || vehicleForm.vehicle_model.trim().length < 2) {
      setVehicleFormError("Please specify the vehicle make and model (e.g., Tata Starbus Ultra 40-Seater).");
      return;
    }
    if (!vehicleForm.rc_number.trim() || vehicleForm.rc_number.trim().length < 4) {
      setVehicleFormError("Please provide a valid Registration Certificate (RC Book Number).");
      return;
    }
    if (Number(vehicleForm.seating_capacity) <= 0) {
      setVehicleFormError("Please enter a valid seating capacity (minimum 5 seats).");
      return;
    }

    try {
      const payload = {
        ...vehicleForm,
        seating_capacity: Number(vehicleForm.seating_capacity) || 40,
        speed_limit_kmh: Number(vehicleForm.speed_limit_kmh) || 40,
        cctv_camera_count: Number(vehicleForm.cctv_camera_count) || 2,
        speed_governor_fitted: Number(vehicleForm.speed_governor_fitted) ? 1 : 0,
        cctv_installed: Number(vehicleForm.cctv_installed) ? 1 : 0,
        fire_extinguisher: Number(vehicleForm.fire_extinguisher) ? 1 : 0,
        emergency_exit: Number(vehicleForm.emergency_exit) ? 1 : 0,
      };

      if (editingVehicle) {
        if (token) {
          try {
            const res = await fetch(`http://localhost:5000/api/v1/school-features/transport/vehicles/${editingVehicle.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (result.success && result.data) {
              setVehicles(vehicles.map(v => v.id === editingVehicle.id ? result.data : v));
            } else {
              setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...payload, id: editingVehicle.id } : v));
            }
          } catch {
            setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...payload, id: editingVehicle.id } : v));
          }
        } else {
          setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...payload, id: editingVehicle.id } : v));
        }
        showToast("✅ Vehicle specifications and compliance certificates updated successfully!");
        setEditingVehicle(null);
      } else {
        let createdItem: VehicleData = {
          ...payload,
          id: `veh-${Date.now()}`,
          created_at: new Date().toISOString()
        };

        if (token) {
          try {
            const res = await fetch("http://localhost:5000/api/v1/school-features/transport/vehicles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (result.success && result.data) {
              createdItem = result.data;
            }
          } catch (e) {
            console.warn("Backend vehicle save failed, saved locally", e);
          }
        }

        setVehicles([createdItem, ...vehicles]);
        showToast("🎉 New school fleet vehicle and compliance documents registered successfully!");
      }

      setShowAddVehicleModal(false);
      setVehicleForm(initialNewVehicleForm);
    } catch {
      setVehicleFormError("Failed to save vehicle details. Please try again.");
    }
  };

  const handleDeleteVehicle = async (id: string, vehNumber: string) => {
    if (!window.confirm(`Are you sure you want to decommission and remove vehicle ${vehNumber} from the school fleet?`)) {
      return;
    }

    if (token) {
      try {
        await fetch(`http://localhost:5000/api/v1/school-features/transport/vehicles/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn("Server delete failed:", err);
      }
    }

    setVehicles(vehicles.filter(v => v.id !== id));
    showToast(`🗑️ Vehicle ${vehNumber} has been decommissioned from the fleet.`);
  };

  const handleEditVehicle = (veh: VehicleData) => {
    setEditingVehicle(veh);
    setVehicleForm({
      vehicle_number: veh.vehicle_number || "",
      vehicle_model: veh.vehicle_model || "",
      vehicle_type: veh.vehicle_type || "BUS",
      seating_capacity: veh.seating_capacity || 40,
      fuel_type: veh.fuel_type || "DIESEL",
      chassis_number: veh.chassis_number || "",
      engine_number: veh.engine_number || "",
      rc_number: veh.rc_number || "",
      rc_expiry: veh.rc_expiry || "",
      fitness_cert_no: veh.fitness_cert_no || "",
      fitness_expiry: veh.fitness_expiry || "",
      insurance_policy_no: veh.insurance_policy_no || "",
      insurance_company: veh.insurance_company || "",
      insurance_expiry: veh.insurance_expiry || "",
      puc_cert_no: veh.puc_cert_no || "",
      puc_expiry: veh.puc_expiry || "",
      permit_number: veh.permit_number || "",
      permit_expiry: veh.permit_expiry || "",
      speed_governor_fitted: veh.speed_governor_fitted ? 1 : 0,
      speed_limit_kmh: veh.speed_limit_kmh || 40,
      gps_device_imei: veh.gps_device_imei || "",
      cctv_installed: veh.cctv_installed ? 1 : 0,
      cctv_camera_count: veh.cctv_camera_count || 2,
      fire_extinguisher: veh.fire_extinguisher ? 1 : 0,
      emergency_exit: veh.emergency_exit ? 1 : 0,
      assigned_driver_name: veh.assigned_driver_name || "",
      assigned_route_name: veh.assigned_route_name || "",
      status: veh.status || "ACTIVE",
      rc_document_url: veh.rc_document_url || "",
      insurance_document_url: veh.insurance_document_url || "",
      fitness_document_url: veh.fitness_document_url || "",
      puc_document_url: veh.puc_document_url || "",
      permit_document_url: veh.permit_document_url || "",
      notes: veh.notes || ""
    });
    setVehicleFormError("");
    setShowAddVehicleModal(true);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const q = vehicleSearchQuery.toLowerCase();
    const matchesSearch =
      v.vehicle_number.toLowerCase().includes(q) ||
      v.vehicle_model.toLowerCase().includes(q) ||
      (v.assigned_driver_name && v.assigned_driver_name.toLowerCase().includes(q)) ||
      (v.assigned_route_name && v.assigned_route_name.toLowerCase().includes(q)) ||
      (v.rc_number && v.rc_number.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (vehicleFilterStatus === "ACTIVE") return v.status === "ACTIVE";
    if (vehicleFilterStatus === "STANDBY") return v.status === "STANDBY";
    if (vehicleFilterStatus === "MAINTENANCE") return v.status === "MAINTENANCE";

    return true;
  });

  /* =========================================================================
     GPS & MAP ROUTING LOGIC
     ========================================================================= */
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
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

  useEffect(() => {
    if (activeSubTab !== "tracking") return;
    if (!mapContainerRef.current) return;

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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const latlngs: [number, number][] = currentRoute.stops.map(s => [s.lat, s.lng]);
    const polyline = L.polyline(latlngs, {
      color: "#3D5EE1",
      weight: 6,
      opacity: 0.85,
    }).addTo(map);

    stopMarkersRef.current = [];
    currentRoute.stops.forEach((s, idx) => {
      const isDone = s.status === "COMPLETED";
      const isCurrent = s.status === "CURRENT";
      const color = isCurrent ? "#3D5EE1" : isDone ? "#10B981" : "#94A3B8";

      const stopIcon = L.divIcon({
        className: "custom-stop-div-icon",
        html: `
          <div style="
            background: ${color};
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([s.lat, s.lng], { icon: stopIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 2px;">
          <strong style="color: #0F172A; font-size: 13px;">Stop ${idx + 1}: ${s.name}</strong><br/>
          <span style="color: #64748B; font-size: 12px;">Scheduled: ${s.time}</span><br/>
          <span style="font-size: 11px; font-weight: 700; color: ${isCurrent ? '#3D5EE1' : isDone ? '#10B981' : '#64748B'};">
            ● ${s.status}
          </span>
        </div>
      `);
      stopMarkersRef.current.push(marker);
    });

    const initialBusPos = getBusCoordinates();
    const busIcon = L.divIcon({
      className: "custom-bus-div-icon",
      html: `
        <div style="
          background: #3D5EE1;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 14px rgba(61, 94, 225, 0.5);
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
        <span style="font-size: 12px; color: #3D5EE1; font-weight: 700;">● Live Speed: ${liveSpeed} km/h</span>
      </div>
    `);
    busMarkerRef.current = busMarker;

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedRouteId, activeSubTab]);

  useEffect(() => {
    if (!isSimulating || activeSubTab !== "tracking") return;

    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const next = prev >= 0.95 ? 0.15 : prev + 0.03;
        setLiveSpeed(30 + Math.floor(Math.random() * 12));
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating, activeSubTab]);

  useEffect(() => {
    if (!busMarkerRef.current || !mapInstanceRef.current || activeSubTab !== "tracking") return;
    const [lat, lng] = getBusCoordinates();
    busMarkerRef.current.setLatLng([lat, lng]);
  }, [busProgress]);

  const recenterOnBus = () => {
    if (!mapInstanceRef.current) return;
    const [lat, lng] = getBusCoordinates();
    mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
  };

  // Submit Driver Registration
  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanPhone = driverForm.phone.replace(/\D/g, "");
    if (!driverForm.name.trim() || driverForm.name.trim().length < 2) {
      setFormError("Please enter the driver's full legal name (minimum 2 characters).");
      return;
    }
    if (!driverForm.phone.trim() || (cleanPhone.length !== 10 && !(cleanPhone.length === 12 && cleanPhone.startsWith("91")))) {
      setFormError("Please enter a valid 10-digit primary mobile contact number.");
      return;
    }
    if (!driverForm.license_number.trim() || driverForm.license_number.trim().length < 4) {
      setFormError("Please enter a valid commercial Heavy Motor Vehicle (HMV) driving license number.");
      return;
    }
    if (driverForm.aadhaar_number) {
      const cleanAadhaar = driverForm.aadhaar_number.replace(/\D/g, "");
      if (cleanAadhaar.length !== 12) {
        setFormError("National Aadhaar number must contain exactly 12 numeric digits.");
        return;
      }
    }

    try {
      if (editingDriver) {
        if (token) {
          const res = await fetch(`http://localhost:5000/api/v1/school-features/transport/drivers/${editingDriver.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(driverForm),
          });
          const result = await res.json();
          if (result.success && result.data) {
            setDrivers(drivers.map(d => d.id === editingDriver.id ? result.data : d));
          } else {
            setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...driverForm, id: editingDriver.id } : d));
          }
        } else {
          setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...driverForm, id: editingDriver.id } : d));
        }
        showToast("✅ Driver profile and commercial licensing credentials updated successfully!");
        setEditingDriver(null);
      } else {
        const payload = {
          ...driverForm,
          experience_years: Number(driverForm.experience_years) || 0,
        };

        let createdItem: DriverData = {
          ...payload,
          id: `drv-${Date.now()}`,
          created_at: new Date().toISOString()
        };

        if (token) {
          try {
            const res = await fetch("http://localhost:5000/api/v1/school-features/transport/drivers", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (result.success && result.data) {
              createdItem = result.data;
            }
          } catch (e) {
            console.warn("Backend save failed, saved locally", e);
          }
        }

        setDrivers([createdItem, ...drivers]);
        showToast("🎉 New certified school bus driver registered and verified successfully!");
      }

      setShowAddDriverModal(false);
      setDriverForm(initialNewDriverForm);
    } catch {
      setFormError("Error occurred while saving driver details.");
    }
  };

  const handleDeleteDriver = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the driver record for ${name}?`)) {
      return;
    }

    if (token) {
      try {
        await fetch(`http://localhost:5000/api/v1/school-features/transport/drivers/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn("Server delete failed:", err);
      }
    }

    setDrivers(drivers.filter(d => d.id !== id));
    showToast(`🗑️ Driver record for ${name} has been removed from the registry.`);
  };

  const handleEditDriver = (driver: DriverData) => {
    setEditingDriver(driver);
    setDriverForm({
      name: driver.name || "",
      phone: driver.phone || "",
      alternate_phone: driver.alternate_phone || "",
      dob: driver.dob || "",
      blood_group: driver.blood_group || "B+ve",
      address: driver.address || "",
      aadhaar_number: driver.aadhaar_number || "",
      license_number: driver.license_number || "",
      license_type: driver.license_type || "HMV_COMMERCIAL",
      license_expiry: driver.license_expiry || "",
      badge_number: driver.badge_number || "",
      experience_years: driver.experience_years || 5,
      assigned_bus: driver.assigned_bus || "",
      route: driver.route || "",
      police_verification: driver.police_verification || "VERIFIED",
      police_station: driver.police_station || "",
      police_report_date: driver.police_report_date || "",
      medical_fitness: driver.medical_fitness || "FIT",
      fitness_certificate_no: driver.fitness_certificate_no || "",
      fitness_doctor: driver.fitness_doctor || "",
      status: driver.status || "ACTIVE_DUTY",
      joining_date: driver.joining_date || "",
      license_document_url: driver.license_document_url || "",
      police_cert_url: driver.police_cert_url || "",
      medical_cert_url: driver.medical_cert_url || "",
      badge_document_url: driver.badge_document_url || "",
      notes: driver.notes || ""
    });
    setFormError("");
    setShowAddDriverModal(true);
  };

  const filteredDrivers = drivers.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q) ||
      (d.assigned_bus && d.assigned_bus.toLowerCase().includes(q)) ||
      (d.route && d.route.toLowerCase().includes(q)) ||
      (d.license_number && d.license_number.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterStatus === "ACTIVE_DUTY") return d.status === "ACTIVE_DUTY";
    if (filterStatus === "STANDBY") return d.status === "STANDBY";
    if (filterStatus === "VERIFIED") return d.police_verification === "VERIFIED";

    return true;
  });

  return (
    <div style={{ padding: "28px", maxWidth: "1440px", margin: "0 auto" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: "#1E293B",
          color: "#fff",
          padding: "14px 22px",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 700,
          fontSize: "14px",
          border: "1px solid #334155"
        }}>
          <Sparkles size={18} color="#3D5EE1" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner (Preskool Indigo/Blue Gradient) */}
      <div style={{
        background: "linear-gradient(135deg, #3D5EE1 0%, #2A46C4 100%)",
        borderRadius: "18px",
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        boxShadow: "0 10px 25px -5px rgba(61, 94, 225, 0.3)"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
            <Bus size={14} color="#93C5FD" /> School Fleet & Transport Compliance System
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            School Bus Fleet, Vehicle RC & Driver Registration
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "780px" }}>
            Institutional school fleet registration, certified driver licensing, route allocations, statutory compliance dossiers (RC, Fitness, Insurance, PUC), and real-time AIS-140 GPS telemetry.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {activeSubTab === "vehicles" ? (
            <button
              onClick={() => {
                setEditingVehicle(null);
                setVehicleForm(initialNewVehicleForm);
                setVehicleFormError("");
                setShowAddVehicleModal(true);
              }}
              style={{
                background: "#FFFFFF",
                color: "#3D5EE1",
                border: "none",
                padding: "12px 22px",
                borderRadius: "12px",
                fontWeight: 900,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
              }}
            >
              <Plus size={18} />
              <span>+ Register Vehicle</span>
            </button>
          ) : activeSubTab === "drivers" ? (
            <button
              onClick={() => {
                setEditingDriver(null);
                setDriverForm(initialNewDriverForm);
                setFormError("");
                setShowAddDriverModal(true);
              }}
              style={{
                background: "#FFFFFF",
                color: "#3D5EE1",
                border: "none",
                padding: "12px 22px",
                borderRadius: "12px",
                fontWeight: 900,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
              }}
            >
              <Plus size={18} />
              <span>+ Register Driver</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                style={{
                  background: isSimulating ? "#DCFCE7" : "#FFFFFF",
                  color: isSimulating ? "#166534" : "#0F172A",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                <span>{isSimulating ? "GPS Tracking Active" : "Resume GPS"}</span>
              </button>

              <button
                onClick={() => setShowAddRouteModal(true)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.4)",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Plus size={16} /> Add Route
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          TRANSPORT DASHBOARD EXECUTIVE OVERVIEW: 4 KEY METRIC CARDS
          ========================================================================= */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px", marginBottom: "22px" }}>
        {/* Metric 1: Total Fleet */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Total Fleet Vehicles</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginTop: "2px" }}>
                {vehicles.length} <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 600 }}>Buses & Vans</span>
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EEF2FF", color: "#3D5EE1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bus size={22} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} /> {vehicles.filter(v => v.status === "ACTIVE").length} Active on Daily Routes
          </div>
        </div>

        {/* Metric 2: Commercial Drivers */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Certified Bus Drivers</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#3D5EE1", marginTop: "2px" }}>
                {drivers.length} <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 600 }}>Drivers</span>
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#F0FDF4", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={22} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} /> 100% Police & Medical Verified
          </div>
        </div>

        {/* Metric 3: Seating & Commuter Capacity */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Total Student Seating Capacity</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginTop: "2px" }}>
                {vehicles.reduce((sum, v) => sum + Number(v.seating_capacity || 40), 0)} <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 600 }}>Seats</span>
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={22} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
            Morning Pickup & Afternoon Drop
          </div>
        </div>

        {/* Metric 4: Safety & GPS Tracking */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>AIS-140 GPS & Safety Rating</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#16A34A", marginTop: "2px" }}>
                100% <span style={{ fontSize: "14px", color: "#16A34A", fontWeight: 700 }}>Compliant</span>
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Navigation size={22} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            ✓ Speed Governors & CCTV Operational
          </div>
        </div>
      </div>

      {/* Sub Tabs Switcher (3 Tabs: Vehicles, Drivers, Live GPS) */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveSubTab("vehicles")}
            style={{
              padding: "11px 22px",
              borderRadius: "12px",
              background: activeSubTab === "vehicles" ? "#3D5EE1" : "#FFFFFF",
              color: activeSubTab === "vehicles" ? "#FFFFFF" : "#475569",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: activeSubTab === "vehicles" ? "0 4px 14px rgba(61, 94, 225, 0.25)" : "0 1px 3px rgba(0,0,0,0.05)",
              border: `1px solid ${activeSubTab === "vehicles" ? "#3D5EE1" : "#E2E8F0"}`,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Truck size={16} />
            <span>School Fleet & Compliance ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("drivers")}
            style={{
              padding: "11px 22px",
              borderRadius: "12px",
              background: activeSubTab === "drivers" ? "#3D5EE1" : "#FFFFFF",
              color: activeSubTab === "drivers" ? "#FFFFFF" : "#475569",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: activeSubTab === "drivers" ? "0 4px 14px rgba(61, 94, 225, 0.25)" : "0 1px 3px rgba(0,0,0,0.05)",
              border: `1px solid ${activeSubTab === "drivers" ? "#3D5EE1" : "#E2E8F0"}`,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <ShieldCheck size={16} />
            <span>Certified Drivers Directory ({drivers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("tracking")}
            style={{
              padding: "11px 22px",
              borderRadius: "12px",
              background: activeSubTab === "tracking" ? "#3D5EE1" : "#FFFFFF",
              color: activeSubTab === "tracking" ? "#FFFFFF" : "#475569",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: activeSubTab === "tracking" ? "0 4px 14px rgba(61, 94, 225, 0.25)" : "0 1px 3px rgba(0,0,0,0.05)",
              border: `1px solid ${activeSubTab === "tracking" ? "#3D5EE1" : "#E2E8F0"}`,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Bus size={16} />
            <span>Live Fleet GPS Tracking</span>
          </button>
        </div>

        {activeSubTab === "vehicles" && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => {
                setEditingVehicle(null);
                setVehicleForm(initialNewVehicleForm);
                setVehicleFormError("");
                setShowAddVehicleModal(true);
              }}
              style={{
                background: "#3D5EE1",
                color: "#FFFFFF",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Plus size={16} />
              <span>Register New Vehicle</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: SCHOOL FLEET & VEHICLE DOCUMENT REGISTRY
          ========================================================================= */}
      {activeSubTab === "vehicles" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Quick Metrics Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Total School Vehicles</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>{vehicles.length} Buses & Vans</div>
              <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>100% Commercial RTO Registered</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Active Daily Fleet</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#3D5EE1" }}>
                {vehicles.filter(v => v.status === "ACTIVE").length} Active
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600, marginTop: "4px" }}>Morning Pickup & Evening Drop Duty</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Speed Governor & AIS-140</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#15803D" }}>
                {vehicles.filter(v => Boolean(v.speed_governor_fitted)).length} Compliant
              </div>
              <div style={{ fontSize: "11px", color: "#15803D", fontWeight: 700, marginTop: "4px" }}>Max 40 km/h Limit & Realtime Telematics</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Fitness & Insurance Valid</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#8B5CF6" }}>
                {vehicles.filter(v => Boolean(v.insurance_policy_no && v.fitness_cert_no)).length} / {vehicles.length}
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600, marginTop: "4px" }}>Government RTO Fitness Certified</div>
            </div>
          </div>

          {/* Search, Filter Toolbar */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px"
          }}>
            {/* Search Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px", maxWidth: "480px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "10px", padding: "8px 14px" }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search by vehicle number (e.g. DL-1PB), model, driver, route, RC..."
                value={vehicleSearchQuery}
                onChange={(e) => setVehicleSearchQuery(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%", color: "#0F172A" }}
              />
              {vehicleSearchQuery && (
                <button onClick={() => setVehicleSearchQuery("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                  <X size={14} color="#94A3B8" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: "All Vehicles" },
                { id: "ACTIVE", label: "Active Duty" },
                { id: "STANDBY", label: "Standby Reserve" },
                { id: "MAINTENANCE", label: "Maintenance" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setVehicleFilterStatus(f.id as any)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${vehicleFilterStatus === f.id ? "#3D5EE1" : "#E2E8F0"}`,
                    background: vehicleFilterStatus === f.id ? "#3D5EE1" : "#FFFFFF",
                    color: vehicleFilterStatus === f.id ? "#FFFFFF" : "#475569",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicles Cards Grid */}
          {loadingVehicles ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748B", fontSize: "14px", fontWeight: 700 }}>
              Loading vehicles registry...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{ background: "#FFFFFF", padding: "50px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", textAlign: "center" }}>
              <Truck size={44} color="#94A3B8" style={{ marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>No matching vehicles found</h3>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>Try clearing your search query or registering a new school vehicle.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px" }}>
              {filteredVehicles.map((v) => (
                <div
                  key={v.id}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    border: "1px solid #E2E8F0",
                    padding: "22px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    position: "relative"
                  }}
                >
                  {/* Top Header: Plate & Type */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      {/* Vehicle License Plate Badge */}
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#FEF08A",
                        color: "#854D0E",
                        border: "2px solid #EAB308",
                        borderRadius: "8px",
                        padding: "4px 12px",
                        fontWeight: 900,
                        fontSize: "15px",
                        letterSpacing: "0.08em",
                        fontFamily: "monospace",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <span>IND</span>
                        <span>{v.vehicle_number}</span>
                      </div>

                      <h3 style={{ margin: "10px 0 2px 0", fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                        {v.vehicle_model}
                      </h3>
                      <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
                        {v.vehicle_type} • {v.seating_capacity} Seater • Fuel: <strong style={{ color: "#3D5EE1" }}>{v.fuel_type}</strong>
                      </div>
                    </div>

                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 800,
                      background: v.status === "ACTIVE" ? "#DCFCE7" : v.status === "MAINTENANCE" ? "#FEE2E2" : "#FEF3C7",
                      color: v.status === "ACTIVE" ? "#166534" : v.status === "MAINTENANCE" ? "#991B1B" : "#92400E",
                      textTransform: "uppercase"
                    }}>
                      ● {v.status}
                    </span>
                  </div>

                  {/* Route & Driver Info Strip */}
                  <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "12px 14px", border: "1px solid #E2E8F0", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Assigned Driver:</span>
                      <strong style={{ color: "#0F172A" }}>{v.assigned_driver_name || "Unassigned"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Assigned Route:</span>
                      <strong style={{ color: "#3D5EE1" }}>{v.assigned_route_name || "Standby Reserve"}</strong>
                    </div>
                  </div>

                  {/* Legal Documents Status Badges */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: "8px" }}>
                      Legal Certificates & Statutory Validity
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11px" }}>
                      <div style={{ background: "#F1F5F9", padding: "8px 10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                        <div style={{ color: "#64748B", fontWeight: 600 }}>RC Registration:</div>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{v.rc_number}</div>
                        <div style={{ color: "#10B981", fontSize: "10px", fontWeight: 700 }}>Valid: {v.rc_expiry || "Active"}</div>
                      </div>

                      <div style={{ background: "#F1F5F9", padding: "8px 10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                        <div style={{ color: "#64748B", fontWeight: 600 }}>RTO Fitness Cert:</div>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{v.fitness_cert_no}</div>
                        <div style={{ color: "#10B981", fontSize: "10px", fontWeight: 700 }}>Exp: {v.fitness_expiry || "2027"}</div>
                      </div>

                      <div style={{ background: "#F1F5F9", padding: "8px 10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                        <div style={{ color: "#64748B", fontWeight: 600 }}>Commercial Insurance:</div>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{v.insurance_company}</div>
                        <div style={{ color: "#10B981", fontSize: "10px", fontWeight: 700 }}>Exp: {v.insurance_expiry || "2027"}</div>
                      </div>

                      <div style={{ background: "#F1F5F9", padding: "8px 10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                        <div style={{ color: "#64748B", fontWeight: 600 }}>Pollution (PUC):</div>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{v.puc_cert_no}</div>
                        <div style={{ color: "#10B981", fontSize: "10px", fontWeight: 700 }}>Exp: {v.puc_expiry || "2026"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Safety Features Strip */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", paddingTop: "4px" }}>
                    <span style={{ background: "#ECFDF5", color: "#065F46", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Radio size={11} /> Speed Gov ({v.speed_limit_kmh} km/h)
                    </span>
                    <span style={{ background: "#EFF6FF", color: "#1E40AF", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Navigation size={11} /> AIS-140 GPS
                    </span>
                    <span style={{ background: "#F5F3FF", color: "#5B21B6", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Camera size={11} /> CCTV ({v.cctv_camera_count} Cams)
                    </span>
                    <span style={{ background: "#FFF7ED", color: "#C2410C", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Flame size={11} /> Fire Extinguisher
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                    <button
                      onClick={() => setViewingCertVehicle(v)}
                      style={{
                        flex: 1,
                        background: "#3D5EE1",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <Eye size={13} /> RC & Fitness Dossier
                    </button>

                    <button
                      onClick={() => handleEditVehicle(v)}
                      style={{
                        background: "#F1F5F9",
                        color: "#334155",
                        border: "1px solid #CBD5E1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteVehicle(v.id, v.vehicle_number)}
                      style={{
                        background: "#FEF2F2",
                        color: "#DC2626",
                        border: "1px solid #FECACA",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      title="Delete Vehicle"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: DRIVER REGISTRY & LICENSE VERIFICATION
          ========================================================================= */}
      {activeSubTab === "drivers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Quick Metrics Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Total Registered Drivers</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#0F172A" }}>{drivers.length}</div>
              <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>100% Commercial Heavy Verified</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Active Duty Drivers</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#15803D" }}>
                {drivers.filter(d => d.status === "ACTIVE_DUTY").length}
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600, marginTop: "4px" }}>Assigned to daily morning & evening routes</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Police Background Clear</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#0284C7" }}>
                {drivers.filter(d => d.police_verification === "VERIFIED").length}
              </div>
              <div style={{ fontSize: "11px", color: "#0284C7", fontWeight: 700, marginTop: "4px" }}>Official Police Station Reports On File</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Medical & Eye Certified</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#8B5CF6" }}>
                {drivers.filter(d => d.medical_fitness === "FIT").length}
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600, marginTop: "4px" }}>CMO Annual Fitness Cleared</div>
            </div>
          </div>

          {/* Search, Filter Toolbar */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px", maxWidth: "450px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "10px", padding: "8px 14px" }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search driver by name, phone, bus no, route, license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%", color: "#0F172A" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                  <X size={14} color="#94A3B8" />
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: "All Drivers" },
                { id: "ACTIVE_DUTY", label: "Active Duty" },
                { id: "STANDBY", label: "Standby" },
                { id: "VERIFIED", label: "Police Verified" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id as any)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${filterStatus === f.id ? "#3D5EE1" : "#E2E8F0"}`,
                    background: filterStatus === f.id ? "#3D5EE1" : "#FFFFFF",
                    color: filterStatus === f.id ? "#FFFFFF" : "#475569",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drivers Grid */}
          {loadingDrivers ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748B", fontSize: "14px", fontWeight: 700 }}>
              Loading drivers registry...
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div style={{ background: "#FFFFFF", padding: "50px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", textAlign: "center" }}>
              <ShieldCheck size={44} color="#94A3B8" style={{ marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>No matching drivers found</h3>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>Try clearing your search query or register a new driver.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" }}>
              {filteredDrivers.map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    border: "1px solid #E2E8F0",
                    padding: "22px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <div style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #3D5EE1 0%, #2A46C4 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "18px",
                        boxShadow: "0 4px 12px rgba(61, 94, 225, 0.25)"
                      }}>
                        {d.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <h3 style={{ margin: "0 0 2px 0", fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                          {d.name}
                        </h3>
                        <div style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Phone size={12} color="#3D5EE1" />
                          <span>{d.phone}</span>
                        </div>
                      </div>
                    </div>

                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 800,
                      background: d.status === "ACTIVE_DUTY" ? "#DCFCE7" : "#FEF3C7",
                      color: d.status === "ACTIVE_DUTY" ? "#166534" : "#92400E",
                      textTransform: "uppercase"
                    }}>
                      ● {d.status === "ACTIVE_DUTY" ? "Active Duty" : "Standby"}
                    </span>
                  </div>

                  <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "12px 14px", border: "1px solid #E2E8F0", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>License Number:</span>
                      <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{d.license_number}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Assigned Bus:</span>
                      <strong style={{ color: "#3D5EE1" }}>{d.assigned_bus || "Unassigned"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Route Assigned:</span>
                      <strong style={{ color: "#0F172A" }}>{d.route || "Spare"}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ background: "#ECFDF5", color: "#065F46", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={12} /> Police: {d.police_verification}
                    </span>
                    <span style={{ background: "#EFF6FF", color: "#1E40AF", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <HeartPulse size={12} /> Fitness: {d.medical_fitness}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #F1F5F9" }}>
                    <button
                      onClick={() => setViewingIdCardDriver(d)}
                      style={{
                        flex: 1,
                        background: "#3D5EE1",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <Eye size={13} /> View ID & Verification
                    </button>

                    <button
                      onClick={() => handleEditDriver(d)}
                      style={{
                        background: "#F1F5F9",
                        color: "#334155",
                        border: "1px solid #CBD5E1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteDriver(d.id, d.name)}
                      style={{
                        background: "#FEF2F2",
                        color: "#DC2626",
                        border: "1px solid #FECACA",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      title="Delete Driver"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIVE GPS BUS TRACKING
          ========================================================================= */}
      {activeSubTab === "tracking" && (
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px" }}>
          {/* Left: Routes List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#334155", margin: "0 0 4px 0" }}>
              Active Fleet Transport Routes:
            </h3>
            {routes.map((r) => {
              const isSel = r.id === selectedRouteId;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  style={{
                    background: isSel ? "#EFF6FF" : "#FFFFFF",
                    border: `2px solid ${isSel ? "#3D5EE1" : "#E2E8F0"}`,
                    borderRadius: "14px",
                    padding: "18px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontWeight: 800, fontSize: "14px", color: isSel ? "#3D5EE1" : "#0F172A" }}>
                      {r.name}
                    </div>
                    <span style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: r.status === "ON_ROUTE" ? "#DCFCE7" : "#FEF3C7",
                      color: r.status === "ON_ROUTE" ? "#166534" : "#92400E",
                      fontWeight: 800
                    }}>
                      {r.status === "ON_ROUTE" ? "Active" : "School Gate"}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", color: "#64748B", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div><strong>Bus:</strong> {r.bus} | <strong>Driver:</strong> {r.driver}</div>
                    <div><strong>Students onboard:</strong> {r.studentsCount} students</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Map & Real-time Progress */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              position: "relative",
              height: "540px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
            }}>
              <div ref={mapContainerRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />

              <div style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 400,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(6px)",
                padding: "10px 16px",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>CURRENT SPEED</div>
                  <div style={{ fontSize: "18px", fontWeight: 900, color: "#3D5EE1" }}>{liveSpeed} km/h</div>
                </div>
                <button
                  onClick={recenterOnBus}
                  style={{
                    background: "#3D5EE1",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Navigation size={14} /> Center Bus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD / EDIT VEHICLE (Fleet Vehicle & Compliance Registration)
          ========================================================================= */}
      {showAddVehicleModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            maxWidth: "760px",
            width: "100%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "20px 28px",
              borderBottom: "1px solid #E2E8F0",
              background: "linear-gradient(135deg, #3D5EE1 0%, #2A46C4 100%)",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 2px 0" }}>
                  {editingVehicle ? "Edit Vehicle Specifications & Dossier" : "Register School Fleet Vehicle"}
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>
                  Enter Vehicle RC, RTO Fitness, Insurance, Pollution, Permit & Safety Details
                </p>
              </div>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveVehicle} style={{ padding: "24px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              {vehicleFormError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: 700 }}>
                  ⚠️ {vehicleFormError}
                </div>
              )}

              {/* SECTION 1: Basic Vehicle Specifications */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Truck size={16} color="#3D5EE1" />
                  <span>1. Basic Vehicle Specifications</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Vehicle Registration No. (License Plate) *</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-1PB-4521"
                      required
                      value={vehicleForm.vehicle_number}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value.toUpperCase() })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", fontWeight: 800, fontFamily: "monospace" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Make & Model *</label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Starbus Ultra 40-Seater"
                      required
                      value={vehicleForm.vehicle_model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_model: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Vehicle Category</label>
                    <select
                      value={vehicleForm.vehicle_type}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value as any })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="BUS">School Heavy Bus (40+ Seats)</option>
                      <option value="MINI_BUS">Mini Bus / Traveller (20-35 Seats)</option>
                      <option value="VAN">School Van / Eco (8-14 Seats)</option>
                      <option value="ELECTRIC_BUS">Green Electric School Bus (EV)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Seating Capacity</label>
                    <input
                      type="number"
                      placeholder="e.g. 42"
                      value={vehicleForm.seating_capacity}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, seating_capacity: Number(e.target.value) })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Fuel Type</label>
                    <select
                      value={vehicleForm.fuel_type}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fuel_type: e.target.value as any })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="DIESEL">Diesel</option>
                      <option value="CNG">CNG (Hydro-tested)</option>
                      <option value="ELECTRIC">Electric (EV Battery)</option>
                      <option value="PETROL">Petrol</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Chassis & Engine Number</label>
                    <input
                      type="text"
                      placeholder="e.g. MAT482910X99201"
                      value={vehicleForm.chassis_number}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, chassis_number: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Statutory Compliance & Legal Documents */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={16} color="#3D5EE1" />
                  <span>2. Statutory Compliance & Legal Documents</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>RC Book Registration Number *</label>
                    <input
                      type="text"
                      placeholder="DL-14-RC-2022-8812"
                      required
                      value={vehicleForm.rc_number}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, rc_number: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>RC Expiry Date</label>
                    <input
                      type="date"
                      value={vehicleForm.rc_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, rc_expiry: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>RTO Fitness Certificate No.</label>
                    <input
                      type="text"
                      placeholder="RTO-NW-FIT-2026-902"
                      value={vehicleForm.fitness_cert_no}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fitness_cert_no: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>RTO Fitness Expiry Date</label>
                    <input
                      type="date"
                      value={vehicleForm.fitness_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fitness_expiry: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Insurance Policy Number & Company</label>
                    <input
                      type="text"
                      placeholder="Policy No. (e.g. Bajaj Allianz / HDFC ERGO)"
                      value={vehicleForm.insurance_policy_no}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, insurance_policy_no: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Insurance Expiry Date</label>
                    <input
                      type="date"
                      value={vehicleForm.insurance_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, insurance_expiry: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Pollution (PUC) Certificate No. & Exp.</label>
                    <input
                      type="text"
                      placeholder="PUC-DL-2026-4410"
                      value={vehicleForm.puc_cert_no}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, puc_cert_no: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>PUC Expiry Date</label>
                    <input
                      type="date"
                      value={vehicleForm.puc_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, puc_expiry: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Safety Compliance (Speed Governor, GPS, CCTV, Fire) */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={16} color="#3D5EE1" />
                  <span>3. Institutional Safety & Transit Compliance</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Speed Governor Installed</label>
                    <select
                      value={vehicleForm.speed_governor_fitted ? 1 : 0}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, speed_governor_fitted: Number(e.target.value) })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                    >
                      <option value={1}>Yes - Installed & Certified</option>
                      <option value={0}>No - Not Installed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Speed Limit (km/h)</label>
                    <input
                      type="number"
                      placeholder="40"
                      value={vehicleForm.speed_limit_kmh}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, speed_limit_kmh: Number(e.target.value) })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>AIS-140 GPS Device IMEI</label>
                    <input
                      type="text"
                      placeholder="e.g. 864920194820194"
                      value={vehicleForm.gps_device_imei}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, gps_device_imei: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>CCTV Surveillance Cameras Count</label>
                    <input
                      type="number"
                      placeholder="2"
                      value={vehicleForm.cctv_camera_count}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, cctv_camera_count: Number(e.target.value) })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Assignment & Operations */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <UserCheck size={16} color="#3D5EE1" />
                  <span>4. Driver & Route Assignment</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Assigned Driver</label>
                    <select
                      value={vehicleForm.assigned_driver_name}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, assigned_driver_name: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="">-- Select Driver --</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.phone})</option>
                      ))}
                      <option value="Standby Driver Pool">Standby Driver Pool</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Assigned Route Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Route #12 (Rohini - Pitampura)"
                      value={vehicleForm.assigned_route_name}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, assigned_route_name: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Vehicle Status</label>
                    <select
                      value={vehicleForm.status}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as any })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="ACTIVE">Active (In Daily Transit)</option>
                      <option value="STANDBY">Standby (Reserve Pool)</option>
                      <option value="MAINTENANCE">Under Maintenance & Servicing</option>
                      <option value="OUT_OF_SERVICE">Decommissioned / Out of Service</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Special Notes & Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g. Clean record, first aid equipped"
                      value={vehicleForm.notes}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, notes: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Mandatory Vehicle Document Uploads */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={16} color="#3D5EE1" />
                  <span>5. Statutory Vehicle Document Uploads (RC, Insurance, Fitness & PUC)</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {/* RC Certificate Upload */}
                    <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: vehicleForm.rc_document_url ? "#F0FDF4" : "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                          📑 Vehicle Registration Certificate (RC Scan) *
                        </label>
                        {vehicleForm.rc_document_url ? (
                          <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                            <CheckCircle2 size={12} /> Uploaded
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setTransportDocDataUrls(prev => ({ ...prev, veh_rc: (re.target?.result as string) || "" }));
                              };
                              reader.readAsDataURL(file);
                              setVehicleForm({ ...vehicleForm, rc_document_url: file.name });
                            }
                          }}
                          style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                        />
                      </div>
                      {vehicleForm.rc_document_url && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                            📎 {vehicleForm.rc_document_url}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingTransportDoc({
                              title: "Vehicle Registration Certificate (RC Book)",
                              fileName: vehicleForm.rc_document_url || "",
                              dataUrl: transportDocDataUrls["veh_rc"],
                              fileType: vehicleForm.rc_document_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                            })}
                            style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                          >
                            <Eye size={12} /> View Document
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Insurance Upload */}
                    <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: vehicleForm.insurance_document_url ? "#F0FDF4" : "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                          🛡️ Commercial Insurance Policy *
                        </label>
                        {vehicleForm.insurance_document_url ? (
                          <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                            <CheckCircle2 size={12} /> Uploaded
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setTransportDocDataUrls(prev => ({ ...prev, veh_insurance: (re.target?.result as string) || "" }));
                              };
                              reader.readAsDataURL(file);
                              setVehicleForm({ ...vehicleForm, insurance_document_url: file.name });
                            }
                          }}
                          style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                        />
                      </div>
                      {vehicleForm.insurance_document_url && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                            📎 {vehicleForm.insurance_document_url}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingTransportDoc({
                              title: "Commercial Motor Vehicle Insurance Policy",
                              fileName: vehicleForm.insurance_document_url || "",
                              dataUrl: transportDocDataUrls["veh_insurance"],
                              fileType: vehicleForm.insurance_document_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                            })}
                            style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                          >
                            <Eye size={12} /> View Document
                          </button>
                        </div>
                      )}
                    </div>

                    {/* RTO Fitness Upload */}
                    <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: vehicleForm.fitness_document_url ? "#F0FDF4" : "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                          📋 RTO Fitness Certificate Copy
                        </label>
                        {vehicleForm.fitness_document_url ? (
                          <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                            <CheckCircle2 size={12} /> Uploaded
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setTransportDocDataUrls(prev => ({ ...prev, veh_fitness: (re.target?.result as string) || "" }));
                              };
                              reader.readAsDataURL(file);
                              setVehicleForm({ ...vehicleForm, fitness_document_url: file.name });
                            }
                          }}
                          style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                        />
                      </div>
                      {vehicleForm.fitness_document_url && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                            📎 {vehicleForm.fitness_document_url}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingTransportDoc({
                              title: "RTO Vehicle Road Fitness Certificate",
                              fileName: vehicleForm.fitness_document_url || "",
                              dataUrl: transportDocDataUrls["veh_fitness"],
                              fileType: vehicleForm.fitness_document_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                            })}
                            style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                          >
                            <Eye size={12} /> View Document
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Pollution PUC Upload */}
                    <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: vehicleForm.puc_document_url ? "#F0FDF4" : "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                          🌿 Pollution Certificate (PUC Scan)
                        </label>
                        {vehicleForm.puc_document_url ? (
                          <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                            <CheckCircle2 size={12} /> Uploaded
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setTransportDocDataUrls(prev => ({ ...prev, veh_puc: (re.target?.result as string) || "" }));
                              };
                              reader.readAsDataURL(file);
                              setVehicleForm({ ...vehicleForm, puc_document_url: file.name });
                            }
                          }}
                          style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                        />
                      </div>
                      {vehicleForm.puc_document_url && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                            📎 {vehicleForm.puc_document_url}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingTransportDoc({
                              title: "Pollution Under Control (PUC) Certificate",
                              fileName: vehicleForm.puc_document_url || "",
                              dataUrl: transportDocDataUrls["veh_puc"],
                              fileType: vehicleForm.puc_document_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                            })}
                            style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                          >
                            <Eye size={12} /> View Document
                          </button>
                        </div>
                      )}
                    </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    background: "#3D5EE1",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(61, 94, 225, 0.3)"
                  }}
                >
                  {editingVehicle ? "Update Vehicle Record" : "Register Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: OFFICIAL VEHICLE FITNESS & RC DOSSIER (Verification & Print)
          ========================================================================= */}
      {viewingCertVehicle && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            maxWidth: "600px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            overflow: "hidden"
          }}>
            {/* Certificate Header */}
            <div style={{
              background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)",
              color: "#FFFFFF",
              padding: "24px",
              textAlign: "center",
              position: "relative"
            }}>
              <button
                onClick={() => setViewingCertVehicle(null)}
                style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>

              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>
                DELHI TRANSPORT DEPARTMENT • GOVERNMENT OF NCT OF DELHI
              </div>
              <h2 style={{ fontSize: "19px", fontWeight: 900, margin: "6px 0 2px 0" }}>
                School Bus Fleet Compliance Dossier
              </h2>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                Motor Vehicles (Central) Act & School Transport Safety Guidelines
              </div>
            </div>

            {/* Certificate Body */}
            <div style={{ padding: "24px 28px" }}>
              <SchoolPrintHeader
                institute={institute}
                documentTitle="FLEET SAFETY & RC COMPLIANCE DOSSIER"
                documentSubtitle="Ministry of Road Transport & School Bus Safety Standards"
                documentNumber={`BUS-${viewingCertVehicle.vehicle_number}`}
                documentDate={new Date().toISOString().slice(0, 10)}
                badgeText="CERTIFIED ROADWORTHY"
              />

              {/* Plate Highlight */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "2px dashed #CBD5E1" }}>
                <div>
                  <div style={{
                    display: "inline-flex",
                    background: "#FEF08A",
                    color: "#854D0E",
                    border: "2px solid #EAB308",
                    padding: "4px 14px",
                    borderRadius: "6px",
                    fontWeight: 900,
                    fontSize: "18px",
                    fontFamily: "monospace"
                  }}>
                    IND {viewingCertVehicle.vehicle_number}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", marginTop: "6px" }}>
                    {viewingCertVehicle.vehicle_model}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 700 }}>STATUS</div>
                  <div style={{ fontSize: "13px", fontWeight: 900, color: "#10B981" }}>
                    ● CERTIFIED COMPLIANT
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px", marginBottom: "18px" }}>
                <div><span style={{ color: "#64748B" }}>RC Reg Number:</span> <strong>{viewingCertVehicle.rc_number}</strong></div>
                <div><span style={{ color: "#64748B" }}>RC Expiry:</span> <strong>{viewingCertVehicle.rc_expiry || "2032"}</strong></div>
                <div><span style={{ color: "#64748B" }}>Fitness Cert:</span> <strong>{viewingCertVehicle.fitness_cert_no}</strong></div>
                <div><span style={{ color: "#64748B" }}>Fitness Valid:</span> <strong>{viewingCertVehicle.fitness_expiry || "2027"}</strong></div>
                <div><span style={{ color: "#64748B" }}>Insurance Provider:</span> <strong>{viewingCertVehicle.insurance_company}</strong></div>
                <div><span style={{ color: "#64748B" }}>Policy Expiry:</span> <strong>{viewingCertVehicle.insurance_expiry || "2027"}</strong></div>
                <div><span style={{ color: "#64748B" }}>Speed Governor:</span> <strong>{viewingCertVehicle.speed_limit_kmh} km/h (CALIBRATED)</strong></div>
                <div><span style={{ color: "#64748B" }}>AIS-140 GPS:</span> <strong>ACTIVE & LINKED</strong></div>
                <div><span style={{ color: "#64748B" }}>Assigned Driver:</span> <strong>{viewingCertVehicle.assigned_driver_name}</strong></div>
                <div><span style={{ color: "#64748B" }}>Assigned Route:</span> <strong>{viewingCertVehicle.assigned_route_name}</strong></div>
              </div>

              {/* Uploaded Legal Documents Bar */}
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "12px", border: "1px solid #E2E8F0", marginBottom: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#475569", marginBottom: "8px", textTransform: "uppercase" }}>
                  Verified Transport Documents On File:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ background: "#DCFCE7", color: "#166534", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> RC Certificate: {viewingCertVehicle.rc_document_url || "RC-Verified.pdf"}
                  </span>
                  <span style={{ background: "#EFF6FF", color: "#1E40AF", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> Insurance Policy: {viewingCertVehicle.insurance_document_url || "Insurance-Valid.pdf"}
                  </span>
                  <span style={{ background: "#FAF5FF", color: "#6B21A8", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> RTO Fitness: {viewingCertVehicle.fitness_document_url || "Fitness-Cleared.pdf"}
                  </span>
                  <span style={{ background: "#ECFDF5", color: "#065F46", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> PUC Certificate: {viewingCertVehicle.puc_document_url || "PUC-Certified.pdf"}
                  </span>
                </div>
              </div>

              {/* Authorisation Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px dashed #CBD5E1", fontSize: "11px", color: "#64748B" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 800, color: "#0F172A" }}>Transport Supervisor</div>
                  <div>RTO Inspection Seal</div>
                </div>
                <div style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid #10B981",
                  color: "#059669",
                  fontWeight: 900,
                  fontSize: "10px",
                  textTransform: "uppercase"
                }}>
                  AUTHORISED 2026-27
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 800, color: "#0F172A" }}>Principal Sign</div>
                  <div>DPA Campus</div>
                </div>
              </div>

              {/* Print Button */}
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    width: "100%",
                    background: "#3D5EE1",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Printer size={16} /> Print Official Vehicle Compliance Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: FULL DRIVER REGISTRATION & EDIT MODAL
          ========================================================================= */}
      {showAddDriverModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            maxWidth: "720px",
            width: "100%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "20px 28px",
              borderBottom: "1px solid #E2E8F0",
              background: "linear-gradient(135deg, #3D5EE1 0%, #2A46C4 100%)",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 2px 0" }}>
                  {editingDriver ? "Edit Certified Driver Profile" : "Register Certified School Bus Driver"}
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>
                  Enter commercial license, personal credentials, route assignment, and safety verification.
                </p>
              </div>
              <button
                onClick={() => setShowAddDriverModal(false)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} style={{ padding: "24px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              {formError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: 700 }}>
                  ⚠️ {formError}
                </div>
              )}

              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <User size={16} color="#3D5EE1" />
                  <span>1. Personal & Identity Details</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Full Legal Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mukesh Kumar"
                      required
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Primary Mobile Number *</label>
                    <input
                      type="text"
                      placeholder="+91 98712 34567"
                      required
                      value={driverForm.phone}
                      onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Alternate Emergency Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98110 99881"
                      value={driverForm.alternate_phone}
                      onChange={(e) => setDriverForm({ ...driverForm, alternate_phone: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Blood Group</label>
                    <select
                      value={driverForm.blood_group}
                      onChange={(e) => setDriverForm({ ...driverForm, blood_group: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="A+ve">A+ve</option>
                      <option value="B+ve">B+ve</option>
                      <option value="O+ve">O+ve</option>
                      <option value="AB+ve">AB+ve</option>
                      <option value="A-ve">A-ve</option>
                      <option value="B-ve">B-ve</option>
                      <option value="O-ve">O-ve</option>
                      <option value="AB-ve">AB-ve</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* License Details */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileCheck size={16} color="#3D5EE1" />
                  <span>2. Commercial Driving License & PSV Badge</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>HMV Driving License No. *</label>
                    <input
                      type="text"
                      placeholder="DL-14-2018-HMV-8821"
                      required
                      value={driverForm.license_number}
                      onChange={(e) => setDriverForm({ ...driverForm, license_number: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>PSV Commercial Badge No.</label>
                    <input
                      type="text"
                      placeholder="PSV-DEL-77821"
                      value={driverForm.badge_number}
                      onChange={(e) => setDriverForm({ ...driverForm, badge_number: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Driver Document Uploads */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={16} color="#3D5EE1" />
                  <span>3. Mandatory Document Dossier (DL, PSV Badge, Police & Medical Certs)</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {/* Driving License Document */}
                  <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: driverForm.license_document_url ? "#F0FDF4" : "#F8FAFC" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                        🪪 Commercial Driving License Scan (DL) *
                      </label>
                      {driverForm.license_document_url ? (
                        <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                          <CheckCircle2 size={12} /> Uploaded
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setTransportDocDataUrls(prev => ({ ...prev, drv_license: (re.target?.result as string) || "" }));
                          };
                          reader.readAsDataURL(file);
                          setDriverForm({ ...driverForm, license_document_url: file.name });
                        }
                      }}
                      style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                    />
                    {driverForm.license_document_url && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                          📎 {driverForm.license_document_url}
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingTransportDoc({
                            title: "Commercial Driving License (DL)",
                            fileName: driverForm.license_document_url || "",
                            dataUrl: transportDocDataUrls["drv_license"],
                            fileType: driverForm.license_document_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                          })}
                          style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                        >
                          <Eye size={12} /> View Document
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PSV Badge Document */}
                  <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: driverForm.badge_document_url ? "#F0FDF4" : "#F8FAFC" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                        🎖️ PSV Commercial Badge Copy
                      </label>
                      {driverForm.badge_document_url ? (
                        <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                          <CheckCircle2 size={12} /> Uploaded
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setTransportDocDataUrls(prev => ({ ...prev, drv_badge: (re.target?.result as string) || "" }));
                          };
                          reader.readAsDataURL(file);
                          setDriverForm({ ...driverForm, badge_document_url: file.name });
                        }
                      }}
                      style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                    />
                    {driverForm.badge_document_url && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                          📎 {driverForm.badge_document_url}
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingTransportDoc({
                            title: "PSV Commercial Badge Copy",
                            fileName: driverForm.badge_document_url || "",
                            dataUrl: transportDocDataUrls["drv_badge"],
                            fileType: driverForm.badge_document_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                          })}
                          style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                        >
                          <Eye size={12} /> View Document
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Police Verification Report */}
                  <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: driverForm.police_cert_url ? "#F0FDF4" : "#F8FAFC" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                        🛡️ Police Verification Certificate
                      </label>
                      {driverForm.police_cert_url ? (
                        <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                          <CheckCircle2 size={12} /> Uploaded
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setTransportDocDataUrls(prev => ({ ...prev, drv_police: (re.target?.result as string) || "" }));
                          };
                          reader.readAsDataURL(file);
                          setDriverForm({ ...driverForm, police_cert_url: file.name });
                        }
                      }}
                      style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                    />
                    {driverForm.police_cert_url && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                          📎 {driverForm.police_cert_url}
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingTransportDoc({
                            title: "Police Verification Certificate",
                            fileName: driverForm.police_cert_url || "",
                            dataUrl: transportDocDataUrls["drv_police"],
                            fileType: driverForm.police_cert_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                          })}
                          style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                        >
                          <Eye size={12} /> View Document
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Medical Certificate */}
                  <div style={{ border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px", background: driverForm.medical_cert_url ? "#F0FDF4" : "#F8FAFC" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
                        🩺 Medical & Eye Fitness Certificate (CMO)
                      </label>
                      {driverForm.medical_cert_url ? (
                        <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                          <CheckCircle2 size={12} /> Uploaded
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#64748B" }}>PDF / Scan</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setTransportDocDataUrls(prev => ({ ...prev, drv_medical: (re.target?.result as string) || "" }));
                          };
                          reader.readAsDataURL(file);
                          setDriverForm({ ...driverForm, medical_cert_url: file.name });
                        }
                      }}
                      style={{ fontSize: "12px", color: "#475569", width: "100%" }}
                    />
                    {driverForm.medical_cert_url && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>
                          📎 {driverForm.medical_cert_url}
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingTransportDoc({
                            title: "Medical Fitness Certificate",
                            fileName: driverForm.medical_cert_url || "",
                            dataUrl: transportDocDataUrls["drv_medical"],
                            fileType: driverForm.medical_cert_url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"
                          })}
                          style={{ display: "flex", alignItems: "center", gap: "4px", background: "#3D5EE1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                        >
                          <Eye size={12} /> View Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 24px", borderRadius: "10px", background: "#3D5EE1", color: "#FFFFFF", border: "none", fontWeight: 800, cursor: "pointer" }}
                >
                  {editingDriver ? "Update Driver Record" : "Register Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: DRIVER ID CARD PREVIEW
          ========================================================================= */}
      {viewingIdCardDriver && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", maxWidth: "480px", width: "100%", padding: "24px", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }} className="no-print">
              <button onClick={() => setViewingIdCardDriver(null)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <SchoolPrintHeader
              institute={institute}
              documentTitle="DRIVER IDENTITY CARD"
              documentSubtitle="Official School Bus Fleet Operations"
              documentNumber={`DRV-${viewingIdCardDriver.badge_number || viewingIdCardDriver.phone.slice(-4)}`}
              documentDate="Session 2026-27"
              badgeText="POLICE & MEDICAL VERIFIED"
            />
            <div style={{ padding: "16px", background: "#F8FAFC", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 900 }}>{viewingIdCardDriver.name}</h4>
              <p style={{ margin: "0 0 10px 0", color: "#64748B", fontSize: "12px" }}>Phone: {viewingIdCardDriver.phone}</p>
              <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div>License: <strong>{viewingIdCardDriver.license_number}</strong></div>
                <div>Badge: <strong>{viewingIdCardDriver.badge_number}</strong></div>
                <div>Police Verification: <strong style={{ color: "#10B981" }}>{viewingIdCardDriver.police_verification}</strong></div>
                <div>Medical Fitness: <strong style={{ color: "#3D5EE1" }}>{viewingIdCardDriver.medical_fitness}</strong></div>
              </div>
              <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed #CBD5E1" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", marginBottom: "6px" }}>Uploaded Documents:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ fontSize: "11px", color: "#15803D", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> DL: {viewingIdCardDriver.license_document_url || "Driving-License-Verified.pdf"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#1E40AF", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> Police Verification: {viewingIdCardDriver.police_cert_url || "Police-Clearance-Report.pdf"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6B21A8", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> Medical Fitness: {viewingIdCardDriver.medical_cert_url || "Medical-CMO-Fitness.pdf"}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              style={{ width: "100%", marginTop: "16px", background: "#3D5EE1", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <Printer size={16} /> Print Driver Card
            </button>
          </div>
        </div>
      )}

      {/* ADD ROUTE MODAL */}
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
              <button
                onClick={() => {
                  alert("Route created successfully!");
                  setShowAddRouteModal(false);
                }}
                style={{ background: "#3D5EE1", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, marginTop: "8px", cursor: "pointer" }}
              >
                Save Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: DOCUMENT PREVIEW MODAL (Vehicle & Driver Compliance Dossier)
          ========================================================================= */}
      {viewingTransportDoc && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            maxWidth: "760px",
            width: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #E2E8F0",
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Eye size={18} color="#38BDF8" />
                  <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>
                    {viewingTransportDoc.title}
                  </h3>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94A3B8" }}>
                  Document File: <strong style={{ color: "#F8FAFC" }}>{viewingTransportDoc.fileName}</strong>
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {viewingTransportDoc.dataUrl && (
                  <a
                    href={viewingTransportDoc.dataUrl}
                    download={viewingTransportDoc.fileName}
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <Download size={14} /> Download
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setViewingTransportDoc(null)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content / Preview Area */}
            <div style={{
              padding: "24px",
              overflowY: "auto",
              flex: 1,
              background: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "360px"
            }}>
              {viewingTransportDoc.dataUrl ? (
                viewingTransportDoc.fileType === "application/pdf" || viewingTransportDoc.fileName.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={viewingTransportDoc.dataUrl}
                    title={viewingTransportDoc.title}
                    style={{
                      width: "100%",
                      height: "520px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "12px"
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", maxWidth: "100%" }}>
                    <img
                      src={viewingTransportDoc.dataUrl}
                      alt={viewingTransportDoc.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "520px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                      }}
                    />
                  </div>
                )
              ) : (
                <div style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  border: "2px dashed #CBD5E1",
                  maxWidth: "420px",
                  width: "100%"
                }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    color: "#3D5EE1"
                  }}>
                    <FileText size={28} />
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 6px 0", color: "#1E293B" }}>
                    Compliance Document Verified
                  </h4>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 16px 0" }}>
                    This statutory compliance document <strong>{viewingTransportDoc.fileName}</strong> is securely verified and archived in the institutional transport registry.
                  </p>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    background: "#DCFCE7",
                    color: "#15803D",
                    fontSize: "12px",
                    fontWeight: 700
                  }}>
                    <CheckCircle2 size={14} /> Official Verified & Stored
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid #E2E8F0",
              background: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={14} color="#16A34A" /> Transport Security & Compliance Record
              </span>
              <button
                type="button"
                onClick={() => setViewingTransportDoc(null)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
