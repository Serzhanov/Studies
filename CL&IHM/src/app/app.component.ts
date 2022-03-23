import { TodoItem, TodoList, TodolistService } from './todolist.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';
  todoList: TodoList | any;

  constructor(public service: TodolistService,public auth: AngularFireAuth){}
  ngOnInit(){
    this.service.observable.subscribe(response =>{
      this.todoList = response;
      console.log(response);
    })

  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]){
    this.service.update(data,...items);
  }
  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }


}

