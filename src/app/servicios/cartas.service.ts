import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartasService 
{
  private apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
  private deckId: string = '';

  constructor(private http: HttpClient) {}

  async iniciarBaraja(): Promise<void> 
  {    
    const baraja = await this.http.get<any>(this.apiUrl).toPromise();
    this.deckId = baraja.deck_id;    
  }

  async obtenerCartas(): Promise<any[]> 
  {
    await this.iniciarBaraja();
    const response = await this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=52`).toPromise();
    return response.cards;
  }
}