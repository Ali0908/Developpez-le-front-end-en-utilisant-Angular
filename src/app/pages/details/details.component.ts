import { Component, ElementRef, OnInit } from '@angular/core';
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
export class DetailsComponent implements OnInit {
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

  ngOnInit(): void {
    this.fetchCountryIdFromUrl();
    this.loadData();
  }

  private loadData(): void {
    this.sharedSrv.loadData().subscribe(({ countries, olympics, years }) => {
      this.countries = countries;
      this.olympics = olympics;
      this.countrySelected = this.countries[this.countryId];
      this.years = years;
      this.matchCountries = this.olympics.find(olympic => olympic.country === this.countrySelected)!;
      this.entries = this.matchCountries.participations.length;
      this.getAthletesPerCountry();
      this.getMedalsPerCountry();
      this.createLineChart();
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
  
  fetchCountryIdFromUrl(): void {
    this.activatedRoute.params.subscribe(params => {
      this.countryId = params['id']; // Extract the ID from the URL parameters
    });
  }
  goBack(): void {
    this.router.navigate(['']);
  }
  createLineChart(): void {
      let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);
      
      Chart.register(Colors);
      // Si besoin de faire un multi-axis : https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
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
