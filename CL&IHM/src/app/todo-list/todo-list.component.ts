import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  todoList: TodoList | any;
  readonly todoListObs = new Observable<TodoList>();

  constructor(public service: TodolistService){
    this.todoListObs =this.service.observable;
  }

  ngOnInit(): void {
    this.service.observable.subscribe(response =>{
      this.todoList = response;
      console.log(response);
    })
  }

  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]){
    this.service.update(data, ...items);
  }

  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }

}
