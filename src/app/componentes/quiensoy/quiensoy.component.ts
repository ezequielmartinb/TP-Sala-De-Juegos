import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-quiensoy',
  imports: [],
  templateUrl: './quiensoy.component.html',
  styleUrl: './quiensoy.component.css'
})
export class QuiensoyComponent {
  imageUrl: string = '';

  constructor() {
    this.obtenerImagen();
  }

  async obtenerImagen() {
    const { data } = await supabase.storage.from('images').getPublicUrl('imagen.jpg');
    this.imageUrl = data.publicUrl;
  }

}
