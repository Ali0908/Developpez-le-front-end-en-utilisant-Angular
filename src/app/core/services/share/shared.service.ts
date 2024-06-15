import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from '../olympic.service';
import { Olympic } from '../../models/Olympic';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private olympicService: OlympicService) { }

  public loadData(): Observable<{ countries: string[], medals: number[], olympics: Olympic[],
    countJOs: number, countCountries: number, years: number[] }> {
    return this.olympicService.getOlympics().pipe(
      tap((olympics) => {
        console.log('Fetched Olympics:', olympics);
      }),
      map((olympics) => {
        const countries = olympics.map(olympic => olympic.country);
        const medals = olympics.map(olympic =>
          olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
        );
        const countJOs = olympics.reduce((acc, olympic) => acc + olympic.participations.length, 0);
        const countCountries = olympics.length;
        let years = olympics.map(olympic => olympic.participations.map(participation => participation.year)).flat();
        years = Array.from(new Set(years));
        years.unshift(0);
        return { countries, medals, olympics, countJOs, countCountries, years };
      })
    );
  }
}
