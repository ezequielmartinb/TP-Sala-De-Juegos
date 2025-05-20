import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { ErrorComponent } from './componentes/error/error.component';

export const routes: Routes = 
[
    {
        path:'',
        pathMatch:'full',
        redirectTo:'home'
    },
    {
        path:'home',
        component: HomeComponent
    },
    {
        path:'login',
        loadComponent: () => import('./componentes/login/login.component').then(l=> l.LoginComponent)
    },
    {
        path:'register',
        loadComponent: () => import('./componentes/registro/registro.component').then(r=> r.RegistroComponent)
    },
    {
        path:'quiensoy',
        loadComponent: () => import('./componentes/quiensoy/quiensoy.component').then(q=> q.QuiensoyComponent)     
    },
    {
        path:'juegos',
        loadChildren : () => import('./juegos/juegos.module').then(j => j.JuegosModule)      
    },
    {
        path:'**',
        component:ErrorComponent
    }
];
