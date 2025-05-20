import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../servicios/auth.service';


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


  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) 
  {
    this.obtenerIconos();
  }
  
  ngOnInit() 
  {
    this.username = this.authService.getUsuario();
  }

  mostrarMensajeError(index: number): void 
  {
    if (!this.username) 
    {
      this.mensajeActivo = index;
    }
    else if(index == 1)
    {
      this.router.navigate(['/juegos/ahorcado']);
    }
    else if(index == 2)
    {
      this.router.navigate(['/juegos/mayormenor']);
    }
    else if(index == 3)
    {
      this.router.navigate(['/juegos/preguntados']);
    }
  }

  async obtenerIconos() 
  {
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
