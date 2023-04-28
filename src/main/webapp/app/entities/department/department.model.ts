import { IProject } from 'app/entities/project/project.model';

export interface IDepartment {
  id: number;
  departmentName?: string | null;
  project?: Pick<IProject, 'id'> | null;
}

export type NewDepartment = Omit<IDepartment, 'id'> & { id: null };
