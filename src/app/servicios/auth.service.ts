import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{

  private username: string | null = null;

  setUsuario(username: string) 
  {
    this.username = username;
    localStorage.setItem('username', username);
  }

  getUsuario(): string | null {
    return this.username || localStorage.getItem('username');
  }

  logout(): void 
  {
    this.username = null;
    localStorage.removeItem('username');
  }
  public isValidEmail(email: string): boolean 
  {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
