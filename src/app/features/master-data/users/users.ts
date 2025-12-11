import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users/users.service';
import { GetUsers, GetUsersResponse, CreateUser } from '../../../models/getUsers';
import { PaginationComponent } from '../../../shared/pagination-component/pagination-component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users: GetUsers[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 0;
  isLoading: boolean = false;
  showModal: boolean = false;
  userForm: FormGroup;
  isSubmitting: boolean = false;

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Account Manager' }
  ];

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role_id: [null, Validators.required],
      phone_number: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: GetUsersResponse) => {
        this.users = response.results;
        this.totalPages = response.total_pages;
        this.currentPage = response.current_page;
        this.totalRecords = response.count;
        this.pageSize = response.page_size;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadUsers();
  }

  onRefresh(): void {
    this.loadUsers();
  }

  openAddUserModal(): void {
    this.showModal = true;
    this.userForm.reset();
  }

  closeModal(): void {
    this.showModal = false;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData: CreateUser = this.userForm.value;
      
      this.usersService.createUser(userData).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.closeModal();
          this.loadUsers(); // Reload users to show the new user
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  getRoleName(roleId: string): string {
    const role = this.roles.find(r => r.id === parseInt(roleId));
    return role ? role.name : roleId;
  }
}
