import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly data: Array<Menu> = new Array<Menu>();

  constructor() {
    this.data = [
      {
        title: 'Dashboard',
        icon: 'icon icon-console',
        children: [
          { title: '分析页', link: '/pages/dashboard/analysis' },
          { title: '监控页', link: '/pages/dashboard/monitor' },
          { title: '工作台', link: '/pages/dashboard/workspace' },
        ],
      },
      {
        title: '表单页',
        icon: 'icon icon-modify',
        children: [
          { title: '基础表单', link: '/pages/form/basic-form' },
          { title: '表单布局', link: '/pages/form/form-layout' },
          { title: '高级表单', link: '/pages/form/advanced-form' },
          { title: '动态表单', link: '/pages/form/dynamic-form' },
        ],
      },
      {
        title: '列表页',
        icon: 'icon icon-table',
        children: [
          { title: '基础列表', link: '/pages/list/basic' },
          { title: '卡片列表', link: '/pages/list/card' },
          { title: '编辑列表', link: '/pages/list/editable' },
          { title: '高级列表', link: '/pages/list/advance' },
          { title: '树状列表', link: '/pages/list/tree' },
        ],
      },
      {
        title: '个人页',
        icon: 'icon icon-mine',
        children: [
          { title: '个人中心', link: '/pages/user/center' },
          { title: '个人设置', link: '/pages/user/settings' },
        ],
      },
    ];
  }

  public getMenuData(): Observable<any> {
    return of(this.data);
  }
}

export interface Menu {
  title: string;
  link?: string;
  icon?: string;
  children?: Menu[];
}
