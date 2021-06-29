import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSidebarLayoutComponent } from './main-sidebar-layout.component';

describe('MainSidebarLayoutComponent', () => {
  let component: MainSidebarLayoutComponent;
  let fixture: ComponentFixture<MainSidebarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainSidebarLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSidebarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
