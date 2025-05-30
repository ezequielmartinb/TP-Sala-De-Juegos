import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { createClient } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root'
})
export class EncuestasService 
{

  private supabase = createClient(environment.apiUrl, environment.publicAnonKey);

  async insertarEncuesta(datos: any) 
  {
    const username = localStorage.getItem('username');
  
    if (!username) 
    {
      console.error('❌ No se encontró username en el local storage.');
      return null;
    }
  
    const usuarioYaCargoEncuesta = await this.verificarEncuestaPorUsuario(username);
  
    if (usuarioYaCargoEncuesta) 
    {
      console.error('❌ Usuario ya registrado, no se puede insertar.');
      return null;
    }
  
    datos.username = username;
  
    const { data, error } = await this.supabase.from('encuestas').insert([datos]).select();
  
    if (error) 
    {
      console.error('❌ Error en Supabase:', error.message);
      return null;
    }
  
    return data;
  }
  
  
  async verificarEncuestaPorUsuario(username: string)
  {
    const { data, error } = await this.supabase
      .from('encuestas')
      .select('username')
      .eq('username', username);
  
    if (error) 
    {
      console.error('❌ Error al consultar Supabase:', error.message);
      return false; 
    }
  
    return data.length > 0;
  }
  
  

}