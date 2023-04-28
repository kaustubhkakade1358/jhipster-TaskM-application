import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
  firstName: 'Donnell',
  lastName: 'Stamm',
};

export const sampleWithPartialData: IEmployee = {
  id: 37115,
  firstName: 'Nedra',
  lastName: 'Weimann',
  email: 'Kennedi.Kutch28@hotmail.com',
  salary: 8063,
};

export const sampleWithFullData: IEmployee = {
  id: 14006,
  firstName: 'Joannie',
  lastName: 'Ziemann',
  email: 'Eddie.Stoltenberg@yahoo.com',
  phoneNumber: 'internet Ville strategic',
  salary: 22575,
};

export const sampleWithNewData: NewEmployee = {
  firstName: 'Emily',
  lastName: 'Raynor',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
