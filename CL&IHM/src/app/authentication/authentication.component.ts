import { ServiceDataService } from './../service-data.service';
import { Route, Router } from '@angular/router';
import { Component, OnInit, Injectable } from '@angular/core';
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
  constructor(public auth:AngularFireAuth,private router:Router,public dataService:ServiceDataService) { }
  ngOnInit(): void {
    console.log('daun')
    this.auth.signOut();
  }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      ()=>{
        this.currentUser=firebase.auth().currentUser;
        this.currentUser?.providerData.forEach( async profile=>{
        this.photoUrl=profile?.photoURL
        this.nameUser=profile?.displayName
        await this.setData([this.photoUrl,this.nameUser]);
        console.log('setted')
        this.router.navigate(['/todo-list'])
        }
          )
        }
    ).catch((error)=>{
      console.log("Got error ,No user has been found :",error);
    })
  }
  async getData(){
    return this.dataService.serviceData;
  }
  async setData(val:any){
     this.dataService.serviceData=val;
  }




}
