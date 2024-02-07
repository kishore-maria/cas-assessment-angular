import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  todoList: Subject<Todo[]> = new Subject();

  showSpinner: Subject<boolean> = new Subject();

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Okay', {
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });

    setTimeout(() => {
      this.closeSnackBar();
    }, 3000);
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
