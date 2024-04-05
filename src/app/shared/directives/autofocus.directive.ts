import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]',
  standalone: true,
})
export class AutofocusDirective {
  @Input('autofocus') focus: boolean;
  host = inject(ElementRef);

  ngAfterViewInit() {
    console.log(this.host);

    if (this.focus) {
      this.host.nativeElement.focus();
    }
  }
}
