import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(
  	public navCtrl: NavController,
  	public oneDriveService: OneDriveService,
  	public utilityService: UtilityService,
    private blockerService: BlockerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if(this.oneDriveService.convId) {
      this.getSecondFolders(this.oneDriveService.convId);
    }
    
  	this.authService.tokenReceived.subscribe((id) => {
  		this.getSecondFolders(id);
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
  }

  getDayTotalNDeptFiles(filesInfo) {
  	let count = filesInfo.length;
  	let breakout = 0;
  	let dayTotalFiles = [];
    let dDeptFiles = [];
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
                }
	  					}
	  				}

	  				this.oneDriveService.folders[filesInfo[i].id] = res.value || [];
	  				count--;
	  				if(count == 0 && breakout == 0) {
	  					this.getDayTotalFilesInfo(dayTotalFiles);
              this.getDDeptFilesInfo(dDeptFiles);
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
  			this.oneDriveService.getWorkbook(dIds[i].id, 'DayTotalsFile')
  			.subscribe(
  				(res) => {
  					this.oneDriveService.worksheets[dIds[i].id] = res;
  					files.push({
  						name: dIds[i].name,
  						formulas: res.formulas,
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
        cityId: graphData[i].cityId
      };

      let count = 0;
      for(let j=0; j<graphData[i].formulas.length; j++) {
        switch(graphData[i].formulas[j][0]) {
          case today:
            obj.today = graphData[i].formulas[j][1];
            count++;
            break;
          case yesterday:
            obj.previous = graphData[i].formulas[j][1];
            count++;
            break;
        }

        if(count == 2) break;
      }

      if(obj.today && obj.previous) {
        let t = Number(obj.today);
        let p = Number(obj.previous);
        obj.type = (t > p) ? 'P' : 'L';
        obj.chart.chart.paletteColors = t > p ? "#fbfbf7,#EEEEEE,#7CD998" : "#fbfbf7,#EEEEEE,#FF0000";
        obj.percent = ((t > p) ? ((t-p)*100/t).toFixed(2) : ((p-t)*100/t).toFixed(2)) + '%';
      } else {
        obj.percent = '0%';
      }

      obj.chart.chart.defaultCenterLabel = obj.percent;
      obj.today = (Number(obj.today)/1000000).toFixed(2);
      obj.previous = (Number(obj.previous)/1000000).toFixed(2);
      ch.push(obj);
    }

    this.dCharts = ch;
  }

  getDDeptFilesInfo(depts) {
    let count = depts.length;
    let breakout = 0;
    let files = [];
    for(let i=0; i<depts.length; i++) {
      ((i) => {
        this.oneDriveService.getWorkbook(depts[i].id, 'DDept')
        .subscribe(
          (res) => {
            this.oneDriveService.worksheets[depts[i].id] = res;
            files.push({
              name: depts[i].name,
              formulas: res.formulas,
              cityId: depts[i].cityId
            })
            count--;
            if(count == 0 && breakout == 0) {
              this.computeBarGraphs(files);
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
    for(let i=0; i < graphData.length; i++) {
      let obj:any = {
        name: graphData[i].name.toUpperCase(),
        chart: this.utilityService.getBarChart(),
        cityId: graphData[i].cityId
      };

      for(let j=1; j < graphData[i].formulas.length; j++) {
        obj.chart.data.push({
          label: graphData[i].formulas[j][1],
          value: Number(graphData[i].formulas[j][2])
        })
      }
      ch.push(obj);
    }

    this.barCharts = ch;
  }
}
