import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastService } from 'ng-devui';
import { Injectable } from '@angular/core';
import { AppRouteReuseStrategy } from './route.service';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private defaultTab: TabInterface = new Tab('/pages/dashboard/analysis', '分析页');
  private activateTab: TabInterface = this.defaultTab;
  private tabList: TabInterface[] = [this.defaultTab];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
  ) {
  }

  public init() {
    this.router.events
      .pipe(filter(e => e instanceof ActivationEnd)) // 仅处理`ActivationEnd`事件
      .subscribe(e => {
        const e2 = e as ActivationEnd;

        const routes = e2.snapshot.pathFromRoot;
        let path: String[] = [];
        e2.snapshot.pathFromRoot.map(r => {
          path.push(r.routeConfig?.path || '/');
        });
        if (path.join('') !== this.router.url) {
          return;
        }
        const title = e2.snapshot.routeConfig?.title || '未知标签页';
        const url = this.router.url;
        const tab = new Tab(url, title.toString());
        if (!this.getActivateTabByPath(tab.path)) {
          this.tabList.push(tab);
        }
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].path === url) {
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

  private canShowToast = true;

  public onTabDeleted(tabId: number | string) {
    if (tabId === this.defaultTab.path) {
      if (this.canShowToast) {
        this.toastService
          .open({ value: [{ severity: 'error', summary: '操作失败', content: '禁止关闭该标签' }], life: 3000 })
          .toastInstance.closeEvent.subscribe(() => this.canShowToast = true);
        this.canShowToast = false;
      }
      return;
    }
    this.tabList = this.tabList.filter(t => {
      return t.getId() !== tabId;
    });

    if (this.activateTab?.getId() === tabId) {
      const lastIndex = this.tabList.length - 1;
      const lastTab = this.tabList[lastIndex];
      this.activateTab = lastTab;
      this.router.navigateByUrl(lastTab.path).finally(() => {
        AppRouteReuseStrategy.clearByKey(<string> tabId);
      });
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
