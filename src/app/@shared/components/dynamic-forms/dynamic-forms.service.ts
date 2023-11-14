import { Injectable } from '@angular/core';
import { DFormItem } from './form-item.interface';

@Injectable({ providedIn: 'root' })
export class DynamicFormsService {
  getFormItems(list: any): DFormItem[] {
    let formItems: DFormItem[] = [];
    Object.keys(list).forEach((item) => {
      formItems.push(list[item]);
    });
    return this.sortItems(formItems);
  }

  sortItems(formItems: DFormItem[]): DFormItem[] {
    let noOrders = formItems.filter((item) => item.order === undefined);
    let hasOrders = formItems.filter((item) => item.order !== undefined).sort((a, b) => (a.order || 0) - (b.order || 0));
    return hasOrders.concat(noOrders);
  }
}
