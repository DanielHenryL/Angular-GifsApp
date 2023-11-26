import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory:string[] = [];
  private apiKey='AgoJNxzVwaOsmGqU7gHpxvf0Xc3nwU6S';
  private serviceUrl = 'https://api.giphy.com/v1/gifs';
  constructor( private http:HttpClient) { }

  get TagsHistory(){
    return [...this._tagsHistory];
  }

  private lowerCaseTag(tag:string){
    tag = tag.toLowerCase();
  }

  private existTagAndRemove(tag:string){
    const existTag = this._tagsHistory.includes(tag);
    if( existTag ){
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag)
    }
  }

  private organizeHistory( tag: string ){
    this.lowerCaseTag(tag);
    this.existTagAndRemove(tag);
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,20);
  }

  searchTag( tag:string ):void {
    if( tag.length === 0 ) return;
    this.organizeHistory( tag );

    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', 10)
        .set('q', tag)

    this.http.get(`${ this.serviceUrl }/search`,{ params:params })
      .subscribe( resp => {
        console.log( resp );
      });
  }

}
