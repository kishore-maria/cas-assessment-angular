import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../config/config';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }

  getTodoList() {
    const url = `${apiUrl}/list`;
    return this.http.get(url);
  }

  addTodo(payloadData: Todo[]) {
    const url = `${apiUrl}/add`;
    return this.http.post(url, payloadData);
  }

}
