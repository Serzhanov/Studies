import { ServiceDataService } from './service-data.service';
import { TodoItem, TodoList, TodolistService } from './todolist.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';
  todoList: TodoList | any;

  constructor(public auth: AngularFireAuth,public dataService: ServiceDataService,public service: TodolistService){}


  ngOnInit(){/*
    const temp= await this.getList()
    if(temp!=undefined){
      this.service.observable=temp
      console.log('zdes ia')
    }
    else{
      console.log("wtf?")
    }*/


  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]){
    this.service.update(data,...items);
  }
  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }

  getList(){
    return new Promise<Observable<TodoList>>( ()=>this.dataService.serviceList)
  }
}

