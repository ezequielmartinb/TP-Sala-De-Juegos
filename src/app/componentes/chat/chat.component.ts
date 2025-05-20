import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent 
{
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  mensajes: { user: string | null; text: string; time: string, timestamp:number }[] = [];
  mensaje: string = '';
  username: string | null;  

  constructor(private authService: AuthService)
  {
    this.username = this.authService.getUsuario();
  }
  ngOnInit() 
  {
    const mensajesGuardados = localStorage.getItem('chatMensajes');
    if (mensajesGuardados) 
    {
      this.mensajes = JSON.parse(mensajesGuardados);
    }
    setInterval(() => this.limpiarMensajes(), 60 * 1000);
  }
  
  enviarMensaje() 
  {
    if (this.mensaje.trim()) 
    {
      const fecha = new Date();
      const horaFormateada = fecha.toLocaleTimeString();
      this.mensajes.push({ user: this.username, text: this.mensaje, time: horaFormateada, timestamp: Date.now() });   
      localStorage.setItem('chatMensajes', JSON.stringify(this.mensajes));   
      this.mensaje = '';
      const maxMensajes = 4;
      if (this.mensajes.length > maxMensajes) 
      {
        this.mensajes.shift();
      }
      requestAnimationFrame(() => this.bloquearScrollBar());
    }
  }
  bloquearScrollBar() 
  {
    if (this.messagesContainer) 
      {
      const container = this.messagesContainer.nativeElement;
  
      if (container.scrollHeight > container.clientHeight) 
      {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
  
  limpiarMensajes() 
  {
    const tiempoMaximo = 60 * 1000;
    const ahora = Date.now();
  
    this.mensajes = this.mensajes.filter(msj => ahora - msj.timestamp < tiempoMaximo);
  
    localStorage.setItem('chatMensajes', JSON.stringify(this.mensajes));
  }  
  obtenerMensajesOrdenados() 
  {
    return this.mensajes.slice().sort((a, b) => b.timestamp - a.timestamp);
  }  
}