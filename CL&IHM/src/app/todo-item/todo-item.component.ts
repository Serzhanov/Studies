import { TodoItem } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() todoitem:TodoItem | any;
  @Output() update =new EventEmitter<Partial<TodoItem>>();
  @Output() remove = new EventEmitter<TodoItem>();
  private _isEditing=false;
  constructor() { }

  ngOnInit(): void {
  }
  delete(){
    this.remove.emit(this.todoitem);
  }
  update_this(){
    this.todoitem.isDone=!this.todoitem.isDone
    this.update.emit(this.todoitem);
  }
  get isEditing():boolean{
    return this._isEditing;
  }
  set isEditing(e:boolean){
    this._isEditing=e;
  }
  changeLabel(label:string):void{
    this.todoitem.label=label
    this.update.emit(this.todoitem)
    this.isEditing=false;
  }
}
