import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<T, D>(endpoint: string, data: D, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { headers });
  }
}