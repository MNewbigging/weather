import { BehaviorSubject, Observable, filter, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  userLocation = new BehaviorSubject<GeolocationPosition | undefined>(
    undefined
  );
  weatherData = new BehaviorSubject<any>(undefined);
  placeNameData = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {
    // React to new location data
    this.userLocation.pipe(filter(Boolean)).subscribe((position) => {
      this.getPlaceName(position);
      this.getWeatherData(position);
    });

    // Start by getting location data
    this.getLocationData();
  }

  getLocationData() {
    if (!navigator.geolocation) {
      console.error('No location data');
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.userLocation.next(position);
      }
    );
  }

  getWeatherData(position: GeolocationPosition) {
    console.log('Getting weather data for ', position);

    //https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m

    const params = new HttpParams()
      .set('latitude', position.coords.latitude)
      .set('longitude', position.coords.longitude)
      .set('hourly', 'apparent_temperature');

    this.http
      .get('https://api.open-meteo.com/v1/forecast?', { params })
      .subscribe((result) => {
        console.log('weather data', result);
        this.weatherData.next(result);
      });
  }

  getPlaceName(position: GeolocationPosition) {
    //https://geocode.maps.co/reverse?lat={latitude}&lon={longitude}

    const params = new HttpParams()
      .set('lat', position.coords.latitude)
      .set('lon', position.coords.longitude);

    this.http
      .get('https://geocode.maps.co/reverse?', { params })
      .subscribe((result) => {
        console.log('place name', result);
        this.placeNameData.next(result);
      });
  }
}
