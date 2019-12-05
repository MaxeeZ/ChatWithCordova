import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { ChatMess } from '../models/ChatMess.model';
import { Subscription, Subject, Observable } from 'rxjs';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})

export class ChatmessService {

  private socket;

  messList: ChatMess[];
  chatSubscription: Subscription;
  chatSubject = new Subject<any[]>();

  NewMessageSubscription: Subscription;

  chatEnable:boolean = false;
  chatEnableSubject = new Subject<boolean>();

  UserWriting: string[];
  UserWritingSubject = new Subject<string[]>();
  UserWritingSubscription: Subscription;

  isUserWritingList: boolean = false;


  constructor(private ws: WebSocketService, private logService: LogService) {
    this.socket = ws.connect();
    this.messList = [];
    this.UserWriting = [];

    this.chatSubscription = this.getMessList().subscribe(messList =>{
        this.messList = messList;
        this.emitChatSubject();
    });

    this.UserWritingSubscription = this.getUserWritingList().subscribe(UserWriting =>{
      this.UserWriting = UserWriting;
      this.emitUserWritingSubject();
    });

    this.NewMessageSubscription = this.getNewMessList().subscribe(NewMessage =>{
      this.messList.push(NewMessage);
      this.emitChatSubject();
    })

  }

  public getMessList() {
    this.logService.createLogDebug("Chatmess.Service.ts: getMessList() -> message list returned from server");
    let observable = new Observable<ChatMess[]>(observer => {
      this.socket.on('messList', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  public getNewMessList() {
    this.logService.createLogDebug("Chatmess.Service.ts: getNewMessList() -> new message to be adding to messList returned from server");
    let observable = new Observable<ChatMess>(observer => {
      this.socket.on('NewMessList', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  public getUserWritingList() {
    this.logService.createLogDebug("Chatmess.Service.ts: getUserWritingList() -> users who are wrinting, returned from server");
    let observable = new Observable<string[]>(observer => {
      this.socket.on('userWritingList', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  emitChatSubject() {
    this.chatSubject.next(this.messList.slice());
    this.logService.createLogDebug("Chatmess.Service.ts: emitChatSubject() -> Send messages list to Chat.Component.ts");
  }

  emitChatEnableSubject() {
    this.chatEnableSubject.next(this.chatEnable);
    this.logService.createLogDebug("Chatmess.Service.ts: emitChatEnableSubject() -> Enable/Disable Chat Box to App.Component.ts: " + this.chatEnable);
  }

  emitUserWritingSubject() {
    this.UserWritingSubject.next(this.UserWriting.slice());
    this.logService.createLogDebug("Chatmess.Service.ts: emitUserWritingSubject() -> Send users list, users who are writing to Chat.Component.ts")
  }


  displayChat(i:boolean){
    this.chatEnable = i;
    this.emitChatEnableSubject();
  }

  createMessage(cm: ChatMess) {
    this.logService.createLogDebug("Chatmess.Service.ts: createMessage(cm: ChatMess) -> Add a message to chat then send it to the server: " + cm.emetteur + " " + cm.message);
    this.socket.emit('createMessList', cm);
    this.emitChatSubject();
  }

  createUserChat(cm: ChatMess) {
    this.logService.createLogDebug("Chatmess.Service.ts: createUserChat(cm: ChatMess) -> Warns that a new user is in the chat: " + cm.emetteur + " " + cm.message);
    this.socket.emit('createUserChat', cm);
    this.emitChatSubject();
  }

  deleteUserToChat(cm: ChatMess) {
    this.logService.createLogDebug("Chatmess.Service.ts: deleteUserChat(cm: ChatMess) -> Warns that a user has left the chat: " + cm.emetteur + " " + cm.message);
    this.socket.emit('deleteUserChat', cm);
    this.emitChatSubject();
  }

  createUserWriting(pseudo: string) {
    this.socket.emit('createUserWriting', pseudo);
    this.logService.createLogDebug("Chatmess.Service.ts: createUserWriting(pseudo: string) -> Warns that a user is writing in the chat");
    this.emitUserWritingSubject();
  }

  
  deleteUserWriting(pseudo: string) {
    this.socket.emit('deleteUserWriting', pseudo);
    this.logService.createLogDebug("Chatmess.Service.ts: deleteUserWriting(pseudo: string) -> Warns that a user stop to write in the chat");
    this.emitUserWritingSubject();
  }

}
