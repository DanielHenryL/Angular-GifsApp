import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  //* lista de gifs de la petición
  private gifList:Gif[] = [];

  //* lista de tags de la busqueda
  private _tagsHistory:string[] = [];

  //* Apikey del servicio Giphy
  private apiKey='AgoJNxzVwaOsmGqU7gHpxvf0Xc3nwU6S';

  //* Url base del servico
  private serviceUrl = 'https://api.giphy.com/v1/gifs';

  constructor( private http:HttpClient ) {
    this.loadLocalStorage();
  }

  //* Gifs de la busqueda
  get GifList(){
    return [...this.gifList];
  }

  //*  historial de busqueda para el siderbar
  get TagsHistory(){
    return [...this._tagsHistory];
  }

  //* Pasar a minusculas el tag
  private lowerCaseTag(tag:string){
    tag = tag.toLowerCase();
  }

  //* buscar el tag en el historial y si lo encuntra lo remueve del historial
  private existTagAndRemove(tag:string){
    const existTag = this._tagsHistory.includes(tag);
    if( existTag ){
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag)
    }
  }

  //* Organiza el sidebar en forma de pila ultimo en entra primero en salir
  private organizeHistory( tag: string ){
    this.lowerCaseTag(tag);
    this.existTagAndRemove(tag);
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,20);
    this.saveLocalStorage();
  }

  //* Guardar en localStorage
  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ))
  }

  //* Leer de localStorage y lanzar la primera busqueda
  private loadLocalStorage():void{
    if ( !localStorage.getItem('history')  ) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    this.searchTag(this._tagsHistory[0]);
  }

  //* Hace la peticion a la api Giphy
  private fetchApiGiphy( tag:string ){
    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', 10)
        .set('q', tag)

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`,{ params:params })
      .subscribe( resp => {
        this.gifList = resp.data;
      });
  }

  //* realiza la busqueda
  searchTag( tag:string ):void {
    if( tag.length === 0 ) return;
    this.organizeHistory( tag );

    this.fetchApiGiphy(tag);
  }

}
