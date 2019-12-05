import { Subject, Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { OnInit } from '@angular/core';
import { Task } from '../models/Task.model';
import { LogService } from './log.service';

@Injectable()
export class ToDoService implements OnInit {

    socket: any;
    getTask: Subscription;

    taskModifiedSubject = new Subject<any>();
    taskSubject = new Subject<any[]>();

    taskmodified: Task;

    tasklist: Task[];

    disconnectedMess: string;

    constructor(private ws: WebSocketService, private logService: LogService) {
        this.socket = ws.connect();
        this.tasklist = [];

        this.getTask = this.getTaskList().subscribe(tasklist => {
            this.tasklist = tasklist;
            this.emitTaskSubject();
        })

    }

    ngOnInit() {
    }

    public getTaskList() {
        this.logService.createLogDebug("Todo.Service.ts: getTaskList() -> Task wanted returned from server");
        let observable = new Observable<Task[]>(observer => {
          this.socket.on('TaskList', (data) => {
            observer.next(data);
          });
          return () => {
            this.socket.emit('disconnect');
            this.socket.disconnect();
          };
        })
        return observable;
      }

    emitTaskSubject() {
        this.taskSubject.next(this.tasklist.slice());
        this.logService.createLogDebug("Todo.Service.ts: emitTaskSubject() -> Send Tasks list to To-do-list.Component.ts");
    }

    emitTaskModifiedSubject() {
        this.taskModifiedSubject.next(this.taskmodified);
        var info = this.taskmodified.nomTache + " | " + this.taskmodified.description + " | " + this.taskmodified.priorite; 
        this.logService.createLogDebug("Todo.Service.ts: emitTaskModifiedSubject() -> Send modified Task to Edit-to-do.Component.ts: " + info);
    }

    createTask(nomTache: string, description: string, priorite: string, idTask?: number) {

        var task1 = new Task();
        task1.nomTache = nomTache;
        task1.description = description;
        task1.priorite = priorite;

        if (idTask != null) {
            task1.id = idTask;
            this.setCurrentUser(task1, null);
            this.logService.createLogDebug("Todo.Service.ts: createTask(nomTache: string, description: string, priorite: string, idTask?: number) -> Send modified Task to Server");
            this.socket.emit('updateTaskModified', task1)
            
        } else {
            this.logService.createLogDebug("Todo.Service.ts: createTask(nomTache: string, description: string, priorite: string, idTask?: number) -> Send new Task to Server");
            this.socket.emit('createTask', task1);
        }

    }

    delete(idTaskList: number[]) {
        this.logService.createLogDebug("Todo.Service.ts: delete(idTask: number) -> Delete task (task id): " + idTaskList);
        this.socket.emit('deleteTask', idTaskList);
        this.emitTaskSubject();
    }

    setCurrentUser(task: Task, currUser: string): void {
        if (currUser != null) {
            task.currentUser = currUser;
            task.using = true;
            this.logService.createLogDebug("Todo.Service.ts: SetCurrentUser(task: Task, currUser: string) -> Adding to task the current user who is modifying it");
        } else {
            task.using = false;
            this.logService.createLogDebug("Todo.Service.ts: SetCurrentUser(task: Task, currUser: string) -> The task is no longer being modified");
        }
    }

    update(idTask: number, currentUser: string) {
        this.taskmodified = this.tasklist[idTask];
        this.setCurrentUser(this.taskmodified, currentUser);
        this.socket.emit('updateTaskModified', this.taskmodified);
        this.logService.createLogDebug("Todo.Service.ts: update(idTask: number, currentUser: string) -> The task is no longer being modified");
        this.emitTaskModifiedSubject();
    }

    readTaskById(idTask: number) {
        this.logService.createLogDebug("Todo.Service.ts: readTaskById(idTask: number) -> return Task find: " + this.tasklist[idTask]);
        return this.tasklist[idTask];
    }
}