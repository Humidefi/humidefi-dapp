import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { SafePipe } from './../../pipes/safe.pipe';
import { WalletModule } from '../wallet/wallet.module';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WalletModule,
    PortfolioRoutingModule,
    BreadcrumbModule,
    CardModule,
    PanelModule,
    ChipModule,
    TableModule,
    DialogModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class PortfolioModule { }
