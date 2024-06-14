import { Component, OnInit, ElementRef } from '@angular/core';
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
  // Typer correctement pas de any
  // Toutes les méthodes commentées
  public olympics: Olympic[] = [];
  public chart!: Chart<"pie", any, never>;
  private olymCountries = [];
  public countCountries: number = 0;
  public countJOs: number = 0;

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
        this.countJOs = this.olympics.reduce((acc, olympic) => acc + olympic.participations.length, 0);
        this.shareSrv.olympics = response;
        this.createChart();
        // this.countNbJOs();
      }
    });
  }

  createChart(): void {
    let olymParticipations = [];    
    let olymMedals = [];
    this.olymCountries = this.shareSrv.extractValues(this.olympics, 'countries');    
    this.countCountries = this.olymCountries.length;
    olymParticipations = this.shareSrv.extractValues(this.olympics, 'participations');    
    olymMedals = this.shareSrv.extractValues(this.olympics, 'medals');   
    
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myfirstChart`);
      // Détruire le graphique existant (si présent)
  if (this.chart) {
    this.chart.destroy();
  }
    Chart.register(Colors);

    this.chart = new Chart(htmlRef, {
      type: 'pie',
      data: {
        labels: this.olymCountries, 
	      datasets: [
          {
            label: "Medals",
            data: olymMedals,
        },
          
        ]
      },
      options: {
        aspectRatio:2.5,
        onClick: (event, elements) => {
          const clickedElement = elements[0];
          const countryId = clickedElement.index + 1;
          this.router.navigate(['/details' ,  countryId]);
      }
      }
    });
  }

  // countNbJOs(){
  // for (let item of this.olympics){
  //   this.countJOs += item.participations.length;
  //   console.log('participations:', this.countJOs);
  // }
  // }
}
