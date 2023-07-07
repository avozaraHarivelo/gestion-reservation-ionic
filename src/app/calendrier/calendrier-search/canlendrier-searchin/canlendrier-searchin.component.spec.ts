import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanlendrierSearchinComponent } from './canlendrier-searchin.component';

describe('CanlendrierSearchinComponent', () => {
  let component: CanlendrierSearchinComponent;
  let fixture: ComponentFixture<CanlendrierSearchinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanlendrierSearchinComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanlendrierSearchinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
