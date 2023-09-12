import { NgModule } from '@angular/core';
import { DialogService, BackTopModule, ToastModule, IconModule } from 'ng-devui';
import { SharedModule } from '../@shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DaLayoutModule } from '../@shared/layouts/da-layout';

@NgModule({
  imports: [PagesRoutingModule, SharedModule, BackTopModule, DaLayoutModule, ToastModule, IconModule],
  declarations: [PagesComponent],
  providers: [
    DialogService,
  ],
})
export class PagesModule {
}
