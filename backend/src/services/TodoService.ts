import { TodoRepository } from '../repositories/TodoRepository';
import { Todo } from '../models/Todo';
import { Service } from 'typedi';
import {TodoDto} from "../dtos/TodoDto";
import {NotFoundError} from "../errors/NotFoundError";

@Service()
export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  async getAllTodos() {
    const todos = await this.todoRepository.findAll();
    return todos.map((todo) => new TodoDto(todo));
  }

  async getTodoById(id: number) {
    const todo = await this.todoRepository.findById(id);
    return todo ? new TodoDto(todo) : null;
  }

  async createTodo(todoData: Partial<Todo>) {
    const todo = await this.todoRepository.create(todoData);
    return new TodoDto(todo);
  }

  async updateTodo(id: number, todoData: Partial<Todo>) {
    const todo = await this.todoRepository.update(id, todoData);
    if (!todo) throw new NotFoundError('Todo not found');
    return new TodoDto(todo);
  }

  async deleteTodo(id: number) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new NotFoundError('Todo not found');
    await this.todoRepository.delete(id);
    return {
      success: true,
      message: 'Todo deleted successfully',
      deletedTodo: new TodoDto(todo)
    };
  }
}