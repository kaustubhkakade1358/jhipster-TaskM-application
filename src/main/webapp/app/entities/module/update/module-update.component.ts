import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ModuleFormService, ModuleFormGroup } from './module-form.service';
import { IModule } from '../module.model';
import { ModuleService } from '../service/module.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

@Component({
  selector: 'jhi-module-update',
  templateUrl: './module-update.component.html',
})
export class ModuleUpdateComponent implements OnInit {
  isSaving = false;
  module: IModule | null = null;

  projectsSharedCollection: IProject[] = [];

  editForm: ModuleFormGroup = this.moduleFormService.createModuleFormGroup();

  constructor(
    protected moduleService: ModuleService,
    protected moduleFormService: ModuleFormService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ module }) => {
      this.module = module;
      if (module) {
        this.updateForm(module);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const module = this.moduleFormService.getModule(this.editForm);
    if (module.id !== null) {
      this.subscribeToSaveResponse(this.moduleService.update(module));
    } else {
      this.subscribeToSaveResponse(this.moduleService.create(module));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModule>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(module: IModule): void {
    this.module = module;
    this.moduleFormService.resetForm(this.editForm, module);

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      module.project
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.module?.project)))
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }
}
