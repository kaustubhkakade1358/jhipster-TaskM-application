import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'role',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.role.home.title' },
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      {
        path: 'project',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.project.home.title' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'module',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.module.home.title' },
        loadChildren: () => import('./module/module.module').then(m => m.ModuleModule),
      },
      {
        path: 'department',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.department.home.title' },
        loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'job-history',
        data: { pageTitle: 'jhipsterTaskMApplicationApp.jobHistory.home.title' },
        loadChildren: () => import('./job-history/job-history.module').then(m => m.JobHistoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
