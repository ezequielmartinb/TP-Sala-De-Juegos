import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createClient, User } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  username: string;
  password: string;
  message:string;
  messageType:string;
  errorMessage:string;

  constructor(private router: Router) {
    this.username = '';
    this.password = '';
    this.message = '';
    this.messageType = '';
    this.errorMessage = '';
  } 
  
  async register() {
    try 
    {
      if (!this.username || !this.password) 
      {
        this.errorMessage = 'Email y contraseña son obligatorios';
        return;
      }
  
      const { error } = await supabase.auth.signUp(
      {
        email: this.username,
        password: this.password,
      });
  
      if (error) 
      {
        this.errorMessage = `Error: ${error.message}`;
        return;
      }
  
      this.errorMessage = 'Usuario registrado correctamente';
      this.saveUserData(this.username, this.password)      
    } 
    catch (error) 
    {
      this.errorMessage = 'Error inesperado al registrar usuario';
    }
  }
  
  
  
  async saveUserData(username:string, password:string) 
  {
    const { error } = await supabase.from('usuarios').insert([
      { username: this.username, password: this.password }
    ]);
  
    if (error) 
    {
      this.message = 'Hubo un error al registrar el usuario';
      this.messageType = 'error';
      console.error(error.message);
    } 
    else 
    {
      this.message = 'Usuario registrado correctamente';
      this.messageType = 'success';
      this.router.navigate(['/home'], {queryParams: {username: this.username}});
    }  
  } 
}
