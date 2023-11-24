import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory:string[] = [];

  constructor() { }

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

  }

}
