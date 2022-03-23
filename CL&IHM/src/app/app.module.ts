import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat'
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodolistService } from './todolist.service';
import { environment } from 'src/environments/environment';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AppRoutingModule } from './app-routing.module';




@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    AuthenticationComponent

  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [TodolistService, { provide: AUTH_SETTINGS, useValue: { appVerificationDisabledForTesting: true } }],
  bootstrap: [AppComponent],
})
export class AppModule { }
