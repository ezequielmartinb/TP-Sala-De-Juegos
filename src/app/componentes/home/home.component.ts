import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent 
{
  username: string | null = null;
  mensajeActivo: number | null = null; 
  iconoPreguntadosUrl: string = '';
  iconoMayorMenorUrl: string = '';
  iconoAhorcadoUrl: string = '';
  iconoMiJuegoUrl: string = '';


  constructor(private route: ActivatedRoute) 
  {
    this.obtenerIconos();
  }
  
  ngOnInit() 
  {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || null;
    });
  }

  mostrarMensajeError(index: number): void {
    if (!this.username) {
      this.mensajeActivo = index;
    }
  }

  async obtenerIconos() {
    const { data: dataPreguntados } = await supabase.storage.from('images').getPublicUrl('preguntados.ico');
    this.iconoPreguntadosUrl = dataPreguntados.publicUrl;
  
    const { data: dataMayorMenor } = await supabase.storage.from('images').getPublicUrl('mayor-menor.ico');
    this.iconoMayorMenorUrl = dataMayorMenor.publicUrl;
  
    const { data: dataAhorcado } = await supabase.storage.from('images').getPublicUrl('ahorcado.ico');
    this.iconoAhorcadoUrl = dataAhorcado.publicUrl;
  
    const { data: dataMiJuego } = await supabase.storage.from('images').getPublicUrl('mi-juego.ico');
    this.iconoMiJuegoUrl = dataMiJuego.publicUrl;
  }
  


}
