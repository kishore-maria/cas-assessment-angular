import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Todo, UpdateTodo } from 'src/app/models/todo.model';
import { SharedService } from 'src/app/services/shared.service';
import { TodoService } from 'src/app/services/todo.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmPopupComponent } from 'src/app/shared/modal/confirm-popup/confirm-popup.component';
import { TodoFormComponent } from 'src/app/shared/modal/todo-form/todo-form.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['id', 'title', 'status', 'actions'];
  todoList: Todo[] = [];
  isOnline = true;
  timeoutVar: NodeJS.Timeout | undefined;

  constructor(
    private todoService: TodoService,
    private userService: UserService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    const offlineData = localStorage.getItem('offlineData');
    if (offlineData) {
      this.todoList = JSON.parse(offlineData);
      this.timeoutVar = setTimeout(() => {
        this.sharedService.todoList.next(this.todoList);
      }, 100);
    } else {
      this.getTodoList();
    }
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  getTodoList() {
    this.subscriptions.push(
      this.todoService.getTodoList().subscribe((res: any) => {
        if (res.data && res.data.list) {
          this.todoList = res.data.list;
        }
        this.sharedService.todoList.next(this.todoList);
      }, err => {
        console.log(err);
      })
    )
  }

  addTodo() {
    this.openDialog(false);
  }

  doTodoAction(event: UpdateTodo) {
    if (event.action === 'edit') {
      this.openDialog(true, event.todo);
    } else {
      this.todoList = this.todoList.filter(val => {
        if (val.id !== event.todo.id) {
          return val
        }
        return false;
      })
    }
    this.sharedService.todoList.next(this.todoList);
    localStorage.setItem('offlineData', JSON.stringify(this.todoList));
    if (this.todoList.length <= 0) {
      this.saveChanges();
    }
  }

  openDialog(editMode: boolean, todo?: Todo) {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      data: { editMode, todo },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      this.updateTodo(res);
    });
  }

  updateTodo(todo: Todo) {
    if (todo.id) {
      this.todoList = this.todoList.map(val => {
        if (val.id === todo.id) {
          val = todo
        }
        return val;
      });
    } else {
      const data = todo;
      data.id = this.todoList.length + 1;
      this.todoList.push(data);
    }
    this.sharedService.todoList.next(this.todoList);
    localStorage.setItem('offlineData', JSON.stringify(this.todoList));
  }

  saveChanges() {
    this.subscriptions.push(
      this.todoService.addTodo(this.todoList).subscribe(() => {
        localStorage.removeItem('offlineData');
        this.sharedService.openSnackBar('Changes are saved successfully');
      }, err => {
        console.log(err);
        this.sharedService.openSnackBar('Something went wrong');
      })
    )
  }

  handleOnline(): void {
    this.isOnline = true;
  }

  handleOffline(): void {
    this.isOnline = false;
  }

  logout() {
    if (localStorage.getItem('offlineData')) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: { title: 'Logout', message: `Unsaved changes are there. You may loss your changes. Are you sure want to logout.?`},
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.userService.logout();
        }
      });
      return;
    } else {
      this.userService.logout();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    clearTimeout(this.timeoutVar);
  }

}
