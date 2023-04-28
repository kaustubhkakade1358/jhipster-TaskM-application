import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: 95113,
};

export const sampleWithPartialData: IJobHistory = {
  id: 19180,
  endDate: 'Developer parse calculating',
};

export const sampleWithFullData: IJobHistory = {
  id: 98236,
  startDate: 'Fresh copying',
  endDate: 'lavender Assurance Global',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
