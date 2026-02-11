import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApodService {

  // clave de la api, se obtuvo por medio de correo 
  private api_Key = 'cVph8gPE7WETxZDeMeaVIR9wa9NmSL94gupFghmZ';
  // Direccion URL de la api a consumir
  private base_url = 'https://api.nasa.gov/planetary/apod';

  // constructor para poder inicializar servicios y dependencias
  // private hace que la propiedad http solo sea accesible dentro de la clase
  // http: nombre de la variable para hacer peticiones
  // HttpCliente: sirve para poder hacer solicitudes HTTP(GET, POST, PUT, DELETE)
  constructor(private http: HttpClient) { }

  // la fecha es opcional y se usa el observable para poder guardar los datos que van a llegar pero no se tienen de imnediato
  // Cuando los datos llegan el observador los entrega y ejecuta toda la logica de ObtenerAPOD()
  ObtenerAPOD(fecha?: string): Observable<any>{
    // Se une toda la URL final, con la URL de la api y la api_key
    let url = `${this.base_url}?api_key=${this.api_Key}`;
    // Si encuentra una fecha entra a la condicion si no va directamente al return 
    if (fecha) {
      url += `&date=${fecha}`
    }
    return this.http.get(url)
  }

}
