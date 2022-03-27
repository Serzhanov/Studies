import { Observable } from 'rxjs';
import { TodoList } from './todolist.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ServiceDataService {
  public serviceData:string[]| undefined;
  public serviceList :Observable<TodoList> | undefined;
  constructor() {

  }
}
