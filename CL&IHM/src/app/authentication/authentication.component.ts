import { TodoList, TodolistService, defaultList } from './../todolist.service';
import { TodoListComponent } from './../todo-list/todo-list.component';
import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  currentUser:null | firebase.User | undefined;
  photoUrl:string|undefined|null;
  nameUser:string|undefined|null;
  @ViewChild(TodoListComponent) child:TodoListComponent | undefined;

  constructor(public afs: AngularFirestore,public auth:AngularFireAuth,public list:TodolistService) { }

  ngOnInit(): void {
    this.auth.signOut();
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      ()=>{
        this.currentUser=firebase.auth().currentUser;
        this.currentUser?.providerData.forEach( async profile=>{
          this.photoUrl=profile?.photoURL
          this.nameUser=profile?.displayName
          this.setCollection()
        })
      }
    ).catch((error)=>{
      console.log("Got error ,No user has been found :",error);
    })
  }

  setCollection(){
    this.afs.doc<TodoList>("users/"+this.nameUser).valueChanges().subscribe(data=>{
    (data && this.nameUser)?this.list.subj.next(data):this.list.subj.next(defaultList)
    })

    this.afs.doc('users/'+this.nameUser).ref.get().then((documentSnapshot) => {
      if(!documentSnapshot.exists)
        this.createCollection({label: "L3 MIAGE", items: [], isCompleted: 0})
      })
  }

  async createCollection(data: any): Promise<DocumentReference<unknown> | void> {
    if (this.nameUser)
      return this.afs.collection<TodoList>('users').doc(""+this.nameUser).set(data)
  }

   logout() {
    this.auth.signOut();
    this.nameUser=undefined
    this.photoUrl=undefined
  }
}
