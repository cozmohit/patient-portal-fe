import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketSize } from './add-market-size';

describe('AddMarketSize', () => {
  let component: AddMarketSize;
  let fixture: ComponentFixture<AddMarketSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMarketSize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMarketSize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
