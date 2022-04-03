import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy,Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common'
import { DownloadFileService } from '../download-file.service';





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

  @Input() nameProfil: string | undefined|null;

  todoListObs = new Observable<TodoList>()

  constructor(public service: TodolistService,private afs: AngularFirestore,public downloadServ:DownloadFileService){
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

  saveList(list:TodoList) {
    this.afs.doc("users/"+this.nameProfil).set(list);
  }

}


