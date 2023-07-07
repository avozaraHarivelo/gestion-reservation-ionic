import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanlendrierSearchoutComponent } from './canlendrier-searchout.component';

describe('CanlendrierSearchoutComponent', () => {
  let component: CanlendrierSearchoutComponent;
  let fixture: ComponentFixture<CanlendrierSearchoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanlendrierSearchoutComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanlendrierSearchoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
