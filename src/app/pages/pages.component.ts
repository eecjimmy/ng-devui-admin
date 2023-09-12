import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DialogService } from 'ng-devui/modal';
import { DrawerService } from 'ng-devui/drawer';
import { Subject } from 'rxjs';
import { SideSettingsComponent } from '../@shared/components/side-settings/side-settings.component';
import { PersonalizeComponent } from '../@shared/components/personalize/personalize.component';
import { PersonalizeService } from '../@core/services/personalize.service';
import { TranslateService } from '@ngx-translate/core';
import { DaLayoutConfig, DaLayoutService } from '../@shared/layouts/da-layout';
import { DaScreenMediaQueryService } from '../@shared/layouts/da-grid';
import { takeUntil } from 'rxjs/operators';
import { SideMenuComponent } from '../@shared/components/side-menu/side-menu.component';
import { Theme } from 'ng-devui/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownDirective, ITabOperation, TabsComponent } from '@devui';
import { TabInterface, TabService } from '../@core/services/tab.service';
import { Menu, MenuService } from '../@core/services/menu.service';
import { EnvironmentService } from '../@core/services/environment.service';

@Component({
  selector: 'da-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, AfterViewInit {
  private destroy$ = new Subject<void>();

  menu: Menu[] = [];

  layoutConfig: DaLayoutConfig = { id: 'sidebar', sidebar: {} };
  isSidebarShrink: boolean = false;
  isSidebarFold: boolean = false;

  settingDrawer: any;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private personalizeService: PersonalizeService,
    private layoutService: DaLayoutService,
    private translate: TranslateService,
    private mediaQueryService: DaScreenMediaQueryService,
    private render2: Renderer2,
    private tabService: TabService,
    private menuService: MenuService,
    public envService: EnvironmentService,
  ) {

    this.menuService.getMenuData().subscribe(r => this.menu = r);
    this.personalizeService.initTheme();
    this.layoutService
      .getLayoutConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe((config: DaLayoutConfig) => {
        this.layoutConfig = config;
        this.isSidebarShrink = !!this.layoutConfig.sidebar.shrink;
      });

    this.mediaQueryService
      .getPoint()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ currentPoint, change, compare }) => {
        /* ml：sidebar shrink breakpoint */
        if (change <= 0 && compare['ml'] <= 0) {
          this.sidebarShrink(true);
        } else if (change >= 0 && compare['ml'] > 0) {
          this.sidebarShrink(false);
        }

        /* mm：sidebar hidden breakpoint */
        if (change <= 0 && compare['mm'] <= 0) {
          this.sidebarFold(true);
        } else if (change >= 0 && compare['mm'] > 0) {
          this.sidebarFold(false);
        }
      });
  }

  ngOnInit() {
    this.translate.get('page').pipe(takeUntil(this.destroy$));
    this.personalizeService.getUiTheme()!.subscribe((theme) => {
      const currentTheme = Object.values((window as { [key: string]: any })['devuiThemes']).find((i: Theme | unknown) => {
        return (i as Theme).id === theme;
      });
      if (currentTheme && (<any> currentTheme).isDark) {
        this.render2.addClass(document.body, 'is-dark');
      } else {
        this.render2.removeClass(document.body, 'is-dark');
      }
    });
  }

  ngAfterViewInit() {
    this.tabService.init();
  }

  openSideMenuDrawer() {
    this.drawerService.open({
      drawerContentComponent: SideMenuComponent,
      width: '240px',
      position: 'left',
      data: {
        data: this.menu,
      },
    });
  }

  openSettingDrawer() {
    if (this.settingDrawer) {
      this.settingDrawer.drawerInstance.show();
    } else {
      this.settingDrawer = this.drawerService.open({
        drawerContentComponent: SideSettingsComponent,
        width: '350px',
        destroyOnHide: false,
        data: {
          close: () => {
            this.settingDrawer.drawerInstance.hide();
          },
        },
      });
    }
  }

  personalizeConfig() {
    this.dialogService.open({
      id: 'theme',
      width: '800px',
      maxHeight: '800px',
      title: '',
      content: PersonalizeComponent,
      backdropCloseable: true,
      draggable: false,
      onClose: () => {
      },
      buttons: [],
    });
  }

  sidebarShrink(isShrink: boolean) {
    this.isSidebarShrink = isShrink;

    if (this.layoutConfig.sidebar.firSidebar) {
      this.layoutConfig.sidebar.firSidebar.width = this.isSidebarShrink ? 54 : 240;
    }
    this.layoutConfig.sidebar.shrink = this.isSidebarShrink;
    this.layoutService.updateLayoutConfig(this.layoutConfig);
  }

  sidebarFold(isFold: boolean) {
    this.isSidebarFold = isFold;

    if (this.layoutConfig.sidebar.firSidebar) {
      this.layoutConfig.sidebar.firSidebar.hidden = isFold;
      this.layoutService.updateLayoutConfig(this.layoutConfig);
    }
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.settingDrawer.drawerInstance.destroy();
    this.settingDrawer = null;
  }

  onTabSwitched($event: number | string) {
    this.tabService.onTabSwitched($event);
  }

  onAddOrDelete($event: ITabOperation) {
    if ($event.operation === 'delete') {
      this.tabService.onTabDeleted($event.id);
    }
  }

  tabList(): TabInterface[] {
    return this.tabService.getTabList();
  }

  getActivateTabId(): string {
    const activateTab = this.tabService.getActivateTab();
    return activateTab ? activateTab.path : '';
  }

  @ViewChild('tabContextMenu', { static: true }) tabContextMenuRef: DropDownDirective | undefined;
  @ViewChild('contextMenuTab') contextMenuTabRef: ElementRef | undefined;
  contextMenuIcons = {
    style: 'padding-right: 5px; vertical-align: middle',
    icons: {
      refresh: 'icon-refresh',
      empty: 'icon-empty',
      close: 'icon-close',
    },
  };

  showTabMenu($event: MouseEvent) {
    this.contextMenuTabRef = new ElementRef($event.target);
    if (!this.tabContextMenuRef) {
      return;
    }
    this.tabContextMenuRef.toggle();
    $event.preventDefault();
  }

  getActivateTab(): ElementRef {
    if (this.contextMenuTabRef) {
      return this.contextMenuTabRef;
    } else {
      return new ElementRef<any>(this.tabContextMenuRef);
    }
  }
}
