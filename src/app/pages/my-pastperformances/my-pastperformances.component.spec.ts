import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPastPerformancesComponent } from './my-pastperformances.component';

describe('CompaniesComponent', () => {
  let component: MyPastPerformancesComponent;
  let fixture: ComponentFixture<MyPastPerformancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPastPerformancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPastPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
