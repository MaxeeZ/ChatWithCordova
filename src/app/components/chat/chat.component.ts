import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatmessService } from '../../services/chatmess.service';
import { Subscription } from 'rxjs';
import { ChatMess } from '../../models/ChatMess.model';
import { LogService } from '../../services/log.service';
import { ElectronService } from '../../services/electron.service';
import { PseudoService } from '../../services/pseudo.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() Pseudo;

  messageList: ChatMess[];
  messageSubscription: Subscription;

  chatEnable: boolean;
  chatEnableSubscription: Subscription;

  infoDialog: boolean;

  userWritingList: string[];
  userpassed: boolean = false;
  userListWritingSubscription: Subscription;

  userNameListSubscription: Subscription;
  userNameList: any;

  constructor(private cms: ChatmessService, 
              private logService: LogService, 
              private electronService: ElectronService, 
              private pss: PseudoService) { } 

  ngOnInit() {

    this.chatEnableSubscription = this.cms.chatEnableSubject.subscribe(bool => {
      this.chatEnable = bool;
      this.logService.createLogInfo("Get value display chat box")
      this.logService.createLogDebug("Chat.Component.ts: ChatEnableSubscription -> Get value display (yes/no): " + bool);
    });
    this.cms.emitChatEnableSubject();

    this.messageSubscription = this.cms.chatSubject.subscribe(messList => {
      this.messageList = messList;

      if (this.messageList.length != 0) {

        if (this.messageList[this.messageList.length - 1] && this.electronService.isElectron()) {
          
          if ((this.messageList[this.messageList.length - 1].priorite == 2)) {
            this.electronService.renameWindow("TodoManager (Client en colère)");
            this.electronService.maximizeWindow();
          }

          if (this.messageList[this.messageList.length - 1].priorite == 3) {
            this.electronService.renameWindow("TodoManager");
          }
        }
      }

      this.logService.createLogInfo("Get messages list");
      this.logService.createLogDebug("Chat.Component.ts: ChatEnableSubscription -> Get messages list");
    });
    this.cms.emitChatSubject();

    this.userListWritingSubscription = this.cms.UserWritingSubject.subscribe(userWritingList => {

      let ind = userWritingList.indexOf(this.Pseudo);
      if(ind != -1) {
        userWritingList.splice(ind, 1);
      }

      this.userWritingList = userWritingList;

      var info = "";
      this.userWritingList.forEach((row) => {
        info += row.toString();
      })

      this.logService.createLogInfo("Get list of users who are writing");
      this.logService.createLogDebug("Chat.Component.ts: UserListWritingSubscription -> Get list of users who are writing: " + info);

      if (userWritingList.length > 0) {
        this.infoDialog = true;
      } else {
        this.infoDialog = false;
      }
    });
    this.cms.emitUserWritingSubject();

    this.userNameListSubscription = this.pss.userNameListSubject.subscribe( data => {
      this.userNameList = data;
      this.logService.createLogInfo("Get users connected list");
      this.logService.createLogDebug("Menu.Component.ts: userNameListSubscription -> Get users connected list");
    })
    this.pss.emitUserNameListSubject();

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onSubmit(form: NgForm) {
    try {
      const chatM = new ChatMess();
      chatM.emetteur = this.Pseudo;
      chatM.message = form.value['message'];
      this.cms.createMessage(chatM);
      form.onReset();
      this.userpassed = false;

      this.logService.createLogInfo("Message has been sending to conversation");
      this.logService.createLogDebug("Chat.Component.ts: onSubmit(form: NgForm) -> Message has been sending");
    } catch (e) {
      this.logService.createLogError("Can't send message in the Chat");
      this.logService.createLogDebug("Chat.Component.ts: onSubmit(form: NgForm) -> Can't send message: " + e);
    }
  }

  openChat() {

    if (this.chatEnable) {
      this.cms.displayChat(false);
      this.logService.createLogInfo("Chat Box not displayed");
    } else {
      this.cms.displayChat(true);
      this.logService.createLogInfo("Chat Box displayed");
    }
  }

  onKey(event, form: NgForm) {

    if (form.value['message'] != null) {
      if (form.value['message'].length > 0) {
        if (!this.userpassed) {
          this.logService.createLogInfo("Add user to the list of users who are writing");
          this.cms.createUserWriting(this.Pseudo);
          this.logService.createLogDebug("Chat.Component.ts: onKey(event, form: NgForm) -> User added to the userwritinglist");
          this.userpassed = true;
        }
      } else {
        this.logService.createLogInfo("Delete user to the list of users who are writing");
        this.cms.deleteUserWriting(this.Pseudo);
        this.logService.createLogDebug("Chat.Component.ts: onKey(event, form: NgForm) -> User deleted of the userwritinglist");
        this.userpassed = false;
      }
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    this.logService.createLogDebug("Chat.Component.ts: ngOnDestroy() -> Unsubscribe of subscriptions");

    this.userNameListSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.userListWritingSubscription.unsubscribe();
    this.chatEnableSubscription.unsubscribe();
  }

}
