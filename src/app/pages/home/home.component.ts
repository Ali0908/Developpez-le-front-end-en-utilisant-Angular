import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import { ShareService } from 'src/app/core/services/share/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics: any;
  public chart:any;
  private olymCountries = [];

  constructor(
    private olympicService: OlympicService,
    private elementRef:ElementRef,
    private shareSrv:ShareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe({
      next: (response) => {
        this.olympics = response;
      this.shareSrv.olympics = response;
     this.createChart();
     this.createChart();
      }
    });
  }

  createChart(){
    let olymParticipations = [];    
    let olymMedals = [];

    this.olymCountries = this.shareSrv.extractValues(this.olympics, 'country');    
    olymParticipations = this.shareSrv.extractValues(this.olympics, 'participations');    
    olymMedals = this.shareSrv.extractValues(this.olympics, 'medals');   
    
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);
    
    Chart.register(Colors);

    this.chart = new Chart(htmlRef, {
      type: 'pie',
      data: {
        labels: this.olymCountries, 
	       datasets: [
          {
            label: "Medals",
            data: olymMedals,
            //backgroundColor: '#b42226'
          },
          
        ]
      },
      options: {
        aspectRatio:2.5,
        onClick : (e) => {
          this.router.navigate(['details']);
        }
      }
    });
  }

  

  
}
