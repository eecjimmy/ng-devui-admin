import { FormLayout } from 'ng-devui';
import { DValidateRules } from 'ng-devui/form/validator-directive/validate.type';

export interface FormConfig {
  layout: FormLayout;
  labelSize: 'sm' | '' | 'lg';
  items: FormItem[];
}

export interface FormItem {
  required?: boolean;
  extraInfo?: any;
  label?: string;
  prop?: string;
  type?: string;
  rule?: DValidateRules;
  options?: any[];
}
