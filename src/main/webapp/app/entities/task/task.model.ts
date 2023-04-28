import { IModule } from 'app/entities/module/module.model';
import { IProject } from 'app/entities/project/project.model';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface ITask {
  id: number;
  title?: string | null;
  description?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  module?: Pick<IModule, 'id'> | null;
  project?: Pick<IProject, 'id'> | null;
  employee?: Pick<IEmployee, 'id'> | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
