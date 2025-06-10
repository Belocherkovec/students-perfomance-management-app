// src/dtos/TodoDto.ts
import {Todo} from "../models/Todo";

export class TodoDto {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;

  constructor(todo: Todo) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description;
    this.isCompleted = todo.completed;
    this.createdAt = todo.createdAt;
  }
}