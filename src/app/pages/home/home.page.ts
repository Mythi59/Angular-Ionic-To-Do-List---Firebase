import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/app/shared/task.service';

interface Task {
  id: string;
  title: string;
  time: string;
  timeRange?: string;
  category: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  day: number = new Date().getDate();
  month: string = new Date().toLocaleString('default', { month: 'short' });
  nextDay: number = this.day + 1;
  countTask: number = 0;

  tasks: Task[] = [];
  todayTasks: Task[] = [];
  private tasksSubscription: Subscription = new Subscription();

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.tasksSubscription.unsubscribe();
  }

  loadTasks() {
    this.tasksSubscription = this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;

      const today = new Date().toISOString().split('T')[0];
      this.todayTasks = tasks.filter((task) => task.time === today);
      this.countTask = this.todayTasks.length;
    });
  }

  navigateToCreateTask() {
    this.router.navigate(['/task']);
  }

  async toggleTaskCompletion(task: Task) {
    if (task.id) {
      try {
        await this.taskService.toggleTaskCompletion(task.id, !task.completed);
      } catch (error) {
        console.error('Error updating task completion:', error);
      }
    }
  }

  formatTime(time: string): string {
    const [hours, minute] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  }
}
