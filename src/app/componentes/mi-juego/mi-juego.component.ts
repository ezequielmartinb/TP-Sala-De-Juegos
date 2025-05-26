import { Component } from '@angular/core';
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
  selector: 'app-mi-juego',
  imports: [CommonModule],
  templateUrl: './mi-juego.component.html',
  styleUrl: './mi-juego.component.css'
})
export class MiJuegoComponent 
{
  cartasDisponibles: Carta[] = [];
  cartasJugador: Carta[] = [];
  cartasBanca: Carta[] = [];
  puntajeJugador = 0;
  puntajeBanca = 0;
  juegoTerminado = false;
  mensajeResultado = '';
  intentosRestantes = 5;
  puntajeTotal = 0;

  constructor(private cartasService: CartasService) {}

  async ngOnInit() 
  {
    await this.iniciarJuego();
  }

  async iniciarJuego() {
    if (this.intentosRestantes <= 0) 
    {
      this.intentosRestantes = 5;
      this.puntajeTotal = 0;
    }

    this.juegoTerminado = false;
    this.mensajeResultado = '';

    const baraja = await this.cartasService.obtenerCartas();
    this.cartasDisponibles = baraja;

    this.cartasJugador = [this.obtenerCarta(), this.obtenerCarta()];
    this.cartasBanca = [this.obtenerCarta(), this.obtenerCarta()];
    this.actualizarPuntajes();
  }

  private obtenerCarta(): any 
  {
    return this.cartasDisponibles.length > 0 ? this.cartasDisponibles.shift() : null;
  }

  private calcularValorCarta(carta: Carta): number 
  {
    const valores: { [key: string]: number } = 
    {
      'ACE': 11, 'KING': 10, 'QUEEN': 10, 'JACK': 10,
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
      '7': 7, '8': 8, '9': 9, '10': 10
    };
    return valores[carta.value] || 0;
  }

  private calcularPuntaje(cartas: any[]): number 
  {
    let puntaje = cartas.reduce((acc, carta) => acc + this.calcularValorCarta(carta), 0);
    let ases = cartas.filter(carta => carta.value === 'ACE');

    while (puntaje > 21 && ases.length > 0) 
    {
      puntaje -= 10;
      ases.pop();
    }
    return puntaje;
  }

  async pedirCarta() 
  {
    const nuevaCarta = this.obtenerCarta();
    if (nuevaCarta) 
    {
      this.cartasJugador.push(nuevaCarta);
      this.actualizarPuntajes();
    }

    if (this.puntajeJugador > 21) 
    {
      this.juegoTerminado = true;
      this.mensajeResultado = '¡Te pasaste de 21! La banca gana.';
      this.intentosRestantes--;
    }
  }

  async plantarJugador() 
  {
    while (this.puntajeBanca < this.puntajeJugador && this.puntajeBanca < 21) 
    {
      const nuevaCarta = this.obtenerCarta();
      if (nuevaCarta) 
      {
        this.cartasBanca.push(nuevaCarta);
        this.actualizarPuntajes();
      }
    }
  
    this.juegoTerminado = true;
    this.determinarGanador();
  }
  

  private actualizarPuntajes() 
  {
    this.puntajeJugador = this.calcularPuntaje(this.cartasJugador);
    this.puntajeBanca = this.calcularPuntaje(this.cartasBanca);
  }

  private determinarGanador() 
  {
    if (this.puntajeBanca > 21 || this.puntajeJugador > this.puntajeBanca) 
    {
      this.mensajeResultado = '¡Ganaste!';
      this.puntajeTotal += 100;
    } 
    else if (this.puntajeBanca === this.puntajeJugador) 
    {
      this.mensajeResultado = '¡Empate!';
    } 
    else 
    {
      this.mensajeResultado = '¡La banca gana!';
      this.intentosRestantes--;
    }   
  }
}
