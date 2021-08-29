import { TasksRepository } from './tasks.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getAll(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async delete(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found!dd`);
    }
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getById(id);
    task.status = status;

    await this.tasksRepository.save(task);
    return task;
  }
}
