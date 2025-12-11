import { Injectable } from '@angular/core';
import { GetProductsResponse } from '../../../models/getProducts';
import { environment } from '../../../../enviornments/enviornment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseUrl = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

  getProducts(page: number, pageSize: number): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(`${this.baseUrl}/?page=${page}&page_size=${pageSize}`);
  }
}
