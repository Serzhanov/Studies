import { ServiceDataService } from './service-data.service';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, tap, Observable, Subscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { flatMap } from 'cypress/types/lodash';
export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
  isCompleted:number;
}



let idItem = 0;

const saveListName='TODOLIST MIAGE';
const defaultList={label: 'L3 MIAGE', items: [],isCompleted:0 };
@Injectable()
export class TodolistService {

  public subj =new BehaviorSubject<TodoList>(defaultList)
  observableTemp:Observable<TodoList> | undefined
  photoUrl:string|undefined
  nameProfil:string|undefined

   //private subj=new BehaviorSubject<TodoList>(localStorage.getItem(saveListName) ? JSON.parse(localStorage.getItem(saveListName)!):defaultList);
   //readonly observable = this.subj.asObservable().pipe(tap(L => localStorage.setItem(saveListName,JSON.stringify(L))));
  constructor(private afs: AngularFirestore,public service:ServiceDataService) {
    this.getCollection()
    this.observableTemp?.subscribe(async resultat=>{
        this.subj.next(resultat as TodoList)
      }
    )
  }

  create(...labels: readonly string[]): this {
    const L: TodoList = this.subj.value;
    this.subj.next( {
      ...L,
      items: [
        ...L.items,
        ...labels.filter( l => l !== '').map(
            label => ({label, isDone: false, id: idItem++})

          )
      ]
    } );

    return this;
  }

  delete(...items: readonly TodoItem[]): this {
    const L = this.subj.value;
    this.subj.next( {
      ...L,
      items: L.items.filter(item => items.indexOf(item) === -1 )
    } );
    return this;
  }


  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this {
    if(data.label !== "") {
        const L = this.subj.value;
        this.subj.next( {
          ...L,
          items: L.items.map( item => items.indexOf(item) >= 0 ? {...item, ...data} : item )
        } );
    } else {
      this.delete(...items);
    }
    return this;
  }


  getData(){
    return this.service.serviceData}


  async createCollection(data: any): Promise<DocumentReference<unknown> | void> {
    console.log(`createCollection`, this.nameProfil, data);
    this.nameProfil='Nurbek Ss'
    if (this.nameProfil)
      return this.afs.collection<TodoList>('users').doc(""+this.nameProfil).set(data)
  }


  getCollection(){
    const temp=this.getData()
    if(temp) {
      this.photoUrl=temp[0];
      this.nameProfil=temp[1];
    }
    this.observableTemp= this.afs.doc<TodoList>("users/"+this.nameProfil).valueChanges().pipe(
      map( TDL => !!TDL ? TDL : {label: "L3 MIAGE", items: [], isCompleted: 0} )
    );
    this.afs.doc('users/'+this.nameProfil).ref.get().then((documentSnapshot) => {
      if(!documentSnapshot.exists)
        this.createCollection({label: "L3 MIAGE", items: [], isCompleted: 0})
      })
  }
}
