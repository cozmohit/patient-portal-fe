import { Injectable } from '@angular/core';
import { environment } from '../../../../enviornments/enviornment';
import { HttpClient } from '@angular/common/http';
import { CreateUser, GetUsers, GetUsersResponse } from '../../../models/getUsers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number, pageSize: number): Observable<GetUsersResponse> {
    return this.http.get<GetUsersResponse>(`${this.baseUrl}/?page=${page}&page_size=${pageSize}`);
  }
  createUser(user: CreateUser): Observable<CreateUser> {
    return this.http.post<CreateUser>(`${this.baseUrl}/`, user);
  } 
}
