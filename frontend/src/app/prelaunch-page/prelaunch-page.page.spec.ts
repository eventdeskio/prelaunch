import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrelaunchPagePage } from './prelaunch-page.page';

describe('PrelaunchPagePage', () => {
  let component: PrelaunchPagePage;
  let fixture: ComponentFixture<PrelaunchPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrelaunchPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
