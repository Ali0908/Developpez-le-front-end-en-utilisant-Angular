import { Component, ElementRef, OnInit } from '@angular/core';
import { ShareService } from 'src/app/core/services/share/share.service';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public olympics: any;
  public chart:any;
  public entries:number = 0;
  public totalMedals:number = 0;
  public totalAthletes:number = 0;
  public countryName:string = '';

  private countryId:number = 1;

  constructor(
    private shareSrv:ShareService,
    private elementRef:ElementRef,
    private olympicService:OlympicService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.olympics = this.shareSrv.olympics;
    this.fetchCountryIdFromUrl();
    this.createChart2();
  }

  createChart2(){
    let countryDetails = [];
    let years = [];
    let medalsCounter = 0;
    let athletesCounter = 0;
    let values = [];

    countryDetails = this.shareSrv.extractValues(this.olympics, 'country', this.countryId)[0];
    
    if(countryDetails.participations){
      for(let p of countryDetails.participations){
        if(p.year)
          years.push(p.year);
        if(p.medalsCount)
          medalsCounter = medalsCounter + p.medalsCount;
        if(p.athleteCount)
          athletesCounter = athletesCounter + p.athleteCount

        if(p.medalsCount)
          values.push(p.medalsCount);
        else
          values.push(0);
      }
    }

    // Make the graph start at 0 not another number
    values.unshift(0);
    years.unshift(0);

    this.countryName = countryDetails.country;
    this.entries = countryDetails.participations.length;
    this.totalMedals = medalsCounter;
    this.totalAthletes = athletesCounter;

    let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);
    
    Chart.register(Colors);

    // Si besoin de faire un multi-axis : https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
    const data = {
      labels: years,
      datasets: [
        {
          label: 'Médailles obtenues',
          data: values,
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
  
  fetchCountryIdFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.countryId = params['id']; // Extract the ID from the URL parameters
    });
  }
  goBack(){
    this.router.navigate(['']);
  }

}
