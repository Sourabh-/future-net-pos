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
  
  public orders:any = [];
  public perPageCount = 20;
  public currentPage = 0;
  public scrollItems:any = [];
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

    this.oneDriveService.reauthsuccess.subscribe(() => {
      this.getFolderContents();
    })

    this.oneDriveService.resetApp.subscribe(() => {
      this.orders = [];
      this.perPageCount = 20;
      this.currentPage = 0;
      this.scrollItems = [];
      this.query = '';
      this.isSearchShow = false;
    })
  }

  getFolderContents() {
    let currComp = this.navCtrl.getActive().name;
    if(currComp == 'OrderStatsComponent') this.utilityService.showLoader();
    this.oneDriveService.getFolders(this.oneDriveService.selectedCityId).subscribe(
      (folders) => {
        if(folders.value) {
          this.oneDriveService.folders[this.oneDriveService.selectedCityId] = folders.value;
          for(let i=0; i < folders.value.length; i++) {
            if(folders.value[i].name.toLowerCase().indexOf("orders") > -1){
              return this.getOrdersContent(folders.value[i], currComp);
            }
          }
          this.hideLoader(currComp);
        } else {
          this.oneDriveService.folders[this.oneDriveService.selectedCityId] = [];
          this.hideLoader(currComp);
        }
      },
      (err) => {
        this.utilityService.showToast(err);
        this.hideLoader(currComp);
      })
  }

  getOrdersContent(orderFileInfo, currComp) {
    this.orders = [];
    this.scrollItems = [];
    let _rows = [];

  	this.oneDriveService.getWorkbook(orderFileInfo.id, 'Orders').subscribe(
        (res) => {
          this.oneDriveService.worksheets[orderFileInfo.id] = res;
          let _formulas = {}, _rows = [];
          for(let i=1; i<res.values.length; i++) {
          	if(res.values[i][0] && res.values[i][0].trim() && res.values[i][0] != 'HEADER') {
          		let _dateArr = res.values[i][1].split(" ")[0].split("/");
              let _timeArr = res.values[i][1].split(" ")[1].split(":");
              let time = this.utilityService.tConvert(_timeArr[0] + ":" + _timeArr[1]);
          		let _date = new Date(_dateArr[2], Number(_dateArr[1])-1, _dateArr[0]);
          		if(!_formulas[res.values[i][2]]){
	          		 _formulas[res.values[i][2]] = {
	          			orderNo: res.values[i][2],
	          			createdDate: _date.getDate() + this.utilityService.getDateSub(Number(_date.getDate())) + " " + this.utilityService.getMonth(_date.getMonth() + 1) + ", " + _date.getFullYear(),
	          			itemQty: 1,
                  items: [res.values[i][4] + ''],
                  all: res.values[i][2] + " " + res.values[i][4],
                  createdTime: time
	          		}
          		} else {
          			_formulas[res.values[i][2]].itemQty += 1;
                _formulas[res.values[i][2]].items.push(res.values[i][4] + '');   		
                _formulas[res.values[i][2]]['all'] += ' ' + res.values[i][4];
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
          this.hideLoader(currComp);
        },
        (err) => {
          this.utilityService.showToast(err);
          this.hideLoader(currComp);
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

  hideLoader(currComp) {
    if(currComp == 'OrderStatsComponent')
      this.utilityService.hideLoader();
  }
}
