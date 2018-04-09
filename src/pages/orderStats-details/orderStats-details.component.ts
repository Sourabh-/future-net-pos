import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'order-stats-details',
  templateUrl: 'orderStats-details.component.html'
})
export class OrderStatsDetailsComponent implements OnInit {

  public parent;
  public items = [
    ['1833166', '14th Jan, 2017 10:54 AM']
  ];

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
  	'VARIETY'
  ];

  public rows = [];
  public scrollItems = [];
  public isShown:boolean = false;
  public openRow = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oneDriveService: OneDriveService,
    public utilityService: UtilityService
  ) {
    this.parent = navParams.data.order;
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
            if(folders.value[i].name.toLowerCase().indexOf("items_live") > -1){
              return this.getItem_liveContent(folders.value[i]);
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

  getItem_liveContent(itemFileInfo) {
    this.oneDriveService.getWorkbook(itemFileInfo.id, 'items_live').subscribe(
        (res) => {
          this.oneDriveService.worksheets[itemFileInfo.id] = res;
          let _formulas = [];
          for(let i=0; i<res.formulas.length; i++) {
            if(typeof res.formulas[i][0] == 'string')
              _formulas.push(res.formulas[i][0].split("^"));
          }

          this.computeTableData(_formulas);
        },
        (err) => {
          this.utilityService.showToast(err);
          this.utilityService.hideLoader();
        }
      )
  }

  computeTableData(sheetDataArr) {
    this.rows = [];
    let _rows = [];
    let count = 0;

    for(let i=0; i<sheetDataArr.length; i++) {
      if(this.parent.items.indexOf(sheetDataArr[i][0].split("=")[1]) > -1) {
        _rows.push([
          { value: ++count },
          { value: '-' },
          { value: '-' },
          { value: sheetDataArr[i][0].split("=")[1] },
          { value: sheetDataArr[i][1].replace(/\"/g, '') },
          { value: '-' },
          { value: '-' },
          { value: '-' },
          { value: '-' },
          { value: '-' },
          { value: '-' }
        ]);
      }
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
}
