import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  time: string;
  timeRange?: string;
  category: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

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

  addTask(task: Omit<Task, 'id'>): Promise<any> {
    return this.firestore.collection('tasks').add({
      ...task,
      createdAt: new Date(),
    });
  }

  updateTask(id: string, task: Partial<Task>): Promise<void> {
    return this.firestore.collection('tasks').doc(id).update(task);
  }

  deleteTask(id: string): Promise<void> {
    return this.firestore.collection('tasks').doc(id).delete();
  }

  toggleTaskCompletion(id: string, completed: boolean): Promise<void> {
    return this.updateTask(id, { completed });
  }
}
