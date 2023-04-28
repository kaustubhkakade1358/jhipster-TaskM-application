import { IModule, NewModule } from './module.model';

export const sampleWithRequiredData: IModule = {
  id: 49866,
  moduleName: 'Fantastic end-to-end Central',
};

export const sampleWithPartialData: IModule = {
  id: 13346,
  moduleName: 'Grocery',
  endDate: 'Avon Rustic',
};

export const sampleWithFullData: IModule = {
  id: 31602,
  moduleName: 'black Markets',
  startDate: 'compressing Practical Senior',
  endDate: 'magenta Vanuatu',
};

export const sampleWithNewData: NewModule = {
  moduleName: 'IB panel invoice',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
