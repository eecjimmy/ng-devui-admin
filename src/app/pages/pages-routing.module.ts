import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './abnormal/not-found/not-found.component';
import { tabGuard } from '../@core/services/tab.service';
import { checkEnvGuard } from '../@core/services/environment.service';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivateChild: [tabGuard, checkEnvGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'form',
        loadChildren: () => import('./form/form.module').then((m) => m.FormModule),
      },
      {
        path: 'list',
        loadChildren: () => import('./list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'abnormal',
        loadChildren: () => import('./abnormal/abnormal.module').then((m) => m.AbnormalModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
