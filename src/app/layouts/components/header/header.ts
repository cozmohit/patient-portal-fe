import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  loginService = inject(LoginService);
  isDropdownOpen = signal(false);

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  onLogout(): void {
    this.closeDropdown();
    this.loginService.logout();
  }
}
