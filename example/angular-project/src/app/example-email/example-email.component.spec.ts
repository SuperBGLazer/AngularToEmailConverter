import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleEmailComponent } from './example-email.component';

describe('ExampleEmailComponent', () => {
  let component: ExampleEmailComponent;
  let fixture: ComponentFixture<ExampleEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampleEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
