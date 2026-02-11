import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Neo } from '../interfaces/nasa.interfaces';
import { Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NasaService {

  private _dates: any[] = [];
  private _apodObj: any

  private readonly BASE_URL = 'https://api.nasa.gov/planetary/apod'
  private readonly API_KEY = 'cVph8gPE7WETxZDeMeaVIR9wa9NmSL94gupFghmZ'

  constructor(private http: HttpClient) { }

  get dates() {
    return [...this._dates];
  }

  get apod() {
    return this._apodObj;
  }

  getApod() {
    /**
     * Paso 1
     * Almacene en una variable un número aleatorio entre 1 y 7
     */

    // Floor para redondear al entero mas cercano
    let numberRamdom: number = Math.floor(Math.random()*7)+1; 

    /**
     * Paso 2
     * Fecha aleatoria entre últimos 7 días
     * Obtenga y almacene en una variable la fecha actual
     * A los días de la fecha actual le debe restar el número obtenido en el Paso 1 para obtener una fecha aleatoria de los últimos 7 días
     */

      // Fecha actual
      let currentDate: Date = new Date();
      // Clonacion fecha actual para no modificarla directamente
      let clonDate: Date = new Date(currentDate);
      // Se restan dias con el numero random
      clonDate.setDate(clonDate.getDate()- numberRamdom);
      
    /**
     * Paso 3
     * petición APOD endpoint
     * consulte el endpoint https://api.nasa.gov/planetary/apod enviando los parámetros:
     * date = fecha obtenida en el Paso 2 en formato YYYY-MM-DD
     * api_key = su API KEY generado en el sitio web https://api.nasa.gov/
     * Debe asignar el valor de la respuesta del endpoint a la variable global _apod que ya se encuentra declarada, ejemplo: this._apodObj = respuesta;
     */

      // Cambio de formato a YYYY-MM-DD
      const year = clonDate.getFullYear();
      // Se deja +1 para que incremente de mes
      // Se usa padStart para poder usar dos digitos en la fecha y el 0 lo antepone, seria 01,02,03
      const month = (clonDate.getMonth()+1).toString().padStart(2, "0")
      const day = clonDate.getDate().toString().padStart(2, "0")
      const formattedDate = `${year}-${month}-${day}`;
      // Se realiza la peticion real usando HttpClient uniendo todo lo anterior
      // Devuelve un observable que guarda los datos cuando lleguen
      this.http.get(`${this.BASE_URL}?api_key=${this.API_KEY}&date=${formattedDate}`)
      // Lo que hace es suscribirse al observable cuando a este le llegen los datos, y luego de eso pasa cumplir con la logica del mismo
      .subscribe({
        // Lo que se ejecuta cuando llegan datos al observable
        next: (respuesta: any) =>{
            this._apodObj = respuesta // asignacion real
            console.log("APOD Consumido", this._apodObj)
        },
        error: (err )=>{
          console.error("Error al consumir APOD", err);
        }
      })
  }

  /**
   * 
   * @param date Fecha seleccionada en el input date
   */
  buscarNeo(date: string) {
    /**
     * Paso 1
     * petición NEOWS endpoint
     * consulte el endpoint https://api.nasa.gov/neo/rest/v1/feed enviando los parámetros:
     * api_key = su API KEY generado en el sitio web https://api.nasa.gov/
     * start_date = parámetro date recibido en la función en formato YYYY-MM-DD.
     * end_date = parámetro date recibido en la función en formato YYYY-MM-DD.
     * Nota: para start_date y end_date se utiliza el mismo valor el cual llega como parámetro de la función.
     * Debe asignar el valor de la respuesta del endpoint a la variable global _dates, 
      ejemplo: this._dates = respuesta.near_earth_objects[date], siendo [date] el parámetro que recibe la función;
     */

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${this.API_KEY}` 
    // Recibe los datos que se esperan de url sin importar que tipo de datos sean 
    this.http.get<any>(url)
    .subscribe({
      next: (respuesta) =>{
        this._dates = respuesta.near_earth_objects[date]
        console.log("NEO consumida", this._dates)
      },
      error: (err) => console.error("Error al consumir NEO:", err)
    })
  }
}
