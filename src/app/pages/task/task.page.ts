import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { TaskService } from 'src/app/shared/task.service';

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {
  selectedDay: number = new Date().getDate();
  selectedDate: string = new Date().toISOString().split('T')[0];

  days = [
    { number: this.selectedDay - 1, name: 'Ayer' },
    { number: this.selectedDay, name: 'Hoy' },
    { number: this.selectedDay + 1, name: 'Mañana' },
    { number: this.selectedDay + 2, name: 'Pasado' },
  ];

  activities: Activity[] = [
    {
      id: 'work',
      name: 'Trabajo',
      description: 'Tareas relacionadas al trabajo',
      icon: 'briefcase',
      color: '#6366f1',
    },
    {
      id: 'personal',
      name: 'Personal',
      description: 'Tareas personales y hobbies',
      icon: 'person',
      color: '#10dc60',
    },
    {
      id: 'health',
      name: 'Salud',
      description: 'Ejercicio y bienestar',
      icon: 'fitness',
      color: '#f04141',
    },
    {
      id: 'study',
      name: 'Estudio',
      description: 'Aprendizaje y educación',
      icon: 'library',
      color: '#ffce00',
    },
    {
      id: 'home',
      name: 'Hogar',
      description: 'Tareas del hogar',
      icon: 'home',
      color: '#7044ff',
    },
  ];

  selectedActivity: Activity | null = null;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  selectDay(day: any) {
    this.selectedDay = day.number;
    const today = new Date();
    const selectedDate = new Date(today);
    selectedDate.setDate(day.number);
    this.selectedDate = selectedDate.toISOString().split('T')[0];
  }

  selectActivity(activity: Activity) {
    this.selectedActivity = activity;
    this.showTaskForm();
  }

  async showTaskForm() {
    if (!this.selectedActivity) return;

    const alert = await this.alertController.create({
      header: `Nueva Tarea - ${this.selectedActivity.name}`,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea',
          attributes: { maxlength: 50, required: true },
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción (opcional)',
          attributes: { maxlength: 200, rows: 3 },
        },
        {
          name: 'time',
          type: 'time',
          value: '09:00',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.title && data.title.trim()) {
              this.createTask(data);
              return true;
            } else {
              this.showToast('El título es obligatorio.', 'danger');
              return false;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async createTask(formData: any) {
    if (!this.selectedActivity) return;

    const newTask = {
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      time: formData.time,
      category: this.selectedActivity.id,
      completed: false,
      createdAt: new Date(),
    };

    try {
      await this.taskService.addTask(newTask);
      this.showToast('Tarea creada con éxito.', 'success');
      this.selectedActivity = null;
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error creating task:', error);
      this.showToast('Error al crear la tarea. Inténtalo de nuevo.', 'danger');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
