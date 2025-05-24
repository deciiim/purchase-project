export interface Project {
  id?: number;
  title: string;
  description: string;
  createdAt: Date;
  status?: string; // <- Add this line
}
