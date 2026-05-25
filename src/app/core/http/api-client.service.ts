import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly http = inject(HttpClient);

  private readonly gateway = environment.gateway;

  get<T>(url: string) {
    return this.http.get<T>(`${this.gateway}${url}`);
  }

  post<T>(url: string, body: unknown) {
    return this.http.post<T>(`${this.gateway}${url}`, body);
  }

  put<T>(url: string, body: unknown) {
    return this.http.put<T>(`${this.gateway}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${this.gateway}${url}`);
  }
}