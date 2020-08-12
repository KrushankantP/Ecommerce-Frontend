import {ProductModelServer} from "./IProduct";


//this modal is for server that is my angular app.
//this information never leave the server.
export interface cartModelServer{
total: number;
data: [{
  product : ProductModelServer,
  numInCart: number
}];
}


// this modal is for the public local storage server.(Browser Local storage)
export interface cartModelPublic {
  total: number;
  prodData:[{
     id: number,
     inCart: number
  }];
}
