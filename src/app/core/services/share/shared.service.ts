import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from '../olympic.service';
import { Olympic } from '../../models/Olympic';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private olympicService: OlympicService) { }

/**
 * Loads and processes data related to the Olympics.
 *
 * @return Observable<{ countries: string[], medals: number[], olympics: Olympic[],
 * countJOs: number, countCountries: number, years: number[] }> - An observable that emits an object containing:
 * - countries: an array of country names
 * - medals: an array of total medal counts for each country
 * - olympics: the original array of Olympic data
 * - countJOs: the total number of participations across all Olympics
 * - countCountries: the total number of countries
 * - years: an array of unique years in which the Olympics took place, with a 0 prepended
 */
  public loadData(): Observable<{ countries: string[], medals: number[], olympics: Olympic[],
    countJOs: number, countCountries: number, years: number[] }> {
    return this.olympicService.getOlympics().pipe(
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
