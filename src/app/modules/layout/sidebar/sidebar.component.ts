import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;

  items: MenuItem[] = [
    // {
    //   label: 'Portfolio',
    //   icon: 'pi pi-fw pi-briefcase',
    //   routerLink: '/app/portfolio'
    // },
    {
      label: 'Dashboard',
      icon: 'custom-icon-dashboard',
      routerLink: '/app/dashboard'
    },
    {
      label: 'Liquidity',
      icon: 'custom-icon-liquidity',
      routerLink: '/app/liquidity'
    },
    {
      label: 'Swap',
      icon: 'custom-icon-swap',
      routerLink: '/app/swap'
    },
    {
      label: 'Transfer',
      icon: 'custom-icon-transfer',
      routerLink: '/app/transfer'
    },
  ];

  ngOnInit() {

  }
}
