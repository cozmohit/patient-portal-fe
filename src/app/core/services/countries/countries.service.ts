import { Injectable } from '@angular/core';
import { environment } from '../../../../enviornments/enviornment';
import { HttpClient } from '@angular/common/http';
import { GetAllCountries, GetAllCountriesResponse } from '../../../models/getAllCountries';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  baseUrl = `${environment.apiUrl}/countries`;
  constructor(private http: HttpClient) {}

  getCountries(page: number, pageSize: number): Observable<GetAllCountriesResponse> {
    return this.http.get<GetAllCountriesResponse>(`${this.baseUrl}/?page=${page}&page_size=${pageSize}`);
  }
}
