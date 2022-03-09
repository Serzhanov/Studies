import { TodoItem, TodoList, TodolistService } from './todolist.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';
  todoList: TodoList | any;
  todoList_all2:TodoList|any;

  constructor(public service: TodolistService){}
  ngOnInit(){
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


}

