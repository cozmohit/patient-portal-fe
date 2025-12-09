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
    { label: 'Master Data', icon: 'bi bi-database-fill', route: '/master-data' } // Placeholder route
  ];
}
