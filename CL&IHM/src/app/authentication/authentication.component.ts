import { Route, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

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
  userFound:boolean=false;
  constructor(public auth:AngularFireAuth,private router:Router) { }

  ngOnInit(): void {
    this.auth.signOut();
  }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      (result)=>{
        console.log("gotchau")
        console.log("here is my user " +this.auth.user)
        console.log("result "+result)
        this.currentUser=firebase.auth().currentUser;
        this.currentUser?.providerData.forEach(profile=>{
        console.log(profile?.photoURL)
        console.log(profile?.displayName)
        this.photoUrl=profile?.photoURL

        this.nameUser=profile?.displayName
        this.router.navigate(['/todo-list'])

        }
          )
        }

    ).catch((error)=>{
      console.log("Got error ,No user has been found :",error);
    })
  }



}
