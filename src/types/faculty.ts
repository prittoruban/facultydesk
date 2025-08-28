import { type FacultyStatus } from '@/lib/faculty-sheets';

export interface FacultyCardProps {
  name: string;
  status: FacultyStatus;
  lastUpdated?: string;
}

export interface FacultyStatusResponse {
  [facultyName: string]: FacultyStatus;
}
