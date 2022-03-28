import { ServiceDataService } from './../service-data.service';
import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { defaultList } from './../todolist.service';





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
  nameProfil:string|undefined|null;
  todoListObs = new Observable<TodoList>()

  constructor(public service: TodolistService,public auth : AngularFireAuth,private router:Router,public dataService:ServiceDataService,private afs: AngularFirestore){

    const temp=this.service.getData()
    this.service.initializing()
    if(temp){
      this.photoUrl=temp[0]
      this.nameProfil=temp[1]
    }
      this.todoListObs=this.service.subj.asObservable()
  }

  ngOnInit(): void {
      this.todoListObs.subscribe((response ) =>{
      this.todoList = response;
      this.todoList.isCompleted=0;
      this.verify(this.todoList)
    })

  }

  updating(data: Partial<TodoItem>,...items: readonly TodoItem[]){
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
      this.updating({isDone:!this.taggle},item)
    })
    this.taggle=!this.taggle;
  }

  logout() {
    this.auth.signOut();
    this.service.subscription?.unsubscribe()
    this.service.subj.next(defaultList)
    this.router.navigate(['/'])
  }

  getData(){
    return this.dataService.serviceData;
  }

  setData(val:string[]){
    this.dataService.serviceData=val;
  }

  sendList(s:Observable<TodoList>){
    this.dataService.serviceList=s
  }

  saveList(list:TodoList) {
    this.afs.doc("users/"+this.nameProfil).set(list);
  }
}


