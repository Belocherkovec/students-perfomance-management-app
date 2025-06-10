import { Get, Post, Put, Delete, Param, Body, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

import { Todo } from '@/models/Todo';
import { TodoService } from '@/services/TodoService';

@JsonController('/todos')
@Service()
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getAll() {
    return this.todoService.getAllTodos();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.todoService.getTodoById(id);
  }

  @Post()
  async create(@Body() todoData: Partial<Todo>) {
    console.log(todoData);
    return this.todoService.createTodo(todoData);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() todoData: Partial<Todo>) {
    return this.todoService.updateTodo(id, todoData);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.todoService.deleteTodo(id);
  }
}
