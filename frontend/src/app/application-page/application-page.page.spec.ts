import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationPagePage } from './application-page.page';

describe('ApplicationPagePage', () => {
  let component: ApplicationPagePage;
  let fixture: ComponentFixture<ApplicationPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
