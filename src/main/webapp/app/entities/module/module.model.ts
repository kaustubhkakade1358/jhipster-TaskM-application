import { IProject } from 'app/entities/project/project.model';

export interface IModule {
  id: number;
  moduleName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  project?: Pick<IProject, 'id'> | null;
}

export type NewModule = Omit<IModule, 'id'> & { id: null };
