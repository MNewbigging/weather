import { Component, OnDestroy } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';

import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  placeNameString = '';

  private unsubscribe = new Subject<boolean>();

  constructor(public weatherService: WeatherService) {
    // Format place name
    weatherService.placeNameData
      .pipe(takeUntil(this.unsubscribe), filter(Boolean))
      .subscribe((placeNameData) => {
        this.placeNameString =
          placeNameData.address.town +
          ', ' +
          placeNameData.address.county +
          ', ' +
          placeNameData.address.state;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
  }
}
