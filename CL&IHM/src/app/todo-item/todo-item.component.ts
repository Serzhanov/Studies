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
  constructor() { }

  ngOnInit(): void {
  }

}
