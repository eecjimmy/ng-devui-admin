import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AnalysisComponent } from './analysis/analysis.component';
import { MonitorComponent } from './monitor/monitor.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'analysis', component: AnalysisComponent, title: '分析页' },
      { path: 'monitor', component: MonitorComponent, title: '监控页' },
      { path: 'workspace', component: WorkSpaceComponent, title: '工作台' },
      { path: '', redirectTo: 'analysis', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
