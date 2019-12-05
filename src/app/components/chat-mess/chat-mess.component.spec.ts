import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessComponent } from './chat-mess.component';

describe('ChatMessComponent', () => {
  let component: ChatMessComponent;
  let fixture: ComponentFixture<ChatMessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
