/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiBase =
    'http://ec2-54-86-60-242.compute-1.amazonaws.com:8080/bff/v1';

  constructor(private http: HttpClient) {}

  getChats(): Observable<any> {
    return this.http.get(`${this.apiBase}/chats`);
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiBase}/clientes`);
  }

  getParametro(): Observable<any> {
    return this.http.get(`${this.apiBase}/parametro`);
  }

  getChatById(id: string): Observable<any> {
    return this.http.get(`${this.apiBase}/chats-by-id/${id}`);
  }

  atualizaModoAssistente(telefone: string, obj: any): Observable<any> {
    return this.http.put(`${this.apiBase}/clientes/${telefone}`, obj);
  }
}
