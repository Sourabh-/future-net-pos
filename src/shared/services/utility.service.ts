import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular'

export const monthAbbr = {
	"1": "Jan",
	"2": "Feb",
	"3": "Mar",
	"4": "Apr",
	"5": "May",
	"6": "June",
	"7": "July",
	"8": "Aug",
	"9": "Sept",
	"10": "Oct",
	"11": "Nov",
	"12": "Dec"
};

export const doughnutObj = {
	"chart": {
	        "showBorder": 0,
	        "use3DLighting": 0,
	        "enableSmartLabels": 0,
	        "startingAngle": "270",
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
	        "doughnutRadius": "60",
	        "paletteColors": "#EEEEEE",
	        "enableSlicing": 0,
	        "animateClockwise": "1"
        },
        "data": [
        	{ value: 20 },
        	{ value: 30 },
        	{ value: 50 }
        ]
};

export const barChartObj = {
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
	        "plotSpacePercent": "30",
	        "showXAxisLine": "0",
	        "showYAxisLine": "0"
	    },
	    "data": []
};

export const msCombiObj = {
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
            "category": []
        }
    ],
    "dataset": [
        {
            "seriesName": "Sales ",
            "showValues": "1",
            "data": [] 
        },
        {
            "seriesName": "GP % ",
            "renderAs": "line",
            "data": []
        },
        {
            "seriesName": "Cost ",
            "renderAs": "line",
            "data": []
        }
    ]
};

@Injectable()
export class UtilityService {
	public activeView = 'dashboard';
	public loader: any;

	constructor(
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController
	) {}

	setLocalStorage(key, json) {
		localStorage[key] = JSON.stringify(json);
	}

	getLocalStorage(key, isJson?) {
		if(localStorage[key]) return isJson ? JSON.parse(localStorage[key]) : localStorage[key]; 
		else return '';
	}

	deleteLocalStorage(key) {
		localStorage.removeItem(key);
	}

	showToast(msg) {
		let toast = this.toastCtrl.create({
	      message: msg.toUpperCase(),
	      duration: 3000
	    });
	    
	    toast.present(); 
	}

	getDate(date) {
		let _date = new Date(date);
	    let gap = Math.ceil((new Date().getTime() - _date.getTime())/(1000 * 60 * 60 * 24));
	    if(gap > 29) {
	      return ('0' + _date.getDate()).slice(-2) + '/'
	             + ('0' + (_date.getMonth()+1)).slice(-2) + '/'
	             + _date.getFullYear();
	    } else {
	      return gap + ' days ago';
	    }
	}

	showLoader() {
		this.loader = this.loadingCtrl.create({
	      content: "Please wait..."
	    });
		this.loader.present();
	}

	hideLoader() {
		this.loader.dismiss();
	}

	getMonth(mon) {
		return monthAbbr[mon];
	}

	getDateSub(dd) {
	  if(dd > 3 && dd < 21) return 'th';
	  switch (dd % 10) {
	        case 1:  return "st";
	        case 2:  return "nd";
	        case 3:  return "rd";
	        default: return "th";
	    }
	}

	getDChart() {
		return JSON.parse(JSON.stringify(doughnutObj));
	}

	getBarChart() {
		return JSON.parse(JSON.stringify(barChartObj));
	}

	getmsCombiChart() {
		return JSON.parse(JSON.stringify(msCombiObj));
	}

	getTitleCase(str) {
		return str.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}
}