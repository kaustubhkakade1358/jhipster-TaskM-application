import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 55962,
  projectName: 'COM dedicated Agent',
};

export const sampleWithPartialData: IProject = {
  id: 53955,
  projectName: 'users parse AGP',
  startDate: 'dot-com',
};

export const sampleWithFullData: IProject = {
  id: 50253,
  projectName: 'Centers',
  startDate: 'regional Loan bluetooth',
  endDate: 'Agent',
};

export const sampleWithNewData: NewProject = {
  projectName: 'Light Niger (Slovak',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
