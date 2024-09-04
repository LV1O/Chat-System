import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Group1PageComponent } from './group1-page.component';

describe('Group1PageComponent', () => {
  let component: Group1PageComponent;
  let fixture: ComponentFixture<Group1PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Group1PageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Group1PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
