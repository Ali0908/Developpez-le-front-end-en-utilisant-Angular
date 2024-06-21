import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private olympicService: OlympicService) {}
  isLoading = false;

  ngOnInit(): void {
    this.olympicService.loadInitialData()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoading = true;
        },
        error: (error) => {
          // Handle error scenario
          console.error('Error loading initial data:', error);
          window.alert('Error loading initial data')
        },
      });
  }
}
