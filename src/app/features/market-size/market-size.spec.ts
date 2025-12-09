import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSize } from './market-size';

describe('MarketSize', () => {
  let component: MarketSize;
  let fixture: ComponentFixture<MarketSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketSize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketSize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
