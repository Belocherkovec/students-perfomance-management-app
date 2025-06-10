import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { Todo } from '@/models/Todo';

@Service()
export class TodoRepository {
  constructor(private sequelize: Sequelize) {}

  async findAll() {
    return this.sequelize.getRepository(Todo).findAll();
  }

  async findById(id: number) {
    return this.sequelize.getRepository(Todo).findByPk(id);
  }

  async create(todoData: Partial<Todo>) {
    return this.sequelize.getRepository(Todo).create(todoData);
  }

  async update(id: number, todoData: Partial<Todo>) {
    const todo = await this.sequelize.getRepository(Todo).findByPk(id);
    if (!todo) throw new Error('Todo not found');
    return todo.update(todoData);
  }

  async delete(id: number) {
    const todo = await this.sequelize.getRepository(Todo).findByPk(id);
    if (!todo) throw new Error('Todo not found');
    await todo.destroy();
    return { message: 'Todo deleted successfully' };
  }
}
