// AURA Mobility — fictional demo data.
// Structured as a mock service layer so real APIs can replace it later.

export const HERO_VEHICLE_IMG =
  "https://static.prod-images.emergentagent.com/jobs/7d1642ee-59c7-4063-80f1-7674e6b02fbb/images/83cbdbacfe7e18a540e11989a5974b4f151eb1aa9ca0faf8a281c5f33278eac2.jpeg";

export const SIDE_VEHICLE_IMG =
  "https://static.prod-images.emergentagent.com/jobs/7d1642ee-59c7-4063-80f1-7674e6b02fbb/images/5e0e266cd360c6ed0f658836af25766084a0bface2401ead164d2d20ddff5b2f.jpeg";

export const CHARGING_IMG =
  "https://static.prod-images.emergentagent.com/jobs/7d1642ee-59c7-4063-80f1-7674e6b02fbb/images/c5509df416ea567a34a0b6c5afed3a6fbb5c2be9ea31dc339893ca52ef0bed14.jpeg";

export const MAP_IMG =
  "https://static.prod-images.emergentagent.com/jobs/7d1642ee-59c7-4063-80f1-7674e6b02fbb/images/e5fe383eae5f796ce4d73baf64f4aa9b87c930fe1b9a57f357d2d79c1021ebd2.jpeg";

export const user = {
  name: "Arjun",
  fullName: "Arjun Nair",
  initials: "AN",
  city: "Bengaluru",
};

export const vehicleSeed = {
  id: "aura-e7",
  name: "AURA E7",
  trim: "Long Range · Dual Motor",
  colour: "Liquid Silver",
  battery: 82,
  range: 428,
  locked: true,
  cabinTemp: 22,
  outsideTemp: 27,
  climateOn: false,
  lightsOn: false,
  trunkOpen: false,
  charging: false,
  chargeLimit: 90,
  plugged: false,
  odometer: 14208,
  efficiency: 6.1, // km per kWh
  location: "Koramangala",
  address: "5th Block, Koramangala",
  status: "Ready",
  software: "AURA OS 4.2.1",
  softwareUpdate: "4.3.0 available",
};

export const weather = {
  condition: "Light haze",
  temp: 27,
  high: 31,
  low: 21,
  rainChance: 18,
};

export const scheduleSeed = [
  {
    id: "e1",
    time: "08:12",
    title: "Leave home",
    place: "Indiranagar",
    kind: "depart",
    traffic: "Moderate",
    battery: 82,
    arrival: "08:46",
    distance: "9.4 km",
    note: "Leave 12 min earlier today due to traffic",
  },
  {
    id: "e2",
    time: "08:45",
    title: "Design review",
    place: "Aura Labs, Koramangala",
    kind: "work",
    traffic: "Moderate",
    battery: 78,
    distance: "9.4 km",
    note: "Parking level 2 · Slot B12",
  },
  {
    id: "e3",
    time: "12:30",
    title: "Lunch with Meera",
    place: "Fig & Vine, Domlur",
    kind: "meal",
    traffic: "Light",
    battery: 74,
    distance: "3.8 km",
  },
  {
    id: "e4",
    time: "17:30",
    title: "Gym",
    place: "Pulse Athletic, HSR",
    kind: "fitness",
    traffic: "Heavy",
    battery: 67,
    distance: "6.1 km",
  },
  {
    id: "e5",
    time: "19:10",
    title: "Home",
    place: "Indiranagar",
    kind: "home",
    traffic: "Moderate",
    battery: 61,
    distance: "7.2 km",
    note: "Charging scheduled for 23:30",
  },
];

export const tomorrowSchedule = [
  { time: "07:40", title: "Airport drop · Meera", place: "KIA Terminal 2" },
  { time: "11:00", title: "Client workshop", place: "Whitefield" },
  { time: "16:00", title: "Service check", place: "AURA Care, HSR" },
];

export const notificationsSeed = [
  {
    id: "n1",
    title: "Your first meeting starts in 45 minutes",
    body: "Traffic has increased by 12 min on Sarjapur Road.",
    kind: "schedule",
    time: "Just now",
    cta: "Start navigation",
    unread: true,
  },
  {
    id: "n2",
    title: "Your car is ready",
    body: "Cabin preconditioned to 22°C. Doors locked.",
    kind: "vehicle",
    time: "6 min ago",
    unread: true,
  },
  {
    id: "n3",
    title: "You usually charge on Wednesday evenings",
    body: "Off-peak tariff starts at 23:30 · ₹6.4/kWh.",
    kind: "charging",
    time: "1 hr ago",
    cta: "Schedule charging",
    unread: false,
  },
];

export const devicesSeed = [
  {
    id: "d1",
    name: "AURA E7",
    type: "vehicle",
    detail: "Koramangala · LTE",
    status: "Connected",
    battery: 82,
    primary: true,
  },
  {
    id: "d2",
    name: "Arjun's Phone",
    type: "phone",
    detail: "AURA app 4.2 · Wi-Fi",
    status: "Online",
    battery: 64,
  },
  {
    id: "d3",
    name: "Arjun's Watch",
    type: "watch",
    detail: "Paired via phone",
    status: "Online",
    battery: 48,
  },
  {
    id: "d4",
    name: "Studio Desktop",
    type: "desktop",
    detail: "AURA Web · Bengaluru",
    status: "Online",
    battery: null,
    thisDevice: true,
  },
];

export const healthSeed = [
  { id: "battery", label: "High-voltage battery", value: 97, state: "Excellent", detail: "State of health · 8 yr warranty" },
  { id: "tyres", label: "Tyre pressure", value: 88, state: "Check soon", detail: "Rear left 2.1 bar · 0.2 low" },
  { id: "brakes", label: "Brakes", value: 92, state: "Good", detail: "Pads 11 mm · regen dominant" },
  { id: "motor", label: "Drive units", value: 99, state: "Excellent", detail: "No faults logged" },
  { id: "software", label: "Software", value: 100, state: "Update ready", detail: "AURA OS 4.3.0 · 1.2 GB" },
  { id: "service", label: "Service", value: 74, state: "In 4,300 km", detail: "Next visit due 12 Mar" },
];

export const chargers = [
  { id: "c1", name: "AURA Hub · Koramangala", distance: "1.2 km", power: "180 kW", available: "6 of 8", price: "₹18.5/kWh", eta: "18 min to 80%" },
  { id: "c2", name: "Forum Mall Fast Charge", distance: "2.6 km", power: "120 kW", available: "2 of 4", price: "₹21.0/kWh", eta: "26 min to 80%" },
  { id: "c3", name: "Home wallbox", distance: "At home", power: "11 kW", available: "Ready", price: "₹6.4/kWh", eta: "4 h 10 m to 90%" },
];

export const journeySeed = {
  from: "Home · Indiranagar",
  to: "Aura Labs · Koramangala",
  depart: "08:12",
  arrive: "08:46",
  distance: 9.4,
  duration: 34,
  traffic: "Moderate",
  trafficDelta: 12,
  batteryAtDestination: 78,
  chargePreference: "Only if needed",
  routePreference: "Fastest",
  chargeStop: "Not required",
  sent: false,
};

export const energyTrend = [
  { day: "Mon", kwh: 8.2, km: 48 },
  { day: "Tue", kwh: 6.4, km: 39 },
  { day: "Wed", kwh: 11.1, km: 68 },
  { day: "Thu", kwh: 7.8, km: 46 },
  { day: "Fri", kwh: 9.6, km: 58 },
  { day: "Sat", kwh: 4.2, km: 26 },
  { day: "Sun", kwh: 5.5, km: 33 },
];

export const suggestionChips = [
  "How much battery do I have?",
  "Is my car locked?",
  "Plan my day",
  "What's my next appointment?",
  "Find a charger",
  "How long to the office?",
  "Precondition the cabin",
  "Take me home",
  "What is my schedule tomorrow?",
];
