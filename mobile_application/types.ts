
export enum UserRole {
  DRIVER = 'DRIVER',
  GARAGE = 'GARAGE',
  MECHANIC = 'MECHANIC',
  ADMIN = 'ADMIN'
}

export enum FaultSeverity {
  MINOR = 'Minor',
  MODERATE = 'Moderate',
  MAJOR = 'Major'
}

export enum GarageRegistrationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFYING_OTP = 'VERIFYING_OTP',
  REGISTERING = 'REGISTERING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Vehicle {
  id: string;
  model: string;
  year: number;
  mileage: number;
  transmission: 'Manual' | 'Automatic';
  registration: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: [number, number];
}

export interface Garage {
  id: string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  regNumber: string;
  location: [number, number];
  address: string;
  type: 'Local' | 'Authorized';
  status: 'Open' | 'Closed';
  availability: 'Available' | 'Busy';
  waitingTime: number; 
  rating: number;
  mechanicsCount: number;
  mechanics: MechanicStaff[];
  distance?: number;
  arrivalTime?: number;
  score?: number;
  regStatus: GarageRegistrationStatus;
  operatingHours: string;
}

export interface MechanicStaff {
  id: string;
  name: string;
  years: number;
  specialization: string;
  isAvailable: boolean;
  attendance: 'Checked-In' | 'Checked-Out';
  currentJobId?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  rating: number;
  experience: number;
  location: [number, number];
  status: 'Online' | 'Offline';
  specialization: string[];
}

export interface DiagnosisResult {
  vehicle: Vehicle;
  faultCategory: string;
  faultType: string;
  severity: FaultSeverity;
  partsRequired: string[];
  isDrivable: boolean;
  symptoms: string[];
  confidence: number;
  repairTimeEstimate: string;
  urgency: 'LOW' | 'MEDIUM' | 'EMERGENCY';
  safetyInstructions?: string[];
  likelyCauses?: string[];
}

export interface Job {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  assignedId: string; // Garage or Mechanic ID
  assignedType: UserRole.GARAGE | UserRole.MECHANIC;
  assignedMechanicName?: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed';
  diagnosis: DiagnosisResult;
  notes?: string;
  photos?: string[];
  cost?: number;
  isPaid: boolean;
  createdAt: number;
  completedAt?: number;
}
