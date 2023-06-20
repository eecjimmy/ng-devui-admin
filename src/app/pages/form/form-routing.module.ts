import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { FormLayoutComponent } from './form-layout/form-layout.component';
import { FormComponent } from './form.component';
import { AdvanceFormComponent } from './advance-form/advance-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    children: [
      { path: 'basic-form', component: BasicFormComponent, title: '基础表单', data: { a: 'b' } },
      { path: 'form-layout', component: FormLayoutComponent, title: '布局表单', data: { a: 'b' } },
      { path: 'advanced-form', component: AdvanceFormComponent, title: '高级表单' },
      { path: 'dynamic-form', component: DynamicFormComponent, title: '动态表单' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {
}
