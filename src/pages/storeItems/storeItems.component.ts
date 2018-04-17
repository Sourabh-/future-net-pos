import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'store-items',
  templateUrl: 'storeItems.component.html'
})
export class StoreItemsComponent implements OnInit {
  
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

  public rows = [];
  public scrollItems = [];
  public openRow = {};
  public query:string = '';
  public isSearchShow: boolean = false;

  constructor(
    public navCtrl: NavController,
    private oneDriveService: OneDriveService,
    public utilityService: UtilityService
  ) {

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
    this.scrollItems = [];
    let _rows = [];
    for(let i=0; i<sheetDataArr.length; i++) {
      _rows.push([
        { value: i+1, all: sheetDataArr[i].join(",")},
        { value: sheetDataArr[i][0].split("=")[1] },
        { value: sheetDataArr[i][1].replace(/\"/g, '') },
        { value: sheetDataArr[i][3].replace(/^0+/, '') },
        { value: sheetDataArr[i][13].replace(/^0+/, '') },
        { value: sheetDataArr[i][14].replace(/^0+/, '') },
        { value: sheetDataArr[i][19] },
        { value: (sheetDataArr[i][80] || "NIL"), class: (sheetDataArr[i][80] ? 'text-green' : 'text-red') + ' text-bold' },
        { value: (sheetDataArr[i][46] && sheetDataArr[i][46].replace(/\"/g, '') ? sheetDataArr[i][46].replace(/\"/g, '') : "NIL"), class: (sheetDataArr[i][46] && sheetDataArr[i][46].replace(/\"/g, '') ? 'text-green': 'text-red') + ' text-bold' }
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
}
