import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AuthenticationComponent } from './authentication/authentication.component';


const routes :Routes=[
  {path: '', component:AuthenticationComponent},
  //{path: 'authentication', component : AuthenticationComponent},
  {path: 'todo-list', component : TodoListComponent},
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports : [RouterModule]
})
export class AppRoutingModule { }
