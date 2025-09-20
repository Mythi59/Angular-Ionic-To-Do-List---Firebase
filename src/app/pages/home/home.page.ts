import { Component } from '@angular/core';

interface Task {
  id: number;
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
  constructor() {}

  day: number = new Date().getDate();
  month: string = new Date().toLocaleString('default', { month: 'short' });
  nextDay: number = this.day + 1;
  countTask: number = 0;

  onClick(title: HTMLInputElement) {}
}
