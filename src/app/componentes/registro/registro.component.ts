import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createClient, User } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment';
import { AuthService } from '../../servicios/auth.service';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  username: string;
  password: string;
  message:string;
  messageType:string;
  errorMessage:string;

  constructor(private router: Router, private authService: AuthService) 
  {
    this.username = '';
    this.password = '';
    this.message = '';
    this.messageType = '';
    this.errorMessage = '';
  } 
  
  async register() 
  {
    if (!this.authService.isValidEmail(this.username)) 
    {
      this.errorMessage = 'Ingrese un correo electrónico válido';
      return;
    }
  
    try 
    {
      const { error } = await supabase.auth.signUp
      ({
        email: this.username,
        password: this.password,
      });
  
      if (error) 
      {        
        this.errorMessage = this.getErrorMessage(error.message);        
      }
      this.saveUserData(this.username, this.password);
    } 
    catch (error) 
    {
      this.errorMessage = 'Error inesperado al registrar usuario';
    }
  }
  
  private getErrorMessage(errorMessage: string): string 
  {
    const errorMessages: Record<string, string> = 
    {
      'Password should be at least 6 characters.': 'La contraseña debe tener al menos 6 caracteres',
      'Signup requires a valid password': 'Ingrese una contraseña válida',
      'Anonymous sign-ins are disabled': 'Ingrese un usuario y contraseña válidos',
      'User already registered': 'El usuario que quiere registrar ya existe',
    };
  
    return errorMessages[errorMessage] || `Error inesperado: ${errorMessage}`;
  }  

  async saveUserData(username:string, password:string) 
  {
    const { error } = await supabase.from('usuarios').insert([
      { username: username, password: password }
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
      this.authService.setUsuario(username);
      this.messageType = 'success';
      this.router.navigate(['/home']);
    }  
  } 
}
