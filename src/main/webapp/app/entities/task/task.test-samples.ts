import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 37978,
  title: 'CSS Account Up-sized',
};

export const sampleWithPartialData: ITask = {
  id: 77015,
  title: 'Representative Bedfordshire Jewelery',
  endTime: 'Principal Internal',
};

export const sampleWithFullData: ITask = {
  id: 66924,
  title: 'attitude Industrial Dirham',
  description: 'invoice Concrete program',
  startTime: 'Oklahoma Account',
  endTime: 'matrix',
};

export const sampleWithNewData: NewTask = {
  title: 'Licensed Account',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
