import { IRole, NewRole } from './role.model';

export const sampleWithRequiredData: IRole = {
  id: 56879,
  role: 'Knolls Loan portals',
};

export const sampleWithPartialData: IRole = {
  id: 73835,
  role: 'Fords impactful Mouse',
};

export const sampleWithFullData: IRole = {
  id: 4555,
  role: 'multi-byte indexing methodical',
};

export const sampleWithNewData: NewRole = {
  role: 'Chicken',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
