import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = 
[
  {
    path:'ahorcado',
    loadComponent: () => import('../componentes/ahorcado/ahorcado.component').then(c => c.AhorcadoComponent)
  },
  {
    path:'mayormenor',
    loadComponent: () => import('../componentes/mayormenor/mayormenor.component').then(c => c.MayormenorComponent)
  },
  {
    path:'preguntados',
    loadComponent: () => import('../componentes/preguntados/preguntados.component').then(c => c.PreguntadosComponent)
  }
  // {
  //   path:'mijuego',
  //   loadComponent: () => import('../componentes/mijuego/mijuego.component').then(c => c.mijuegoComponent)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
