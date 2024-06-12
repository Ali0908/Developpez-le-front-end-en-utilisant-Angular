import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics: any;
  public chart:any;
  private olymCountries = [];

  constructor(private olympicService: OlympicService, private elementRef:ElementRef) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe({
      next: (response) => {
        this.olympics = response;
     console.log(this.olympics);
     this.createChart();
      }
    });
  }

  createChart(){
    let olymParticipations = [];    
    let olymMedals = [];

    this.olymCountries = this.extractValues(this.olympics, 'country');    
    olymParticipations = this.extractValues(this.olympics, 'participations');    
    olymMedals = this.extractValues(this.olympics, 'medals');   
    
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);
    
    Chart.register(Colors);

    this.chart = new Chart(htmlRef, {
      type: 'pie',
      data: {
        labels: this.olymCountries, 
	       datasets: [
          {
            label: "Participations par pays",
            data: olymMedals,
            //backgroundColor: '#b42226'
          },
          
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }

  /**
   * Extract values faster than a map, map is 19ops/s, a loop...of is around 300ops/s
   */
  private extractValues(array:any[], field:string){
    if(array && field){
      if(field == 'medals'){
        let countries = [];
        let tab: any[] = [];
        console.log('Tableau pre-traitement : ', array);
        for(let item of array){
          countries.push(item.country);
          tab.push(item.participations);
        }
        console.log('Tableau post-traitement : ', tab);
        const res:any = this.extractMedalsByCountries(tab, countries);
        console.log('Résultat :', res);
        return res;
      }else{
        let tab: any[] = [];
        for(let item of array){
          tab.push(item[field]);
        }
        return tab;
      }
    }else{
      throw 'Array or field is undefined or null';
    }
  }

  private extractMedalsByCountries(tab:any, countries:any){
    let values = [];
    let counter = 0;

    for(let item of tab){
      counter = 0;
      for(let i of item)
        counter = counter + i.medalsCount;
      values.push(counter);
    }

    return values;
  }
}
