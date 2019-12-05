import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ToDoService } from '../../services/todo.service';
import { PseudoService } from '../../services/pseudo.service';
import { LogService } from '../../services/log.service';
import { Subscription } from 'rxjs';
import { Task } from '../../models/Task.model';
import { MdePopoverTrigger } from '@material-extended/mde';



@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit, OnDestroy {

  @Input() id;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;

  hideTaskTab: boolean = false;

  pseudo: string
  pseudoSubscription: Subscription;
  tasklist: Task[];
  taskSubscription: Subscription;
  displayedColumns: string[] = ['select', 'nomTache', 'description', 'priorite', 'modif', 'delete'];
  dataSource: MatTableDataSource<Task>;
  selection = new SelectionModel<Task>(true, []);

  constructor(private toDoService: ToDoService,
              private pss: PseudoService,
              private logService: LogService) 
  {
    this.dataSource = new MatTableDataSource(this.tasklist);
  }

  ngOnInit() {

    this.taskSubscription = this.toDoService.taskSubject.subscribe(
      (tasklist: Task[]) => {
        this.tasklist = tasklist;
        if (this.tasklist.length == 0) {
          this.hideTaskTab = true;
        } else {
          this.hideTaskTab = false;
        }

        this.dataSource = new MatTableDataSource(this.tasklist);
        this.logService.createLogInfo("Get Tasks list");
        this.logService.createLogDebug("To-do-list.Componenent.ts: TaskSubscription -> Get Tasks list: " + this.tasklist);
      }
    )
    this.toDoService.emitTaskSubject();

    this.dataSource.sort = this.sort;

    this.pseudoSubscription = this.pss.pseudoSubject.subscribe( (data: string) => {
      this.pseudo = data;
      this.logService.createLogInfo("Get Pseudo");
      this.logService.createLogDebug("To-do-list.Componenent.ts: PseudoSubscription -> Get Pseudo for the Current User (if modified task): " + data);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  delete(idTask?: number, idTaskList?: number[]) {
    try {

      if (idTask != null) {
        var idTaskL = [];
        idTaskL.push(idTask);
        this.toDoService.delete(idTaskL);
      }

      if (idTaskList != null) {
        this.toDoService.delete(idTaskList);
      }
      this.logService.createLogInfo("Task deleted");
      this.logService.createLogDebug("To-do-list.Component.ts: delete(idTask: number) -> Delete the following task id: " + idTask);
    } catch (e) {
      this.logService.createLogError("Can't delete task");
      this.logService.createLogDebug("To-do-list.Component.ts: delete(idTask: number) -> Error to delete task: " + e);
    }
  }

  deleteSelected() {

    let idTaskList = [];

    this.selection.selected.forEach((rowElement) => {
      idTaskList.push(rowElement.id);
    });

    this.delete(null, idTaskList);
    this.selection.clear();
  }

  update(idTask: number) {
    this.pss.emitPseudoSubject();
    
    try {
      this.toDoService.update(idTask, this.pseudo);
      this.logService.createLogInfo("Task modified");
      this.logService.createLogDebug("To-do-list.Component.ts: update(idTask: number) -> The Task has been modified");
    } catch(e) {
      this.logService.createLogError("Can't update Task");
      this.logService.createLogDebug("To-do-list.Component.ts: update(idTask: number) -> Can't update Task: " + e);
    }
  }

  hideTaskTable() {
    if (this.tasklist.length == 0) {
      this.hideTaskTab = true;
    }

    this.hideTaskTab = false;
  }

  ngOnDestroy() {
    this.logService.createLogDebug("To-do-list.Component.ts: ngOnDestroy() -> Unsubscribe of subscriptions");
    this.taskSubscription.unsubscribe();
    this.pseudoSubscription.unsubscribe();
  }

}
