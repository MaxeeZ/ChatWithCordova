import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ChatComponent } from './chat.component';
import { ChatMess } from '../../models/ChatMess.model';

// Mock ChatMessService used
const cm1 = new ChatMess();
cm1.emetteur = "bot 1";
cm1.message = "message du bot 1";

const cm2 = new ChatMess();
cm2.emetteur = "bot 2";
cm2.message = "message du bot 2"

var messList: ChatMess[];
messList.push(cm1);
messList.push(cm2);

var userWritingList: string[];
userWritingList.push("bot 2");

const spyChatMessService = jasmine.createSpyObj('spyChatMessService', ['subscribe']);
spyChatMessService.chatEnableSubject.subscribe.and.returnValue(Observable.of(true));
spyChatMessService.chatSubject.subscribe.and.returnValue(Observable.of(messList));
spyChatMessService.userWritingSubject.subscribe.and.returnValue(Observable.of(userWritingList));

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;


  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
