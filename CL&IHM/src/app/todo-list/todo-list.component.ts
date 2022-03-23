import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


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
  taggle=false;

  photoUrl:string|undefined|null;
  readonly todoListObs = new Observable<TodoList>();

  constructor(public service: TodolistService,public auth : AngularFireAuth,private router:Router){
    this.todoListObs =this.service.observable;

  }

  ngOnInit(): void {
    this.service.observable.subscribe(response =>{
      this.todoList = response;
      console.log(response);
      this.todoList.isCompleted=0;
      this.verify(this.todoList)
    })
  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]){
    this.service.update(data,...items);

  }
  verify(list:TodoList){
    list.items.forEach(item=>{
      if(item.isDone==false)
        list.isCompleted++;
    })
  }


  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }
  change(val:string):void{
    switch(val){
      case 'all':
        this.filter='all';
        break;
      case 'actives':
        this.filter='actives';
        break;
      case 'pass':
        this.filter='pass';
        break;
    }
  }

  toChange(items:TodoItem[],filter:string){
    if((filter==='pass') ||(filter==='actives'))
      return items.filter(el=>el.isDone==(filter==='pass'));
    return items;
  }
  delete_all(items:TodoItem[]){
    this.service.delete(...items.filter(el=>el.isDone==true));
  }
  updateAll(data: TodoList){
    data.items.forEach(item=>{
      this.update({isDone:!this.taggle},item)
    })
    this.taggle=!this.taggle;
  }
  logout() {
    this.auth.signOut();
    this.router.navigate(['/'])
  }

}
