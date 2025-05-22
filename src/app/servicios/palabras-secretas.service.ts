import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PalabrasSecretasService {

  constructor(private http: HttpClient) { }

  getPalabrasSecretas() 
  {
    return this.http.get<String[]>('https://random-word-api.herokuapp.com/all?lang=es')
  }
}
