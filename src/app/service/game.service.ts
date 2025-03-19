import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login?name=${name}`, {});
  }

  saveScore(userId: number, score: number, mode:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/score?userId=${userId}&score=${score}&mode=${mode}`, {});
  }

  getScores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scores`);
  }

  getModeWiseTopScore(userId:number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/modeWiseTopScore?userId=${userId}`);
  }
}
