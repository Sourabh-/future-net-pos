import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'order-stats-details',
  templateUrl: 'orderStats-details.component.html'
})
export class OrderStatsDetailsComponent implements OnInit {

  public parent:any;

  public header = [
  	'#', 
  	'DATE', 
  	'TIME', 
  	'ORDER NO.', 
  	'ITEM NO.', 
  	'DESCRIPTION', 
  	'CTNS ORD', 
  	'UNITS ORD', 
  	'CORG RNG?', 
  	'SLOW', 
  	'VARIETY',
    'PROMO CTN COST',
    'PROMO SAVE $',
    'PROMO SAVE %',
    'CTN COST'
  ];

  public rows:any = [];
  public scrollItems:any = [];
  public isShown:boolean = false;
  public openRow = {};
  public query: string = '';
  public isSearchShow: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oneDriveService: OneDriveService,
    public utilityService: UtilityService
  ) {
    this.parent = navParams.data.order;
  }

  ngOnInit() {
    this.computeTableData();

    this.oneDriveService.resetApp.subscribe(() => {
      this.rows = [];
      this.scrollItems = [];
      this.isShown = false;
      this.openRow = {};
      this.query = '';
      this.isSearchShow = false;
    })
  }

  computeTableData() {
    this.rows = [];
    let _rows = [];
    let count = 0;

    for(let i=0; i<this.parent.items.length; i++) {
      _rows.push([
          { 
            value: ++count, 
            all: this.parent.items[i][4]
          },
          { value: this.parent.createdDate, width: '130px' },
          { value: this.parent.createdTime, width: '90px' },
          { value:  this.parent.orderNo },
          { value: this.parent.items[i][4] },
          { value: this.parent.items[i][5] },
          { value: this.parent.items[i][30] },
          { value: this.parent.items[i][29] },
          { value: this.parent.items[i][42], class: (this.parent.items[i][42] == 'Y' ? 'text-green' : 'text-red') + ' text-bold' },
          { value: this.parent.items[i][37].trim(), class: (this.parent.items[i][37].trim() == 'Y' ? 'text-green' : 'text-red') + ' text-bold' },
          { value: this.parent.items[i][38].trim(), class: (this.parent.items[i][38].trim() == 'Y' ? 'text-green' : 'text-red') + ' text-bold' },
          { value: Number(this.parent.items[i][32] || '0').toFixed(2) },
          { value: Number(this.parent.items[i][33] || '0').toFixed(2) },
          { value: this.parent.items[i][34] ? Number(this.parent.items[i][34]).toFixed(2) : '0' },
          { value: this.parent.items[i][31] ? Number(this.parent.items[i][31]).toFixed(2) : '0' }
        ]);
    }

    this.rows = _rows;
    for(let i=0; i < 20; i++) { if(this.rows[i]) this.scrollItems.push(this.rows[i])}
    this.utilityService.hideLoader();
  }

  addMore(infiniteScroll) {
    setTimeout(() => {
      let count = this.scrollItems.length;
      if(this.rows.length > this.scrollItems.length) {
        let len = (this.scrollItems.length + 20) > this.rows.length ? this.rows.length : (this.scrollItems.length + 20);
        for(let i=0; i<len; i++) {
          this.scrollItems.push(this.rows[i]);
        }
      }
      infiniteScroll.complete();
    }, 50);
  }

  goBack() {
    this.navCtrl.pop({ 'animate': false });
  }
}
