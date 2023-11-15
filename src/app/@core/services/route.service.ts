import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  DetachedRouteHandle,
} from '@angular/router';
import { Injectable } from '@angular/core';

/**
 * Route reuse
 * @see https://juejin.cn/post/7132770068009582629
 */
@Injectable({
  providedIn: 'root',
})
export class AppRouteReuseStrategy extends BaseRouteReuseStrategy {
  public static routeSnapshots: Map<String, DetachedRouteHandle> = new Map();

  /**
   * Determines whether the route should be detached.
   *
   * @param {ActivatedRouteSnapshot} route - The route to be evaluated.
   * @return {boolean} Returns true if the route should be detached.
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  /**
   * Stores the route and its corresponding detached route handle in the routeSnapshots map.
   *
   * @param {ActivatedRouteSnapshot} route - The route to store.
   * @param {DetachedRouteHandle} handle - The detached route handle to store.
   * @return {void} This function does not return any value.
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKeyByRoute(route);
    AppRouteReuseStrategy.routeSnapshots.set(key, handle);
  }

  /**
   * Determines whether the given route should be attached or not.
   *
   * @param {ActivatedRouteSnapshot} route - The route to be checked.
   * @return {boolean} Returns true if the route should be attached, false otherwise.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.component === null) {
      return false;
    }
    const key = this.getKeyByRoute(route);
    return AppRouteReuseStrategy.routeSnapshots.has(key);
  }

  /**
   * Retrieves the detached route handle for a given route.
   *
   * @param {ActivatedRouteSnapshot} route - The route snapshot to retrieve the detached route handle for.
   * @return {DetachedRouteHandle | null} - The detached route handle for the given route, or null if not found.
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getKeyByRoute(route);
    return AppRouteReuseStrategy.routeSnapshots.get(key) || null;
  }

  /**
   * Determines whether the given future and current ActivatedRouteSnapshots should reuse the route.
   *
   * @param {ActivatedRouteSnapshot} future - The future ActivatedRouteSnapshot.
   * @param {ActivatedRouteSnapshot} curr - The current ActivatedRouteSnapshot.
   * @return {boolean} Returns true if the route should be reused, false otherwise.
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.getKeyByRoute(future) === this.getKeyByRoute(curr);
  }

  /**
   * Generates a key by extracting the route from the given ActivatedRouteSnapshot.
   *
   * @param {ActivatedRouteSnapshot} route - The route snapshot to extract the key from.
   * @return {string} The generated key based on the route.
   */
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

  /**
   * Clears the route snapshots by a given key.
   *
   * @param {string} key - The key to identify the route snapshots to be cleared.
   */
  public static clearByKey(key: string) {
    AppRouteReuseStrategy.routeSnapshots.delete(key);
  }
}
