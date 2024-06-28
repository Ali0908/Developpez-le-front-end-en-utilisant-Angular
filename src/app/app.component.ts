import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, take} from 'rxjs';
import {OlympicService} from './core/services/olympic.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private olympicService: OlympicService) {
  }
  public isLoading = false;
  private dataSubscription!: Subscription;

  ngOnInit(): void {
  this.dataSubscription =  this.olympicService.loadInitialData()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoading = true;
        },
        error: (error) => {
          console.error('Error loading initial data:', error);
          window.alert('Error loading initial data');
        },
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
