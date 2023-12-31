import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Address } from "src/app/models/address.model";
import { ApiService } from "../api/api.service";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addresses() {
    return this._addresses.asObservable();
  }
  get addressChange() {
    return this._addressChange.asObservable();
  }

  constructor(private api: ApiService) {}

  getAddresses() {
    try {
      //user id
      let allAddress: Address[] = this.api.addresses;
      console.log(allAddress);
      this._addresses.next(allAddress);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  addAddress(param) {
    param.id = "address1";
    param.user_id = "user1";
    const currentAddresses = this._addresses.value;
    const data = new Address(
      param.id,
      param.user_id,
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    currentAddresses.push(data);
    this._addresses.next(currentAddresses);
    this._addressChange.next(data);
  }

  updateAddress(id, param) {
    param.id = id;
    let currentAddresses = this._addresses.value;
    const index = currentAddresses.findIndex((x) => x.id == id);
    currentAddresses[index] = new Address(
      id,
      param.user_id,
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    this._addresses.next(currentAddresses);
  }

  deleteAddress(param) {
    let currentAddresses = this._addresses.value;
    currentAddresses = currentAddresses.filter((x) => x.id != param.id);
    this._addresses.next(currentAddresses);
  }
  changeAddress(address: any) {
    this._addressChange.next(address);
  }
}
