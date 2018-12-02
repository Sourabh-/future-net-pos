import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';
import { BlockerService } from '../../shared/services/blocker.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  
  dCharts = [];
  barCharts = [];
  public query: string = '';
  public isSearchShow: boolean = false;
  public totals:any = {};

  constructor(
  	public navCtrl: NavController,
  	public oneDriveService: OneDriveService,
  	public utilityService: UtilityService,
    private blockerService: BlockerService,
    private authService: AuthService,
    public actionSheetCtrl: ActionSheetController,
    private platform: Platform
  ) {
    document.addEventListener('click', this.offClickHandler.bind(this));
  }

  offClickHandler(ev: any) {
    if(!ev.target.matches('.offtouch')) {
      for(let i=0; i< this.barCharts.length; i++) {
        this.barCharts[i].open = false;
      }
    }
  }

  ngOnInit() {
    if(this.oneDriveService.convId) {
      this.getSecondFolders(this.oneDriveService.convId);
    }
    
  	this.authService.tokenReceived.subscribe((id) => {
  		this.getSecondFolders(id);
  	});

    this.oneDriveService.reauthsuccess.subscribe(() => {
      if(this.oneDriveService.convId) this.getSecondFolders(this.oneDriveService.convId);
    })

    this.oneDriveService.resetApp.subscribe(() => {
      this.dCharts = [];
      this.barCharts = [];
      this.query = '';
      this.isSearchShow = false;
      this.totals = {};
    });
  }

  getSecondFolders(id) {
  	this.oneDriveService.getFolders(id).subscribe(
      (folders) => {
      	if(folders.value) {
      		this.getDayTotalNDeptFiles(folders.value);
      	}
      },
      (msg) => {
      	this.utilityService.showToast(msg);
      }
    )
  }

  scrollBack() {
  	let db = document.getElementById('doughnut-body');
  	db.scrollLeft = db.scrollLeft - 90;
  }

  scrollForward() {
  	let db = document.getElementById('doughnut-body');
  	db.scrollLeft = db.scrollLeft + 90;
  }

  navigateToDetails(chart) {
  	this.navCtrl.push(DashboardDetailsComponent, { chart });
    if(this.oneDriveService.selectedCityId != chart.cityId)
      this.oneDriveService.setCity(chart.all, chart.cityId);
  }

  getDayTotalNDeptFiles(filesInfo) {
  	let count = filesInfo.length;
  	let breakout = 0;
  	let dayTotalFiles = [];
    let dDeptFiles = [];
    let wDeptFiles = [];
  	for(let i=0; i<filesInfo.length; i++) {
  		((i) => {
  			this.oneDriveService.getFolders(filesInfo[i].id)
	  		.subscribe(
	  			(res) => {
	  				if(res.value) {
	  					for(let j=0; j < res.value.length; j++) {
	  						if(res.value[j].name.toLowerCase().indexOf("daytotalsfile") > -1)
	  							dayTotalFiles.push({
	  								id: res.value[j].id,
	  								name: filesInfo[i].name,
                    cityId: filesInfo[i].id
	  							});
                else if(res.value[j].name.toLowerCase().indexOf("ddept") > -1) {
                  dDeptFiles.push({
                    id: res.value[j].id,
                    name: filesInfo[i].name,
                    cityId: filesInfo[i].id
                  });
                } else if(res.value[j].name.toLowerCase().indexOf("wdept") > -1) {
                  wDeptFiles.push({
                    id: res.value[j].id,
                    name: filesInfo[i].name,
                    cityId: filesInfo[i].id
                  });
                } else if(res.value[j].name.toLowerCase().indexOf('changelog') > -1) {
                  this.oneDriveService.logFileIds[filesInfo[i].id] = res.value[j].id;
                }
	  					}
	  				}

	  				this.oneDriveService.folders[filesInfo[i].id] = res.value || [];
	  				count--;
	  				if(count == 0 && breakout == 0) {
	  					this.getDayTotalFilesInfo(dayTotalFiles);
              this.getDDeptFilesInfo(dDeptFiles, wDeptFiles);
	  				} 
	  			},
	  			(msg) => {
	  				breakout = 1;
	  				this.utilityService.showToast(msg);
	  			}
	  		)
  		})(i);
  	}
  }

  getDayTotalFilesInfo(dIds) {
  	let count = dIds.length;
  	let breakout = 0;
  	let files = [];
  	for(let i=0; i<dIds.length; i++) {
  		((i) => {
  			this.oneDriveService.getWorkbook(dIds[i].id)
  			.subscribe(
  				(res) => {
  					this.oneDriveService.worksheets[dIds[i].id] = res;
  					files.push({
  						name: dIds[i].name,
  						values: res.values,
              cityId: dIds[i].cityId
  					})
  					count--;
  					if(count == 0 && breakout == 0) {
  						this.computeDGraphs(files);
  					}
  				},
  				(msg) => {
  					breakout = 1;
	  				this.utilityService.showToast(msg);
  				})
  		})(i);
  	}
  }

  setTotal(totalObj, formula, thisYr, prevYr, yrMinTwo) {
    if(formula[0].indexOf(thisYr + '') > -1)
      totalObj.yearTotal += Number(formula[1]);
    else if(formula[0].indexOf(prevYr + '') > -1)
      totalObj.previousYearTotal += Number(formula[1]);
    else if(formula[0].indexOf(yrMinTwo + '') > -1)
      totalObj.yearMinusTwoTotal += Number(formula[1]);
  }

  computeDGraphs(graphData) {
  	/*
    Object ==> name, previous, today, percent, type:P/L, chart
    */
    let ch = [];
    let date = new Date();
    let today = ('0' + (date.getMonth()+1)).slice(-2) + '/'
             + ('0' + date.getDate()).slice(-2) + '/'
             + date.getFullYear();

    date.setDate(date.getDate() - 1);
    let yesterday = ('0' + (date.getMonth()+1)).slice(-2) + '/'
             + ('0' + date.getDate()).slice(-2) + '/'
             + date.getFullYear();

    for(let i=0; i < graphData.length; i++) {
      let obj:any = {
        name: this.utilityService.getTitleCase(graphData[i].name),
        chart: this.utilityService.getDChart(),
        cityId: graphData[i].cityId,
        all: graphData[i].name
      };

      if(!this.platform.is('core')) {
        obj.chart.chart.doughnutRadius = "54";
      }

      let count = 0;
      let thisYear = new Date().getFullYear();
      let previousYear = thisYear - 1;
      let yearMinusTwo = thisYear - 2;

      if(!this.totals[obj.cityId])
        this.totals[obj.cityId] = {
          dayTotal: 0,
          weekTotal: 0,
          dayTotalCost: 0,
          weekTotalCost: 0,
          yearTotal: 0,
          previousYearTotal: 0,
          yearMinusTwoTotal: 0
        };

      for(let j=0; j<graphData[i].values.length; j++) {
        this.setTotal(this.totals[obj.cityId], graphData[i].values[j], thisYear, previousYear, yearMinusTwo);
        switch(graphData[i].values[j][0]) {
          case today:
            obj.today = graphData[i].values[j][1];
            count++;
            break;
          case yesterday:
            obj.previous = graphData[i].values[j][1];
            count++;
            break;
        }

        if(count == 2) break;
      }

      if(obj.today && obj.previous) {
        let t = Number(obj.today);
        let p = Number(obj.previous);
        obj.type = (t > p) ? 'P' : 'L';
        obj.chart.chart.paletteColors = t > p ? "#fbfbf7,#EEEEEE,#30D496" : "#fbfbf7,#EEEEEE,#FF3333";
        obj.chart.chart.centerLabelColor = t > p ? "#30D496" : "#FF3333";
        obj.percent = ((t > p) ? ((t-p)*100/t).toFixed(2) : ((p-t)*100/t).toFixed(2)) + '%';
      } else {
        obj.percent = '0%';
        obj.today = 0;
        obj.previous = 0;
      }

      obj.chart.chart.defaultCenterLabel = obj.percent;
      obj.today = (Number(obj.today)/1000000).toFixed(2);
      obj.previous = (Number(obj.previous)/1000000).toFixed(2);
      ch.push(obj);
    }

    this.dCharts = ch;
    this.dCharts.sort((b1, b2) => {
      return (b1.name > b2.name) ? 1 : (b2.name > b1.name) ? -1 : 0;
    })
    this.oneDriveService.totals = this.totals;
  }

  getDDeptFilesInfo(ddepts, wdepts) {
    let count = ddepts.length + wdepts.length;
    let breakout = 0;
    let _fileObj = {};
    for(let i=0; i<ddepts.length; i++) {
      ((i) => {

        _fileObj[ddepts[i].cityId] = {
          name: ddepts[i].name,
          cityId: ddepts[i].cityId
        };

        this.oneDriveService.getWorkbook(ddepts[i].id)
        .subscribe(
          (res) => {
            this.oneDriveService.worksheets[ddepts[i].id] = res;
            _fileObj[ddepts[i].cityId].dformulas = res.values;
            count--;
            if(count == 0 && breakout == 0) {
              this.computeBarGraphs(_fileObj);
            }
          },
          (msg) => {
            breakout = 1;
            this.utilityService.showToast(msg);
          })

        this.oneDriveService.getWorkbook(wdepts[i].id)
        .subscribe(
          (res) => {
            this.oneDriveService.worksheets[wdepts[i].id] = res;
            _fileObj[ddepts[i].cityId].wformulas = res.values;
            count--;
            if(count == 0 && breakout == 0) {
              this.computeBarGraphs(_fileObj);
            }
          },
          (msg) => {
            breakout = 1;
            this.utilityService.showToast(msg);
          })
      })(i);
    }
  }

  computeBarGraphs(graphData) {
    /*
    Object ==> name, chart
    */
    let ch = [];
    for(let key in graphData) {
      let c1 = 8, c2 = 8;
      let obj:any = {
        name: graphData[key].name.toUpperCase(),
        chartD: this.utilityService.getBarChart(),
        chartW: this.utilityService.getBarChart(),
        cityId: graphData[key].cityId,
        all: graphData[key].name,
        period: 'Day'
      };

      if(!this.totals[obj.cityId])
        this.totals[obj.cityId] = {
          dayTotal: 0,
          weekTotal: 0,
          yearTotal: 0,
          previousYearTotal: 0,
          yearMinusTwoTotal: 0,
          dayTotalCost: 0,
          weekTotalCost: 0
        };

      for(let j=1; j < graphData[key].dformulas.length; j++) {
        if(!graphData[key].dformulas[j][0]) continue;
        if(c1 > 0)
          obj.chartD.data.push({
            label: graphData[key].dformulas[j][1],
            value: Number(graphData[key].dformulas[j][2])
          });

        c1--;

        this.totals[obj.cityId].dayTotal += Number(graphData[key].dformulas[j][2]);
        this.totals[obj.cityId].dayTotalCost += Number(graphData[key].dformulas[j][3]);
      }

      for(let j=1; j < graphData[key].wformulas.length; j++) {
        if(!graphData[key].wformulas[j][0]) continue;
        if(c2 > 0)
          obj.chartW.data.push({
            label: graphData[key].wformulas[j][1],
            value: Number(graphData[key].wformulas[j][2])
          });

        c2--;

        this.totals[obj.cityId].weekTotal += Number(graphData[key].wformulas[j][2]);
        this.totals[obj.cityId].weekTotalCost += Number(graphData[key].wformulas[j][3]);
      }

      ch.push(obj);
    }

    this.oneDriveService.totals = this.totals;
    this.barCharts = ch;
    this.barCharts.sort((b1, b2) => {
      return (b1.name > b2.name) ? 1 : (b2.name > b1.name) ? -1 : 0;
    })
  }

  changePeriod(chart) {
    chart.open = !chart.open;
  }

  selectPeriod(chart, type) {
    chart.period = type;
    chart.open = false;
  }

  getTotal(cityId, type) {
    if(!this.totals[cityId]) return '0.00';

    switch(type) {
      case 'day':
        return this.utilityService.convertToMillion(this.totals[cityId].dayTotal);
      case 'week':
        return this.utilityService.convertToMillion(this.totals[cityId].weekTotal);
      default:
        return this.utilityService.convertToMillion(this.totals[cityId].yearTotal);
    }
  }
}
