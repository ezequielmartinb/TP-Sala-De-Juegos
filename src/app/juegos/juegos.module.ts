import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from '../componentes/ahorcado/ahorcado.component';

@NgModule({
  declarations: [], // Agregar el componente aquí
  imports: [CommonModule, JuegosRoutingModule, AhorcadoComponent],
  exports: [] // Exportarlo si se usa en otros módulos
})
export class JuegosModule { }
