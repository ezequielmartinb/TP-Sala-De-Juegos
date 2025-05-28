import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit
{
  estadisticasAhorcado: any[] = [];
  estadisticasMayorMenor: any[] = [];
  estadisticasPreguntados: any[] = [];
  estadisticasBlackjack: any[] = [];
  cargandoEstadisticas = true; // Nuevo estado de carga

  constructor(private estadisticasService: EstadisticasService) {}

  async ngOnInit() {
    this.cargandoEstadisticas = true; // Indicar que está cargando

    this.estadisticasAhorcado = (await this.estadisticasService.obtenerEstadisticasPorJuego("Ahorcado")) || [];
    this.estadisticasMayorMenor = (await this.estadisticasService.obtenerEstadisticasPorJuego("Mayor-Menor")) || [];
    this.estadisticasPreguntados = (await this.estadisticasService.obtenerEstadisticasPorJuego("Preguntados")) || [];
    this.estadisticasBlackjack = (await this.estadisticasService.obtenerEstadisticasPorJuego("Blackjack")) || [];

    this.cargandoEstadisticas = false; // Indicar que terminó la carga
  }


}
