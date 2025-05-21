import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PalabrasSecretasService } from '../../servicios/palabras-secretas.service';

@Component({
  selector: 'app-ahorcado',
  imports:[CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements AfterViewInit 
{
  @ViewChild('hangmanCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  fila1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  fila2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  fila3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];  

  palabrasSecretas: string[] = [];
  palabraIngresada: string = "";
  palabraOculta: string = "";
  letras: string[] = [];
  errores = 0;
  erroresMaximos = 7;  
  juegoActivo = true;
  cargandoPalabra:boolean = true;
  mensajeFinal:string = "";

  constructor(private palabrasService: PalabrasSecretasService) {}

  ngOnInit() 
  {
    this.cargandoPalabra = true; 
    this.palabrasService.getPalabrasSecretas().subscribe(
    {
      next: (data) => 
      {        
        this.palabrasSecretas = data.filter(palabra => !palabra.includes(" ") && !palabra.includes("-") && !palabra.includes(".") && !palabra.includes("!"))
        .map(palabra => palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase());
  
        if (this.palabrasSecretas.length > 0) 
        {
          this.iniciarJuego();
        } 
        else 
        {
          console.error("Error: No se recibieron palabras válidas.");
        }
  
        this.cargandoPalabra = false; 
      },
      error: (err) => {
        console.error("Error al obtener palabras:", err);
        this.cargandoPalabra = false;
      }
    });
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
     
    this.palabraIngresada = this.palabrasSecretas[Math.trunc(Math.random() * this.palabrasSecretas.length)];  
    this.palabraOculta = '_ '.repeat(this.palabraIngresada.length).trim();
    this.letras = [];
    this.errores = 0;
    this.juegoActivo = true;
  
    console.log("Palabra seleccionada:", this.palabraIngresada);
    this.mensajeFinal = "";  
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
  }

  informarResultadoDelJuego() 
  {
    if (!this.palabraOculta.includes('_'))
    {
      this.juegoActivo = false;
      this.mensajeFinal = `Ganaste! La palabra es: ${this.palabraIngresada}`;
    } 
    else if (this.errores >= this.erroresMaximos) 
    {
      this.juegoActivo = false;
      this.mensajeFinal = `Perdiste! La palabra era: ${this.palabraIngresada}`;
    }
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