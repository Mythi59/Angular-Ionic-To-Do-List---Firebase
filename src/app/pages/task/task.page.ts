import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { TaskLocalService, Task } from '../../shared/task-local.service';

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

  // Días de la semana
  days = [
    { number: this.selectedDay - 1, name: 'Ayer' },
    { number: this.selectedDay, name: 'Hoy' },
    { number: this.selectedDay + 1, name: 'Mañana' },
    { number: this.selectedDay + 2, name: 'Pasado' },
  ];

  // Actividades predefinidas
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
    private taskService: TaskLocalService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    console.log('TaskPage constructor');
  }

  ngOnInit() {
    console.log('TaskPage inicializada');
  }

  // Seleccionar día
  selectDay(day: any) {
    console.log('Seleccionando día:', day);
    this.selectedDay = day.number;
    const today = new Date();
    const selectedDate = new Date(today);
    selectedDate.setDate(day.number);
    this.selectedDate = selectedDate.toISOString().split('T')[0];
    console.log('Fecha seleccionada:', this.selectedDate);
  }

  // Seleccionar actividad
  selectActivity(activity: Activity) {
    console.log('Actividad seleccionada:', activity.name);
    this.selectedActivity = activity;
    this.showTaskForm();
  }

  // Mostrar formulario de tarea
  async showTaskForm() {
    if (!this.selectedActivity) {
      console.log('No hay actividad seleccionada');
      return;
    }

    console.log('Mostrando formulario para:', this.selectedActivity.name);

    const alert = await this.alertController.create({
      header: `Nueva tarea - ${this.selectedActivity.name}`,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea',
          attributes: {
            required: true,
            maxlength: 50,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción (opcional)',
          attributes: {
            rows: 3,
            maxlength: 200,
          },
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
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Crear Tarea',
          handler: (data) => {
            console.log('Datos del formulario:', data);
            if (data.title && data.title.trim()) {
              this.createTask(data);
              return true;
            } else {
              this.showToast(
                'Por favor ingresa un título para la tarea',
                'warning'
              );
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Crear nueva tarea
  async createTask(formData: any) {
    if (!this.selectedActivity) {
      console.log('No hay actividad seleccionada para crear tarea');
      return;
    }

    const newTask: Omit<Task, 'id'> = {
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      time: formData.time,
      date: this.selectedDate,
      category: this.selectedActivity.id,
      completed: false,
      createdAt: new Date(),
    };

    console.log('Intentando crear tarea:', newTask);

    try {
      await this.taskService.addTask(newTask);
      console.log('Tarea creada exitosamente');

      await this.showToast('¡Tarea creada exitosamente!', 'success');

      // Esperar un momento y navegar de vuelta
      setTimeout(() => {
        console.log('Navegando de vuelta al home');
        this.router.navigate(['/home']);
      }, 2000);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      await this.showToast('Error al crear la tarea', 'danger');
    }
  }

  // Mostrar toast
  async showToast(message: string, color: string) {
    console.log('Mostrando toast:', message);
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  // Volver al home
  goBack() {
    console.log('Regresando al home');
    this.router
      .navigate(['/home'])
      .then((success) => {
        console.log('Navegación al home exitosa:', success);
      })
      .catch((error) => {
        console.error('Error navegando al home:', error);
      });
  }
}
