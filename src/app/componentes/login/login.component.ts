import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../servicios/auth.service';


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

  constructor(private router: Router, private cd: ChangeDetectorRef, private authService: AuthService) 
  {
  
  }

  async login() 
  {
    if (!this.authService.isValidEmail(this.username)) 
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
  
      this.cd.detectChanges();
      this.authService.setUsuario(this.username);
      this.router.navigate(['/home']);
    } 
    catch (error) 
    {
      this.errorMessage = 'Error inesperado al iniciar sesión';
    }
  }
  
  private getErrorMessage(errorMessage: string): string 
  {
    const errorMessages: Record<string, string> = 
    {
      'Invalid login credentials': 'Credenciales inválidas',
      'missing email or phone': 'Ingrese username',
    };  
    return errorMessages[errorMessage] || `Error inesperado: ${errorMessage}`;
  }
  public quickAcess()
  {
    this.username="ezequielmartinb10@gmail.com";
    this.password="123456";
    this.cd.detectChanges(); 
  }
  public quickAcess2()
  {
    this.username="ezequiel@gmail.com";
    this.password="123456";
    this.cd.detectChanges(); 
  }
}
