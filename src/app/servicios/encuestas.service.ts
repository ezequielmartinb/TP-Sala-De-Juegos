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
  const { data, error } = await this.supabase.from('encuestas').insert([datos]).select(); // 🔹 Agrega .select() para obtener la respuesta
  
  if (error) 
  {
    console.error('❌ Error en Supabase:', error.message);
    return null;
  }
  return data; // Retorna los datos insertados
}

}