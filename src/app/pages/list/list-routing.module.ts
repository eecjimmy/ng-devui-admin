import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BasicListComponent } from './basic-list/basic-list.component';
import { CardListComponent } from './card-list/card-list.component';
import { ListComponent } from './list.component';
import { AdvanceListComponent } from './advance-list/advance-list.component';
import { TreeListComponent } from './tree-list/tree-list.component';
import { EditableListComponent } from './editable-list/editable-list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    children: [
      { path: 'basic', component: BasicListComponent, title: '基础列表' },
      { path: 'card', component: CardListComponent, title: '卡片列表' },
      { path: 'editable', component: EditableListComponent, title: '编辑列表' },
      { path: 'advance', component: AdvanceListComponent, title: '高级列表' },
      { path: 'tree', component: TreeListComponent, title: '树状列表' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule {
}
