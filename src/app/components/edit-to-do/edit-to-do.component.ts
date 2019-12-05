import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToDoService } from '../../services/todo.service';
import { ButtonViewService } from '../../services/buttonSet.service';
import { LogService } from '../../services/log.service';
import { Subscription } from 'rxjs';
import { Task } from './../../models/Task.model';



@Component({
  selector: 'app-edit-to-do',
  templateUrl: './edit-to-do.component.html',
  styleUrls: ['./edit-to-do.component.scss']
})

export class EditToDoComponent implements OnInit {

  defaultNomTache = "";
  defaultPriorite = 'Faible';
  defaultDescription = "";

  @Input() id;

  taskModifiedSubscription: Subscription;
  taskModifiedBool: boolean = false;
  taskModifiedIndex: number;

  constructor(private toDoService: ToDoService,
    private router: Router,
    private buttonView: ButtonViewService,
    private route: ActivatedRoute,
    private logService: LogService) {
  }

  ngOnInit() {

    //this.taskModifiedBool = false;
    this.buttonView.updateBT(false);

    this.taskModifiedSubscription = this.toDoService.taskModifiedSubject.subscribe(
      (task: Task) => {
        this.logService.createLogInfo("Get modified Task");
        this.logService.createLogDebug("Edit-to-do.Component.ts: taskModifiedSubscription -> Get modified Task");
        this.taskModifiedIndex = task.id;
        this.taskModifiedBool = true;
      }
    );

    if (this.route.snapshot.params['id'] != null) {
      this.toDoService.emitTaskModifiedSubject();
      this.id = this.route.snapshot.params['id'];
      const taskRead = this.readTaskById(this.id);
      this.defaultNomTache = taskRead.nomTache;
      this.defaultDescription = taskRead.description;
      this.defaultPriorite = taskRead.priorite;

    }

  }

  onSubmit(form: NgForm) {

    try {
      const nomTache = form.value['nomTache'];
      const description = form.value['description'];
      const priorite = form.value['priorite'];

      if (!this.taskModifiedBool) {
        this.toDoService.createTask(nomTache, description, priorite);
        this.logService.createLogInfo("Submit new task");
        this.logService.createLogDebug("Edit-to-do.Component.ts: onSubmit(form: NgForm) -> Submit new task");
        
      } else {
        this.toDoService.createTask(nomTache, description, priorite, this.taskModifiedIndex);
        this.taskModifiedBool = false;
        this.logService.createLogInfo("Update task");
        this.logService.createLogDebug("Edit-to-do.Component.ts: onSubmit(form: NgForm) -> Submit updated task");
      }

      this.router.navigate(['tasks']);
    
    } catch(e) {
      this.logService.createLogError("Can't submit task");
      this.logService.createLogDebug("Edit-to-do.Component.ts: onSubmit(form: NgForm) -> Error: " + e);
    }
  }

  updateBT(index: boolean) {
    this.buttonView.updateBT(index);
  }

  readTaskById(id: number) {
    this.logService.createLogDebug("Edit-to-do.Component.ts: readTaskById(id: number) -> Submit modified task");
    return this.toDoService.readTaskById(id);
  }

  ngOnDestroy() {
    this.logService.createLogDebug("Edit-to-do.Component.ts: ngOnDestroy() -> Unsubscribed of subscriptions");

    this.taskModifiedSubscription.unsubscribe();
  }

}
