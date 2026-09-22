import { Block, Apartment, WorkerProfile, MaintenanceTicket, AIAlert, ActivityEvent, NotificationItem, SensorItem } from '../types';
import { getAssetUrl } from '../utils/assets';

export const INITIAL_BLOCKS: Block[] = [
  {
    id: 'A',
    name: 'Cedar Heights (Block A)',
    tagline: 'East Wing • Garden facing • 8 Floors • 64 Units',
    totalFloors: 8,
    totalApartments: 64,
    healthyCount: 59,
    warningCount: 3,
    maintenanceCount: 2,
    image: getAssetUrl('/images/block_complex.jpg')
  },
  {
    id: 'B',
    name: 'Pine Crest (Block B)',
    tagline: 'Central Tower • Courtyard facing • 8 Floors • 64 Units',
    totalFloors: 8,
    totalApartments: 64,
    healthyCount: 61,
    warningCount: 2,
    maintenanceCount: 1,
    image: getAssetUrl('/images/block_complex.jpg')
  },
  {
    id: 'C',
    name: 'Olive Grove (Block C)',
    tagline: 'West Wing • Sunset park view • 8 Floors • 64 Units',
    totalFloors: 8,
    totalApartments: 64,
    healthyCount: 62,
    warningCount: 1,
    maintenanceCount: 1,
    image: getAssetUrl('/images/block_complex.jpg')
  }
];

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'WRK-102',
    name: 'Arun Kumar',
    role: 'Plumber',
    specialties: ['Water & Plumbing', 'Appliance', 'Civil & Structure'],
    phone: '+91 98450 12891',
    email: 'arun.k@propcareai.internal',
    rating: 4.92,
    completedTasks: 184,
    activeTasks: 1,
    isAvailable: true,
    shiftStatus: 'available',
    currentLocation: 'Block A, Ground Utility',
    avgResponseMins: 14,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-01',
    name: 'Ravi Kumar',
    role: 'Plumber',
    specialties: ['Water & Plumbing', 'Appliance', 'Civil & Structure'],
    phone: '+91 98450 12891',
    email: 'ravi.k@propcareai.internal',
    rating: 4.9,
    completedTasks: 184,
    activeTasks: 1,
    isAvailable: true,
    shiftStatus: 'available',
    currentLocation: 'Block A, Ground Utility',
    avgResponseMins: 14,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-02',
    name: 'Suresh Patel',
    role: 'Electrician',
    specialties: ['Electrical & Power', 'HVAC & Climate'],
    phone: '+91 97120 44820',
    email: 'suresh.p@propcareai.internal',
    rating: 4.8,
    completedTasks: 212,
    activeTasks: 1,
    isAvailable: true,
    currentLocation: 'Block B, Level 1 Substation',
    avgResponseMins: 18,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-03',
    name: 'Priya Menon',
    role: 'HVAC Technician',
    specialties: ['HVAC & Climate', 'Electrical & Power'],
    phone: '+91 99011 83204',
    email: 'priya.m@propcareai.internal',
    rating: 4.95,
    completedTasks: 146,
    activeTasks: 0,
    isAvailable: true,
    currentLocation: 'Central Maintenance Hub',
    avgResponseMins: 12,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-04',
    name: 'Rajesh Sharma',
    role: 'General Maintenance',
    specialties: ['Civil & Structure', 'Cleaning & Hygiene', 'Security & Access', 'Other'],
    phone: '+91 94481 90218',
    email: 'rajesh.s@propcareai.internal',
    rating: 4.75,
    completedTasks: 260,
    activeTasks: 0,
    isAvailable: true,
    currentLocation: 'Block C, Service Bay',
    avgResponseMins: 15,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

const generateSensorsForApartment = (aptId: string, isAnomalyWater: boolean = false, isAnomalyPower: boolean = false): SensorItem[] => {
  const waterVal = isAnomalyWater ? 14.8 : +(4.2 + Math.random() * 2.5).toFixed(1);
  const voltVal = isAnomalyPower ? 262 : +(228 + Math.random() * 4).toFixed(1);
  const powerVal = isAnomalyPower ? 4.8 : +(1.2 + Math.random() * 0.8).toFixed(2);
  const tempVal = +(23.5 + Math.random() * 1.8).toFixed(1);
  const humVal = +(48 + Math.random() * 8).toFixed(0);
  const aqiVal = +(28 + Math.random() * 18).toFixed(0);

  const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', 'Now'];

  return [
    {
      id: `SENS-${aptId}-WTR`,
      apartmentId: aptId,
      name: 'Smart Main Water Flow Meter',
      type: 'water',
      location: 'Utility Service Duct',
      currentValue: waterVal,
      unit: 'L/min',
      normalMin: 2.0,
      normalMax: 8.5,
      status: isAnomalyWater ? 'warning' : 'normal',
      lastUpdated: 'Just now',
      batteryLevel: 94,
      history: times.map((t, idx) => ({
        time: t,
        value: idx === times.length - 1 ? waterVal : +(4.0 + Math.sin(idx) * 2).toFixed(1),
        unit: 'L/min'
      }))
    },
    {
      id: `SENS-${aptId}-VOLT`,
      apartmentId: aptId,
      name: 'Main Distribution Voltage Monitor',
      type: 'electrical_voltage',
      location: 'Primary Distribution Box',
      currentValue: voltVal,
      unit: 'V',
      normalMin: 215,
      normalMax: 245,
      status: isAnomalyPower ? 'warning' : 'normal',
      lastUpdated: '1 min ago',
      batteryLevel: 100,
      history: times.map((t, idx) => ({
        time: t,
        value: idx === times.length - 1 ? voltVal : 230 + Math.floor(Math.sin(idx) * 3),
        unit: 'V'
      }))
    },
    {
      id: `SENS-${aptId}-PWR`,
      apartmentId: aptId,
      name: 'Active Circuit Load Sensor',
      type: 'power',
      location: 'Kitchen & HVAC Sub-panel',
      currentValue: powerVal,
      unit: 'kW',
      normalMin: 0.2,
      normalMax: 3.5,
      status: isAnomalyPower ? 'warning' : 'normal',
      lastUpdated: 'Just now',
      history: times.map((t, idx) => ({
        time: t,
        value: idx === times.length - 1 ? powerVal : +(1.1 + Math.cos(idx) * 0.5).toFixed(2),
        unit: 'kW'
      }))
    },
    {
      id: `SENS-${aptId}-TEMP`,
      apartmentId: aptId,
      name: 'Smart Ambient Thermostat',
      type: 'temperature',
      location: 'Living Room Central',
      currentValue: tempVal,
      unit: '°C',
      normalMin: 20,
      normalMax: 27,
      status: 'normal',
      lastUpdated: '2 mins ago',
      batteryLevel: 88,
      history: times.map((t, idx) => ({
        time: t,
        value: idx === times.length - 1 ? tempVal : +(23.0 + idx * 0.2).toFixed(1),
        unit: '°C'
      }))
    },
    {
      id: `SENS-${aptId}-HUM`,
      apartmentId: aptId,
      name: 'Relative Humidity Sensor',
      type: 'humidity',
      location: 'Living Area & Balcony Entry',
      currentValue: +humVal,
      unit: '%',
      normalMin: 35,
      normalMax: 65,
      status: 'normal',
      lastUpdated: '2 mins ago',
      batteryLevel: 88,
      history: times.map((t, idx) => ({
        time: t,
        value: idx === times.length - 1 ? +humVal : 50 + (idx % 3),
        unit: '%'
      }))
    },
    {
      id: `SENS-${aptId}-AQI`,
      apartmentId: aptId,
      name: 'Air Purity & PM2.5 Optical Sensor',
      type: 'air_quality',
      location: 'Dining & Kitchen Breeze Zone',
      currentValue: +aqiVal,
      unit: 'AQI',
      normalMin: 0,
      normalMax: 60,
      status: 'normal',
      lastUpdated: 'Just now',
      history: times.map((t, idx) => ({
        time: t,
        value: idx === times.length - 1 ? +aqiVal : 32 + (idx % 5),
        unit: 'AQI'
      }))
    }
  ];
};

export const INITIAL_APARTMENTS: Apartment[] = [
  // Block A
  {
    id: 'A-302',
    blockId: 'A',
    floor: 3,
    doorNumber: '302',
    resident: {
      id: 'RES-A302',
      apartmentId: 'A-302',
      name: 'Ananya Kumar',
      email: 'ananya.kumar@gmail.com',
      phone: '+91 98840 99123',
      pin: '1234',
      moveInDate: '12 Oct 2024',
      emergencyContact: '+91 98840 99120 (Siddharth K.)'
    },
    status: 'warning',
    sensorSummary: {
      temperature: 24.2,
      humidity: 52,
      waterFlow: 14.8,
      powerUsage: 1.45,
      airQuality: 34
    },
    hasActiveAlert: true,
    activeAlertId: 'ALT-2026-0891',
    sensors: generateSensorsForApartment('A-302', true, false)
  },
  {
    id: 'A-101',
    blockId: 'A',
    floor: 1,
    doorNumber: '101',
    resident: {
      id: 'RES-A101',
      apartmentId: 'A-101',
      name: 'Rohan Sharma',
      email: 'rohan.s@outlook.com',
      phone: '+91 98401 22345',
      pin: '1111',
      moveInDate: '15 Jan 2024',
      emergencyContact: '+91 98401 22340'
    },
    status: 'healthy',
    sensorSummary: { temperature: 23.8, humidity: 49, waterFlow: 5.2, powerUsage: 1.1, airQuality: 28 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('A-101')
  },
  {
    id: 'A-102',
    blockId: 'A',
    floor: 1,
    doorNumber: '102',
    resident: {
      id: 'RES-A102',
      apartmentId: 'A-102',
      name: 'Vikram Reddy',
      email: 'vikram.reddy@techcorp.in',
      phone: '+91 99402 33456',
      pin: '2222',
      moveInDate: '01 Mar 2024',
      emergencyContact: '+91 99402 33450'
    },
    status: 'healthy',
    sensorSummary: { temperature: 24.5, humidity: 50, waterFlow: 4.8, powerUsage: 1.8, airQuality: 32 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('A-102')
  },
  {
    id: 'A-204',
    blockId: 'A',
    floor: 2,
    doorNumber: '204',
    resident: {
      id: 'RES-A204',
      apartmentId: 'A-204',
      name: 'Sneha Iyer',
      email: 'sneha.iyer@gmail.com',
      phone: '+91 98415 67890',
      pin: '3333',
      moveInDate: '20 Jul 2024',
      emergencyContact: '+91 98415 67891'
    },
    status: 'maintenance',
    sensorSummary: { temperature: 25.1, humidity: 55, waterFlow: 6.1, powerUsage: 4.8, airQuality: 40 },
    hasActiveAlert: false,
    activeTicketId: 'PC-2026-00122',
    sensors: generateSensorsForApartment('A-204', false, true)
  },
  {
    id: 'A-405',
    blockId: 'A',
    floor: 4,
    doorNumber: '405',
    resident: {
      id: 'RES-A405',
      apartmentId: 'A-405',
      name: 'Arjun Deshmukh',
      email: 'arjun.d@innovate.org',
      phone: '+91 98230 44556',
      pin: '4444',
      moveInDate: '05 Nov 2024',
      emergencyContact: '+91 98230 44550'
    },
    status: 'healthy',
    sensorSummary: { temperature: 23.4, humidity: 48, waterFlow: 3.9, powerUsage: 0.95, airQuality: 26 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('A-405')
  },
  {
    id: 'A-501',
    blockId: 'A',
    floor: 5,
    doorNumber: '501',
    resident: {
      id: 'RES-A501',
      apartmentId: 'A-501',
      name: 'Kavita Pillai',
      email: 'kavita.p@gmail.com',
      phone: '+91 94470 12345',
      pin: '5555',
      moveInDate: '10 Feb 2025',
      emergencyContact: '+91 94470 12340'
    },
    status: 'healthy',
    sensorSummary: { temperature: 24.1, humidity: 51, waterFlow: 4.5, powerUsage: 1.25, airQuality: 30 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('A-501')
  },
  {
    id: 'A-602',
    blockId: 'A',
    floor: 6,
    doorNumber: '602',
    resident: {
      id: 'RES-A602',
      apartmentId: 'A-602',
      name: 'Aditya Varma',
      email: 'aditya.v@matrix.in',
      phone: '+91 99805 66778',
      pin: '6666',
      moveInDate: '18 Apr 2025',
      emergencyContact: '+91 99805 66770'
    },
    status: 'healthy',
    sensorSummary: { temperature: 24.0, humidity: 53, waterFlow: 5.0, powerUsage: 1.4, airQuality: 29 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('A-602')
  },
  {
    id: 'A-704',
    blockId: 'A',
    floor: 7,
    doorNumber: '704',
    resident: {
      id: 'RES-A704',
      apartmentId: 'A-704',
      name: 'Meera Nambiar',
      email: 'meera.n@gmail.com',
      phone: '+91 94460 77889',
      pin: '7777',
      moveInDate: '01 Jun 2025',
      emergencyContact: '+91 94460 77880'
    },
    status: 'healthy',
    sensorSummary: { temperature: 23.6, humidity: 47, waterFlow: 4.1, powerUsage: 1.05, airQuality: 25 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('A-704')
  },

  // Block B
  {
    id: 'B-204',
    blockId: 'B',
    floor: 2,
    doorNumber: '204',
    resident: {
      id: 'RES-B204',
      apartmentId: 'B-204',
      name: 'Siddharth Sen',
      email: 'siddharth.sen@gmail.com',
      phone: '+91 98301 11223',
      pin: '1234',
      moveInDate: '15 Aug 2024',
      emergencyContact: '+91 98301 11220'
    },
    status: 'warning',
    sensorSummary: { temperature: 26.8, humidity: 62, waterFlow: 5.8, powerUsage: 3.2, airQuality: 48 },
    hasActiveAlert: true,
    activeAlertId: 'ALT-2026-0892',
    sensors: generateSensorsForApartment('B-204', false, false)
  },
  {
    id: 'B-301',
    blockId: 'B',
    floor: 3,
    doorNumber: '301',
    resident: {
      id: 'RES-B301',
      apartmentId: 'B-301',
      name: 'Divya Ranganathan',
      email: 'divya.r@gmail.com',
      phone: '+91 98844 55667',
      pin: '1234',
      moveInDate: '28 Sep 2024',
      emergencyContact: '+91 98844 55660'
    },
    status: 'healthy',
    sensorSummary: { temperature: 23.9, humidity: 50, waterFlow: 4.4, powerUsage: 1.3, airQuality: 31 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('B-301')
  },
  {
    id: 'B-404',
    blockId: 'B',
    floor: 4,
    doorNumber: '404',
    resident: {
      id: 'RES-B404',
      apartmentId: 'B-404',
      name: 'Gaurav Mukherjee',
      email: 'gaurav.m@capital.com',
      phone: '+91 98311 22334',
      pin: '1234',
      moveInDate: '10 Nov 2024',
      emergencyContact: '+91 98311 22330'
    },
    status: 'healthy',
    sensorSummary: { temperature: 24.3, humidity: 49, waterFlow: 4.9, powerUsage: 1.5, airQuality: 27 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('B-404')
  },
  {
    id: 'B-508',
    blockId: 'B',
    floor: 5,
    doorNumber: '508',
    resident: {
      id: 'RES-B508',
      apartmentId: 'B-508',
      name: 'Sunita Joshi',
      email: 'sunita.j@gmail.com',
      phone: '+91 98200 33445',
      pin: '1234',
      moveInDate: '02 Dec 2024',
      emergencyContact: '+91 98200 33440'
    },
    status: 'healthy',
    sensorSummary: { temperature: 24.1, humidity: 51, waterFlow: 5.3, powerUsage: 1.6, airQuality: 33 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('B-508')
  },

  // Block C
  {
    id: 'C-105',
    blockId: 'C',
    floor: 1,
    doorNumber: '105',
    resident: {
      id: 'RES-C105',
      apartmentId: 'C-105',
      name: 'Tarun Saxena',
      email: 'tarun.s@fintech.co',
      phone: '+91 98110 88990',
      pin: '1234',
      moveInDate: '14 Jan 2025',
      emergencyContact: '+91 98110 88991'
    },
    status: 'healthy',
    sensorSummary: { temperature: 23.7, humidity: 48, waterFlow: 4.2, powerUsage: 1.15, airQuality: 24 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('C-105')
  },
  {
    id: 'C-302',
    blockId: 'C',
    floor: 3,
    doorNumber: '302',
    resident: {
      id: 'RES-C302',
      apartmentId: 'C-302',
      name: 'Pooja Hegde',
      email: 'pooja.h@gmail.com',
      phone: '+91 98451 77665',
      pin: '1234',
      moveInDate: '22 Feb 2025',
      emergencyContact: '+91 98451 77660'
    },
    status: 'healthy',
    sensorSummary: { temperature: 24.4, humidity: 52, waterFlow: 4.7, powerUsage: 1.42, airQuality: 30 },
    hasActiveAlert: false,
    sensors: generateSensorsForApartment('C-302')
  },
  {
    id: 'C-508',
    blockId: 'C',
    floor: 5,
    doorNumber: '508',
    resident: {
      id: 'RES-C508',
      apartmentId: 'C-508',
      name: 'Karthik Balakrishnan',
      email: 'karthik.b@startup.io',
      phone: '+91 98408 99887',
      pin: '1234',
      moveInDate: '08 Mar 2025',
      emergencyContact: '+91 98408 99880'
    },
    status: 'maintenance',
    sensorSummary: { temperature: 25.4, humidity: 58, waterFlow: 6.0, powerUsage: 2.1, airQuality: 35 },
    hasActiveAlert: false,
    activeTicketId: 'PC-2026-00123',
    sensors: generateSensorsForApartment('C-508')
  }
];

export const INITIAL_AI_ALERTS: AIAlert[] = [
  {
    id: 'ALT-2026-0891',
    apartmentId: 'A-302',
    sensorId: 'SENS-A-302-WTR',
    sensorName: 'Smart Main Water Flow Meter',
    issueTitle: 'Unusual Continuous Water Flow Detected',
    category: 'Water & Plumbing',
    detectedAt: 'Today, 10:42 AM',
    confidence: 87.5,
    readingValue: 14.8,
    normalRange: '2.0 – 8.5 L/min',
    unit: 'L/min',
    explanation: 'Flow rate exceeded historical 95th percentile baseline for > 42 continuous minutes during typical low-occupancy window.',
    modelUsed: 'Isolation Forest',
    status: 'pending'
  },
  {
    id: 'ALT-2026-0892',
    apartmentId: 'B-204',
    sensorId: 'SENS-B-204-TEMP',
    sensorName: 'HVAC Thermal Delta Monitor',
    issueTitle: 'HVAC Compressor Thermal Inefficiency',
    category: 'HVAC & Climate',
    detectedAt: 'Today, 09:15 AM',
    confidence: 82.0,
    readingValue: 26.8,
    normalRange: '20.0 – 24.5 °C',
    unit: '°C',
    explanation: 'Compressor power draw remained peak while room temperature delta remained under 0.4°C over 60 minutes.',
    modelUsed: 'Random Forest',
    status: 'pending'
  }
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    ticketId: 'PC-2026-00125',
    apartmentId: 'A-203',
    residentName: 'Ananya Kumar',
    category: 'Water & Plumbing',
    problem: 'Water Leakage',
    description: 'Continuous high flow anomaly in master bathroom utility line. Resident confirmed unusual water hissing sound.',
    priority: 'high',
    sensorId: 'SENS-A-203-WTR',
    sensorReading: '14.8 L/min (Normal: 2.0 – 8.5 L/min)',
    aiConfidence: 96.0,
    createdAt: 'Today, 10:44 AM',
    updatedAt: 'Today, 10:52 AM',
    status: 'worker_assigned',
    workerId: 'WRK-102',
    workerName: 'Arun Kumar',
    workerSkill: 'Plumber',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    workerNotes: 'Dispatched with ultrasonic leak detector and replacement brass pressure valve.',
    partsReplaced: [],
    timeline: [
      { status: 'ai_detected', timestamp: '10:42 AM', note: 'AI anomaly flagged with 96.0% confidence' },
      { status: 'awaiting_resident', timestamp: '10:42 AM', note: 'Push notification sent to resident' },
      { status: 'resident_confirmed', timestamp: '10:44 AM', note: 'Resident confirmed: Water Leakage problem verified' },
      { status: 'admin_confirmed', timestamp: '10:48 AM', note: 'Admin verified and authorized emergency work order' },
      { status: 'worker_assigned', timestamp: '10:52 AM', note: 'Assigned to Arun Kumar (Plumber)' }
    ]
  },
  {
    ticketId: 'PC-2026-00126',
    apartmentId: 'B-104',
    residentName: 'Vikram Sundaram',
    category: 'Electrical & Power',
    problem: 'Electrical Issue & Circuit Trip',
    description: 'Corridor utility panel breaker trip affecting auxiliary lighting and drain booster.',
    priority: 'medium',
    sensorId: 'SENS-B-104-VOLT',
    sensorReading: '248 V (Normal: 220 – 240 V)',
    aiConfidence: 89.2,
    createdAt: 'Today, 09:15 AM',
    updatedAt: 'Today, 09:30 AM',
    status: 'worker_assigned',
    workerId: 'WRK-102',
    workerName: 'Arun Kumar',
    workerSkill: 'Plumber',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    workerNotes: 'Inspection scheduled after completing active plumbing call.',
    partsReplaced: [],
    timeline: [
      { status: 'resident_confirmed', timestamp: '09:15 AM', note: 'Reported by resident' },
      { status: 'admin_confirmed', timestamp: '09:20 AM', note: 'Admin verified' },
      { status: 'worker_assigned', timestamp: '09:30 AM', note: 'Queued to Arun Kumar' }
    ]
  },
  {
    ticketId: 'PC-2026-00127',
    apartmentId: 'C-302',
    residentName: 'Pooja Hegde',
    category: 'HVAC & Climate',
    problem: 'AC Problem & Condensate Drain Block',
    description: 'AC indoor unit water tray overflow due to clogged drain line.',
    priority: 'low',
    sensorId: 'SENS-C-302-TEMP',
    sensorReading: '26.2 °C (Normal: 21 – 24 °C)',
    aiConfidence: 92.5,
    createdAt: 'Today, 07:30 AM',
    updatedAt: 'Today, 09:10 AM',
    completedAt: 'Today, 09:10 AM',
    status: 'work_completed',
    workerId: 'WRK-102',
    workerName: 'Arun Kumar',
    workerSkill: 'Plumber',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    workerNotes: 'Cleared condensate siphon trap with nitrogen blow and replaced filter mesh.',
    problemFound: 'Algae buildup in secondary condensate siphon tube causing water backup into drip tray.',
    workPerformed: 'Flushed drain tube with pressurized air and installed anti-microbial drain pan tablet.',
    materialsUsed: ['Condensate Drain Tablet x1', 'Flexible PVC Coupling x1'],
    partsReplaced: ['Flexible PVC Coupling x1'],
    repairCost: 250,
    beforeImage: getAssetUrl('/images/apartment_living.jpg'),
    afterImage: getAssetUrl('/images/apartment_living.jpg'),
    residentRating: 5,
    residentFeedback: 'Super quick response, problem resolved before any ceiling damage occurred!',
    timeline: [
      { status: 'resident_confirmed', timestamp: '07:30 AM', note: 'Reported by resident' },
      { status: 'admin_confirmed', timestamp: '07:45 AM', note: 'Admin approved' },
      { status: 'worker_assigned', timestamp: '08:00 AM', note: 'Assigned to Arun Kumar' },
      { status: 'work_in_progress', timestamp: '08:20 AM', note: 'Drain pipe flush in progress' },
      { status: 'work_completed', timestamp: '09:10 AM', note: 'Repair completed by technician' }
    ]
  },
  {
    ticketId: 'PC-2026-00122',
    apartmentId: 'A-204',
    residentName: 'Sneha Iyer',
    category: 'Electrical & Power',
    problem: 'Kitchen Induction Circuit Trip & Voltage Fluctuation',
    description: 'Sub-panel breaker tripped repeatedly during morning cooking. Over-voltage transient spikes recorded on Line 2.',
    priority: 'high',
    sensorId: 'SENS-A-204-VOLT',
    sensorReading: '262 V (Normal: 215 – 245 V)',
    aiConfidence: 91.0,
    createdAt: 'Today, 08:30 AM',
    updatedAt: 'Today, 09:45 AM',
    status: 'work_in_progress',
    workerId: 'W-02',
    workerName: 'Suresh Patel',
    workerSkill: 'Senior Electrician',
    workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    workerNotes: 'Diagnosed loose neutral lug in corridor distribution riser box. Replacing 32A MCB breaker.',
    timeline: [
      { status: 'ai_detected', timestamp: '08:28 AM', note: 'Voltage spike anomaly recorded at 262V' },
      { status: 'resident_confirmed', timestamp: '08:30 AM', note: 'Resident confirmed tripping' },
      { status: 'admin_confirmed', timestamp: '08:35 AM', note: 'Admin verified and marked High priority' },
      { status: 'worker_assigned', timestamp: '08:40 AM', note: 'Assigned to Suresh Patel' },
      { status: 'worker_accepted', timestamp: '08:45 AM', note: 'Worker accepted job' },
      { status: 'worker_en_route', timestamp: '08:50 AM', note: 'Worker en route to Block A' },
      { status: 'work_in_progress', timestamp: '09:05 AM', note: 'Work started in apartment utility sub-panel' }
    ]
  },
  {
    ticketId: 'PC-2026-00123',
    apartmentId: 'C-508',
    residentName: 'Karthik Balakrishnan',
    category: 'Civil & Structure',
    problem: 'Balcony Glass Balustrade Alignment Adjustment',
    description: 'Sliding balcony track friction and loose safety clamp on corner pane after seasonal wind storm.',
    priority: 'medium',
    createdAt: 'Yesterday, 04:15 PM',
    updatedAt: 'Today, 11:10 AM',
    completedAt: 'Today, 11:35 AM',
    status: 'work_completed',
    workerId: 'W-04',
    workerName: 'Rajesh Sharma',
    workerSkill: 'General Maintenance Specialist',
    workerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    workerNotes: 'Re-aligned lower roller track with silicone lubricant and tightened stainless steel clamping brackets.',
    partsReplaced: ['Stainless Steel Clamp x2', 'Track Roller Guide x1'],
    repairCost: 450,
    beforeImage: getAssetUrl('/images/balcony_nature.jpg'),
    afterImage: getAssetUrl('/images/balcony_nature.jpg'),
    timeline: [
      { status: 'resident_confirmed', timestamp: 'Yesterday, 04:15 PM', note: 'Reported manually by resident' },
      { status: 'admin_confirmed', timestamp: 'Yesterday, 04:30 PM', note: 'Approved by property manager' },
      { status: 'worker_assigned', timestamp: 'Today, 10:00 AM', note: 'Assigned to Rajesh Sharma' },
      { status: 'work_in_progress', timestamp: 'Today, 10:45 AM', note: 'Roller alignment in progress' },
      { status: 'work_completed', timestamp: 'Today, 11:35 AM', note: 'Work marked completed by technician. Awaiting resident review.' }
    ]
  },
  {
    ticketId: 'PC-2026-00119',
    apartmentId: 'A-101',
    residentName: 'Rohan Sharma',
    category: 'Water & Plumbing',
    problem: 'Kitchen Sink Aerator Blockage & Reduced Pressure',
    description: 'Mineral sedimentation causing aerator clogging in kitchen faucet.',
    priority: 'low',
    createdAt: '18 Sep 2026, 02:00 PM',
    updatedAt: '18 Sep 2026, 03:40 PM',
    completedAt: '18 Sep 2026, 03:30 PM',
    verifiedAt: '18 Sep 2026, 03:40 PM',
    status: 'resident_verified',
    workerId: 'WRK-102',
    workerName: 'Arun Kumar',
    workerSkill: 'Plumber',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    workerNotes: 'Cleaned limescale and fitted new high-flow Neoperl aerator cartridge.',
    problemFound: 'Hard water mineral deposits inside 22mm brass aerator housing.',
    workPerformed: 'Descaled housing with citric solution and installed 6L/min water-saving cartridge.',
    materialsUsed: ['Neoperl 6L Aerator x1', 'EPDM Washer x1'],
    partsReplaced: ['Neoperl 6L Aerator'],
    repairCost: 180,
    residentRating: 5,
    residentFeedback: 'Prompt and clean service. Arun resolved it within 15 minutes of arrival!',
    timeline: [
      { status: 'resident_confirmed', timestamp: '02:00 PM', note: 'Ticket lodged by resident' },
      { status: 'admin_confirmed', timestamp: '02:10 PM', note: 'Dispatched to Arun Kumar' },
      { status: 'work_in_progress', timestamp: '03:00 PM', note: 'Work initiated' },
      { status: 'work_completed', timestamp: '03:30 PM', note: 'Repair finished' },
      { status: 'resident_verified', timestamp: '03:40 PM', note: '5-star verification confirmed by Rohan Sharma' }
    ]
  }
];

export const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'ACT-01',
    timestamp: '10:52 AM',
    timeAgo: 'Just now',
    type: 'admin_action',
    title: 'Technician Assigned',
    description: 'Ravi Kumar (Plumber) assigned to Ticket PC-2026-00125 (A-302)',
    apartmentId: 'A-302',
    ticketId: 'PC-2026-00125'
  },
  {
    id: 'ACT-02',
    timestamp: '10:48 AM',
    timeAgo: '4 mins ago',
    type: 'admin_action',
    title: 'Work Order Authorized',
    description: 'Property Manager verified priority for Water Leakage in A-302',
    apartmentId: 'A-302',
    ticketId: 'PC-2026-00125'
  },
  {
    id: 'ACT-03',
    timestamp: '10:44 AM',
    timeAgo: '8 mins ago',
    type: 'resident_confirm',
    title: 'Resident Verified Issue',
    description: 'Ananya Kumar confirmed water anomaly notification in A-302',
    apartmentId: 'A-302',
    ticketId: 'PC-2026-00125'
  },
  {
    id: 'ACT-04',
    timestamp: '10:42 AM',
    timeAgo: '10 mins ago',
    type: 'ai_alert',
    title: 'AI Anomaly Detected',
    description: 'Isolation Forest model flagged 14.8 L/min water surge in A-302 (87.5% confidence)',
    apartmentId: 'A-302'
  },
  {
    id: 'ACT-05',
    timestamp: '09:45 AM',
    timeAgo: '1 hour ago',
    type: 'worker_action',
    title: 'Work In Progress',
    description: 'Suresh Patel started kitchen electrical sub-panel replacement in A-204',
    apartmentId: 'A-204',
    ticketId: 'PC-2026-00122'
  },
  {
    id: 'ACT-06',
    timestamp: '09:15 AM',
    timeAgo: '1.5 hours ago',
    type: 'ai_alert',
    title: 'HVAC Thermal Warning',
    description: 'Random Forest model flagged compressor thermal delta in B-204',
    apartmentId: 'B-204'
  },
  {
    id: 'ACT-07',
    timestamp: '08:15 AM',
    timeAgo: '2.5 hours ago',
    type: 'false_alert',
    title: 'False Detection Recorded',
    description: 'Resident marked power surge in B-301 as normal EV high-speed charging. AI model weights updated.',
    apartmentId: 'B-301'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Possible Water Leakage Detected',
    message: 'Your apartment A-203 shows unusual 14.8 L/min water usage. Please confirm if there is a problem.',
    timestamp: '10:42 AM',
    type: 'alert',
    isRead: false,
    targetRole: 'resident',
    linkTarget: { role: 'resident', tab: 'alerts', apartmentId: 'A-203' }
  },
  {
    id: 'NOTIF-02',
    title: 'New Maintenance Assigned',
    message: 'Ticket PC-2026-00125 (Water Leakage - Apartment A-203) assigned to you.',
    timestamp: '10:52 AM',
    type: 'worker',
    isRead: false,
    targetRole: 'worker',
    linkTarget: { role: 'worker', ticketId: 'PC-2026-00125' }
  },
  {
    id: 'NOTIF-03',
    title: 'Resident Confirmed the Problem',
    message: 'Resident Ananya Kumar in A-203 confirmed water anomaly. Urgency upgraded.',
    timestamp: '10:44 AM',
    type: 'worker',
    isRead: false,
    targetRole: 'worker',
    linkTarget: { role: 'worker', ticketId: 'PC-2026-00125' }
  },
  {
    id: 'NOTIF-04',
    title: 'Admin Approved the Request',
    message: 'Property Manager verified priority and authorized immediate dispatch.',
    timestamp: '10:48 AM',
    type: 'worker',
    isRead: false,
    targetRole: 'worker',
    linkTarget: { role: 'worker', ticketId: 'PC-2026-00125' }
  },
  {
    id: 'NOTIF-05',
    title: 'Job Location Updated',
    message: 'Main water shutoff valve is located in 2nd Floor Utility Duct East (Access Code: 2044).',
    timestamp: '10:55 AM',
    type: 'worker',
    isRead: true,
    targetRole: 'worker',
    linkTarget: { role: 'worker', ticketId: 'PC-2026-00125' }
  },
  {
    id: 'NOTIF-06',
    title: 'Resident Requested Completion Verification',
    message: 'Resident Pooja Hegde in C-302 submitted 5-star verification for AC Drain Repair (PC-2026-00127).',
    timestamp: '09:20 AM',
    type: 'worker',
    isRead: true,
    targetRole: 'worker',
    linkTarget: { role: 'worker', ticketId: 'PC-2026-00127' }
  },
  {
    id: 'NOTIF-07',
    title: 'Work Completed — Verification Needed',
    message: 'Technician Rajesh Sharma finished repair on Ticket PC-2026-00123 (C-508 Balcony). Resident review pending.',
    timestamp: '11:35 AM',
    type: 'ticket',
    isRead: false,
    targetRole: 'admin',
    linkTarget: { role: 'admin', tab: 'maintenance', ticketId: 'PC-2026-00123' }
  },
  {
    id: 'NOTIF-08',
    title: 'Monthly Solar Inverter Maintenance Completed',
    message: 'Rooftop solar telemetry normal across all 3 residential blocks. Generation efficiency: 98.4%.',
    timestamp: 'Yesterday, 05:00 PM',
    type: 'system',
    isRead: true,
    targetRole: 'all'
  }
];
