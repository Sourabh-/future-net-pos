import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { EditItemsModalComponent } from '../../shared/components/editItemsModal/editItemsModal.component';
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
  	'LONG DESC', 
  	'SHORT DESC', 
  	'PRICE 1', 
  	'PRICE 2', 
  	'PRICE 3', 
  	'PRICE 4', 
  	'PRICE 5',
    'PRICE 6',
    'PRICE 7',
    'PRICE 8',
    'PRICE 9',
    'PRICE 10',
    'COST PRICE',
    'DEPT NO',
    'GST YN',
    'SCALEYN',
    'SUB DEPT NO',
    'NON DISK YN',
    'TARE',
    'PROMO PRICE',
    'PROMO ID',
    'PROMO DESC',
    'PROMO START DATE',
    'PROMO END DATE',
    'PROMO DAY MASK',
    'PROMO START TIME',
    'PROMO END TIME',
    'PROMO UNIT COST',
    'GROUP NO',
    'SUPPLIER ID',
    'INST YN',
    'ZERO PRICE YN'
  ];

  public options = {
    isEditable: true
  };

  public rows:any = [];
  public scrollItems:any = [];
  public openRow:any = {};
  public query:string = '';
  public isSearchShow: boolean = false;

  constructor(
    public navCtrl: NavController,
    private oneDriveService: OneDriveService,
    public utilityService: UtilityService,
    public modalCtrl: ModalController
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

    this.oneDriveService.resetApp.subscribe(() => {
      this.rows = [];
      this.scrollItems = [];
      this.openRow = {};
      this.query = '';
      this.isSearchShow = false;
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
        { value: i+1, all: sheetDataArr[i].join(","), name: '#', isShow: false, isDisabled: true, input: i+1 },
        { value: sheetDataArr[i][0].split("=")[1], name: 'Item No.', isShow: true, isDisabled: false, input: sheetDataArr[i][0] },
        { value: sheetDataArr[i][1].replace(/\"/g, ''), name: 'Long Desc', isShow: true, isDisabled: false, input: sheetDataArr[i][1] },
        { value: sheetDataArr[i][2].replace(/\"/g, ''), name: 'Short Desc', isShow: true, isDisabled: false, input: sheetDataArr[i][2] },
        { value: sheetDataArr[i][3].replace(/^0+/, ''), name: 'Price 1', isShow: true, isDisabled: false, input: sheetDataArr[i][3] },
        { value: sheetDataArr[i][4].replace(/^0+/, ''), name: 'Price 2', isShow: true, isDisabled: false, input: sheetDataArr[i][4] },
        { value: sheetDataArr[i][5].replace(/^0+/, ''), name: 'Price 3', isShow: true, isDisabled: false, input: sheetDataArr[i][5] },
        { value: sheetDataArr[i][6].replace(/^0+/, ''), name: 'Price 4', isShow: true, isDisabled: false, input: sheetDataArr[i][6] },
        { value: sheetDataArr[i][7].replace(/^0+/, ''), name: 'Price 5', isShow: true, isDisabled: false, input: sheetDataArr[i][7] },
        { value: sheetDataArr[i][8].replace(/^0+/, ''), name: 'Price 6', isShow: true, isDisabled: false, input: sheetDataArr[i][8] },
        { value: sheetDataArr[i][9].replace(/^0+/, ''), name: 'Price 7', isShow: true, isDisabled: false, input: sheetDataArr[i][9] },
        { value: sheetDataArr[i][10].replace(/^0+/, ''), name: 'Price 8', isShow: true, isDisabled: false, input: sheetDataArr[i][10] },
        { value: sheetDataArr[i][11].replace(/^0+/, ''), name: 'Price 9', isShow: true, isDisabled: false, input: sheetDataArr[i][11] },
        { value: sheetDataArr[i][12].replace(/^0+/, ''), name: 'Price 10', isShow: true, isDisabled: false, input: sheetDataArr[i][12] },
        { value: sheetDataArr[i][13].replace(/^0+/, ''), name: 'Cost Price', isShow: true, isDisabled: true, input: sheetDataArr[i][13] },
        { value: sheetDataArr[i][14], name: 'Dept No.', isShow: true, isDisabled: true, input: sheetDataArr[i][14] },
        { value: sheetDataArr[i][15], class: (sheetDataArr[i][15] == 'GST' ? "text-green" : "text-red") +  " text-bold", name: 'Gst YN', isShow: true, isDisabled: true, input: sheetDataArr[i][15] },
        { value: sheetDataArr[i][16], class: (sheetDataArr[i][16] !== 'N' ? "text-green" : "text-red") +  " text-bold", name: 'Scale YN', isShow: true, isDisabled: true, input: sheetDataArr[i][16] },
        { value: sheetDataArr[i][19], name: 'Sub Dept No.', isShow: true, isDisabled: false, input: sheetDataArr[i][19] },
        { value: sheetDataArr[i][23], class: (sheetDataArr[i][19] !== 'N' ? "text-green" : "text-red") +  " text-bold", name: 'Non Disc YN', isShow: true, isDisabled: true, input: sheetDataArr[i][23] },
        { value: sheetDataArr[i][25], name: 'Tare', isShow: true, isDisabled: false, input: sheetDataArr[i][25] },
        { value: sheetDataArr[i][47].replace(/^0+/, ''), name: 'Promo Price', isShow: true, isDisabled: true, input: sheetDataArr[i][47] },
        { value: sheetDataArr[i][48].replace(/^ /, '') || 'NIL', class: (!sheetDataArr[i][48].replace(/^ /, '') ? "text-red text-bold" : ""), name: 'Promo ID', isShow: true, isDisabled: true, input: sheetDataArr[i][48] },
        { value: sheetDataArr[i][49].replace(/\"/g, '').replace(/^ /g, '') || "NIL", class: (sheetDataArr[i][49].replace(/\"/g, '').replace(/^ /g, '') ? "" : "text-red text-bold"), name: 'Promo Desc', isShow: true, isDisabled: true, input: sheetDataArr[i][49] },
        { value: sheetDataArr[i][50].replace(/^ /, '') || 'NIL', class: (sheetDataArr[i][50].replace(/^ /, '') ? '' : 'text-red text-bold'), name: 'Promo Start Date', isShow: true, isDisabled: true, input: sheetDataArr[i][50] },
        { value: sheetDataArr[i][51].replace(/^ /, '') || 'NIL', class: (sheetDataArr[i][51].replace(/^ /, '') ? '' : 'text-red text-bold'), name: 'Promo End Date', isShow: true, isDisabled: true, input: sheetDataArr[i][51] },
        { value: sheetDataArr[i][52].replace(/^ /, '') || 'NIL', class: (sheetDataArr[i][52].replace(/^ /, '') ? '' : 'text-red text-bold'), name: 'Promo Day Mask', isShow: true, isDisabled: true, input: sheetDataArr[i][52] },
        { value: sheetDataArr[i][53].replace(/^ /, '') || 'NIL', class: (sheetDataArr[i][53].replace(/^ /, '') ? '' : 'text-red text-bold'), name: 'Promo Start Time', isShow: true, isDisabled: true, input: sheetDataArr[i][53] },
        { value: sheetDataArr[i][54].replace(/^ /, '') || 'NIL', class: (sheetDataArr[i][54].replace(/^ /, '') ? '' : 'text-red text-bold'), name: 'Promo End Time', isShow: true, isDisabled: true, input: sheetDataArr[i][54] },
        { value: sheetDataArr[i][79].replace(/^0+/, ''), name: 'Promo Unit Cost', isShow: true, isDisabled: true, input: sheetDataArr[i][79] },
        { value: sheetDataArr[i][80] || "NIL", class: (!sheetDataArr[i][80] ? 'text-red text-bold' : ''), name: 'Group No', isShow: true, isDisabled: true, input: sheetDataArr[i][80] },
        { value: sheetDataArr[i][81] || "NIL", class: (!sheetDataArr[i][81] ? 'text-red text-bold' : ''), name: 'Supplier ID', isShow: true, isDisabled: true, input: sheetDataArr[i][81] },
        { value: sheetDataArr[i][82], class: (sheetDataArr[i][82] == 'N' ? 'text-red' : 'text-green') + " text-bold", name: 'Inst YN', isShow: true, isDisabled: true, input: sheetDataArr[i][82] },
        { value: sheetDataArr[i][83], class: (sheetDataArr[i][83] == 'N' ? 'text-red' : 'text-green') + " text-bold", name: 'Zero Price YN', isShow: true, isDisabled: true, input: sheetDataArr[i][83] }
      ]);
    };

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

  openEdit(item) {
    let editModal = this.modalCtrl.create(EditItemsModalComponent, { item, func: this.saveItem });
    editModal.present();
  }

  saveItem(item) {

  }
}
