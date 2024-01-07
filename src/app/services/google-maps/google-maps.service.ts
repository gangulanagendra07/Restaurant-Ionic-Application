import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { environment } from "src/environments/environment";
import { map, switchMap } from "rxjs/operators";
import { async } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GoogleMapsService {
  googleMaps: any;
  public _places = new BehaviorSubject<any[]>([]);
  private _markerChange = new BehaviorSubject<any>({});
  get places() {
    return this._places.asObservable();
  }
  get markerChange() {
    return this._markerChange.asObservable();
  }
  constructor(private http: HttpClient, private zone: NgZone) {}

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if (gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        environment.googleMapsApiKey +
        "&libraries=places";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject("Google Map SDK is not Available");
        }
      };
    });
  }

  getAddress(lat: number, lng: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
        )
        .pipe(
          map((geoData) => {
            if (!geoData || !geoData.results || geoData.results.length === 0)
              throw null;
            return geoData.results[0];
          })
        )
        .subscribe(
          (data) => {
            resolve(data);
          },
          (e) => {
            reject(e);
          }
        );
    });
  }
  async getPlaces(query: any) {
    try {
      if (!this.googleMaps) {
        this.googleMaps = await this.loadGoogleMaps();
      }
      let googleMaps: any = this.googleMaps;
      let service = new googleMaps.places.AutoCompleteService();
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: {
            country: "IN",
          },
        },
        (predictions: any, status: any) => {
          console.log("prediction", predictions);
          let autoCompleteItems = [];
          this.zone.run(() => {
            if (predictions) {
              predictions.forEach(async (prediction: any) => {
                console.log("prediction", prediction);
                let latLng: any = await this.geoCode(
                  prediction.description,
                  googleMaps
                );
                const places = {
                  location_name: prediction.structured_formatting.main_text,
                  address: prediction.description,
                  lat: latLng.lat,
                  lng: latLng.lng,
                };
                autoCompleteItems.push(places);
              });
              // here use rxjs behaviorSubject to pass the data to component
              this._places.next(autoCompleteItems);
            }
          });
        }
      );
    } catch (error) {}
  }
  geoCode(address, googleMaps) {
    let lating: any = { lat: "", lng: "" };
    return new Promise((resolve, reject) => {
      let geoCoder = new googleMaps.GeoCoder();
      geoCoder.geoCode({ address: address }, (results: any, status: any) => {
        lating.lat = results[0].geometry.location.lat();
        lating.lng = results[0].geometry.location.lng();
      });
    });
  }
  changeMarkerPositionInMap(location: any) {
    this._markerChange.next(location);
  }
}
