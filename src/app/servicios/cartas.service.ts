import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
interface Baraja
{
  success: boolean;
  deck_id: string;
  remaining: number;
  shuffled: boolean;

}
@Injectable({
  providedIn: 'root'
})
export class CartasService 
{
  private apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
  private deckId: string = '';

  constructor(private http: HttpClient) {}

  iniciarBaraja()
  {
    return this.http.get<any>(this.apiUrl);
  }

  async obtenerCartas(): Promise<any[]> 
  {    
    const baraja = await this.iniciarBaraja().toPromise();
    
    this.deckId = baraja.deck_id;
  
    
    const response = await this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=52`).toPromise();
    return response.cards;
  }
}
