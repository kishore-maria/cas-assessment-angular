import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Todo, UpdateTodo } from 'src/app/models/todo.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'title', 'status', 'actions'];
  dataSource: Todo[] = [];

  @ViewChild(MatTable) table: MatTable<any> | undefined;

  @Output() emitCustomEvent: EventEmitter<UpdateTodo> = new EventEmitter();

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.sharedService.todoList.subscribe(res => {
        this.dataSource = res;
        this.table?.renderRows()
      })
    )
  }

  editTodo(todo: Todo) {
    const data = {
      todo,
      action: 'edit'
    }
    this.emitCustomEvent.emit(data);
  }

  deleteTodo(todo: Todo) {
    const data = {
      todo,
      action: 'delete'
    }
    this.emitCustomEvent.emit(data);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
