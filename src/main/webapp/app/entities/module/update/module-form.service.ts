import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IModule, NewModule } from '../module.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IModule for edit and NewModuleFormGroupInput for create.
 */
type ModuleFormGroupInput = IModule | PartialWithRequiredKeyOf<NewModule>;

type ModuleFormDefaults = Pick<NewModule, 'id'>;

type ModuleFormGroupContent = {
  id: FormControl<IModule['id'] | NewModule['id']>;
  moduleName: FormControl<IModule['moduleName']>;
  startDate: FormControl<IModule['startDate']>;
  endDate: FormControl<IModule['endDate']>;
  project: FormControl<IModule['project']>;
};

export type ModuleFormGroup = FormGroup<ModuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModuleFormService {
  createModuleFormGroup(module: ModuleFormGroupInput = { id: null }): ModuleFormGroup {
    const moduleRawValue = {
      ...this.getFormDefaults(),
      ...module,
    };
    return new FormGroup<ModuleFormGroupContent>({
      id: new FormControl(
        { value: moduleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      moduleName: new FormControl(moduleRawValue.moduleName, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(moduleRawValue.startDate),
      endDate: new FormControl(moduleRawValue.endDate),
      project: new FormControl(moduleRawValue.project),
    });
  }

  getModule(form: ModuleFormGroup): IModule | NewModule {
    return form.getRawValue() as IModule | NewModule;
  }

  resetForm(form: ModuleFormGroup, module: ModuleFormGroupInput): void {
    const moduleRawValue = { ...this.getFormDefaults(), ...module };
    form.reset(
      {
        ...moduleRawValue,
        id: { value: moduleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ModuleFormDefaults {
    return {
      id: null,
    };
  }
}
