export interface UserResponseDTO {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'CAREGIVER' | 'SUPERVISOR' | 'MANAGER';
}

export interface UserRequestDTO {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'CAREGIVER' | 'SUPERVISOR' | 'MANAGER';
}

export interface ShiftResponseDTO {
  employeeRole: any;
  id: number;
  startTime: string;
  endTime: string;
  totalHours: number;
  employeeId: number;
  employeeName?: string;
}

export interface ShiftRequestDTO {
  date: string | number | Date;
  startTime: string;
  endTime: string;
  employeeId: number;
}
