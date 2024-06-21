import { Component, ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/core/services/share/shared.service';
import { Olympic } from 'src/app/core/models/Olympic';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnChanges {
  public chart!: Chart<"pie", any, string>;
  public entries:number = 0;
  public totalMedalsPerCountry:number = 0;
  public totalAthletesPerCountry:number = 0;
  public countryName:string = '';
  private countries: string[] = [];
  private countryId:number = 0;
  public countrySelected: string = '';
  public olympics: Olympic[] = [];
  public years: number[] = [];
  public medalsPerCountry: number[] = [];
  public matchCountries: Olympic = {id: 0, country: '', participations: []};



  constructor(
    private sharedSrv:SharedService,
    private elementRef:ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  ngOnChanges(): void {
    if(this.countryId){
      this.fetchCountryIdFromUrl();
      this.loadData();
    };
  }

  ngOnInit(): void {
    this.fetchCountryIdFromUrl();
    this.loadData();
  }

  /**
 * Handles routing based on the validity of the selected country.
 *
 * This method checks if the selected country exists in the list of countries. If the country exists,
 * it allows further processing. If the country does not exist, it redirects to a 404 page.
 *
 * @param countries An array of country names.
 * 
 * @return void
 */
  private handleRouting(countries: string[]): void {
    if(countries?.length > 0){
      const countryFound = countries.some(country => country === this.countrySelected);
      if (countryFound) {
        return; // Redirect to details page
      }
      this.router.navigate(['/**']);
    }
  }
  
/**
 * Loads and processes data related to the Olympics for the selected country.
 * 
 * This method fetches data using the shared service, processes it to extract the necessary details, 
 * and updates the component's state with the relevant information. It also handles routing based on 
 * the validity of the selected country.
 *
 * @return void
 */
  private loadData(): void {
    this.sharedSrv.loadData().subscribe(({ countries, olympics, years }) => {
      this.countries = countries;
      this.olympics = olympics;
      this.countrySelected = this.countries[this.countryId];
      this.years = years;
      this.handleRouting(this.countries);
      this.matchCountries = this.olympics.find(olympic => olympic.country === this.countrySelected)!;
      // Condition to avoid undefined error (matchCountries.participations)
      if(this.matchCountries){
        this.entries = this.matchCountries.participations.length;
        this.getAthletesPerCountry();
        this.getMedalsPerCountry();
        this.createLineChart();
      }
      });
  }

  private getMedalsPerCountry(): number[] {
    this.medalsPerCountry = this.matchCountries.participations.map((participation: { medalsCount: number; }) => participation.medalsCount);
    this.totalMedalsPerCountry = this.medalsPerCountry.reduce((acc, medals) => acc + medals, 0);
    this.medalsPerCountry.unshift(0);
    return this.medalsPerCountry;
  }

  private getAthletesPerCountry(): number {
    return this.totalAthletesPerCountry = this.matchCountries.participations.reduce((acc, participation: { athleteCount: number; }) => acc + participation.athleteCount, 0);
    
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
        labels: this.years,
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
      const config:any = {
        type: 'line',
        data: data,
      };
      this.chart = new Chart(htmlRef, config);
    }
  }
