import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Group3PageComponent } from './group3-page.component';

describe('Group3PageComponent', () => {
  let component: Group3PageComponent;
  let fixture: ComponentFixture<Group3PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Group3PageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Group3PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
