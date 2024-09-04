import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Group2PageComponent } from './group2-page.component';

describe('Group2PageComponent', () => {
  let component: Group2PageComponent;
  let fixture: ComponentFixture<Group2PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Group2PageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Group2PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
