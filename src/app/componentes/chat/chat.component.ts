import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit
{
  nuevoMensaje: string = "";
  username: string | null;
  mensajes: any[] = []; // Almacena los mensajes obtenidos de Supabase
  mostrarChat: boolean = false;
  iconoChat: string = "";

  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef) 
  {
    this.username = this.authService.getUsuario();
    this.obtenerIconos();
  }

  ngOnInit(): void 
  {
    this.obtenerMensajes();
  }

  async enviarMensaje() 
  {
    if (this.nuevoMensaje.trim() === "") return;

    const mensaje = 
    {
      emisor: this.username,
      texto: this.nuevoMensaje,
      fecha: new Date()
    };

    const { error } = await supabase.from('mensajes').insert([mensaje]);

    if (error) 
    {
      console.error("Error al guardar el mensaje:", error);
      return;
    }

    this.mensajes.push(mensaje);
    this.nuevoMensaje = "";
    setTimeout(() => this.scrollToTheLastElementByClassName(), 30);
  }

  async obtenerMensajes() 
  {
    const { data, error } = await supabase
      .from('mensajes')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) 
    {
      console.error("Error al obtener mensajes:", error);
      return;
    }

    this.mensajes = data || [];
    this.cdRef.detectChanges();
  }

  scrollToTheLastElementByClassName() 
  {
    setTimeout(() => 
      {
      const mensajesContainer = document.getElementById('mensajes');
      if (mensajesContainer) 
      {
        mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
      }
    }, 100);
  }

  async obtenerIconos() 
  {
    const { data: dataChat } = await supabase.storage.from('images').getPublicUrl('chat.ico');
    this.iconoChat = dataChat.publicUrl;
    this.cdRef.detectChanges();
  }
}