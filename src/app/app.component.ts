import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TP-Sala-De-Juegos';
  public isLoggedIn = false;

  constructor(private router: Router, private cd: ChangeDetectorRef) {} // ✅ Agregar ChangeDetectorRef

  async ngOnInit() {
    await this.checkSession();

    // 🔹 Escucha cambios en sesión en tiempo real
    supabase.auth.onAuthStateChange((_event, session) => {
      this.isLoggedIn = !!session?.user;
      this.cd.detectChanges(); // ✅ Forzar actualización de la vista
      console.log('Cambio de sesión:', session);
    });
  }

  async checkSession() {
    const { data } = await supabase.auth.getSession();
    
    console.log('Datos de sesión:', data.session);

    // 🔹 Verifica si hay un usuario autenticado
    this.isLoggedIn = !!data.session?.user;
    this.cd.detectChanges(); // ✅ Forzar actualización de la vista
  }

  async logout() {
    await supabase.auth.signOut();
    this.isLoggedIn = false;
    this.cd.detectChanges(); // ✅ Refresca la pantalla después del logout
    this.router.navigate(['/login']);
  }
}

