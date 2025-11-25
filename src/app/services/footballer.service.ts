import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Footballer } from '../models/footballer.model';
import { environment } from '../../enviornment/environment';

@Injectable({
  providedIn: 'root'
})
export class FootballerService {
  private apiUrl = `${environment.apiUrl}/footballers`;

  constructor(private http: HttpClient) { }

  getAllFootballers(filters?: { 
    name?: string, 
    team?: string, 
    nationality?: string,
    position?: string
  }): Observable<Footballer[]> {
  
    let params = new HttpParams();
  
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.team) params = params.set('team', filters.team);
      if (filters.nationality) params = params.set('nationality', filters.nationality);
      if (filters.position) params = params.set('position', filters.position);
    }
  
    return this.http.get<Footballer[]>(this.apiUrl, { params });
  }

  createFootballer(footballer: Footballer): Observable<Footballer> {
    return this.http.post<Footballer>(this.apiUrl, footballer);
  }

  updateFootballer(id: string, footballer: Footballer): Observable<Footballer> {
    return this.http.put<Footballer>(`${this.apiUrl}/${id}`, footballer);
  }

  deleteFootballer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getFootballerById(id: string): Observable<Footballer> {
    return this.http.get<Footballer>(`${this.apiUrl}/${id}`);
  }
}