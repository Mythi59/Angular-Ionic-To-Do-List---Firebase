import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  time: string;
  date: string;
  category: string;
  completed: boolean;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskLocalService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {
    console.log('TaskLocalService inicializado');
  }

  // Obtener tareas por fecha
  getTasksByDate(date: string): Observable<Task[]> {
    console.log('Obteniendo tareas para la fecha:', date);
    return this.tasksSubject
      .asObservable()
      .pipe(map((tasks) => tasks.filter((task) => task.date === date)));
  }

  // Agregar nueva tarea
  async addTask(task: Omit<Task, 'id'>): Promise<void> {
    try {
      console.log('Agregando tarea:', task);

      const newTask: Task = {
        ...task,
        id: this.generateId(),
        createdAt: new Date(),
      };

      this.tasks.push(newTask);
      this.tasksSubject.next([...this.tasks]);

      console.log('Tarea agregada exitosamente:', newTask);
      console.log('Total de tareas:', this.tasks.length);
    } catch (error) {
      console.error('Error agregando tarea:', error);
      throw error;
    }
  }

  // Actualizar tarea
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
        this.tasksSubject.next([...this.tasks]);
        console.log('Tarea actualizada:', this.tasks[taskIndex]);
      }
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }

  // Marcar tarea como completada
  async toggleTaskComplete(id: string, completed: boolean): Promise<void> {
    return this.updateTask(id, { completed });
  }

  // Generar ID único
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Obtener todas las tareas (para debugging)
  getAllTasks(): Task[] {
    return this.tasks;
  }
}
