import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxIntlComponent } from './ngx-intl.component';

describe('NgxIntlComponent', () => {
  let component: NgxIntlComponent;
  let fixture: ComponentFixture<NgxIntlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxIntlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxIntlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
