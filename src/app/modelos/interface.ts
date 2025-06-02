export interface Carta
{
  code:string;
  image:string;
  suit:string;
  value:string
}
export interface Pais
{
  name:string,
  flag:string
}
export interface EstadisticaJuego 
{
  nombreUsuario: string;
  fecha: Date;
  puntuacion: number;
  juego: string;
}