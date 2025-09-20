import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TaskLocalService, Task } from '../../shared/task-local.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  day: number = new Date().getDate();
  month: string = new Date().toLocaleString('es-ES', { month: 'short' });
  nextDay: number = this.day + 1;
  countTask: number = 0;

  tasks: Task[] = [];
  todayTasks: Task[] = [];
  private tasksSubscription?: Subscription;

  constructor(private router: Router, private taskService: TaskLocalService) {
    console.log('HomePage constructor');
  }

  ngOnInit() {
    console.log('HomePage ngOnInit');
    this.loadTasks();
  }

  ngOnDestroy() {
    console.log('HomePage ngOnDestroy');
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  loadTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Cargando tareas para:', today);

      this.tasksSubscription = this.taskService
        .getTasksByDate(today)
        .subscribe({
          next: (tasks) => {
            console.log('Tareas recibidas:', tasks);
            this.todayTasks = tasks;
            this.countTask = tasks.length;
          },
          error: (error) => {
            console.error('Error al cargar tareas:', error);
            this.todayTasks = [];
            this.countTask = 0;
          },
        });
    } catch (error) {
      console.error('Error en loadTasks:', error);
      this.todayTasks = [];
      this.countTask = 0;
    }
  }

  // Navegar a la página de crear tarea
  navigateToCreateTask() {
    console.log('Navegando a crear tarea');
    this.router
      .navigate(['/task'])
      .then((success) => {
        console.log('Navegación exitosa:', success);
      })
      .catch((error) => {
        console.error('Error en navegación:', error);
      });
  }

  // Alternar estado completado de tarea
  async toggleTaskComplete(task: Task) {
    console.log('Toggling task:', task.title);
    if (task.id) {
      try {
        await this.taskService.toggleTaskComplete(task.id, !task.completed);
        console.log('Tarea actualizada');
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
      }
    }
  }

  // Formatear hora para mostrar
  formatTime(time: string): string {
    if (!time) return '--:--';

    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formateando tiempo:', error);
      return time;
    }
  }

  // Para debugging
  debugTasks() {
    console.log('Todas las tareas:', this.taskService.getAllTasks());
    console.log('Tareas de hoy:', this.todayTasks);
  }

  // TrackBy function para optimizar *ngFor
  trackByTaskId(index: number, task: Task): string {
    return task.id || index.toString();
  }

  onClick(title: HTMLInputElement) {}
}
