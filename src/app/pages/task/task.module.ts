import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPageRoutingModule } from './task-routing.module';

import { TaskPage } from './task.page';
import { TaskLocalService } from '../../shared/task-local.service';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TaskPageRoutingModule],
  declarations: [TaskPage],
  providers: [TaskLocalService],
})
export class TaskPageModule {}
