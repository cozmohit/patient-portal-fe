import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.scss',
})
export class LeftSidebar {
  menuItems = [
    { label: 'Dashboard', icon: 'bi bi-grid-fill', route: '/dashboard' },
    { label: 'Market Size', icon: 'bi bi-pie-chart-fill', route: '/market-size' },
    { label: 'Patients', icon: 'bi bi-person-fill', route: '/patients' },
    { 
      label: 'Master Data', 
      icon: 'bi bi-database-fill', 
      route: '/master-data',
      children: [
        { label: 'Users', icon: 'bi bi-people-fill', route: '/master/users' },
        { label: 'Countries', icon: 'bi bi-globe', route: '/master/countries' },
        { label: 'Products', icon: 'bi bi-box-seam', route: '/master/products' }
      ]
    }
  ];

  expandedMenu: string | null = null;

  toggleMenu(label: string) {
    this.expandedMenu = this.expandedMenu === label ? null : label;
  }
}
