import { Component, OnInit } from '@angular/core';
import { CartasService } from '../../servicios/cartas.service';
import { CommonModule } from '@angular/common';
interface Carta
{
  code:string;
  image:string;
  suit:string;
  value:string
}
@Component({
  selector: 'app-mayormenor',
  imports: [CommonModule],
  templateUrl: './mayormenor.component.html',
  styleUrl: './mayormenor.component.css'
})
export class MayormenorComponent 
{
    cartas: Carta[] = [];
    cartaVisible!: Carta;
    cartaTapada!: Carta;
    cartaRevelada: string = '';
    resultado: string = '';
    seleccionRealizada: boolean = false;
    cargandoCartas: boolean = false;
    mensajeCarga:string="";
  
    constructor(private cartasService: CartasService) {}
  
    ngOnInit()
    {
      this.cargarCartas();
    }
  
    cargarCartas() 
    {
      this.cargandoCartas = true;
      this.mensajeCarga = "⌛ Barajando cartas...";    
      this.cartasService.obtenerCartas().then(data => 
      {
        this.cartas = data.filter(carta => carta.code);
  
        if (this.cartas.length > 1) 
        {
          this.iniciarJuego();
        } 
        else 
        {
          console.error("Error: No se recibieron cartas válidas.");
        }
  
        this.cargandoCartas = false;
        this.mensajeCarga = ''; 
      }).catch(error => 
      {
        console.error("Error al obtener cartas:", error);
        this.cargandoCartas = false;
      });
    }
  
    iniciarJuego()
    {
      this.resultado = '';
      this.cartaRevelada = '';
      this.seleccionRealizada = false;
  
      if (!this.cartas || this.cartas.length < 2) 
      {
        console.error("Error: No hay suficientes cartas disponibles.");
        return;
      }
  
      do 
      {
        this.cartaVisible = this.cartas[Math.floor(Math.random() * this.cartas.length)];
        this.cartaTapada = this.cartas[Math.floor(Math.random() * this.cartas.length)];
      } while (!this.cartaVisible?.value || !this.cartaTapada?.value || this.cartaVisible.value === this.cartaTapada.value);
    }
  
    evaluarEleccion(elección: string)
    {
      if (this.seleccionRealizada) return;
  
      this.seleccionRealizada = true;
      const valorVisible = this.obtenerValor(this.cartaVisible.value);
      const valorTapada = this.obtenerValor(this.cartaTapada.value); 
      this.resultado = (elección === 'mayor' && valorVisible > valorTapada) || (elección === 'menor' && valorVisible < valorTapada) ? 'Correcto!' : 'Incorrecto, intenta de nuevo.';  
      this.cartaRevelada = this.cartaTapada.image;
    }
  
    obtenerValor(valor: string): number 
    {
      const valores: Record<string, number> = { JACK: 11, QUEEN: 12, KING: 13, ACE: 14 };
      if (valores[valor] !== undefined) 
      {
        return valores[valor];
      } 
      else 
      {
        return parseInt(valor, 10);
      }
      
    }  
}
  