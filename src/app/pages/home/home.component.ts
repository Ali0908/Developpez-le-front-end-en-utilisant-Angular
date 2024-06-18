import { Component, OnInit, ElementRef } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { SharedService } from 'src/app/core/services/share/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.loadData();
  }
  private loadData(): void {
    this.sharedService.loadData().subscribe(({ countries, medals, olympics, countJOs, countCountries }) => {
      this.countries = countries;
      this.medals = medals;
      this.olympics = olympics;
      this.countJOs = countJOs;
      this.countCountries = countCountries;
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
          const countryId = clickedElement.index;
          this.router.navigate(['/details' ,  countryId]);
      }
      }
    });
  }
  
}

