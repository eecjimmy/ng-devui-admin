import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  DetachedRouteHandle,
} from '@angular/router';
import { Injectable } from '@angular/core';

/**
 * 路由重用策略
 * @see https://juejin.cn/post/7132770068009582629
 */
@Injectable({
  providedIn: 'root',
})
export class AppRouteReuseStrategy extends BaseRouteReuseStrategy {
  /**
   * 用于保存路由快照
   **/
  public static routeSnapshots: Map<String, DetachedRouteHandle> = new Map();

  /**
   * 允许所有路由重用
   * 如果你有路由不想被重用，可以在这个方法中加业务逻辑判断
   **/
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  /**
   * 以url为key保存路由，key也可以使用其他属性，能确保唯一即可
   **/
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKeyByRoute(route);
    AppRouteReuseStrategy.routeSnapshots.set(key, handle);
  }

  /**
   * 缓存中存在则允许还原路由
   **/
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.component === null) {
      return false;
    }
    const key = this.getKeyByRoute(route);
    return AppRouteReuseStrategy.routeSnapshots.has(key);
  }

  /**
   * 从缓存中获取快照，没有返回null
   **/
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getKeyByRoute(route);
    return AppRouteReuseStrategy.routeSnapshots.get(key) || null;
  }

  /**
   * 进入路由触发，判断是否同一路由
   **/
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.getKeyByRoute(future) === this.getKeyByRoute(curr);
  }

  getKeyByRoute(route: ActivatedRouteSnapshot): string {
    if (route.component === null) {
      return '';
    }
    if (route.pathFromRoot.length === 0) {
      return '';
    }
    const segments = route
      .pathFromRoot
      .map((snapshot) => snapshot.url.map((segment) => segment.path))
      .filter(s => s.length > 0)
      .join('/')
    ;

    return '/' + segments;
  }

  public static clearByKey(key: string) {
    AppRouteReuseStrategy.routeSnapshots.delete(key);
  }
}
