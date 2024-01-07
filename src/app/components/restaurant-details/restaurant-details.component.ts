import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss'],
})
export class RestaurantDetailsComponent implements OnInit {

  @Input() data: any;
  @Input() isLoading: boolean;

  constructor() { }

  ngOnInit() {}

  getCuisines(data: any) {
    return data.join(",");
  }

}
