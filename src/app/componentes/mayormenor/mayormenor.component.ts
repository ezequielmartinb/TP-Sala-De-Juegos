import { Component, OnInit } from '@angular/core';
import { CartasService } from '../../servicios/cartas.service';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { Carta } from '../../modelos/interface';

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
  mensajeCarga: string = '';
  intentosRestantes: number = 3; 
  puntuacion: number = 0;
  mostrarBotonContinuar: boolean = false;

  constructor(private cartasService: CartasService, private estadisticasService: EstadisticasService) {}

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
    if (this.intentosRestantes <= 0 || this.cartas.length < 2) 
    {
      this.finalizarJuego();
      return;
    }
    console.log(this.cartas);    

    this.resultado = '';
    this.cartaRevelada = '';
    this.seleccionRealizada = false;
    this.mostrarBotonContinuar = false;

    const indexVisible = Math.floor(Math.random() * this.cartas.length);
    this.cartaVisible = this.cartas[indexVisible];
    this.cartas.splice(indexVisible, 1);

    const indexTapada = Math.floor(Math.random() * this.cartas.length);
    this.cartaTapada = this.cartas[indexTapada];
    this.cartas.splice(indexTapada, 1);

    console.log(this.cartaVisible);
    console.log(this.cartaTapada);    

  }

  evaluarEleccion(elección: string) 
  {
    if (this.seleccionRealizada || this.intentosRestantes <= 0) return;

    this.seleccionRealizada = true;

    const valorVisible = this.obtenerValor(this.cartaVisible.value);
    const valorTapada = this.obtenerValor(this.cartaTapada.value);
    
    if (valorVisible === valorTapada) 
    {
      this.resultado = '🤝 ¡Empate! Las cartas tienen el mismo valor.';
    } 
    else if ((elección === 'mayor' && valorTapada > valorVisible) || (elección === 'menor' && valorTapada < valorVisible)) 
    {
      this.resultado = '✅ ¡Correcto!';
      this.puntuacion += 2;
    } 
    else 
    {
      this.resultado = '❌ Incorrecto, intenta de nuevo.';
      this.intentosRestantes--;
      if(this.intentosRestantes === 0)
      {
        this.estadisticasService.guardarEstadistica(this.puntuacion, "Mayor-Menor");
      }
    }

    this.cartaRevelada = this.cartaTapada.image;
    this.mostrarBotonContinuar = true;
  }

  continuarJuego() 
  {
    this.mostrarBotonContinuar = false;
    this.iniciarJuego();
  }

  finalizarJuego() 
  {
    console.log(`🎯 ¡Juego terminado! Puntuación final: ${this.puntuacion}`);
    this.intentosRestantes = 0;
    this.mostrarBotonContinuar = false;
  }

  obtenerValor(valor: string): number 
  {
    const valores: Record<string, number> = { JACK: 11, QUEEN: 12, KING: 13, ACE: 14 };
    return valores[valor] !== undefined ? valores[valor] : parseInt(valor, 10);
  }
  reiniciarJuego() 
  {
    this.intentosRestantes = 3;
    this.puntuacion = 0;
    this.cartas = [];
    this.mostrarBotonContinuar = false;
    this.resultado = '';
    this.cartaRevelada = '';
    this.seleccionRealizada = false;
    
    this.cargarCartas();
  }
  
}
  