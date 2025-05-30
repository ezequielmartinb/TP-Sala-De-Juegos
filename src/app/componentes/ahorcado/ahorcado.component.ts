import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { EstadisticasService } from '../../servicios/estadisticas.service';

@Component({
  selector: 'app-ahorcado',
  imports:[CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements AfterViewInit, OnInit 
{
  @ViewChild('hangmanCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  fila1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  fila2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  fila3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];  

  palabrasSecretas: string[] = [
    "RELAMPAGO", "SUSURRO", "ESPEJISMO", "RELOJ", "LABERINTO",
    "HORIZONTE", "CRISTAL", "MELODIA", "TORMENTA", "ECLIPSE",
    "REFLEJO", "DESTELLO", "RUIDO", "INFINITO", "SOMBRA",
    "OLVIDO", "RAIZ", "ABISMO", "FANTASIA", "CENIZA",
    "VIENTO", "DESVELO", "RELATO", "ESTRATEGIA", "SILENCIO",
    "ENCANTO", "EFIMERO", "NOSTALGIA", "MISTERIO", "AURORA",
    "RASTRO", "UMBRAL", "DISTANCIA", "FRAGANCIA", "SUSPIRO",
    "MURMULLO", "VERSO", "CIELO", "IMPETU", "QUIMERA",
    "CLARIDAD", "ALBOR", "ECO", "EUFORIA", "LATIDO",
    "ESENCIA", "FUGAZ", "ANHELO", "CREPUSCULO", "ETER"
  
  ];
  
  palabraIngresada: string = "";
  palabraOculta: string = "";
  letras: string[] = [];
  errores = 0;
  erroresMaximos = 7;  
  juegoActivo = true;
  cargandoPalabra:boolean = true;
  mensajeFinal:string = "";
  intentos : number = 3;
  puntuacion : number = 0;
  palabrasJugadas: string[] = [];
  finDelJuego:boolean = false;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit() 
  {
    if (this.palabrasSecretas.length > 0) 
    {
      this.cargandoPalabra = false;
      this.palabrasSecretas
      this.iniciarJuego();
    }
    else 
    {
      console.error("Error: No se recibieron palabras válidas.");
    }   
  }
  
  ngAfterViewInit() 
  {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
  }

  iniciarJuego() 
  {
    if (this.palabrasSecretas.length === 0)
    {
      console.error("No hay palabras disponibles para jugar.");
      return;
    }
  
    const palabrasDisponibles = this.palabrasSecretas.filter(
      palabra => !this.palabrasJugadas.includes(palabra)
    );
  
    if (palabrasDisponibles.length === 0) 
    {
      this.finDelJuego = true;
      this.estadisticasService.guardarEstadistica( this.puntuacion, 'Ahorcado');
      return;
    }
  
    this.palabraIngresada = palabrasDisponibles[Math.trunc(Math.random() * palabrasDisponibles.length)];
    this.palabraOculta = '_ '.repeat(this.palabraIngresada.length).trim();
    this.letras = [];
    this.errores = 0;
    this.juegoActivo = true;
    console.log("Palabra seleccionada:", this.palabraIngresada);
    this.mensajeFinal = "";  
    this.palabrasJugadas.push(this.palabraIngresada);        
    this.limpiarAhorcado();
  }
  
  mostrarLetraElegida(letter: string) 
  {

    if (!this.juegoActivo) return;

    if (!this.letras.includes(letter))
    {
      this.letras.push(letter);
    }

    if (this.palabraIngresada.includes(letter)) 
    {
      this.actualizarPalabraOculta(letter);
    } 
    else 
    {      
      this.mostrarError();
    }

    this.informarResultadoDelJuego();
  }

  actualizarPalabraOculta(letter: string)
  {
    let palabraActualizada = '';
    for (let i = 0; i < this.palabraIngresada.length; i++) 
    {
      palabraActualizada += this.palabraIngresada[i] === letter ? letter : this.palabraOculta[i * 2];
      palabraActualizada += ' ';
    }
    this.palabraOculta = palabraActualizada.trim();
  }

  mostrarError() 
  {    
    if (this.errores < this.erroresMaximos) 
    {
      this.dibujarHorca();
      this.errores++;
      this.dibujarAhorcado();
    }  
    else if (this.errores >= this.erroresMaximos) 
    {
      this.intentos--;
      this.errores = 0;
      if (this.intentos === 0) 
      {
        this.juegoActivo = false;
        this.mensajeFinal = `¡Perdiste todos tus intentos! La última palabra era: ${this.palabraIngresada}`;
      } 
      else 
      {
        this.iniciarJuego(); 
      }
    }
  }
  

  informarResultadoDelJuego() 
  {
    if (!this.palabraOculta.includes('_')) 
    {
      this.puntuacion += this.palabraIngresada.length * 10; // Más puntos por palabras más largas
      this.juegoActivo = false;
      this.mensajeFinal = `Ganaste! La palabra es: ${this.palabraIngresada}. Puntuación actual: ${this.puntuacion}`;
    } 
    else if (this.errores >= this.erroresMaximos) 
    {
      this.juegoActivo = false;
      this.intentos--;
      if (this.intentos === 0) 
      {
        this.mensajeFinal = `Perdiste todos tus intentos! Puntuación final: ${this.puntuacion}`;
        this.estadisticasService.guardarEstadistica( this.puntuacion, 'Ahorcado');
      }
      else
      {
        this.mensajeFinal = `Perdiste un intento! La palabra era: ${this.palabraIngresada}`;
      }
    }
     
  }
  reiniciarJuego() 
  {
    this.intentos = 3;
    this.puntuacion = 0;
    this.finDelJuego = false;
    this.palabrasJugadas = []; // Reiniciar palabras usadas
    this.juegoActivo = true;
    this.iniciarJuego();
  }  

  limpiarAhorcado()
  {
    this.ctx.clearRect(0, 0, 200, 250);
  }

  dibujarAhorcado() 
  {
    const dibujoDePersona = 
    [            
      () => this.dibujarCabeza(150, 80, 20),
      () => this.dibujarLineas(150, 100, 150, 160), 
      () => this.dibujarLineas(150, 110, 130, 140), 
      () => this.dibujarLineas(150, 110, 170, 140), 
      () => this.dibujarLineas(150, 160, 130, 190),
      () => this.dibujarLineas(150, 160, 170, 190), 
      () => this.dibujarLineas(120, 100, 180, 100)
    ];

    if (this.errores <= dibujoDePersona.length) 
    {
      dibujoDePersona[this.errores - 1]();
    }
  }  
  dibujarHorca()
  {
    const dibujoDeHorca = 
    [
      () => this.dibujarLineas(70, 220, 130, 220),
      () => this.dibujarLineas(100, 50, 100, 220),
      () => this.dibujarLineas(100, 50, 150, 50),
      () => this.dibujarLineas(150, 50, 150, 60),
      () => this.dibujarCabeza(150, 80, 20)
    ]
    for(const index in dibujoDeHorca)
    {
      dibujoDeHorca[index]();
    }
  }

  dibujarCabeza(x: number, y: number, radius: number) 
  {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  dibujarLineas(x1: number, y1: number, x2: number, y2: number) 
  {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }
  
   
}