import { TodoItem, TodoList, TodolistService } from './todolist.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';
  todoList: TodoList | any;
  currentUser:null | firebase.User | undefined;
  photoUrl:string|undefined|null;
  nameUser:string|undefined|null;
  constructor(public service: TodolistService,public auth: AngularFireAuth){}
  ngOnInit(){
    this.service.observable.subscribe(response =>{
      this.todoList = response;
      console.log(response);
    })

  }

  update(data: Partial<TodoItem>,...items: readonly TodoItem[]){
    this.service.update(data,...items);
  }
  delete(...items: readonly TodoItem[]): void{
    this.service.delete(...items);
  }


  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      (result)=>{
        console.log("gotchau")
        console.log("here is my user " +this.auth.user)
        console.log("result "+result)
        this.currentUser=firebase.auth().currentUser;
        if(this.currentUser!=null){
          this.currentUser?.providerData.forEach(profile=>{
            console.log(profile?.photoURL)
            console.log(profile?.displayName)
            this.photoUrl=profile?.photoURL
            this.nameUser=profile?.displayName
          }
          )
        }
        else{
          console.log("Got error ,No user has been found :user==null")
        }
      }

    ).catch((error)=>{
      console.log("Got error ,No user has been found :",error);
    })


  }
  logout() {
    this.photoUrl=""
    this.nameUser=""
    this.auth.signOut();
  }
}

