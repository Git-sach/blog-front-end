import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]',
  standalone: true,
})
export class AutofocusDirective {
  @Input('autofocus') focus: { mustBeFocused: boolean; placeCursor: number | null };
  host = inject(ElementRef);

  ngOnChanges() {
    if (this.focus.mustBeFocused) {
      setTimeout(() => {
        this.host.nativeElement.focus();
        this.host.nativeElement.setSelectionRange(this.focus.placeCursor, this.focus.placeCursor);
      }, 0);
    }
  }
}
