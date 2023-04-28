import { IDepartment } from 'app/entities/department/department.model';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IJobHistory {
  id: number;
  startDate?: string | null;
  endDate?: string | null;
  department?: Pick<IDepartment, 'id'> | null;
  employee?: Pick<IEmployee, 'id'> | null;
}

export type NewJobHistory = Omit<IJobHistory, 'id'> & { id: null };
