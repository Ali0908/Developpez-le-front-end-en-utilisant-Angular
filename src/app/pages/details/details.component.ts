import { Component, ElementRef, OnInit } from '@angular/core';
import { ShareService } from 'src/app/core/services/share/share.service';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public olympics: any;
  public chart:any;

  constructor(
    private shareSrv:ShareService,
    private elementRef:ElementRef,
    private olympicService:OlympicService
  ) { }

  ngOnInit(): void {
    this.olympics = this.shareSrv.olympics;
  }

  createChart2(){
    let olymParticipations = [];    
    let olymMedals = [];
    
    olymMedals = this.shareSrv.extractValues(this.olympics, 'medals');
    
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);
    
    Chart.register(Colors);

    const labels = ['titi', 'toto', 'tata', 'tritri', 'trotro', 'tratra', 'travtrav'];
    const data = {
      labels: labels,
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    const config:any = {
      type: 'line',
      data: data,
    };

    this.chart = new Chart(htmlRef, config);

  }
}
