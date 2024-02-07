import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {

  todoForm: FormGroup = {} as FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      status: ['todo', Validators.required]
    });
    if (this.data.editMode) {
      this.setFormValues();
    }
  }

  setFormValues() {
    this.todoForm.patchValue(
      {
        title: this.data.todo.title,
        status: this.data.todo.status
      }
    );
  }

  save() {
    if (!this.todoForm.valid) {
      this.todoForm.markAllAsTouched();
      return;
    }
    const data = this.todoForm.value
    if (this.data.todo) {
      data.id = this.data.todo.id;
    }
    this.dialogRef.close(data);
  }

}
