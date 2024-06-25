import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from 'src/app/core/services/share/shared.service';
import {Olympic} from 'src/app/core/models/Olympic';
import Chart from 'chart.js/auto';
import {Colors} from 'chart.js';
import {ActivatedRoute, Router} from "@angular/router";
import {FormattedOlympicData} from 'src/app/core/models/FormattedOlympicData';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  public chart!: Chart<"pie", any, string>;
  public entries: number = 0;
  public totalMedalsPerCountry: number = 0;
  public totalAthletesPerCountry: number = 0;
  private countryId: number = 0;
  public countrySelected: string = '';
  public medalsPerCountry: number[] = [];
  public matchCountries: Olympic = {id: 0, country: '', participations: []};
  public formattedOlympicData!: FormattedOlympicData;
  private dataSubscription!: Subscription;


  constructor(
    private sharedSrv: SharedService,
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchCountryIdFromUrl();
    this.loadFormattedOlympicData();
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  private loadFormattedOlympicData(): void {
    this.dataSubscription = this.sharedSrv.loadAndProcessOlympicData().subscribe({
        next: (formattedOlympicData: FormattedOlympicData) => {
          this.formattedOlympicData = formattedOlympicData;
          this.matchCountries = this.formattedOlympicData.olympics.find((olympic) => olympic.id === this.countryId)!;
          if (this.matchCountries) {
            this.entries = this.matchCountries.participations.length;
            this.countrySelected = this.matchCountries.country;
            this.getMedalsPerCountry();
            this.getAthletesPerCountry();
            this.createLineChart();
          } else {
            this.router.navigate(['**']);
          }
        },
        error: (error) => {
          console.error('Error loading initial data:', error);
          window.alert('Error loading initial data');
        }
      }
    );
  }

  private getMedalsPerCountry(): void {
    this.medalsPerCountry = this.matchCountries.participations.map((participation: {
      medalsCount: number;
    }) => participation.medalsCount);
    this.totalMedalsPerCountry = this.medalsPerCountry.reduce((acc, medals) => acc + medals, 0);
    this.medalsPerCountry.unshift(0);
  }

  private getAthletesPerCountry(): void {
    this.totalAthletesPerCountry = this.matchCountries.participations.reduce((acc, participation: {
      athleteCount: number;
    }) => acc + participation.athleteCount, 0);

  }

  private fetchCountryIdFromUrl(): void {
    let countryInString = '';
    this.activatedRoute.params.subscribe(params => {
      countryInString = params['id']; // Extract the ID from the URL parameters
      this.countryId = parseInt(countryInString);
    });
  }

  goBack(): void {
    this.router.navigate(['']);
  }

  private createLineChart(): void {
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);

    Chart.register(Colors);
    const data = {
      labels: this.formattedOlympicData.years,
      datasets: [
        {
          label: 'Médailles obtenues',
          data: this.medalsPerCountry,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
    const config: any = {
      type: 'line',
      data: data,
    };
    this.chart = new Chart(htmlRef, config);
  }
}
