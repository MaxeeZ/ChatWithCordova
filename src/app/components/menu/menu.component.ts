import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToDoService } from '../../services/todo.service';
import { ButtonViewService } from '../../services/buttonSet.service';
import { ChatmessService } from '../../services/chatmess.service';
import { PseudoService } from '../../services/pseudo.service';
import { LogService } from '../../services/log.service';
import { LocalizeService } from '../../services/localize.service';
import { Task } from './../../models/Task.model';
import { MdePopoverTrigger } from '@material-extended/mde';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() MatMenuTriggerData
  @Input() matMenuTriggerFor; // submenu account icon
  @Input() pseudo; // Bienvenue + pseudo
  @Input() language;

  @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;

  chatEnable: boolean;
  chatEnableSubscription: Subscription;
  
  nbUserSubscription: Subscription;
  nbUser: any;

  btnBackTaskList: boolean;
  btnBackTaskListSubscription: Subscription;

  taskModifiedSubscription: Subscription;
  taskModifiedBool: boolean = false;
  task: Task;

  popoverSubscription: Subscription;
  popoverBool: boolean = false;

  pseudoSubscription: Subscription;
  pseudoBool: boolean = false;

 

  constructor(private buttonView: ButtonViewService,
              private cms: ChatmessService,
              private pss: PseudoService,
              private toDoService: ToDoService,
              private logService: LogService,
              private lcls: LocalizeService) { }

  ngOnInit() {

    this.nbUserSubscription = this.pss.nbUserSubject.subscribe( data => {
      this.nbUser = data;
      this.logService.createLogInfo("Get modified Task");
      this.logService.createLogDebug("Menu.Component.ts: nbUserSubscription -> Get nbUser");
    })

    this.btnBackTaskListSubscription = this.buttonView.buttonSubject.subscribe(
      (button) => {
        this.btnBackTaskList = button;
        if (!button) {
          this.trigger.closePopover();
        }

        this.logService.createLogInfo("Get back button state");
        this.logService.createLogDebug("Menu.Component.ts: btnBackTaskListSubscription -> Get state button");
      }
    )

    this.buttonView.emitButtonSubject();

    this.chatEnableSubscription = this.cms.chatEnableSubject.subscribe( bool => {
      this.chatEnable = bool;
      this.logService.createLogInfo("Get value display of chat");
      this.logService.createLogDebug("Menu.Component.ts: chatEnableSubscription -> Get value display");
    });

    this.cms.emitChatEnableSubject();

    this.taskModifiedSubscription = this.toDoService.taskModifiedSubject.subscribe(
      (task: Task) => {
        this.taskModifiedBool = true;
        this.task = task;
        this.logService.createLogInfo("Get value for the modified task");
        this.logService.createLogDebug("Menu.Component.ts: taskModifiedSubscription -> Get new value of the modified task");
      }
    );

    this.popoverSubscription = this.toDoService.taskSubject.subscribe( (data: Task[]) => {
      if (data.length == 0) {
        this.popoverBool = true;
        if (this.pseudoBool) {
          this.trigger.openPopover();          
        }
      } else {
        this.popoverBool = false;
        this.trigger.closePopover();
      }
    });

    this.pseudoSubscription = this.pss.pseudoSubject.subscribe( (data: string) => {
      if (data.localeCompare("") == 1) {
        if (this.popoverBool) {
          this.pseudoBool = true;
          this.trigger.openPopover();
        }
      } else {
        this.pseudoBool = false;
        this.trigger.closePopover();
      }
    })

  }

  updateBT(btnDisplayOrNot: boolean) {
    this.logService.createLogInfo("Change value of the back button");
    this.buttonView.updateBT(btnDisplayOrNot);
    this.buttonView.emitButtonSubject();

    try {

      if (this.taskModifiedBool) {
        this.logService.createLogInfo("Cancel change of task");
        this.logService.createLogDebug("Menu.Component.ts: updateBT(btnDisplayOrNot: boolean) -> Cancel change of task");
        this.toDoService.createTask(this.task.nomTache, this.task.description, this.task.priorite, this.task.id);
        this.taskModifiedBool = false;
      }
    } catch (e) {
      this.logService.createLogError("Can't cancel change of task");
      this.logService.createLogDebug("Menu.Component.ts: updateBT(btnDisplayOrNot: boolean) -> Can't cancel change of task: " + e);
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

  translate(language: string) {
    this.lcls.changeLanguage(language);
  }

  ngOnDestroy() {
    this.logService.createLogDebug("Menu.Component.ts: ngOnDestroy() -> Unsubscribe of subscriptions");

    this.chatEnableSubscription.unsubscribe();
    this.nbUserSubscription.unsubscribe();
    this.btnBackTaskListSubscription.unsubscribe();
  }

}
