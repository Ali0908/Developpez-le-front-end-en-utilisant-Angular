import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public olympics:any;

  constructor() { }

  // Méthode à revoir pour mieux la typer
  // 

  /**
   * Extract values faster than a map, map is 19ops/s, a loop...of is around 300ops/s
   */
  extractValues(array:any[], field:string, countryId?:number){

    // Utilise reduce rxjs pour améliorer ce code
    if(array && field){
      if(field == 'medals'){
        let countries = [];
        let tab: any[] = [];
        for(let item of array){
          countries.push(item.country);
          tab.push(item.participations);
        }
        const res:any = this.extractMedalsByCountries(tab, countries);
        return res;
      }
      else if(field == 'countries'){
        let tab:any[] = [];

        for(let item of array){
          tab.push(item.country);
          //tab[item.id] = item.country;
        }
        console.log(tab);
        return tab;
      }
      else if(field == 'country'){
        if(countryId){

        let tab:any[] = [];

        for(let item of array){
          if(item.id == countryId)
            tab.push(item);
        }
        return tab;
        }
      }
      else{
        let tab: any[] = [];
        for(let item of array){
          tab.push(item[field]);
        }
        return tab;
      }
    }else{
      throw 'Array or field is undefined or null';
    }
  }

  private extractMedalsByCountries(tab:any, countries:any){
    let values = [];
    let counter = 0;

    for(let item of tab){
      counter = 0;
      for(let i of item)
        counter = counter + i.medalsCount;
      values.push(counter);
    }

    return values;
  }
}
