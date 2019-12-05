import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { WebSocketService } from './web-socket.service';
import { ToDoService } from './todo.service';
import { Task } from '../models/Task.model';

// Create type of task list
const task1 = new Task();
task1.nomTache = "Test 1";
task1.description = "description Test 1";
task1.priorite = "prorite Test 1";

const task2 = new Task();
task2.nomTache = "Test 2";
task2.description = "description Test 2";
task2.priorite = "prorite Test 2";

var tasklist: Task[];
tasklist.push(task1);
tasklist.push(task2);

// Mock WebSocketService used by ToDoService to get tasklist
const spyWebSocketService = jasmine.createSpyObj('spyWebSocketService', ['readTaskList']);
spyWebSocketService.readTaskList.and.returnValue(Observable.of(tasklist));

beforeEach(async(() => {
  TestBed.configureTestingModule({
    providers: [
      ToDoService,
      {
        provide: WebSocketService,
        useValue: spyWebSocketService
      }
    ]
  });
}));

let service;
 
beforeEach(inject( [ToDoService], (_s: ToDoService) => {
 
    service = _s;
     
}));

it('check if mock is good', () => {
  expect(spyWebSocketService.readTaskList);
  expect(service.tasklist).toBe(this.tasklist);
});

