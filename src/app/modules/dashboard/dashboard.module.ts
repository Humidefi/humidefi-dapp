import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { SafePipe } from './../../pipes/safe.pipe';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    BreadcrumbModule,
    CardModule,
    PanelModule,
    ChipModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class DashboardModule { }
