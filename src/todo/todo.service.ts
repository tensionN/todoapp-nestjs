import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  async createTodo(todo: CreateTodoDto) {
    return await this.todoRepository.save(todo);
  }

  getTodos(): Promise<Todo[]> {
    return this.todoRepository.find();
  }
}
