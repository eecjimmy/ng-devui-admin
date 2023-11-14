import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DValidateRules, FormLayout } from 'ng-devui';
import { DynamicFormsService } from './dynamic-forms.service';
import { DFormData, DFormItem, DFormUI } from './form-item.interface';
import { RadioUI } from './ui/radio/radio.interface';
import { TextInputUI } from './ui/text-input/text-input.interface';
import { TextAreaUI } from './ui/textarea/textarea.interface';
import { CheckboxUI } from './ui/checkbox/checkbox.interface';
import { SelectUI } from './ui/select/select.interface';
import { ToggleUI } from './ui/toggle/toggle.interface';
import { TagsInputUI } from './ui/tags-input/tags-input.interface';

@Component({
  selector: 'da-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
})
export class DynamicFormsComponent implements OnInit {
  _formData: DFormItem[] = [];

  @Input() set formData(formItems: DFormData) {
    if (formItems) {
      this._formData = this.formService.getFormItems(formItems);
    }
  }

  get formItems(): DFormItem[] {
    return this._formData;
  }

  @Input() layout = FormLayout.Horizontal;
  @Input() labelSize: 'sm' | '' | 'lg' = '';
  @Input() labelAlign: 'start' | 'center' | 'end' = 'start';
  @Input() formRules: DValidateRules | undefined;
  @Input() showLoading = true;
  @Input() formSubmitData: any;
  @Input() showSubmitBtn: boolean = true;
  @Input() showResetBtn: boolean = true;
  @Input() submitBtnContent: string = 'Submit';
  @Input() resetBtnContent: string = 'Reset';
  @Output() formSubmit = new EventEmitter<any>();

  constructor(private formService: DynamicFormsService) {
  }

  ngOnInit(): void {
  }

  submitForm(event: any) {
    this.formSubmit.emit(event);
  }

  asRadioUI(ui: DFormUI): RadioUI {
    return ui as RadioUI;
  }

  asTextInputUI(ui: DFormUI): TextInputUI {
    return ui as TextInputUI;
  }
   asTextAreaUI(ui:DFormUI):TextAreaUI {
     return ui as TextAreaUI;
   }
    asCheckboxUI(ui: DFormUI): CheckboxUI {
      return ui as CheckboxUI;
    }

    asSelectUI(ui: DFormUI): SelectUI {
      return ui as SelectUI;
    }

    asToggleUI(ui: DFormUI): ToggleUI {
      return ui as ToggleUI;
    }
     asTagsInputUI(ui:DFormUI):TagsInputUI {
       return ui as TagsInputUI;
     }
}
