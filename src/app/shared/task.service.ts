import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  time: string;
  date: string;
  category: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todas las tareas
  getTasks(): Observable<Task[]> {
    return this.firestore
      .collection<Task>('tasks', (ref) => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Task;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // Obtener tareas por fecha
  getTasksByDate(date: string): Observable<Task[]> {
    return this.firestore
      .collection<Task>('tasks', (ref) =>
        ref.where('date', '==', date).orderBy('time', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Task;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // Agregar nueva tarea
  addTask(task: Omit<Task, 'id'>): Promise<any> {
    return this.firestore.collection('tasks').add({
      ...task,
      createdAt: new Date(),
    });
  }

  // Actualizar tarea
  updateTask(id: string, task: Partial<Task>): Promise<void> {
    return this.firestore.collection('tasks').doc(id).update(task);
  }

  // Eliminar tarea
  deleteTask(id: string): Promise<void> {
    return this.firestore.collection('tasks').doc(id).delete();
  }

  // Marcar tarea como completada
  toggleTaskComplete(id: string, completed: boolean): Promise<void> {
    return this.updateTask(id, { completed });
  }
}
