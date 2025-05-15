import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';


const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent 
{
  username:string = "";
  password:string = "";
  errorMessage:string=""

  constructor(private router: Router) 
  {
  
  }

  login()
  {
    console.log(this.username);
    supabase.auth.signInWithPassword(
    {
      email: this.username,
      password: this.password,
    })
    .then(({ data, error }) => 
    {
      if (error) {
        console.error('Error al iniciar sesión:', error.message);
  
        if (error.message === 'Invalid login credentials') {
          this.errorMessage = 'Credenciales inválidas';
        } else if (error.message === 'missing email or phone') {
          this.errorMessage = 'Ingrese username';
        } else {
          this.errorMessage = `Error inesperado: ${error.message}`;
        }
  
        console.log(this.errorMessage);
      } else {
        console.log('Inicio de sesión exitoso:', data);
        this.router.navigate(['/home'], { queryParams: { username: this.username } });
      }
    })   
  
  }
  quickAcess()
  {
    this.username="ezequielmartinb10@gmail.com";
    this.password="123456"
  }


}
