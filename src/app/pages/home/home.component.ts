import {Component, OnInit, ElementRef, OnDestroy} from '@angular/core';
import Chart from 'chart.js/auto';
import {ActiveElement, ChartEvent, Colors} from 'chart.js';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SharedService} from 'src/app/core/services/share/shared.service';
import {FormattedOlympicData} from '../../core/models/FormattedOlympicData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public chart!: Chart<"pie", any, string>;
  public formattedOlympicData!: FormattedOlympicData;
  private dataSubscription!: Subscription;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }


  private loadData(): void {
    this.dataSubscription = this.sharedService.loadData().subscribe(
      {
        next: (formattedOlympicData: FormattedOlympicData) => {
          this.formattedOlympicData = formattedOlympicData;
          this.createPieChart();
        },
        error: (error) => {
          console.error('Error loading initial data:', error);
          window.alert('Error loading initial data');
        }
      }
    );
  }

  private createPieChart(): void {
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myfirstChart`);
    // Destroy the graphic if it already exists
    if (this.chart) {
      this.chart.destroy();
    }
    Chart.register(Colors);

    this.chart = new Chart(htmlRef, {
      type: 'pie',
      data: {
        labels: this.formattedOlympicData.countries,
        datasets: [
          {
            label: "Medals",
            data: this.formattedOlympicData.medals,
          },

        ]
      },
      options: {
        aspectRatio: 2.5,
        onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
          const clickedElement = elements[0];
          const countryId = clickedElement.index + 1;
          this.router.navigate(['/details', countryId]);
        }
      }
    });
  }

}

