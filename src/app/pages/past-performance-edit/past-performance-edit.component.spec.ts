import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastPerformanceEditComponent } from './past-performance-edit.component';

describe('PastPerformanceEditComponent', () => {
  let component: PastPerformanceEditComponent;
  let fixture: ComponentFixture<PastPerformanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastPerformanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastPerformanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
