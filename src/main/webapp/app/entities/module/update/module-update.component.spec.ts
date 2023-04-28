import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ModuleFormService } from './module-form.service';
import { ModuleService } from '../service/module.service';
import { IModule } from '../module.model';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { ModuleUpdateComponent } from './module-update.component';

describe('Module Management Update Component', () => {
  let comp: ModuleUpdateComponent;
  let fixture: ComponentFixture<ModuleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moduleFormService: ModuleFormService;
  let moduleService: ModuleService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ModuleUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ModuleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModuleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moduleFormService = TestBed.inject(ModuleFormService);
    moduleService = TestBed.inject(ModuleService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const module: IModule = { id: 456 };
      const project: IProject = { id: 76262 };
      module.project = project;

      const projectCollection: IProject[] = [{ id: 81095 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ module });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining)
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const module: IModule = { id: 456 };
      const project: IProject = { id: 89875 };
      module.project = project;

      activatedRoute.data = of({ module });
      comp.ngOnInit();

      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.module).toEqual(module);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModule>>();
      const module = { id: 123 };
      jest.spyOn(moduleFormService, 'getModule').mockReturnValue(module);
      jest.spyOn(moduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ module });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: module }));
      saveSubject.complete();

      // THEN
      expect(moduleFormService.getModule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moduleService.update).toHaveBeenCalledWith(expect.objectContaining(module));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModule>>();
      const module = { id: 123 };
      jest.spyOn(moduleFormService, 'getModule').mockReturnValue({ id: null });
      jest.spyOn(moduleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ module: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: module }));
      saveSubject.complete();

      // THEN
      expect(moduleFormService.getModule).toHaveBeenCalled();
      expect(moduleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModule>>();
      const module = { id: 123 };
      jest.spyOn(moduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ module });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moduleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        comp.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
