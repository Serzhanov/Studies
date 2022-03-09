import { TodoListComponent } from './todo-list/todo-list.component';
import { Injectable } from '@angular/core';
import { BehaviorSubject ,tap} from 'rxjs';

export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}

let idItem = 0;

const saveListName='TODOLIST MIAGE';
const defaultList={label: 'L3 MIAGE', items: [] };
export class TodolistService {

  private subj = new BehaviorSubject<TodoList>({label: 'L3 MIAGE', items: [] });
  readonly observable = this.subj.asObservable();
  // private subj=new BehaviorSubject<TodoList>(localStorage.getItem(saveListName) ? JSON.parse(localStorage.getItem(saveListName)!):defaultList);
  // readonly observable = this.subj.asObservable().pipe(tap(L => localStorage.setItem(saveListName,JSON.stringify(L))));
  constructor() {

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


  update(data: Partial<TodoItem>,filter:string, ...items: readonly TodoItem[]): this {
    if(data.label !== "") {
      if (filter=='all'){
        console.log('all_main');
        const L = this.subj.value;
        this.subj.next( {
          ...L,
          items: L.items.map( item => items.indexOf(item) >= 0 ? {...item, ...data} : item )
        } );
      }
      else if(filter=='acitves'){
        console.log('actives_all_main');
        const L = this.subj.value;
        this.subj.next( {
          ...L,
          items: L.items.map( item => items.indexOf(item) >= 0  && item.isDone==false ?  {...item, ...data} : item )
        } );
      }
      else{
        console.log('actives_pass_asd');
        const L = this.subj.value;
        this.subj.next( {
          ...L,
          items: L.items.map( item => items.indexOf(item) >= 0  && item.isDone==true ?  {...item, ...data} : item )
        } );
      }
    } else {
      this.delete(...items);
    }
    return this;
  }

  }


