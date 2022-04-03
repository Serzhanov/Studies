import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';



export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
  readonly linkForFile:string;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
  isCompleted:number;
}



let idItem = 0;

const saveListName='TODOLIST MIAGE';
export const defaultList={label: 'Who are u?', items: [],isCompleted:0 };
@Injectable()
export class TodolistService {

  public subj =new BehaviorSubject<TodoList>(defaultList)

   //private subj=new BehaviorSubject<TodoList>(localStorage.getItem(saveListName) ? JSON.parse(localStorage.getItem(saveListName)!):defaultList);
   //readonly observable = this.subj.asObservable().pipe(tap(L => localStorage.setItem(saveListName,JSON.stringify(L))));
  constructor(private afs: AngularFirestore) {

  }

  create(...labels: readonly string[]): this {
    const L: TodoList = this.subj.value;
    this.subj.next( {
      ...L,
      items: [
        ...L.items,
        ...labels.filter( l => l !== '').map(
            label => ({label, isDone: false, id: idItem++,linkForFile:''})
          )
      ]
    } );
    (<HTMLInputElement>document.getElementById("labelInput")).value=""
    //console.log(L.items[0].linkForFile,"sadadda")
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
}
