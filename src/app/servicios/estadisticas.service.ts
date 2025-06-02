import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { EstadisticaJuego } from '../modelos/interface';

@Injectable({
  providedIn: 'root'
})


export class EstadisticasService 
{
  private supabase = createClient(environment.apiUrl, environment.publicAnonKey);
  private estadisticas: EstadisticaJuego[] = [];

  constructor()
  {
    
  }

  async agregarEstadistica(nombreUsuario: string, puntuacion: number, juego: string) 
  {
    const fechaValida = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  
  
    const { data, error } = await this.supabase
      .from('estadisticas')
      .insert([{ nombre_usuario: nombreUsuario, puntuacion, juego, fecha: fechaValida }])
      .select();
  
    if (error) 
    {
      console.error('Error al guardar la estadística:', error.message, error.details);
    } 
    else 
    {
      console.log('Estadística guardada correctamente:', data);
    }
  }

  obtenerEstadisticas(): EstadisticaJuego[] 
  {
    return this.estadisticas;
  }
  async guardarEstadistica(puntuacion: number, juego:string) 
  {
    const username = localStorage.getItem('username') || 'Invitado';
    this.agregarEstadistica(username, puntuacion, juego);
  }
  async obtenerEstadisticasPorJuego(juego: string)
  {
    const { data, error } = await this.supabase
      .from("estadisticas")
      .select("*")
      .eq("juego", juego)
      .order("puntuacion", { ascending: false })
      .limit(3);
  
    if (error) 
    {
      console.error(`Error al obtener estadísticas de ${juego}:`, error.message);
    }
  
    return data as EstadisticaJuego[] || [];
  }
}
