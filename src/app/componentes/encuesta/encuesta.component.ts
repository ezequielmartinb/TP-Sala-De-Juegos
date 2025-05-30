import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncuestasService } from '../../servicios/encuestas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  formularioEncuesta!: FormGroup;
  mensajeGracias: boolean = false;
  mostrarFormulario: boolean = true;
  contadorCaracteres: number = 0;
  mostrarError: boolean = false;

  constructor(private encuestaService: EncuestasService)
  {
    
  }

  ngOnInit(): void 
  {
    this.formularioEncuesta = new FormGroup
    ({
        nombre: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'), Validators.required]),
        apellido: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'), Validators.required]),
        edad: new FormControl("", [Validators.required, Validators.min(18), Validators.max(99)]),
        telefono: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(10), Validators.minLength(10)]),
        juegoFavorito: new FormControl("", [Validators.required]),
        caracteristicas: new FormArray([], [Validators.required]),
        comentario: new FormControl('', [Validators.required, Validators.maxLength(180)])
    });    
  }
  agregarOEliminarCaracteristica(opcion: string, event: any) 
  {
    if (event.target.checked) 
    {
      this.Caracteristicas.push(new FormControl(opcion));
    } 
    else 
    {
      const index = this.Caracteristicas.controls.findIndex(ctrl => ctrl.value === opcion);
      this.Caracteristicas.removeAt(index);
    }
  }
  actualizarContador() {
    this.contadorCaracteres = this.formularioEncuesta.get('comentario')?.value?.length || 0;
  }
  
  get Nombre()
  {
    return this.formularioEncuesta.get('nombre');
  }
  get Apellido()
  {
    return this.formularioEncuesta.get('apellido');
  }
  get Edad()
  {
    return this.formularioEncuesta.get('edad');
  }
  get Telefono()
  {
    return this.formularioEncuesta.get('telefono');
  }
  get JuegoFavorito()
  {
    return this.formularioEncuesta.get('juegoFavorito') as FormControl;
  }
  get Caracteristicas()
  {
    return this.formularioEncuesta.get('caracteristicas') as FormArray;
  }  
  get Comentario()
  {
    return this.formularioEncuesta.get('comentario') as FormArray;
  }  
  async enviarFormulario() 
  {
    const username = localStorage.getItem('username');
  
    if (!username) {
      console.error('❌ No se encontró username en el local storage.');
      return;
    }
  
    if (this.formularioEncuesta.invalid) {
      this.formularioEncuesta.markAllAsTouched();
      return;
    }
  
    try 
    {
      const usuarioYaCargoEncuesta = await this.encuestaService.verificarEncuestaPorUsuario(username);
  
      if (usuarioYaCargoEncuesta) {
        console.error('⚠️ Ya has enviado una encuesta anteriormente.');
        this.mostrarError = true;
        return;
      }
  
      const datos = {
        nombre: this.formularioEncuesta.value.nombre,
        apellido: this.formularioEncuesta.value.apellido,
        edad: this.formularioEncuesta.value.edad,
        telefono: this.formularioEncuesta.value.telefono,
        juego_favorito: this.formularioEncuesta.value.juegoFavorito,
        caracteristicas: this.formularioEncuesta.value.caracteristicas,
        comentario: this.formularioEncuesta.value.comentario,
        username: username
      };
  
      const respuesta = await this.encuestaService.insertarEncuesta(datos);
      console.log(respuesta);
  
      if (respuesta) 
      {
        this.mostrarFormulario = false;
        this.mensajeGracias = true;
      } 
      else 
      {
        console.error('❌ Hubo un problema al enviar la encuesta.');
      }
  
    } catch (error) {
      console.error('Error al enviar la encuesta:', error instanceof Error ? error.message : error);
    }
  }
  
}  