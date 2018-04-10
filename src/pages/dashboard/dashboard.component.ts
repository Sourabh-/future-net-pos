import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  
  dataSource;
  dataSource2;
  charts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(public navCtrl: NavController) {
	this.dataSource = {
        "chart": {
	        "showBorder": 0,
	        "use3DLighting": 0,
	        "enableSmartLabels": 0,
	        "startingAngle": "310",
	        "showLabels": 0,
	        "showValues": 0,
	        "showPercentValues": 0,
	        "showLegend": 0,
	        "defaultCenterLabel": "15.4 %",
	        "centerLabelBold": "1",
	        "showTooltip": 0,
	        "decimals": 0,
	        "useDataPlotColorForLabels": "1",
	        "theme": "fint",
	        "doughnutRadius": "52",
	        "paletteColors": "#eeeeee, #FF0000"
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

    this.dataSource2 = {
    	"chart": {
    		"bgColor": "#ffffff",
	        "showBorder": "0",
	        "showCanvasBorder": "0",
	        "usePlotGradientColor": "0",
	        "plotBorderAlpha": "10",
	        "showAlternateVGridColor": "0",
	        "placeValuesInside": "1",
	        "valueFontColor": "#ffffff",
	        "showAxisLines": "1",
	        "axisLineAlpha": "25",
	        "divLineAlpha": "10",
	        "alignCaptionWithCanvas": "0",
	        "showValues": 0,
	        "plotSpacePercent": "60",
	        "showXAxisLine": "0",
	        "showYAxisLine": "0"
	    },
	    "data": [
	        {
	            "label": "Bakersfield",
	            "value": "880000"
	        },
	        {
	            "label": "Garden",
	            "value": "730000"
	        },
	        {
	            "label": "Los",
	            "value": "590000"
	        },
	        {
	            "label": "Compton",
	            "value": "520000"
	        },
	        {
	            "label": "Daly",
	            "value": "330000"
	        }
	    ]
    };
  }

  scrollBack() {
  	let db = document.getElementById('doughnut-body');
  	db.scrollLeft = db.scrollLeft - 90;
  }

  scrollForward() {
  	let db = document.getElementById('doughnut-body');
  	db.scrollLeft = db.scrollLeft + 90;
  }

  navigateToDetails(item) {
  	this.navCtrl.push(DashboardDetailsComponent);
  }
}
