import { Component, OnInit, Input } from '@angular/core';
import { ToDoService } from './../../services/todo.service';
import { Task } from '../../models/Task.model';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  @Input() task: Task;
  @Input() index: number;

  constructor(private toDoService: ToDoService, ) {}

  ngOnInit() {
  }

  getPriorite() {
    return this.task.priorite;
  }

  getNomTache() {
    return this.task.nomTache;
  }

  getDescription() {
    return this.task.description;
  }

}

