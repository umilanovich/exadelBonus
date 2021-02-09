import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private isMobile = new Subject();
  public screenWidth: string;

  constructor() {
    this.checkWidth();
  }

  public onMobileChange(status: boolean): void {
    this.isMobile.next(status);
  }

  public getMobileStatus(): Observable<any> {
    return this.isMobile.asObservable();
  }

  public checkWidth(): void {
    const width: number = window.innerWidth;
    if (width <= 768) {
      this.screenWidth = 'sm';
      this.onMobileChange(true);
    } else if (width > 768 && width <= 992) {
      this.screenWidth = 'md';
      this.onMobileChange(false);
    } else {
      this.screenWidth = 'lg';
      this.onMobileChange(false);
    }
  }
}
