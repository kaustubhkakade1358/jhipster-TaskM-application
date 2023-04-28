export interface IProject {
  id: number;
  projectName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
