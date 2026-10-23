import React, { useState, useEffect } from "react";
import { SchoolPrintHeader } from "./SchoolPrintHeader";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Plus,
  RefreshCw,
  Droplets,
  Trees,
  School,
  Activity,
  Star,
  ChevronRight,
  ClipboardCheck,
  ShieldCheck,
  Download,
  Trash2,
  ArrowUpDown,
  Check,
  X,
  Eye,
  Award
} from "lucide-react";

interface CleanlinessZone {
  id: string;
  name: string;
  code: string;
  category: "WASHROOM" | "GARDEN_PARK" | "WATER_STATION" | "PLAYGROUND" | "CLASSROOM" | "CAFETERIA";
  location_block: string;
  assigned_cleaner: string;
  cleaner_phone?: string;
  assigned_supervisor: string;
  cleaning_frequency: string;
  last_cleaned_at: string | null;
  last_cleaned_by: string | null;
  last_cleaned_tasks: string[];
  next_cleaning_scheduled_at: string | null;
  last_inspected_at: string | null;
  last_inspected_by: string | null;
  next_inspection_due_at: string | null;
  inspection_status: "VERIFIED_CLEAN" | "NEEDS_ATTENTION" | "INSPECTION_OVERDUE" | "PENDING_INSPECTION";
  hygiene_rating: number;
  checklist_json: { title: string; passed: boolean }[];
  latest_inspection_remarks?: string;
}

const DEFAULT_ZONES: CleanlinessZone[] = [
  {
    id: "zone-1",
    name: "Ground Floor Boys Washroom (Block A)",
    code: "WR-B-GF",
    category: "WASHROOM",
    location_block: "Academic Block A - Ground Floor",
    assigned_cleaner: "Ramesh Lal",
    cleaner_phone: "98765-43210",
    assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
    cleaning_frequency: "Twice Daily (Morning & Afternoon)",
    last_cleaned_at: "2026-10-22T08:30:00.000Z",
    last_cleaned_by: "Ramesh Lal",
    last_cleaned_tasks: ["Mopping with Phenyl & Disinfectant", "Dustbins Emptied & Liners Replaced", "Liquid Soap Refilled", "Urinal Flush Checked"],
    next_cleaning_scheduled_at: "2026-10-22T13:30:00.000Z",
    last_inspected_at: "2026-10-22T09:15:00.000Z",
    last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
    next_inspection_due_at: "2026-10-22T16:00:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 4.8,
    checklist_json: [
      { title: "Floor Cleanliness & Disinfection", passed: true },
      { title: "No Foul Odor / Fresh Ventilation", passed: true },
      { title: "Running Tap Water & No Leaks", passed: true },
      { title: "Liquid Soap & Hand Wash Stocked", passed: true },
      { title: "Dustbin Cleared with Garbage Bag", passed: true }
    ],
    latest_inspection_remarks: "All 6 cubicles cleaned and disinfected. Floor is dry and exhaust fan working properly.",
  },
  {
    id: "zone-2",
    name: "Ground Floor Girls Washroom (Block A)",
    code: "WR-G-GF",
    category: "WASHROOM",
    location_block: "Academic Block A - Ground Floor",
    assigned_cleaner: "Kamla Devi",
    cleaner_phone: "98765-43211",
    assigned_supervisor: "Smt. Sunita Sharma (Vice Principal)",
    cleaning_frequency: "Twice Daily (Morning & Afternoon)",
    last_cleaned_at: "2026-10-22T08:45:00.000Z",
    last_cleaned_by: "Kamla Devi",
    last_cleaned_tasks: ["Floor Disinfection", "Sanitary Napkin Incinerator Checked", "Mirrors Cleaned", "Liquid Soap Refilled"],
    next_cleaning_scheduled_at: "2026-10-22T13:45:00.000Z",
    last_inspected_at: "2026-10-22T09:30:00.000Z",
    last_inspected_by: "Smt. Sunita Sharma (Vice Principal)",
    next_inspection_due_at: "2026-10-22T16:30:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 4.9,
    checklist_json: [
      { title: "Floor Cleanliness & Disinfection", passed: true },
      { title: "Sanitary Disposal Bin Cleared", passed: true },
      { title: "Running Tap Water & Basin Clean", passed: true },
      { title: "Handwash & Paper Towels Available", passed: true },
      { title: "Mirrors & Counters Spotless", passed: true }
    ],
    latest_inspection_remarks: "Excellent hygiene maintained. Incinerator and sanitization unit functional.",
  },
  {
    id: "zone-3",
    name: "1st Floor Boys Washroom (Block B)",
    code: "WR-B-1F",
    category: "WASHROOM",
    location_block: "Secondary Wing Block B - 1st Floor",
    assigned_cleaner: "Suraj Pal",
    cleaner_phone: "98765-43212",
    assigned_supervisor: "Shri Mohan Lal (Supervisor)",
    cleaning_frequency: "Twice Daily",
    last_cleaned_at: "2026-10-22T07:45:00.000Z",
    last_cleaned_by: "Suraj Pal",
    last_cleaned_tasks: ["Basic Sweeping", "Floor Mopping"],
    next_cleaning_scheduled_at: "2026-10-22T12:00:00.000Z",
    last_inspected_at: "2026-10-21T16:00:00.000Z",
    last_inspected_by: "Shri Mohan Lal (Supervisor)",
    next_inspection_due_at: "2026-10-22T14:00:00.000Z",
    inspection_status: "NEEDS_ATTENTION",
    hygiene_rating: 3.5,
    checklist_json: [
      { title: "Floor Cleanliness & Disinfection", passed: true },
      { title: "No Foul Odor / Fresh Ventilation", passed: false },
      { title: "Running Tap Water & No Leaks", passed: false },
      { title: "Liquid Soap & Hand Wash Stocked", passed: true },
      { title: "Dustbin Cleared with Garbage Bag", passed: true }
    ],
    latest_inspection_remarks: "Slight leak in tap #2 reported. Cleaner notified to mop immediately before lunch break.",
  },
  {
    id: "zone-4",
    name: "Main Campus Garden & Central Green Lawn",
    code: "GDN-MAIN",
    category: "GARDEN_PARK",
    location_block: "Central Quadrangle & Front Gate Entrance",
    assigned_cleaner: "Mangat Ram (Head Gardener)",
    cleaner_phone: "98765-43214",
    assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
    cleaning_frequency: "Daily Morning & Regular Weeding",
    last_cleaned_at: "2026-10-22T07:15:00.000Z",
    last_cleaned_by: "Mangat Ram (Head Gardener)",
    last_cleaned_tasks: ["Grass Mowing & Edge Trimming", "Fallen Leaves Swept & Composted", "Flowerbed Weeding & Soil Aeration", "Pathway Swept & Sprinkled"],
    next_cleaning_scheduled_at: "2026-10-23T07:00:00.000Z",
    last_inspected_at: "2026-10-22T08:15:00.000Z",
    last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
    next_inspection_due_at: "2026-10-23T08:30:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 5.0,
    checklist_json: [
      { title: "Lawn Mowed & Grass Height Maintained", passed: true },
      { title: "Fallen Leaves & Organic Waste Cleared", passed: true },
      { title: "No Plastic / Candy Wrappers on Lawn", passed: true },
      { title: "Garden Benches & Statues Clean", passed: true },
      { title: "Sprinklers & Watering Completed", passed: true }
    ],
    latest_inspection_remarks: "Lawn freshly manicured for the morning assembly. Flower beds vibrant and weed-free.",
  },
  {
    id: "zone-5",
    name: "Kindergarten Play Park & Kids Garden",
    code: "PRK-KIDS",
    category: "GARDEN_PARK",
    location_block: "Junior Wing East Lawn",
    assigned_cleaner: "Shyam Singh",
    cleaner_phone: "98765-43215",
    assigned_supervisor: "Ms. Anjali Verma (Primary Head)",
    cleaning_frequency: "Daily (Before & After Playtime)",
    last_cleaned_at: "2026-10-22T08:00:00.000Z",
    last_cleaned_by: "Shyam Singh",
    last_cleaned_tasks: ["Swings, Slides & Seesaws Sanitized", "Sandpit Checked for Stones & Sharp Debris", "Lawn Litter Cleared", "Safety Soft Mats Disinfected"],
    next_cleaning_scheduled_at: "2026-10-22T14:30:00.000Z",
    last_inspected_at: "2026-10-22T08:30:00.000Z",
    last_inspected_by: "Ms. Anjali Verma (Primary Head)",
    next_inspection_due_at: "2026-10-22T15:00:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 4.9,
    checklist_json: [
      { title: "Play Equipment Clean & Disinfected", passed: true },
      { title: "Sandpit Levelled & Foreign Objects Removed", passed: true },
      { title: "Soft Rubber Flooring Sanitized", passed: true },
      { title: "Fencing & Gate Latches Secure", passed: true },
      { title: "Litter Bins Emptied", passed: true }
    ],
    latest_inspection_remarks: "Playground equipment sanitised. Safe for nursery and kindergarten students.",
  },
  {
    id: "zone-6",
    name: "RO Cold Drinking Water Station #1",
    code: "RO-COOL-1",
    category: "WATER_STATION",
    location_block: "Central Dining & Cafeteria Zone",
    assigned_cleaner: "Ramesh Lal",
    cleaner_phone: "98765-43210",
    assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
    cleaning_frequency: "Twice Daily & Weekly Filter Backwash",
    last_cleaned_at: "2026-10-22T08:15:00.000Z",
    last_cleaned_by: "Ramesh Lal",
    last_cleaned_tasks: ["Stainless Steel Basin Polished", "Drain Trays Flushed & Cleared", "TDS Level Checked (115 ppm)", "Surrounding Floor Mopped"],
    next_cleaning_scheduled_at: "2026-10-22T14:00:00.000Z",
    last_inspected_at: "2026-10-22T09:00:00.000Z",
    last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
    next_inspection_due_at: "2026-10-23T09:00:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 4.9,
    checklist_json: [
      { title: "Water TDS Tested within 80-150 ppm", passed: true },
      { title: "Chiller Temperature 15°C Verified", passed: true },
      { title: "Stainless Steel Surface Cleaned", passed: true },
      { title: "No Water Clogging / Overflow in Drain", passed: true },
      { title: "UV Sterilizer Indicator Active", passed: true }
    ],
    latest_inspection_remarks: "TDS 115 ppm. Safe drinking water standards verified. Drainage flowing freely.",
  },
  {
    id: "zone-7",
    name: "Main Sports Complex & Football Playground",
    code: "PLY-MAIN",
    category: "PLAYGROUND",
    location_block: "Outdoor Sports Field & Running Track",
    assigned_cleaner: "Mangat Ram & Team",
    cleaner_phone: "98765-43214",
    assigned_supervisor: "Coach Devendra Singh (Sports Director)",
    cleaning_frequency: "Daily Afternoon & Pre-Match",
    last_cleaned_at: "2026-10-21T18:00:00.000Z",
    last_cleaned_by: "Mangat Ram & Team",
    last_cleaned_tasks: ["Running Track Debris Swept", "Football Pitch Rolling & Lining", "Boundary Dustbins Cleared"],
    next_cleaning_scheduled_at: "2026-10-22T17:30:00.000Z",
    last_inspected_at: "2026-10-21T18:30:00.000Z",
    last_inspected_by: "Coach Devendra Singh",
    next_inspection_due_at: "2026-10-22T18:00:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 4.8,
    checklist_json: [
      { title: "Track & Field Free from Stones & Glass", passed: true },
      { title: "Pitch Lines Marked & Grass Leveled", passed: true },
      { title: "Spectator Benches Clean", passed: true },
      { title: "Litter Cans Emptied Around Stadium", passed: true }
    ],
    latest_inspection_remarks: "Field ready for evening sports practice and athletics drills.",
  },
  {
    id: "zone-8",
    name: "Senior Wing Classrooms (Rooms 101 to 110) & Corridors",
    code: "CLS-SR-101",
    category: "CLASSROOM",
    location_block: "Academic Block B - 1st Floor",
    assigned_cleaner: "Suraj Pal",
    cleaner_phone: "98765-43212",
    assigned_supervisor: "Shri Mohan Lal (Supervisor)",
    cleaning_frequency: "Daily Morning & Post-School",
    last_cleaned_at: "2026-10-22T06:30:00.000Z",
    last_cleaned_by: "Suraj Pal",
    last_cleaned_tasks: ["Desks & Chairs Dusted", "Whiteboards Cleaned", "Floors Mopped", "Dustbins Emptied"],
    next_cleaning_scheduled_at: "2026-10-22T14:45:00.000Z",
    last_inspected_at: "2026-10-22T07:45:00.000Z",
    last_inspected_by: "Shri Mohan Lal (Supervisor)",
    next_inspection_due_at: "2026-10-22T15:30:00.000Z",
    inspection_status: "VERIFIED_CLEAN",
    hygiene_rating: 4.7,
    checklist_json: [
      { title: "Floors Swept & Mopped", passed: true },
      { title: "Student Benches Wiped Down", passed: true },
      { title: "Window Panes & Fans Dust-Free", passed: true },
      { title: "Classroom Waste Bins Cleaned", passed: true }
    ],
    latest_inspection_remarks: "Classrooms spotless before student arrival.",
  }
];

const DEFAULT_LOGS: InspectionLog[] = [
  {
    id: "insp-1",
    zone_id: "zone-1",
    zone_name: "Ground Floor Boys Washroom (Block A)",
    category: "WASHROOM",
    log_type: "INSPECTION",
    action_date: "2026-10-22T09:15:00.000Z",
    performed_by: "Dr. Sunil Verma (Estate Officer)",
    role: "SUPERVISOR",
    rating: 4.8,
    status: "VERIFIED_CLEAN",
    checklist_results: ["Floor Cleanliness Passed", "No Foul Odor Passed", "Taps & Water Passed", "Soaps Refilled Passed", "Bins Cleared Passed"],
    next_scheduled_date: "2026-10-22T16:00:00.000Z",
    remarks: "Thoroughly disinfected. All urinals and flush sensors working flawlessly."
  },
  {
    id: "insp-2",
    zone_id: "zone-4",
    zone_name: "Main Campus Garden & Central Green Lawn",
    category: "GARDEN_PARK",
    log_type: "INSPECTION",
    action_date: "2026-10-22T08:15:00.000Z",
    performed_by: "Dr. Sunil Verma (Estate Officer)",
    role: "SUPERVISOR",
    rating: 5.0,
    status: "VERIFIED_CLEAN",
    checklist_results: ["Grass Trimmed Passed", "Leaves Cleared Passed", "No Plastic Passed", "Benches Clean Passed", "Plants Watered Passed"],
    next_scheduled_date: "2026-10-23T08:30:00.000Z",
    remarks: "Garden is looking lush, neat and completely clean for assembly."
  },
  {
    id: "insp-3",
    zone_id: "zone-2",
    zone_name: "Ground Floor Girls Washroom (Block A)",
    category: "WASHROOM",
    log_type: "INSPECTION",
    action_date: "2026-10-22T09:30:00.000Z",
    performed_by: "Smt. Sunita Sharma (Vice Principal)",
    role: "SUPERVISOR",
    rating: 4.9,
    status: "VERIFIED_CLEAN",
    checklist_results: ["Floors Disinfected Passed", "Incinerator Checked Passed", "Sanitizer Stocked Passed"],
    next_scheduled_date: "2026-10-22T16:30:00.000Z",
    remarks: "Very clean and properly sanitised."
  },
  {
    id: "insp-4",
    zone_id: "zone-3",
    zone_name: "1st Floor Boys Washroom (Block B)",
    category: "WASHROOM",
    log_type: "INSPECTION",
    action_date: "2026-10-21T16:00:00.000Z",
    performed_by: "Shri Mohan Lal (Supervisor)",
    role: "SUPERVISOR",
    rating: 3.5,
    status: "NEEDS_ATTENTION",
    checklist_results: ["Floor Damp", "Tap 2 Dripping"],
    next_scheduled_date: "2026-10-22T14:00:00.000Z",
    remarks: "Plumber informed to repair leaking tap 2. Second mopping needed."
  }
];

interface InspectionLog {
  id: string;
  zone_id: string;
  zone_name: string;
  category: string;
  log_type: "INSPECTION" | "CLEANING_LOG";
  action_date: string;
  performed_by: string;
  role: string;
  rating?: number | null;
  status: string;
  checklist_results: string[] | any[];
  next_scheduled_date?: string | null;
  remarks?: string;
}

interface Props {
  token: string | null;
  institute?: any;
}

export const CleanlinessInspectionView: React.FC<Props> = ({ token, institute }) => {
  const [zones, setZones] = useState<CleanlinessZone[]>(DEFAULT_ZONES);
  const [logs, setLogs] = useState<InspectionLog[]>(DEFAULT_LOGS);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"zones" | "schedule" | "logs">("zones");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [showLogCleaningModal, setShowLogCleaningModal] = useState<boolean>(false);

  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [showAddZoneModal, setShowAddZoneModal] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<CleanlinessZone | null>(null);

  // Form states
  const [cleaningForm, setCleaningForm] = useState({
    zone_id: "",
    cleaned_by: "",
    cleaning_date: new Date().toISOString().slice(0, 16),
    next_cleaning_scheduled_at: "",
    tasks: ["Floor Mopping & Disinfection", "Dustbin Cleared"],
    remarks: "",
  });

  const [inspectionForm, setInspectionForm] = useState({
    zone_id: "",
    inspector_name: "Dr. Sunil Verma (Estate Officer)",
    rating: 5,
    status: "VERIFIED_CLEAN" as "VERIFIED_CLEAN" | "NEEDS_ATTENTION" | "FAILED",
    checklist: [
      { title: "Floor Cleanliness & Disinfection", passed: true },
      { title: "No Foul Odor / Proper Air Circulation", passed: true },
      { title: "Water Supply & Plumbing Working", passed: true },
      { title: "Soaps, Sanitizer & Consumables Stocked", passed: true },
      { title: "Dustbin Cleared & Waste Managed", passed: true },
    ],
    next_inspection_due_at: "",
    remarks: "Campus hygiene inspection verified up to safety standards.",
  });

  const [zoneForm, setZoneForm] = useState({
    name: "",
    code: "",
    category: "WASHROOM",
    location_block: "",
    assigned_cleaner: "",
    cleaner_phone: "",
    assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
    cleaning_frequency: "Twice Daily",
  });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resZones, resLogs] = await Promise.all([
        fetch("http://localhost:5000/api/v1/cleanliness/zones", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/v1/cleanliness/history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dataZones = await resZones.json();
      const dataLogs = await resLogs.json();

      if (dataZones.success && Array.isArray(dataZones.data) && dataZones.data.length > 0) {
        setZones(dataZones.data);
      }
      if (dataLogs.success && Array.isArray(dataLogs.data) && dataLogs.data.length > 0) {
        setLogs(dataLogs.data);
      }
    } catch (err) {
      console.error("Error fetching cleanliness data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCleaningModal = (zone?: CleanlinessZone) => {
    const target = zone || zones[0];
    if (target) {
      // Calculate next cleaning slot ~4 hours from now
      const nextTime = new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16);
      setSelectedZone(target);
      setCleaningForm({
        zone_id: target.id,
        cleaned_by: target.assigned_cleaner,
        cleaning_date: new Date().toISOString().slice(0, 16),
        next_cleaning_scheduled_at: nextTime,
        tasks: target.category === "GARDEN_PARK"
          ? ["Lawn Mowing & Weeding", "Dry Leaves Cleared", "Watering Completed"]
          : target.category === "WATER_STATION"
          ? ["TDS Verification", "Basin Cleaned", "Drain Pipe Flushed"]
          : ["Floor Mopping & Disinfection", "Dustbin Cleared & Bag Replaced", "Soap Refilled"],
        remarks: "",
      });
      setShowLogCleaningModal(true);
    }
  };

  const handleOpenInspectionModal = (zone?: CleanlinessZone) => {
    const target = zone || zones[0];
    if (target) {
      // Next inspection tomorrow same time
      const nextTime = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16);
      setSelectedZone(target);
      
      const defaultChecklist = target.category === "GARDEN_PARK" ? [
        { title: "Lawn Mowed & Grass Height Maintained", passed: true },
        { title: "Fallen Leaves & Organic Waste Cleared", passed: true },
        { title: "No Plastic / Trash Litter on Garden", passed: true },
        { title: "Swings & Benches Safe and Clean", passed: true },
        { title: "Sprinklers & Drainage Functional", passed: true },
      ] : target.category === "WATER_STATION" ? [
        { title: "TDS Level within Safe Drinking Norms (80-150 ppm)", passed: true },
        { title: "Water Cooler Temperature Checked", passed: true },
        { title: "Stainless Steel Basin Spotless", passed: true },
        { title: "No Drainage Overflow or Stagnation", passed: true },
        { title: "Filter Cartridge & UV Light Active", passed: true },
      ] : [
        { title: "Floor Cleanliness & Phenyl Mopping", passed: true },
        { title: "No Foul Odor / Fresh Ventilation", passed: true },
        { title: "Taps, Flushes & Running Water Working", passed: true },
        { title: "Liquid Soap & Sanitizer Available", passed: true },
        { title: "Dustbin Cleared with Garbage Bag", passed: true },
      ];

      setInspectionForm({
        zone_id: target.id,
        inspector_name: target.assigned_supervisor || "Dr. Sunil Verma (Estate Officer)",
        rating: 5,
        status: "VERIFIED_CLEAN",
        checklist: defaultChecklist,
        next_inspection_due_at: nextTime,
        remarks: `Physical inspection conducted by supervisor. Hygiene standards verified for ${target.name}.`,
      });
      setShowInspectionModal(true);
    }
  };

  const handleSaveCleaning = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/cleanliness/log-cleaning", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(cleaningForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowLogCleaningModal(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to log cleaning:", err);
    }
  };

  const handleSaveInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/cleanliness/conduct-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(inspectionForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowInspectionModal(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to record inspection:", err);
    }
  };

  const handleSaveNewZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/cleanliness/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(zoneForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddZoneModal(false);
        setZoneForm({
          name: "",
          code: "",
          category: "WASHROOM",
          location_block: "",
          assigned_cleaner: "",
          cleaner_phone: "",
          assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
          cleaning_frequency: "Twice Daily",
        });
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create new zone:", err);
    }
  };

  const handleQuickMarkCleaned = async (zone: CleanlinessZone) => {
    const nextTime = new Date(Date.now() + 4 * 3600 * 1000).toISOString();
    try {
      await fetch("http://localhost:5000/api/v1/cleanliness/log-cleaning", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          zone_id: zone.id,
          cleaned_by: zone.assigned_cleaner,
          tasks: zone.last_cleaned_tasks?.length ? zone.last_cleaned_tasks : ["Routine Cleaning & Mopping"],
          next_cleaning_scheduled_at: nextTime,
          remarks: "Quick cleaning verified by admin console.",
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Helper formatting functions
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "Not Logged Yet";
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = new Date(today.getTime() + 24 * 3600 * 1000).toDateString() === date.toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isToday) return `Today, ${timeStr}`;
    if (isTomorrow) return `Tomorrow, ${timeStr}`;
    return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${timeStr}`;
  };

  const getUrgencyBadge = (nextDateStr: string | null) => {
    if (!nextDateStr) return null;
    const nextDate = new Date(nextDateStr).getTime();
    const now = Date.now();
    const diffHours = (nextDate - now) / (1000 * 3600);

    if (diffHours < 0) {
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "#FEE2E2",
          color: "#B91C1C",
          fontSize: "11px",
          fontWeight: 800,
          padding: "2px 8px",
          borderRadius: "12px"
        }}>
          <AlertTriangle size={12} /> Overdue by {Math.abs(Math.round(diffHours))}h
        </span>
      );
    }
    if (diffHours <= 2) {
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "#FEF3C7",
          color: "#B45309",
          fontSize: "11px",
          fontWeight: 800,
          padding: "2px 8px",
          borderRadius: "12px"
        }}>
          <Clock size={12} /> Due in {Math.round(diffHours * 60)} mins
        </span>
      );
    }
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "#F1F5F9",
        color: "#475569",
        fontSize: "11px",
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: "12px"
      }}>
        <Clock size={12} /> Scheduled
      </span>
    );
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case "WASHROOM":
        return { label: "Washroom & Restroom", icon: Droplets, color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" };
      case "GARDEN_PARK":
        return { label: "Garden & Play Park", icon: Trees, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" };
      case "WATER_STATION":
        return { label: "RO Water Station", icon: Droplets, color: "#06B6D4", bg: "#ECFEFF", border: "#A5F3FC" };
      case "PLAYGROUND":
        return { label: "Playground & Sports", icon: Activity, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" };
      case "CLASSROOM":
        return { label: "Classrooms & Corridors", icon: School, color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE" };
      default:
        return { label: "Campus Facility", icon: Sparkles, color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" };
    }
  };

  // Filtered zones
  const filteredZones = zones.filter((z) => {
    const matchesCategory = selectedCategory === "ALL" || z.category === selectedCategory;
    const matchesStatus = statusFilter === "ALL" || z.inspection_status === statusFilter;
    const matchesSearch =
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.location_block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.assigned_cleaner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // KPI Calculations
  const totalZones = zones.length;
  const verifiedClean = zones.filter((z) => z.inspection_status === "VERIFIED_CLEAN").length;
  const needsAttention = zones.filter((z) => z.inspection_status === "NEEDS_ATTENTION" || z.inspection_status === "INSPECTION_OVERDUE").length;
  const pendingInspection = zones.filter((z) => z.inspection_status === "PENDING_INSPECTION").length;
  const avgRating = totalZones > 0
    ? (zones.reduce((acc, curr) => acc + (Number(curr.hygiene_rating) || 5), 0) / totalZones).toFixed(1)
    : "5.0";

  return (
    <div style={{ padding: "28px 36px", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Page Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)"
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#0F172A", margin: 0 }}>
                Campus Cleanliness & Hygiene Inspection Hub
              </h1>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0, marginTop: "2px" }}>
                स्वच्छता एवं निरीक्षण प्रबंधन • Track Garden, Parks, Washrooms, Water Coolers & Daily Inspection Schedule
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleOpenCleaningModal()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#FFFFFF",
              color: "#0F172A",
              border: "1px solid #CBD5E1",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          >
            <Clock size={16} color="#059669" />
            <span>Log Cleaning (सफ़ाई दर्ज करें)</span>
          </button>

          <button
            onClick={() => handleOpenInspectionModal()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)"
            }}
          >
            <ClipboardCheck size={16} />
            <span>Conduct Inspection (निरीक्षण ऑडिट)</span>
          </button>

          <button
            onClick={() => setShowAddZoneModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#0F172A",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 14px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            <Plus size={16} />
            <span>Add Zone</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        {/* Card 1: Total Zones */}
        <div style={{
          background: "#FFFFFF",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              Total Campus Zones
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
              <School size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginTop: "10px" }}>
            {totalZones}
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
            Washrooms, Gardens, RO Plants, Classrooms
          </div>
        </div>

        {/* Card 2: Verified Clean */}
        <div style={{
          background: "#FFFFFF",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #BBF7D0",
          boxShadow: "0 2px 4px rgba(16, 185, 129, 0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669", textTransform: "uppercase" }}>
              100% Clean & Verified
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A" }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#059669", marginTop: "10px" }}>
            {verifiedClean} <span style={{ fontSize: "14px", fontWeight: 600, color: "#64748B" }}>/ {totalZones}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", marginTop: "4px", fontWeight: 600 }}>
            ● Inspection standards passed
          </div>
        </div>

        {/* Card 3: Action Needed */}
        <div style={{
          background: "#FFFFFF",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #FECACA",
          boxShadow: "0 2px 4px rgba(239, 68, 68, 0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>
              Action Required / Overdue
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#DC2626", marginTop: "10px" }}>
            {needsAttention}
          </div>
          <div style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px", fontWeight: 600 }}>
            {needsAttention > 0 ? "⚠️ Immediate cleaner dispatch needed" : "All zones on schedule"}
          </div>
        </div>

        {/* Card 4: Overall Hygiene Rating */}
        <div style={{
          background: "#FFFFFF",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #DDD6FE",
          boxShadow: "0 2px 4px rgba(124, 58, 237, 0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6D28D9", textTransform: "uppercase" }}>
              Campus Hygiene Score
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED" }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#6D28D9", marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            {avgRating} <span style={{ fontSize: "18px", color: "#F59E0B" }}>★</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748B" }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: "12px", color: "#6D28D9", marginTop: "4px", fontWeight: 600 }}>
            Grade A+ School Accreditation
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #E2E8F0",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", gap: "24px" }}>
          <button
            onClick={() => setActiveTab("zones")}
            style={{
              padding: "12px 4px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "zones" ? "3px solid #4F46E5" : "3px solid transparent",
              color: activeTab === "zones" ? "#4F46E5" : "#64748B",
              fontWeight: 800,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Sparkles size={16} />
            <span>Facility Cleanliness Live Grid ({zones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            style={{
              padding: "12px 4px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "schedule" ? "3px solid #4F46E5" : "3px solid transparent",
              color: activeTab === "schedule" ? "#4F46E5" : "#64748B",
              fontWeight: 800,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Calendar size={16} />
            <span>Inspection Schedule & Planner</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            style={{
              padding: "12px 4px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "logs" ? "3px solid #4F46E5" : "3px solid transparent",
              color: activeTab === "logs" ? "#4F46E5" : "#64748B",
              fontWeight: 800,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <ClipboardCheck size={16} />
            <span>Audit Trail & Cleanliness History ({logs.length})</span>
          </button>
        </div>

        {/* View Toggle */}
        {activeTab === "zones" && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F1F5F9", padding: "4px", borderRadius: "10px" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                background: viewMode === "grid" ? "#FFFFFF" : "transparent",
                color: viewMode === "grid" ? "#0F172A" : "#64748B",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              Cards Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              style={{
                background: viewMode === "table" ? "#FFFFFF" : "transparent",
                color: viewMode === "table" ? "#0F172A" : "#64748B",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              Detailed Table
            </button>
          </div>
        )}
      </div>

      {/* Filters & Category Pills */}
      {activeTab === "zones" && (
        <div style={{ marginBottom: "24px" }}>
          {/* Category Pill Buttons */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px" }}>
            {[
              { id: "ALL", label: "All Campus Facilities", icon: Sparkles },
              { id: "WASHROOM", label: "Washrooms & Restrooms", icon: Droplets },
              { id: "GARDEN_PARK", label: "Garden, Lawn & Parks", icon: Trees },
              { id: "WATER_STATION", label: "RO Coolers & Drinking Water", icon: Droplets },
              { id: "PLAYGROUND", label: "Sports & Playgrounds", icon: Activity },
              { id: "CLASSROOM", label: "Classrooms & Corridors", icon: School },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    border: `1px solid ${isSelected ? "#4F46E5" : "#E2E8F0"}`,
                    background: isSelected ? "#EEF2FF" : "#FFFFFF",
                    color: isSelected ? "#4338CA" : "#475569",
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 2px 6px rgba(79, 70, 229, 0.12)" : "none"
                  }}
                >
                  <Icon size={15} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search and Secondary Filter Row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "12px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "10px",
              padding: "8px 14px",
              width: "360px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search facility name, code, cleaner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "13px",
                  color: "#0F172A"
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 600 }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0F172A",
                  outline: "none"
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED_CLEAN">✓ 100% Verified Clean</option>
                <option value="NEEDS_ATTENTION">⚠️ Needs Attention</option>
                <option value="PENDING_INSPECTION">🕒 Awaiting Inspection</option>
              </select>

              <button
                onClick={fetchData}
                title="Refresh Live Data"
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#475569",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 600,
                  fontSize: "13px"
                }}
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Facility Zones View */}
      {activeTab === "zones" && (
        <>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748B", fontWeight: 700 }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 12px", color: "#4F46E5" }} />
              Loading campus facility zones & inspection data...
            </div>
          ) : filteredZones.length === 0 ? (
            <div style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              border: "1px solid #E2E8F0"
            }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#EEF2FF", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>No Facility Zones Found</h3>
              <p style={{ fontSize: "13px", color: "#64748B", maxWidth: "420px", margin: "0 auto 20px" }}>
                No zones match your current search or category filter. Try clearing filters or add a new school zone.
              </p>
              <button
                onClick={() => { setSelectedCategory("ALL"); setStatusFilter("ALL"); setSearchQuery(""); }}
                style={{ padding: "8px 16px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Cards Grid View */
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "20px"
            }}>
              {filteredZones.map((zone) => {
                const cat = getCategoryDetails(zone.category);
                const CatIcon = cat.icon;

                return (
                  <div
                    key={zone.id}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 8px -2px rgba(15, 23, 42, 0.05)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* Card Top Header */}
                    <div style={{
                      padding: "18px 20px",
                      borderBottom: "1px solid #F1F5F9",
                      background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: cat.bg,
                          color: cat.color,
                          border: `1px solid ${cat.border}`,
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "3px 10px",
                          borderRadius: "16px"
                        }}>
                          <CatIcon size={12} />
                          <span>{cat.label}</span>
                          <span style={{ opacity: 0.6 }}>•</span>
                          <span>{zone.code}</span>
                        </span>

                        {/* Status Badge */}
                        {zone.inspection_status === "VERIFIED_CLEAN" ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "#DCFCE7",
                            color: "#15803D",
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "16px"
                          }}>
                            <CheckCircle2 size={13} />
                            <span>Verified Clean</span>
                          </span>
                        ) : zone.inspection_status === "NEEDS_ATTENTION" ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "#FEE2E2",
                            color: "#B91C1C",
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "16px"
                          }}>
                            <AlertTriangle size={13} />
                            <span>Needs Attention</span>
                          </span>
                        ) : (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "#EFF6FF",
                            color: "#2563EB",
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "16px"
                          }}>
                            <Clock size={13} />
                            <span>Awaiting Inspection</span>
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>
                        {zone.name}
                      </h3>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>
                        📍 {zone.location_block}
                      </div>
                    </div>

                    {/* Card Content - Cleanliness & Inspection Details */}
                    <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      
                      {/* Section 1: "सफ़ाई कब हुई" (Last Cleaned) */}
                      <div style={{
                        background: "#F8FAFC",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid #E2E8F0"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            सफ़ाई कब हुई (Last Cleaned)
                          </span>
                          <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>
                            {zone.cleaning_frequency}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>
                            🕒 {formatDateTime(zone.last_cleaned_at)}
                          </div>
                          <div style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                            By: <strong>{zone.last_cleaned_by || zone.assigned_cleaner}</strong>
                          </div>
                        </div>

                        {/* Tasks Done Pills */}
                        {zone.last_cleaned_tasks && zone.last_cleaned_tasks.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                            {zone.last_cleaned_tasks.slice(0, 3).map((task, idx) => (
                              <span key={idx} style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                background: "#FFFFFF",
                                color: "#334155",
                                border: "1px solid #CBD5E1",
                                padding: "2px 6px",
                                borderRadius: "6px"
                              }}>
                                ✓ {task}
                              </span>
                            ))}
                            {zone.last_cleaned_tasks.length > 3 && (
                              <span style={{ fontSize: "10px", color: "#64748B", padding: "2px 4px" }}>
                                +{zone.last_cleaned_tasks.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Section 2: "सफ़ाई कब होगी" (Next Scheduled Cleaning) */}
                      <div style={{
                        background: "#F8FAFC",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid #E2E8F0"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#4338CA", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            सफ़ाई कब होगी (Next Cleaning)
                          </span>
                          {getUrgencyBadge(zone.next_cleaning_scheduled_at)}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>
                            📅 {formatDateTime(zone.next_cleaning_scheduled_at)}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748B" }}>
                            Cleaner: {zone.assigned_cleaner}
                          </div>
                        </div>
                      </div>

                      {/* Section 3: "निरीक्षण फ्लो (Inspection Flow & Verification)" */}
                      <div style={{
                        background: zone.inspection_status === "NEEDS_ATTENTION" ? "#FEF2F2" : "#F5F3FF",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: `1px solid ${zone.inspection_status === "NEEDS_ATTENTION" ? "#FECACA" : "#DDD6FE"}`
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#6D28D9", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            निरीक्षण फ्लो (Inspection Flow)
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                fill={star <= Math.round(zone.hygiene_rating) ? "#F59E0B" : "none"}
                                color="#F59E0B"
                              />
                            ))}
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "#0F172A", marginLeft: "4px" }}>
                              {zone.hygiene_rating}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: "12px", color: "#334155", marginBottom: "4px" }}>
                          <span>Last Inspected: <strong>{formatDateTime(zone.last_inspected_at)}</strong></span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "6px" }}>
                          <span>Next Audit Due: <strong style={{ color: "#0F172A" }}>{formatDateTime(zone.next_inspection_due_at)}</strong></span>
                        </div>

                        <div style={{ fontSize: "11px", color: "#475569", background: "rgba(255,255,255,0.7)", padding: "6px 8px", borderRadius: "6px", fontStyle: "italic" }}>
                          "{zone.latest_inspection_remarks || "Regular hygiene check verified by supervisor."}"
                        </div>
                      </div>

                    </div>

                    {/* Card Actions Footer */}
                    <div style={{
                      padding: "14px 20px",
                      background: "#F8FAFC",
                      borderTop: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px"
                    }}>
                      <button
                        onClick={() => handleQuickMarkCleaned(zone)}
                        title="Mark Cleaned Right Now (सफ़ाई अभी पूरी हुई)"
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          background: "#FFFFFF",
                          color: "#059669",
                          border: "1px solid #A7F3D0",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        <Check size={14} />
                        <span>Mark Cleaned</span>
                      </button>

                      <button
                        onClick={() => handleOpenInspectionModal(zone)}
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          background: "#4F46E5",
                          color: "#FFFFFF",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        <ClipboardCheck size={14} />
                        <span>Inspect Now</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(15, 23, 42, 0.02)"
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", textAlign: "left" }}>
                      <th style={{ padding: "14px 18px", fontWeight: 800 }}>Zone & Code</th>
                      <th style={{ padding: "14px 18px", fontWeight: 800 }}>Category</th>
                      <th style={{ padding: "14px 18px", fontWeight: 800 }}>सफ़ाई कब हुई (Last Cleaned)</th>
                      <th style={{ padding: "14px 18px", fontWeight: 800 }}>सफ़ाई कब होगी (Next Slot)</th>
                      <th style={{ padding: "14px 18px", fontWeight: 800 }}>Inspection Status & Rating</th>
                      <th style={{ padding: "14px 18px", fontWeight: 800 }}>Next Inspection Due</th>
                      <th style={{ padding: "14px 18px", fontWeight: 800, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZones.map((zone) => {
                      const cat = getCategoryDetails(zone.category);
                      return (
                        <tr key={zone.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 800, color: "#0F172A" }}>{zone.name}</div>
                            <div style={{ fontSize: "11px", color: "#64748B" }}>{zone.code} • {zone.location_block}</div>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: cat.color, background: cat.bg, padding: "3px 8px", borderRadius: "10px" }}>
                              {cat.label}
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 700, color: "#0F172A" }}>{formatDateTime(zone.last_cleaned_at)}</div>
                            <div style={{ fontSize: "11px", color: "#64748B" }}>By: {zone.last_cleaned_by || zone.assigned_cleaner}</div>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 700, color: "#0F172A" }}>{formatDateTime(zone.next_cleaning_scheduled_at)}</div>
                            <div>{getUrgencyBadge(zone.next_cleaning_scheduled_at)}</div>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: "12px",
                                background: zone.inspection_status === "VERIFIED_CLEAN" ? "#DCFCE7" : "#FEE2E2",
                                color: zone.inspection_status === "VERIFIED_CLEAN" ? "#16A34A" : "#DC2626"
                              }}>
                                {zone.inspection_status === "VERIFIED_CLEAN" ? "✓ Verified Clean" : "⚠️ Attention Required"}
                              </span>
                              <span style={{ fontWeight: 800, color: "#F59E0B" }}>★ {zone.hygiene_rating}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 700, color: "#475569" }}>{formatDateTime(zone.next_inspection_due_at)}</div>
                            <div style={{ fontSize: "11px", color: "#64748B" }}>Inspector: {zone.assigned_supervisor}</div>
                          </td>
                          <td style={{ padding: "14px 18px", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                              <button
                                onClick={() => handleQuickMarkCleaned(zone)}
                                style={{ background: "#F1F5F9", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#059669" }}
                              >
                                ✓ Cleaned
                              </button>
                              <button
                                onClick={() => handleOpenInspectionModal(zone)}
                                style={{ background: "#4F46E5", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                              >
                                Inspect
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Inspection Schedule & Planner */}
      {activeTab === "schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Upcoming Campus Inspections Timeline
                </h3>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0 0" }}>
                  Automated inspection flow for Estate Manager, Vice-Principal & Sanitation Officers
                </p>
              </div>
              <button
                onClick={() => handleOpenInspectionModal()}
                style={{
                  padding: "8px 16px",
                  background: "#4F46E5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                + Conduct Instant Inspection
              </button>
            </div>

            {/* Timeline List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: zone.category === "GARDEN_PARK" ? "#DCFCE7" : "#EFF6FF",
                      color: zone.category === "GARDEN_PARK" ? "#16A34A" : "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800
                    }}>
                      {zone.category === "GARDEN_PARK" ? <Trees size={22} /> : <Droplets size={22} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>
                        {zone.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                        Inspector: <strong>{zone.assigned_supervisor}</strong> • Cleaner: {zone.assigned_cleaner}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                        Scheduled Inspection
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#4F46E5", marginTop: "2px" }}>
                        📅 {formatDateTime(zone.next_inspection_due_at)}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleOpenInspectionModal(zone)}
                        style={{
                          background: "#4F46E5",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Start Audit Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Full Audit Trail & Cleaning History */}
      {activeTab === "logs" && (
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.02)"
        }}>
          <div style={{ padding: "20px 24px 0 24px" }}>
            <SchoolPrintHeader
              institute={institute}
              documentTitle="CAMPUS HYGIENE & CLEANLINESS AUDIT REGISTER"
              documentSubtitle="Official Health Inspection & Sanitation Compliance Record"
              documentNumber={`HYG-REG-${new Date().getFullYear()}`}
              documentDate={new Date().toISOString().slice(0, 10)}
              badgeText="STATUTORY AUDIT VERIFIED"
            />
          </div>

          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                Campus Cleanliness & Inspection Audit Register
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
                Official verification log for school compliance, health audits and management oversight
              </p>
            </div>

            <button
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#FFFFFF",
                border: "1px solid #CBD5E1",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#475569",
                cursor: "pointer"
              }}
            >
              <Download size={14} />
              <span>Print / Export Audit Register</span>
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", textAlign: "left" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>Date & Time</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>Action Type</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>Zone Name</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>Performed / Inspected By</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>Rating / Status</th>
                  <th style={{ padding: "14px 18px", fontWeight: 800 }}>Verification Remarks</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                      No audit entries recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {formatDateTime(log.action_date)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: log.log_type === "INSPECTION" ? "#EDE9FE" : "#DCFCE7",
                          color: log.log_type === "INSPECTION" ? "#6D28D9" : "#15803D"
                        }}>
                          {log.log_type === "INSPECTION" ? "📋 INSPECTION AUDIT" : "🧹 ROUTINE CLEANING"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", fontWeight: 800, color: "#0F172A" }}>
                        {log.zone_name}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#334155" }}>{log.performed_by}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>Role: {log.role}</div>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: log.status === "VERIFIED_CLEAN" ? "#DCFCE7" : "#FEE2E2",
                            color: log.status === "VERIFIED_CLEAN" ? "#16A34A" : "#DC2626"
                          }}>
                            {log.status}
                          </span>
                          {log.rating && <span style={{ fontWeight: 800, color: "#F59E0B" }}>★ {log.rating}</span>}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569", maxWidth: "300px" }}>
                        {log.remarks || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: LOG CLEANING ("सफ़ाई कब हुई")                   */}
      {/* ======================================================== */}
      {showLogCleaningModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
          padding: "16px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "540px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "20px 24px",
              background: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Log Cleanliness Execution (सफ़ाई दर्ज करें)
                </h3>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
                  Record executed cleaning, time slot & schedule next routine cleaning
                </p>
              </div>
              <button
                onClick={() => setShowLogCleaningModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCleaning} style={{ padding: "24px" }}>
              {/* Select Zone */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Facility Zone (स्थान चुनें):
                </label>
                <select
                  value={cleaningForm.zone_id}
                  onChange={(e) => {
                    const z = zones.find((item) => item.id === e.target.value);
                    if (z) {
                      setCleaningForm({
                        ...cleaningForm,
                        zone_id: z.id,
                        cleaned_by: z.assigned_cleaner,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: 600,
                    outline: "none"
                  }}
                  required
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.code} - {z.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cleaning Date & Time + Cleaned By */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    सफ़ाई का समय (Executed Date & Time):
                  </label>
                  <input
                    type="datetime-local"
                    value={cleaningForm.cleaning_date}
                    onChange={(e) => setCleaningForm({ ...cleaningForm, cleaning_date: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      outline: "none"
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    सफ़ाई कर्मी (Cleaned By):
                  </label>
                  <input
                    type="text"
                    value={cleaningForm.cleaned_by}
                    onChange={(e) => setCleaningForm({ ...cleaningForm, cleaned_by: e.target.value })}
                    placeholder="e.g. Ramesh Lal"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      outline: "none"
                    }}
                    required
                  />
                </div>
              </div>

              {/* Tasks Completed Checkboxes */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                  सफ़ाई कार्य चेकलिस्ट (Tasks Executed):
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    "Floor Mopping with Disinfectant / Phenyl",
                    "Waste Bins Cleared & Poly Liners Replaced",
                    "Liquid Soap, Sanitizer & Tissues Stocked",
                    "Sanitary / Lawn / Water Station Checked",
                    "Exhaust & Ventilation Checked",
                  ].map((task, idx) => (
                    <label key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={cleaningForm.tasks.includes(task)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCleaningForm({ ...cleaningForm, tasks: [...cleaningForm.tasks, task] });
                          } else {
                            setCleaningForm({ ...cleaningForm, tasks: cleaningForm.tasks.filter((t) => t !== task) });
                          }
                        }}
                      />
                      <span>{task}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Next Scheduled Cleaning ("सफ़ाई कब होगी") */}
              <div style={{ marginBottom: "16px", background: "#EFF6FF", padding: "12px", borderRadius: "10px", border: "1px solid #BFDBFE" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#1D4ED8", marginBottom: "6px" }}>
                  अगली सफ़ाई कब होगी (Next Cleaning Scheduled At):
                </label>
                <input
                  type="datetime-local"
                  value={cleaningForm.next_cleaning_scheduled_at}
                  onChange={(e) => setCleaningForm({ ...cleaningForm, next_cleaning_scheduled_at: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #93C5FD",
                    fontSize: "13px",
                    background: "#FFFFFF",
                    outline: "none"
                  }}
                  required
                />
              </div>

              {/* Remarks */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  टिप्पणी (Cleaner Notes / Remarks):
                </label>
                <textarea
                  value={cleaningForm.remarks}
                  onChange={(e) => setCleaningForm({ ...cleaningForm, remarks: e.target.value })}
                  placeholder="e.g. Floor sanitized, fresh phenyl used. Everything clean."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowLogCleaningModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: "#10B981", color: "#fff", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}
                >
                  Save & Update Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONDUCT INSPECTION AUDIT ("निरीक्षण फ्लो")     */}
      {/* ======================================================== */}
      {showInspectionModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
          padding: "16px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "20px 24px",
              background: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Conduct Cleanliness Inspection (निरीक्षण ऑडिट)
                </h3>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
                  Supervisor / Principal physical inspection & hygiene certification
                </p>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInspection} style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {/* Select Zone */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Facility Zone Under Inspection:
                </label>
                <select
                  value={inspectionForm.zone_id}
                  onChange={(e) => {
                    const z = zones.find((item) => item.id === e.target.value);
                    if (z) {
                      setInspectionForm({
                        ...inspectionForm,
                        zone_id: z.id,
                        inspector_name: z.assigned_supervisor,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: 600,
                    outline: "none"
                  }}
                  required
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Inspector Name & Hygiene Rating */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    निरीक्षक (Inspector Name & Role):
                  </label>
                  <input
                    type="text"
                    value={inspectionForm.inspector_name}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, inspector_name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      outline: "none"
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    Hygiene Rating (1 - 5 Stars):
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "42px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setInspectionForm({ ...inspectionForm, rating: star })}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px"
                        }}
                      >
                        <Star
                          size={24}
                          fill={star <= inspectionForm.rating ? "#F59E0B" : "none"}
                          color="#F59E0B"
                        />
                      </button>
                    ))}
                    <span style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A", marginLeft: "4px" }}>
                      {inspectionForm.rating}.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                  निरीक्षण परिणाम (Inspection Result Status):
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[
                    { id: "VERIFIED_CLEAN", label: "✓ 100% Clean", bg: "#DCFCE7", color: "#15803D" },
                    { id: "NEEDS_ATTENTION", label: "⚠️ Needs Attention", bg: "#FEF3C7", color: "#B45309" },
                    { id: "FAILED", label: "🔴 Re-Clean Now", bg: "#FEE2E2", color: "#B91C1C" },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setInspectionForm({ ...inspectionForm, status: s.id as any })}
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        border: inspectionForm.status === s.id ? `2px solid ${s.color}` : "1px solid #CBD5E1",
                        background: inspectionForm.status === s.id ? s.bg : "#FFFFFF",
                        color: s.color,
                        fontWeight: 800,
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspection Criteria Checklist */}
              <div style={{ marginBottom: "16px", background: "#F8FAFC", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>
                  Inspection Checklist (मानक जांच):
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {inspectionForm.checklist.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "#334155" }}>{item.title}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...inspectionForm.checklist];
                          updated[idx].passed = !updated[idx].passed;
                          setInspectionForm({ ...inspectionForm, checklist: updated });
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "none",
                          background: item.passed ? "#DCFCE7" : "#FEE2E2",
                          color: item.passed ? "#15803D" : "#B91C1C",
                          fontWeight: 700,
                          fontSize: "11px",
                          cursor: "pointer"
                        }}
                      >
                        {item.passed ? "✓ Passed" : "✗ Issue Found"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Inspection Due At */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  अगला निरीक्षण कब होगा (Next Inspection Due Date & Time):
                </label>
                <input
                  type="datetime-local"
                  value={inspectionForm.next_inspection_due_at}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, next_inspection_due_at: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    outline: "none"
                  }}
                  required
                />
              </div>

              {/* Inspector Remarks */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  निरीक्षण टिप्पणी (Supervisor Remarks & Action Plan):
                </label>
                <textarea
                  value={inspectionForm.remarks}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, remarks: e.target.value })}
                  placeholder="e.g. Lawn manicured properly, dry leaves cleared, swings checked for kids safety."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: "#4F46E5", color: "#fff", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}
                >
                  Verify & Record Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD NEW FACILITY ZONE                           */}
      {/* ======================================================== */}
      {showAddZoneModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
          padding: "16px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "520px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "20px 24px",
              background: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Add School Cleanliness Zone
                </h3>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
                  Register a new washroom, garden, park, water station or classroom
                </p>
              </div>
              <button
                onClick={() => setShowAddZoneModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewZone} style={{ padding: "24px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Zone Name (e.g. Science Block Boys Washroom):
                </label>
                <input
                  type="text"
                  value={zoneForm.name}
                  onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                  placeholder="e.g. Primary Wing Kids Play Park"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    Category (श्रेणी):
                  </label>
                  <select
                    value={zoneForm.category}
                    onChange={(e) => setZoneForm({ ...zoneForm, category: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  >
                    <option value="WASHROOM">Washroom / Restroom</option>
                    <option value="GARDEN_PARK">Garden, Lawn & Parks</option>
                    <option value="WATER_STATION">RO Water Station</option>
                    <option value="PLAYGROUND">Playground & Sports</option>
                    <option value="CLASSROOM">Classroom / Corridor</option>
                    <option value="CAFETERIA">Cafeteria / Dining Hall</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    Zone Code (e.g. GDN-02):
                  </label>
                  <input
                    type="text"
                    value={zoneForm.code}
                    onChange={(e) => setZoneForm({ ...zoneForm, code: e.target.value })}
                    placeholder="e.g. WR-SCI-1F"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Location / Floor Block:
                </label>
                <input
                  type="text"
                  value={zoneForm.location_block}
                  onChange={(e) => setZoneForm({ ...zoneForm, location_block: e.target.value })}
                  placeholder="e.g. Science Block 1st Floor, East Wing"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    Assigned Cleaner:
                  </label>
                  <input
                    type="text"
                    value={zoneForm.assigned_cleaner}
                    onChange={(e) => setZoneForm({ ...zoneForm, assigned_cleaner: e.target.value })}
                    placeholder="e.g. Mangat Ram"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    Frequency:
                  </label>
                  <select
                    value={zoneForm.cleaning_frequency}
                    onChange={(e) => setZoneForm({ ...zoneForm, cleaning_frequency: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  >
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Daily Morning">Daily Morning</option>
                    <option value="Daily Evening">Daily Evening</option>
                    <option value="Weekly Twice">Weekly Twice</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: "#0F172A", color: "#fff", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}
                >
                  Create Facility Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default CleanlinessInspectionView;
