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
    supabase.auth.signInWithPassword(
    {
      email: this.username,
      password: this.password,
    })
    .then(({ data, error }) => 
    {
      if (error) 
      {
        if(error.message == 'Invalid login credentials')
        {
          this.errorMessage = 'Credenciales invalidas';
          console.log(this.errorMessage);
        }
        else if(this.errorMessage == 'missing email or phone')
        {
          this.errorMessage = 'Ingrese username';
          console.log(this.errorMessage);
        }
      } 
      else 
      {
        this.router.navigate(['/home']);
      }
    });
  }
  quickAcess()
  {
    this.username="ezequielmartinb10@gmail.com";
    this.password="123456"
  }


}
