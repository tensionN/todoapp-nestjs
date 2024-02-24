import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  getTodos(): Promise<Todo[]> {
    return this.todoService.getTodos();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createTodo(@Body() todo: CreateTodoDto) {
    return this.todoService.createTodo(todo);
  }
}
