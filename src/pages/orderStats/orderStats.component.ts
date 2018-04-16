import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderStatsDetailsComponent } from '../orderStats-details/orderStats-details.component';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'order-stats',
  templateUrl: 'orderStats.component.html'
})
export class OrderStatsComponent implements OnInit {
  
  public orders = [];
  public perPageCount = 20;
  public currentPage = 0;
  public scrollItems = [];
  public query: string = '';
  public isSearchShow: boolean = false;

  constructor(
  	public navCtrl: NavController,
  	private oneDriveService: OneDriveService,
  	public utilityService: UtilityService
  ) {

  }

  navigateToDetails(order) {
  	this.navCtrl.push(OrderStatsDetailsComponent, {
      order
    });
  }

  ngOnInit() {
  	if(this.oneDriveService.selectedCity) {
      this.getFolderContents();
    } 

    this.oneDriveService.selectedCityUpdated.subscribe(() => {
      this.getFolderContents();
    })
  }

  getFolderContents() {
    this.utilityService.showLoader();
    this.oneDriveService.getFolders(this.oneDriveService.selectedCityId).subscribe(
      (folders) => {
        if(folders.value) {
          this.oneDriveService.folders[this.oneDriveService.selectedCityId] = folders.value;
          for(let i=0; i < folders.value.length; i++) {
            if(folders.value[i].name.toLowerCase().indexOf("orders") > -1){
              return this.getOrdersContent(folders.value[i]);
            }
          }
          this.utilityService.hideLoader();
        } else {
          this.oneDriveService.folders[this.oneDriveService.selectedCityId] = [];
          this.utilityService.hideLoader();
        }
      },
      (err) => {
        this.utilityService.showToast(err);
        this.utilityService.hideLoader();
      })
  }

  getOrdersContent(orderFileInfo) {
    this.orders = [];
    this.scrollItems = [];
    let _rows = [];

  	this.oneDriveService.getWorkbook(orderFileInfo.id, 'Orders').subscribe(
        (res) => {
          this.oneDriveService.worksheets[orderFileInfo.id] = res;
          let _formulas = {}, _rows = [];
          for(let i=1; i<res.formulas.length; i++) {
          	if(res.formulas[i][0] && res.formulas[i][0].trim() && res.formulas[i][0] != 'HEADER') {
          		let _dateArr = res.formulas[i][1].split(" ")[0].split("/");
              let _timeArr = res.formulas[i][1].split(" ")[1].split(":");
              let time = this.utilityService.tConvert(_timeArr[0] + ":" + _timeArr[1]);
          		let _date = new Date(_dateArr[2], Number(_dateArr[1])-1, _dateArr[0]);
          		if(!_formulas[res.formulas[i][2]]){
	          		 _formulas[res.formulas[i][2]] = {
	          			orderNo: res.formulas[i][2],
	          			createdDate: _date.getDate() + this.utilityService.getDateSub(Number(_date.getDate())) + " " + this.utilityService.getMonth(_date.getMonth() + 1) + ", " + _date.getFullYear(),
	          			itemQty: 1,
                  items: [res.formulas[i][4] + ''],
                  all: res.formulas[i][2] + " " + res.formulas[i][4],
                  createdTime: time
	          		}
          		} else {
          			_formulas[res.formulas[i][2]].itemQty += 1;
                _formulas[res.formulas[i][2]].items.push(res.formulas[i][4] + '');   		
                _formulas[res.formulas[i][2]]['all'] += ' ' + res.formulas[i][4];
              }
          	}
          }
          
          if(Object.keys(_formulas).length) {
          	for(let key in _formulas) {
          		_rows.push(_formulas[key]);
          	}
          }

          this.orders = _rows;
          for(let i=0; i < 20; i++) { if(this.orders[i]) this.scrollItems.push(this.orders[i])}
          this.utilityService.hideLoader();
        },
        (err) => {
          this.utilityService.showToast(err);
          this.utilityService.hideLoader();
        }
      )
  }

  addMore(infiniteScroll) {
    setTimeout(() => {
      let count = this.scrollItems.length;
      if(this.orders.length > this.scrollItems.length) {
        let len = (this.scrollItems.length + 20) > this.orders.length ? this.orders.length : (this.scrollItems.length + 20);
        for(let i=0; i<len; i++) {
          this.scrollItems.push(this.orders[i]);
        }
      }
      infiniteScroll.complete();
    }, 50);
  }
}
