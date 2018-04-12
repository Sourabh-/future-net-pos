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

  combiChart:any;
  dataSource2;

  public header = [
  	'SOURCE', 
  	'DAY', 
  	'WEEK', 
  	'MONTH', 
  	'YEAR' 
  ];

  public rows = [
  		[ 
  			{value: 'Grocery', class: ''},
  			{value: '100 (24.7%)', class: ''},
  			{value: '3.4', class: ''},
  			{value: '100', class: ''},
  			{value: '71 (36.5%)', class: ''}
  		],
  		[ 
  			{value: 'Grocery', class: ''},
  			{value: '100 (24.7%)', class: ''},
  			{value: '3.4', class: ''},
  			{value: '100', class: ''},
  			{value: '71 (36.5%)', class: ''}
  		],
  		[ 
  			{value: 'Grocery', class: ''},
  			{value: '100 (24.7%)', class: ''},
  			{value: '3.4', class: ''},
  			{value: '100', class: ''},
  			{value: '71 (36.5%)', class: ''}
  		],
  		[ 
  			{value: 'Grocery', class: ''},
  			{value: '100 (24.7%)', class: ''},
  			{value: '3.4', class: ''},
  			{value: '100', class: ''},
  			{value: '71 (36.5%)', class: ''}
  		],
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public oneDriveService: OneDriveService,
    public utilityService: UtilityService,
    private blockerService: BlockerService
  ) {	
    this.showDetailBarChart(navParams.data.chart);

    this.oneDriveService.selectedCityUpdated.subscribe(() => {
      this.showDetailBarChart({ cityId: this.oneDriveService.selectedCityId })
    })

  	this.dataSource2 = {
        "chart": {
	        "showBorder": 0,
	        "use3DLighting": 0,
	        "startingAngle": "310",
	        "showLabels": 0,
	        "showValues": 0,
	        "showPercentValues": 0,
	        "showLegend": 0,
	        "centerLabelBold": "1",
	        "showTooltip": 0,
	        "decimals": 0,
	        "useDataPlotColorForLabels": "1",
	        "theme": "fint",
	        "doughnutRadius": "32"
        },
        "data": [
            {
                "label": "Bakersfield Central",
                "value": "50"
            },
            {
                "label": "Garden Groove harbour",
                "value": "50"
            }
        ]
    };
  }

  showDetailBarChart(parent) {
    this.utilityService.showLoader();
    this.oneDriveService.getFolders(parent.cityId).subscribe(
      (res) => {
        if(res.value) {
          this.oneDriveService.folders[parent.cityId] = res.value;
          for(let i=0; i < res.value.length; i++) {
            if(res.value[i].name.toLowerCase().indexOf("ddept") > -1) {
              this.getDDeptFile(res.value[i].id);
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

  getDDeptFile(id) {
    this.oneDriveService.getWorkbook(id, 'DDept').subscribe(
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
}
