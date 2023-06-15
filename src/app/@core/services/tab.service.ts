import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastService } from 'ng-devui';
import { Injectable } from '@angular/core';
import { AppRouteReuseStrategy } from './route.service';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private static ID: Number = 0;

  private tabList: TabInterface[] = [];
  private activateTab: TabInterface | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private toastService: ToastService, private reuseRouteService: AppRouteReuseStrategy) {
  }

  // 路由结束事件
  public onNavigationEnd() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd)) // 仅处理`NavigationEnd`事件
      .subscribe(e => {
        const e2 = <NavigationEnd> e; // 强制转换`Event_2`为`NavigationEnd`事件
        const title = '未知标签'; // 默认标签名，后续可以通过其他方式获取，比如通过路由配置中的title或者是其他方式
        const tab = new Tab(e2.url, title);
        console.log(tab);
        if (!this.getActivateTabByPath(tab.path)) {
          this.tabList.push(tab);
        }
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].path === e2.url) {
            this.activateTab = this.tabList[i];
            break;
          }
        }
      });
  }

  // 根据path查找对应的tab
  private getActivateTabByPath(path: string): TabInterface | undefined {
    return this.tabList.find(s => {
      return s.path === path;
    });
  }

  // tab切换事件
  public onTabSwitched(tabId: number | string) {
    const url = <string> tabId;
    if (url == this.router.url) {
      return;
    }
    this.router.navigateByUrl(url).finally();
  }

  // tab删除事件
  private toastLock: boolean = false;

  public onTabDeleted(tabId: number | string) {
    if (this.tabList.length <= 1) {
      if (!this.toastLock) {
        this.toastService
          .open({ value: [{ severity: 'error', content: '至少保留一个标签' }] })
          .toastInstance.closeEvent.subscribe(() => this.toastLock = false);
        this.toastLock = true;
      }
      return;
    }
    this.tabList = this.tabList.filter(t => {
      return t.getId() !== tabId;
    });
    this.reuseRouteService.clearByKey(<string> tabId);

    if (this.activateTab?.getId() === tabId) {
      const lastIndex = this.tabList.length - 1;
      const lastTab = this.tabList[lastIndex];
      this.activateTab = lastTab;
      this.router.navigateByUrl(lastTab.path).finally();
    }
  }

  public getTabList() {
    return this.tabList;
  }

  getActivateTab() {
    return this.activateTab;
  }
}

export interface TabInterface {
  path: string;
  title: string;

  getId(): string; // 获取tab的唯一id
}

export class Tab implements TabInterface {
  path: string = '';
  title: string = '';

  constructor(path: string, title: string) {
    this.path = path;
    this.title = title;
  }

  public getId(): string {
    return this.path;
  }
}
