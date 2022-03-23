import { ServiceDataService } from './../service-data.service';
import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';


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
  chck:boolean=false;
  photoUrl:string|undefined|null;
  nameProfil:string|undefined|null;
  todoListObs = new Observable<TodoList>();
  //todoItems= new Observable<TodoItem[]|undefined>();
  //private fireListStocking: AngularFirestoreCollection<TodoList> | undefined;
  constructor(public service: TodolistService,public auth : AngularFireAuth,private router:Router,public dataService:ServiceDataService,private afs: AngularFirestore){
    const temp=this.getData()
    if(temp){
      this.photoUrl=temp[0];
      this.nameProfil=temp[1];
      console.log(this.nameProfil)
    }
    if(this.getDocumentFromCollection()==null){
      this.todoListObs=this.service.observable;
      this.todoListObs.subscribe(val=>this.createCollection(val))
      console.log('nety')
    }
    else{
      this.todoList=this.getDocumentFromCollection();
    }

  }
  createCollection(data: any){
    return new Promise<any>((resolve, reject) => {
       this.afs
           .collection(""+this.nameProfil)
           .add(data)
           .then(
               res => {console.log(resolve)},
               err => reject(err)
           )
    }
 )}
 getDocumentFromCollection(){
  if (this.afs.collection.length==0)
    return this.afs
              .doc(""+this.nameProfil).valueChanges()
  return null;
}
  updateList(list:TodoList) {
    this.afs?.doc(""+this.nameProfil).set(list);
  }
  ngOnInit(): void {
    this.service.observable.subscribe(response =>{
      this.todoList = response;
      console.log(response);
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
    this.router.navigate(['/'])
  }
  getData(){
    return this.dataService.serviceData;
  }
  setData(val:string){
    this.dataService.serviceData;
  }
}


