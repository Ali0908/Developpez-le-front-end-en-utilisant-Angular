import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public olympics:any;

  constructor() { }

  /**
   * Extract values faster than a map, map is 19ops/s, a loop...of is around 300ops/s
   */
  extractValues(array:any[], field:string){
    if(array && field){
      if(field == 'medals'){
        let countries = [];
        let tab: any[] = [];
        console.log('Tableau pre-traitement : ', array);
        for(let item of array){
          countries.push(item.country);
          tab.push(item.participations);
        }
        console.log('Tableau post-traitement : ', tab);
        const res:any = this.extractMedalsByCountries(tab, countries);
        console.log('Résultat :', res);
        return res;
      }else{
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
