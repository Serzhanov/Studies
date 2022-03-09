import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  filter='all';
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

  update(data: Partial<TodoItem>, filter:string,...items: readonly TodoItem[]){
    this.service.update(data, filter,...items);

  }

  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }
  change_to_all():void{
    this.filter='all';
    console.log(this.filter);
  }
  change_to_activ():void{
    this.filter='acitves';
    console.log(this.filter);
  }
  change_to_else():void{
    this.filter='pass';
    console.log(this.filter);
  }
}
