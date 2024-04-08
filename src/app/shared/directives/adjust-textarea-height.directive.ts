import { AfterViewInit, Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[adjustTextareaHeight]',
  standalone: true,
})
export class AdjustTextareaHeightDirective implements AfterViewInit {
  host = inject(ElementRef);

  // Event triggered when typing text into the input
  @HostListener('input') inputListener() {
    this.adjustTextareaHeight();
  }

  // Event triggered when the input loses focus
  @HostListener('blur') blurListener() {
    this.adjustTextareaHeight();
  }

  ngAfterViewInit(): void {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight() {
    this.host.nativeElement.style.height = 'auto';
    this.host.nativeElement.style.height = this.host.nativeElement.scrollHeight + 'px';
  }
}
