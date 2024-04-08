import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]',
  standalone: true,
})
export class AutofocusDirective {
  @Input('autofocus') focus: boolean;
  host = inject(ElementRef);

  ngOnChanges() {
    if (this.focus) {
      setTimeout(() => {
        this.host.nativeElement.focus();
        this.host.nativeElement.setSelectionRange(0, 0);
      }, 0);
    }
  }
}
