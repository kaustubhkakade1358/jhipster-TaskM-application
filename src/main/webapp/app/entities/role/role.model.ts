import { IEmployee } from 'app/entities/employee/employee.model';

export interface IRole {
  id: number;
  role?: string | null;
  employees?: Pick<IEmployee, 'id'>[] | null;
}

export type NewRole = Omit<IRole, 'id'> & { id: null };
