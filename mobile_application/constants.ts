
import { Garage, Mechanic, UserRole, User, GarageRegistrationStatus } from './types';

export const SLIIT_LOCATION: [number, number] = [6.914833, 79.972861];

export const MOCK_DRIVER: User = {
  id: 'driver_1',
  name: 'Kavindu',
  email: 'kavindu@example.com',
  role: UserRole.DRIVER,
  location: SLIIT_LOCATION
};

export const DUMMY_GARAGES: Garage[] = [
  {
    id: 'g1',
    name: 'Elite Car Care',
    owner: 'Aruna',
    phone: '0771112223',
    email: 'aruna@elite.lk',
    regNumber: 'REG-E001',
    location: [6.917808, 79.972542],
    address: 'New Kandy Rd, Malabe',
    type: 'Local',
    status: 'Open',
    availability: 'Busy',
    waitingTime: 15,
    rating: 3.2,
    mechanicsCount: 2,
    mechanics: [
      { id: 'm1', name: 'Jagath', years: 7, specialization: 'Engine', isAvailable: true, attendance: 'Checked-In' },
      { id: 'm2', name: 'Saman', years: 9, specialization: 'Suspension', isAvailable: true, attendance: 'Checked-In' }
    ],
    distance: 0.5,
    arrivalTime: 2,
    regStatus: GarageRegistrationStatus.APPROVED,
    operatingHours: '8:00 AM - 8:00 PM'
  },
  {
    id: 'g2',
    name: 'Dara Garage',
    owner: 'Nimal',
    phone: '0772223334',
    email: 'nimal@dara.lk',
    regNumber: 'REG-D002',
    location: [6.915941, 79.969006],
    address: 'Malabe Main Rd',
    type: 'Authorized',
    status: 'Open',
    availability: 'Available',
    waitingTime: 0,
    rating: 4.2,
    mechanicsCount: 3,
    mechanics: [
      { id: 'd1', name: 'Ruwan', years: 7, specialization: 'General', isAvailable: true, attendance: 'Checked-In' },
      { id: 'd2', name: 'Kasun', years: 12, specialization: 'Engine', isAvailable: true, attendance: 'Checked-In' },
      { id: 'd3', name: 'Amila', years: 3, specialization: 'Brakes', isAvailable: true, attendance: 'Checked-In' }
    ],
    distance: 0.55,
    arrivalTime: 2,
    regStatus: GarageRegistrationStatus.APPROVED,
    operatingHours: '24 Hours'
  },
  {
    id: 'g3',
    name: 'Motor Vision',
    owner: 'Kamal',
    phone: '0773334445',
    email: 'kamal@motorv.lk',
    regNumber: 'REG-M003',
    location: [6.915764, 79.969251],
    address: 'Kandy Rd, Malabe',
    type: 'Authorized',
    status: 'Open',
    availability: 'Busy',
    waitingTime: 15,
    rating: 4.4,
    mechanicsCount: 5,
    mechanics: [
      { id: 'v1', name: 'Sunil', years: 12, specialization: 'All', isAvailable: true, attendance: 'Checked-In' },
      { id: 'v2', name: 'Silva', years: 14, specialization: 'Engine', isAvailable: true, attendance: 'Checked-In' },
      { id: 'v3', name: 'Perera', years: 10, specialization: 'AC', isAvailable: true, attendance: 'Checked-In' },
      { id: 'v4', name: 'Namal', years: 8, specialization: 'Paint', isAvailable: true, attendance: 'Checked-In' },
      { id: 'v5', name: 'Rohana', years: 6, specialization: 'Brakes', isAvailable: true, attendance: 'Checked-In' }
    ],
    distance: 0.6,
    arrivalTime: 3,
    regStatus: GarageRegistrationStatus.APPROVED,
    operatingHours: '8:00 AM - 10:00 PM'
  },
  {
    id: 'g4',
    name: 'Quick Fix',
    owner: 'Saman',
    phone: '0774445556',
    email: 'info@quickfix.lk',
    regNumber: 'REG-Q004',
    location: [6.916514, 79.973312],
    address: 'Junction Rd, Malabe',
    type: 'Local',
    status: 'Open',
    availability: 'Available',
    waitingTime: 0,
    rating: 4.0,
    mechanicsCount: 3,
    mechanics: [
      { id: 'q1', name: 'Danuka', years: 4, specialization: 'Service', isAvailable: true, attendance: 'Checked-In' },
      { id: 'q2', name: 'Dilan', years: 6, specialization: 'Repair', isAvailable: true, attendance: 'Checked-In' },
      { id: 'q3', name: 'Sameera', years: 6, specialization: 'Electrical', isAvailable: true, attendance: 'Checked-In' }
    ],
    distance: 0.6,
    arrivalTime: 3,
    regStatus: GarageRegistrationStatus.APPROVED,
    operatingHours: '8:00 AM - 6:00 PM'
  },
  {
    id: 'g5',
    name: 'Malabe Service Station',
    owner: 'Perera',
    phone: '0775556667',
    email: 'service@malabe.lk',
    regNumber: 'REG-S005',
    location: [6.910179, 79.968944],
    address: 'SLIIT Rd, Malabe',
    type: 'Authorized',
    status: 'Open',
    availability: 'Available',
    waitingTime: 15,
    rating: 3.5,
    mechanicsCount: 4,
    mechanics: [
      { id: 's1', name: 'John', years: 2, specialization: 'General', isAvailable: true, attendance: 'Checked-In' },
      { id: 's2', name: 'Doe', years: 2, specialization: 'General', isAvailable: true, attendance: 'Checked-In' },
      { id: 's3', name: 'Smith', years: 4, specialization: 'Mechanical', isAvailable: true, attendance: 'Checked-In' },
      { id: 's4', name: 'Wick', years: 6, specialization: 'Mechanical', isAvailable: true, attendance: 'Checked-In' }
    ],
    distance: 1.7,
    arrivalTime: 6,
    regStatus: GarageRegistrationStatus.APPROVED,
    operatingHours: '7:00 AM - 8:00 PM'
  }
];

export const DUMMY_MECHANICS: Mechanic[] = [
  {
    id: 'm1',
    name: 'Jagath',
    rating: 4.8,
    experience: 15,
    location: [6.918, 79.975],
    status: 'Online',
    specialization: ['Engine', 'Overheating']
  }
];

export const RECOMMENDATION_WEIGHTS = {
  distance: 0.25,
  waiting: 0.35,
  arrival: 0.15,
  rating: 0.20,
  mechanics: 0.05
};
