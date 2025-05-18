import { ChangeDetectorRef, Component } from '@angular/core';
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

  constructor(private router: Router, private cd: ChangeDetectorRef) 
  {
  
  }

  async login() {
    if (!this.isValidEmail(this.username)) 
    {
      this.errorMessage = 'Ingrese un correo electrónico válido';
      return;
    }
  
    try 
    {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.username,
        password: this.password,
      });
  
      if (error) 
      {
        this.errorMessage = this.getErrorMessage(error.message);
        return;
      }
  
      console.log('Inicio de sesión exitoso:', data);
      this.cd.detectChanges();
      this.router.navigate(['/home'], { queryParams: { username: this.username } });
    } 
    catch (error) 
    {
      console.error('Error inesperado al iniciar sesión:', error);
      this.errorMessage = 'Error inesperado al iniciar sesión';
    }
  }
  
  private isValidEmail(email: string): boolean 
  {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private getErrorMessage(errorMessage: string): string {
    const errorMessages: Record<string, string> = 
    {
      'Invalid login credentials': 'Credenciales inválidas',
      'missing email or phone': 'Ingrese username',
    };
  
    return errorMessages[errorMessage] || `Error inesperado: ${errorMessage}`;
  }
  quickAcess()
  {
    this.username="ezequielmartinb10@gmail.com";
    this.password="123456";
    this.cd.detectChanges(); 
  }


}
