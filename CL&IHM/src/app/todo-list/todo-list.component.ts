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
  taille:number|undefined;
  readonly todoListObs = new Observable<TodoList>();

  constructor(public service: TodolistService){
    this.todoListObs =this.service.observable;

  }

  ngOnInit(): void {
    this.service.observable.subscribe(response =>{
      this.todoList = response;
      console.log(response);
      this.taille=this.todoList.items.length

    })
  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]){
    this.service.update(data,...items);

  }

  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }
  change_to_all():void{
    this.filter='all';
    console.log(this.filter);
  }
  change_to_activ():void{
    this.filter='actives';
    console.log(this.filter);
  }
  change_to_else():void{
    this.filter='pass';
    console.log(this.filter);
  }
  toChange(items:TodoItem[],filter:string){
    if (filter==='pass'){
      return items.filter(el=>el.isDone==true);
    }
    else if(filter==='actives'){
      return items.filter(el=>el.isDone==false);
    }
    else{
      return items;
    }
  }
  delete_all(items:TodoItem[]){
    this.service.delete(...items.filter(el=>el.isDone==true));
  }

}
