export interface Project {
    id?: number;
    title: string;
    description?: string;
    status?: 'active' | 'finished'; // <-- Add this line
  }
  