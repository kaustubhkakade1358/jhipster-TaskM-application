import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJobHistory, NewJobHistory } from '../job-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobHistory for edit and NewJobHistoryFormGroupInput for create.
 */
type JobHistoryFormGroupInput = IJobHistory | PartialWithRequiredKeyOf<NewJobHistory>;

type JobHistoryFormDefaults = Pick<NewJobHistory, 'id'>;

type JobHistoryFormGroupContent = {
  id: FormControl<IJobHistory['id'] | NewJobHistory['id']>;
  startDate: FormControl<IJobHistory['startDate']>;
  endDate: FormControl<IJobHistory['endDate']>;
  department: FormControl<IJobHistory['department']>;
  employee: FormControl<IJobHistory['employee']>;
};

export type JobHistoryFormGroup = FormGroup<JobHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobHistoryFormService {
  createJobHistoryFormGroup(jobHistory: JobHistoryFormGroupInput = { id: null }): JobHistoryFormGroup {
    const jobHistoryRawValue = {
      ...this.getFormDefaults(),
      ...jobHistory,
    };
    return new FormGroup<JobHistoryFormGroupContent>({
      id: new FormControl(
        { value: jobHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startDate: new FormControl(jobHistoryRawValue.startDate),
      endDate: new FormControl(jobHistoryRawValue.endDate),
      department: new FormControl(jobHistoryRawValue.department),
      employee: new FormControl(jobHistoryRawValue.employee),
    });
  }

  getJobHistory(form: JobHistoryFormGroup): IJobHistory | NewJobHistory {
    return form.getRawValue() as IJobHistory | NewJobHistory;
  }

  resetForm(form: JobHistoryFormGroup, jobHistory: JobHistoryFormGroupInput): void {
    const jobHistoryRawValue = { ...this.getFormDefaults(), ...jobHistory };
    form.reset(
      {
        ...jobHistoryRawValue,
        id: { value: jobHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JobHistoryFormDefaults {
    return {
      id: null,
    };
  }
}
