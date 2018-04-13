import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UtilityService } from '../../shared/services/utility.service';
import { BlockerService } from '../../shared/services/blocker.service';
import { OneDriveService } from '../../shared/services/oneDrive.service';

@Component({
  selector: 'dashboard-details',
  templateUrl: 'dashboard-details.component.html'
})
export class DashboardDetailsComponent {

  combiChart: any;
  dChart: any;
  totals: any = {};
  period: string = 'Day'; 
  selectedRowVal: any;
  selectedRow: any;

  public header = [
  	'SOURCE', 
  	'DAY', 
  	'WEEK'
  ];

  public rows = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public oneDriveService: OneDriveService,
    public utilityService: UtilityService,
    private blockerService: BlockerService
  ) {	

    this.init();
    this.oneDriveService.selectedCityUpdated.subscribe(() => {
      this.init();
    })
  }

  init() {
    this.showDetailBarChart({ cityId: this.oneDriveService.selectedCityId }, 'DDept');
    this.totals = this.oneDriveService.totals || {};
    this.computeDChart();
    this.getTableData();
  }

  computeDChart() {
    let yr = new Date().getFullYear();
    let total = this.utilityService.convertToMillion(this.totals[this.oneDriveService.selectedCityId].yearTotal + this.totals[this.oneDriveService.selectedCityId].previousYearTotal + this.totals[this.oneDriveService.selectedCityId].yearMinusTwoTotal);
    this.dChart = {
        "chart": {
          "showBorder": 0,
          "use3DLighting": 0,
          "startingAngle": "310",
          "showLabels": "1",
          "showValues": 0,
          "showPercentValues": 0,
          "showLegend": 0,
          "centerLabelBold": "1",
          "showTooltip": 0,
          "decimals": 0,
          "useDataPlotColorForLabels": "1",
          "theme": "fint",
          "doughnutRadius": "40",
          "paletteColors": "#22F0F1,#551A8B,#FF0000",
          "enableSlicing": 0,
          "animateClockwise": "1",
          "defaultCenterLabel": total + ' M'
        },
        "data": [
            {
                "label": yr,
                "value": this.totals[this.oneDriveService.selectedCityId].yearTotal
            },
            {
                "label": yr-1,
                "value": this.totals[this.oneDriveService.selectedCityId].previousYearTotal
            },
            {
                "label": yr-2,
                "value": this.totals[this.oneDriveService.selectedCityId].yearMinusTwoTotal
            }
        ]
    };
  }

  getTableData() {
    this.oneDriveService.getFolders(this.oneDriveService.selectedCityId).subscribe(
      (res) => {
        if(res.value) {
          let count = 2;
          let breakout = 0;
          let iDs:any = {};
          for(let i=0; i < res.value.length; i++) {
            if(res.value[i].name.toLowerCase().indexOf('ddept') > -1) {
              this.oneDriveService.getWorkbook(res.value[i].id, 'DDept').subscribe(
                (res1) => {
                  iDs.day = res1.formulas;
                  count--;
                  if(count == 0 && breakout == 0) {
                    this.computeTable(iDs);
                  }
                },
                (msg) => {
                  breakout = 1;
                  this.utilityService.showToast(msg);
                }
              )
            } else if(res.value[i].name.toLowerCase().indexOf('wdept') > -1) {
              this.oneDriveService.getWorkbook(res.value[i].id, 'WDept').subscribe(
                (res1) => {
                  iDs.week = res1.formulas;
                  count--;
                  if(count == 0 && breakout == 0) {
                    this.computeTable(iDs);
                  }
                },
                (msg) => {
                  breakout = 1;
                  this.utilityService.showToast(msg);
                }
              )
            }

            if(count == 0) {

              break;
            }
          }
        }
      },
      (msg) => {
        this.utilityService.showToast(msg);
      }
    )
  }

  computeTable(tableData) {
    let rows = [];
    for(let i=1; i < tableData.day.length; i++) {
      rows.push([
        { value: tableData.day[i][1] },
        { value: tableData.day[i][2], percent: tableData.day[i][4] },
        { value: tableData.week[i][2] }
      ]);
    }

    this.rows = rows;
    this.selectedRow = rows[0];
    this.selectedRowVal = rows[0][0].value;
  }

  showDetailBarChart(parent, fname) {
    this.utilityService.showLoader();
    this.oneDriveService.getFolders(parent.cityId).subscribe(
      (res) => {
        if(res.value) {
          this.oneDriveService.folders[parent.cityId] = res.value;
          for(let i=0; i < res.value.length; i++) {
            if(res.value[i].name.toLowerCase().indexOf(fname.toLowerCase()) > -1) {
              this.getDDeptFile(res.value[i].id, fname);
              break;
            }
          }
        } else {
          this.utilityService.hideLoader();
        }
      },
      (msg) => {
        this.utilityService.hideLoader();
        this.utilityService.showToast(msg);
      }
    )
  }

  getDDeptFile(id, fname) {
    this.oneDriveService.getWorkbook(id, fname).subscribe(
      (res) => {
        this.oneDriveService.worksheets[id] = res;
        this.utilityService.hideLoader();
        this.computeMSCombiGraph(res.formulas);
      },
      (msg) => {
        this.utilityService.hideLoader();
        this.utilityService.showToast(msg);
      }
    )
  }

  computeMSCombiGraph(graphData) {
    let chart = this.utilityService.getmsCombiChart();
    for(let i=1; i < graphData.length; i++) {
      chart.categories[0].category.push({ value:  graphData[i][1] });
      chart.dataset[0].data.push({ value: graphData[i][2] });
      chart.dataset[1].data.push({ value: graphData[i][4] });
      chart.dataset[2].data.push({ value: graphData[i][3] });
    }

    this.combiChart = chart;
  }

  getTotal(type) {
    if(this.oneDriveService.selectedCityId && this.totals[this.oneDriveService.selectedCityId]) {
      return this.utilityService.numWithCommas(Number(this.totals[this.oneDriveService.selectedCityId][type]).toFixed(2));
    }
  }

  getSalesFigure(type) {
    if(this.oneDriveService.selectedCityId && this.totals[this.oneDriveService.selectedCityId]) {
      switch(type) {
        case 'current':
          return this.utilityService.convertToMillion(this.totals[this.oneDriveService.selectedCityId].yearTotal);
        case 'prev':
          return this.utilityService.convertToMillion(this.totals[this.oneDriveService.selectedCityId].previousYearTotal);
        default: 
          return this.utilityService.convertToMillion(this.totals[this.oneDriveService.selectedCityId].yearMinusTwoTotal);
      }
    } else {
      return '0.00';
    }
  }

  getYear(type) {
    switch(type) {
      case 'current':
        return new Date().getFullYear();
      case 'prev':
        return new Date().getFullYear() - 1;
      default: 
        return new Date().getFullYear() - 2;
    }
  }

  changePeriod(type) {
    this.period = type;
    this.showDetailBarChart({ cityId: this.oneDriveService.selectedCityId }, type == 'Day' ? 'DDept' : 'WDept');
  }

  rowChanged(ev) {
    for(let i=0; i < this.rows.length; i++) {
      if(this.rows[i][0].value == ev) {
        this.selectedRow = this.rows[i];
        break;
      }
    }
  }
}
