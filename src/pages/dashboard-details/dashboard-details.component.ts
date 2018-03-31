import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'dashboard-details',
  templateUrl: 'dashboard-details.component.html'
})
export class DashboardDetailsComponent {

  dataSource;
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

  constructor(public navCtrl: NavController) {
	this.dataSource = {
		"chart": {
	        "showBorder": "0",
	        "showValues": "0",
	        "paletteColors": "#2bd7ce,#1aaf5d,#f2c500",
	        "bgColor": "#ffffff",
	        "showPlotBorder": "0",
	        "showCanvasBorder": "0",
	        "canvasBgColor": "#ffffff",
	        "captionFontSize": "14",
	        "subcaptionFontSize": "14",
	        "subcaptionFontBold": "0",
	        "divlineColor": "#999999",
	        "divLineIsDashed": "1",
	        "divLineDashLen": "1",
	        "divLineGapLen": "1",
	        "showAlternateHGridColor": "0",
	        "usePlotGradientColor": "0",
	        "toolTipColor": "#ffffff",
	        "toolTipBorderThickness": "0",
	        "toolTipBgColor": "#000000",
	        "toolTipBgAlpha": "80",
	        "toolTipBorderRadius": "2",
	        "toolTipPadding": "5",
	        "legendBgColor": "#ffffff",
	        "legendBorderAlpha": "0",
	        "legendShadow": "0",
	        "legendItemFontSize": "10",
	        "legendItemFontColor": "#666666"
	    },
	    "categories": [
	        {
	            "category": [
	                {
	                    "label": "Jan"
	                },
	                {
	                    "label": "Feb"
	                },
	                {
	                    "label": "Mar"
	                },
	                {
	                    "label": "Apr"
	                },
	                {
	                    "label": "May"
	                },
	                {
	                    "label": "Jun"
	                },
	                {
	                    "label": "Jul"
	                },
	                {
	                    "label": "Aug"
	                },
	                {
	                    "label": "Sep"
	                },
	                {
	                    "label": "Oct"
	                },
	                {
	                    "label": "Nov"
	                },
	                {
	                    "label": "Dec"
	                }
	            ]
	        }
	    ],
	    "dataset": [
	        {
	            "seriesName": "Actual Revenue",
	            "showValues": "1",
	            "data": [
	                {
	                    "value": "16000"
	                },
	                {
	                    "value": "20000"
	                },
	                {
	                    "value": "18000"
	                },
	                {
	                    "value": "19000"
	                },
	                {
	                    "value": "15000"
	                },
	                {
	                    "value": "21000"
	                },
	                {
	                    "value": "16000"
	                },
	                {
	                    "value": "20000"
	                },
	                {
	                    "value": "17000"
	                },
	                {
	                    "value": "25000"
	                },
	                {
	                    "value": "19000"
	                },
	                {
	                    "value": "23000"
	                }
	            ]
	        },
	        {
	            "seriesName": "Projected Revenue",
	            "renderAs": "line",
	            "data": [
	                {
	                    "value": "15000"
	                },
	                {
	                    "value": "16000"
	                },
	                {
	                    "value": "17000"
	                },
	                {
	                    "value": "18000"
	                },
	                {
	                    "value": "19000"
	                },
	                {
	                    "value": "19000"
	                },
	                {
	                    "value": "19000"
	                },
	                {
	                    "value": "19000"
	                },
	                {
	                    "value": "20000"
	                },
	                {
	                    "value": "21000"
	                },
	                {
	                    "value": "22000"
	                },
	                {
	                    "value": "23000"
	                }
	            ]
	        },
	        {
	            "seriesName": "Profit",
	            "renderAs": "line",
	            "data": [
	                {
	                    "value": "4000"
	                },
	                {
	                    "value": "5000"
	                },
	                {
	                    "value": "3000"
	                },
	                {
	                    "value": "4000"
	                },
	                {
	                    "value": "1000"
	                },
	                {
	                    "value": "7000"
	                },
	                {
	                    "value": "1000"
	                },
	                {
	                    "value": "4000"
	                },
	                {
	                    "value": "1000"
	                },
	                {
	                    "value": "8000"
	                },
	                {
	                    "value": "2000"
	                },
	                {
	                    "value": "7000"
	                }
	            ]
	        }
	    ]
	};

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
}
