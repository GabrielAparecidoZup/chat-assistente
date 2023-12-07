/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getChats(): Observable<any> {
    return this.http.get('http://localhost:3002/api/chats');
  }

  getChatById(id: number): Observable<any> {
    return this.http.get(`http://localhost:3002/api/chats/1`);
  }
}
