import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFootballerComponent } from './edit-footballer.component';

describe('EditFootballerComponent', () => {
  let component: EditFootballerComponent;
  let fixture: ComponentFixture<EditFootballerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFootballerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFootballerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
