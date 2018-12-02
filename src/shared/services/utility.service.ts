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
	        "centerLabelFontSize": "16",
	        "centerLabelColor": "#929090",
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
	        "plotSpacePercent": "40",
	        "showXAxisLine": "0",
	        "showYAxisLine": "0",
	        "paletteColors": "#259D9E,#FF6060,#FFBE3C,#375BAF"
	    },
	    "data": []
};

export const msCombiObj = {
	"chart": {
		"showLabels": "1",
		"labelDisplay": "rotate",
        "showBorder": "0",
        "showValues": "0",
        "paletteColors": "#50E3C2,#F5A623,#C04DD8",
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
        "toolTipPadding": "10",
        "showLegend": "1",
        "sNumberSuffix": "%",
        "legendBgColor": "#ffffff",
        "legendBorderAlpha": "0",
        "legendShadow": "0",
        "legendItemFontSize": "12",
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
            "showValues": "0",
            "data": [] 
        },
        {
            "seriesName": "GP % ",
            "parentYAxis": "S",
            "showValues": "0",
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
	public isMenuEnabled: boolean = false;
	private loaderShown: boolean = false;
	public theme: string = localStorage.theme || 'light-theme';
	public selectDisabled: boolean = false;
	public selectedCity: string = '';

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
		if(msg) {
			let toast = this.toastCtrl.create({
		      message: msg.toUpperCase(),
		      duration: 3000
		    });
		    
		    toast.present(); 
		}
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
		if(!this.loaderShown) {
			this.loader = this.loadingCtrl.create({
		      content: "Please wait..."
		    });
		    this.loaderShown = true;
			this.loader.present();
		}
	}

	hideLoader() {
		if(this.loaderShown) {
			this.loaderShown = false;
			this.loader.dismiss();
		} 
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

	convertToMillion(number) {
		return (Number(number)/1000000).toFixed(2);
	}

	numWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	tConvert (time) {
	  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

	  if (time.length > 1) { // If time format correct
	    time = time.slice (1);  // Remove full string match value
	    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
	    time[0] = +time[0] % 12 || 12; // Adjust hours
	  }

	  return time.join(''); // return adjusted time or original string
	}

	changeTheme() {
		this.theme = this.theme == 'dark-theme' ? 'light-theme' : 'dark-theme';
		localStorage.theme = this.theme;
	}
}