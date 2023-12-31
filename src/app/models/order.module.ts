import { Address } from "./address.model";
import { Item } from "./item.model";
import { Restaurant } from "./restaurant.model";

export class Order {
    constructor(
        public id: string,
        public user_id: string,
        public address: Address,
        public restaurant: Restaurant,
        public order: Item[],
        public restaurant_id: string,
        public total: number,
        public grandTotal: number,
        public deliveryCharge: number,
        public status: string,
        public time: Date,
        public paid: string,
        public instruction?: string
        // public totalItem: number,
        // public totalPrice: number,
        
    ){}
}