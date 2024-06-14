import { Component, OnInit, ElementRef } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import { Router } from '@angular/router';
import { Observable, from, map, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Typer correctement pas de any
  // Toutes les méthodes commentées
  public olympics: Olympic[] = [];
  public olympics$!: Observable<Olympic[]>;
  private countries: string[] = [];
  private medals: number[] = [];
  public chart!: Chart<"pie", any, string>;
  public countCountries: number = 0;
  public countJOs: number = 0;

  constructor(
    private olympicService: OlympicService,
    private elementRef:ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.loadData();
  }

  private loadData(): void {
    this.olympics$.pipe(
      tap((olympics) => {
        this.olympics = olympics;
        this.countJOs = olympics.reduce((acc, olympic) => acc + olympic.participations.length, 0);
        this.countCountries = olympics.length;
      }),
      map((olympics) => ({
        countries: olympics.map(olympic => olympic.country),
        medals: olympics.map(olympic =>
          olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
        )
      }))
    ).subscribe(({ countries, medals }) => {
      this.countries = countries;
      console.log(this.countries);
      this.medals = medals;
      this.createPieChart();
    });
  }

  private createPieChart(): void {    
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myfirstChart`);
      // Détruire le graphique existant (si présent)
      if (this.chart) {
        this.chart.destroy();
      }
    Chart.register(Colors);

    this.chart = new Chart(htmlRef, {
      type: 'pie',
      data: {
        labels: this.countries, 
	      datasets: [
          {
            label: "Medals",
            data: this.medals,
        },
          
        ]
      },
      options: {
        aspectRatio:2.5,
        onClick: (event, elements) => {
          const clickedElement = elements[0];
          console.log('clickedElement', clickedElement);
          const countryId = clickedElement.index;
          this.router.navigate(['/details' ,  countryId]);
      }
      }
    });
  }
  
}
