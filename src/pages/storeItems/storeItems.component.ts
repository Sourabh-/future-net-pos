import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'store-items',
  templateUrl: 'storeItems.component.html'
})
export class StoreItemsComponent {
  
  public header = [
  	'#', 
  	'ITEM NO.', 
  	'DESCRIPTION', 
  	'SELLING PRICE', 
  	'COST PRICE', 
  	'DEPT ID', 
  	'SUBDEPT ID', 
  	'GROUP ID', 
  	'REPLICATE'
  ];

  public options = {
    isEditable: true
  };

  public rows = [
      [ 
        {value: '1', class: ''},
        {value: '000001', class: ''},
        {value: 'WATTLE VALLEY WAFFLES 5PK 1', class: ''},
        {value: '1.68', class: ''},
        {value: '2.76', class: ''},
        {value: '19', class: ''},
        {value: '404', class: ''},
        {value: 'NIL', class: 'text-bold text-red'},
        {value: 'NIL', class: 'text-bold text-red'}
      ],
      [ 
        {value: '1', class: ''},
        {value: '000001', class: ''},
        {value: 'WATTLE VALLEY WAFFLES 5PK 1', class: ''},
        {value: '1.68', class: ''},
        {value: '2.76', class: ''},
        {value: '19', class: ''},
        {value: '404', class: ''},
        {value: 'NIL', class: 'text-bold text-red'},
        {value: 'NIL', class: 'text-bold text-red'}
      ],
      [ 
        {value: '1', class: ''},
        {value: '000001', class: ''},
        {value: 'WATTLE VALLEY WAFFLES 5PK 1', class: ''},
        {value: '1.68', class: ''},
        {value: '2.76', class: ''},
        {value: '19', class: ''},
        {value: '404', class: ''},
        {value: 'NIL', class: 'text-bold text-red'},
        {value: 'NIL', class: 'text-bold text-red'}
      ]
  ];

  constructor(public navCtrl: NavController) {

  }

}
