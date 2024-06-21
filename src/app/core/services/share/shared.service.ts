import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from '../olympic.service';
import { map } from 'rxjs/operators';
import { FormattedOlympicData } from '../../models/FormattedOlympicData';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private olympicService: OlympicService) { }

/**
 * Loads and processes data related to the Olympics.
 *
 * @return Observable<{FormattedOlympicData}>
 */
  public loadData(): Observable< FormattedOlympicData> {
    return  this.olympicService.getOlympics().pipe(
      map((olympics) => {
        const countries = olympics.map(olympic => olympic.country);
        const medals = olympics.map(olympic =>
          olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
        );
        const countCountries = olympics.length;
        let years =  Array.from (new Set (olympics.flatMap(olympic => olympic.participations).map(participation => participation.year)));
        const countJOs = years.length;
        years.unshift(0);
        return { countries, medals, olympics, countJOs, countCountries, years };
      })
    );
  }
}
