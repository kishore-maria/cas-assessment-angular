export interface Todo {
    id: number;
    title: string;
    status: string;
}

export interface UpdateTodo {
    todo: Todo,
    action: string
}