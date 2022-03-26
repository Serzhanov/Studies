import { ServiceDataService } from './../service-data.service';
import { TodoItem, TodoList, TodolistService } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy, ReflectiveInjector} from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';




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
    const temp=this.getData()
    if(temp) {
      this.photoUrl=temp[0];
      this.nameProfil=temp[1];
      console.log("Mon rofil est ", this.nameProfil);
    }
    this.todoListObs = this.afs.doc<TodoList>("users/"+this.nameProfil).valueChanges().pipe(
      map( TDL => !!TDL ? TDL : {label: "L3 MIAGE", items: [], isCompleted: 0} )
    );
    this.afs.doc('users/'+this.nameProfil).ref.get().then((documentSnapshot) => {
    if(!documentSnapshot.exists){
      this.createCollection({label: "L3 MIAGE", items: [], isCompleted: 0})
      }
    })

  }
  async createCollection(data: any): Promise<DocumentReference<unknown> | void> {
    console.log(`createCollection`, this.nameProfil, data);
    if (this.nameProfil) {
      return this.afs
            .collection<TodoList>('users').doc(""+this.nameProfil).set(data)
    }

  }

  updateList(list:TodoList) {
    this.afs?.doc(""+this.nameProfil).set(list);
  }
  ngOnInit(): void {
    this.service.observable.subscribe(response =>{
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
    this.router.navigate(['/'])
  }
  getData(){
    return this.dataService.serviceData;
  }
  setData(val:string){
    this.dataService.serviceData;
  }
}


