import { Component } from '@angular/core';
import { PaisesService } from '../../servicios/paises.service';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../servicios/estadisticas.service';
interface Pais
{
  name:string,
  flag:string
}
@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent {
  listadoPaises: Pais[] = [];
  paisSeleccionado: Pais;
  opciones: Pais[] = [];
  respuestaSeleccionada = false;
  tiempoRestante = 10;
  intervalo!: any;
  puntuacion: number = 0;
  intentosRestantes: number = 3;

  constructor(private paisesService: PaisesService, private estadisticasService: EstadisticasService) 
  {
    this.paisSeleccionado = this.elegirUnPais();
  }

  ngOnInit() 
  {
    this.paisesService.getPaises().subscribe(data => 
    {
      this.listadoPaises = data.map(pais => (
      {
        name: pais.translations?.spa?.common || pais.name.common,
        flag: pais.flags?.png || ''
      }));
      this.iniciarJuego();
    });
  }

  elegirUnPais() 
  {
    const randomIndex = Math.floor(Math.random() * this.listadoPaises.length);
    return this.listadoPaises[randomIndex];
  }

  iniciarJuego() 
  {
    if (this.listadoPaises.length < 3) return;
    this.paisSeleccionado = this.elegirUnPais();

    let opciones = new Set<Pais>();
    opciones.add(this.paisSeleccionado);

    while (opciones.size < 3) 
    {
      const paisRandom = this.elegirUnPais();
      opciones.add(paisRandom);
    }
    
    setTimeout(() => 
    {
      document.querySelectorAll('button.opcion').forEach(btn => 
      {
        btn.removeAttribute('disabled');
        btn.classList.remove('correcto', 'incorrecto');
      });
    });

    this.opciones = Array.from(opciones).sort(() => Math.random() - 0.5);
    this.respuestaSeleccionada = false;

    this.iniciarTemporizador();
  }

  iniciarTemporizador() 
  {
    this.tiempoRestante = 10;
    this.intervalo = setInterval(() => 
    {
      if (this.tiempoRestante > 0) 
      {
        this.tiempoRestante--;
      } 
      else 
      {
        this.seleccionarPrimeraOpcion();
      }
    }, 1000);
  }

  verificarRespuesta(opcion: Pais, boton: HTMLButtonElement) 
  {
    if (this.respuestaSeleccionada) return;

    this.respuestaSeleccionada = true;
    clearInterval(this.intervalo);

    if (opcion.name === this.paisSeleccionado.name) 
    {
      this.puntuacion += 5;
    } 
    else 
    {
      this.intentosRestantes--;
      if(this.intentosRestantes === 0)
      {
        this.estadisticasService.guardarEstadistica(this.puntuacion, "Preguntados");
      }
    }

    boton.classList.add(opcion.name === this.paisSeleccionado.name ? 'correcto' : 'incorrecto');
    document.querySelectorAll('button.opcion').forEach(btn => btn.setAttribute('disabled', 'true'));
  }

  seleccionarPrimeraOpcion() 
  {
    clearInterval(this.intervalo);
    const primeraOpcion = this.opciones[0];
    this.verificarRespuesta(primeraOpcion, document.querySelector(`button.opcion`)!);
  }
  reiniciarJuego() 
  {
    this.puntuacion = 0;
    this.intentosRestantes = 3;
    this.respuestaSeleccionada = false;
  
    clearInterval(this.intervalo);
    this.iniciarJuego();
  }
  continuarJuego() 
  {
    if (this.intentosRestantes > 0) 
    {
      this.iniciarJuego();
    }
  }  
}