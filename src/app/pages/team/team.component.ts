// //TIM
//
// //TODO: figure out how to change the "currentTab form a b"
//
//
// //
// //TODO figure out how to create a horizontal bar chart that can have a different number
// //     of bars for each grouping
 // import { Component, OnInit, AfterViewInit } from '@angular/core';
 // import { User } from '../../classes/user';
// import { Company } from '../../classes/company';
 import { Router, ActivatedRoute } from '@angular/router';
// import { Location } from '@angular/common';
//
//
// import { Component} from '@angular/core';
// import { GoogleChartComponent} from './ChartComponent.js';
//
// @Component({
//   selector: 'evolution',
//   template: `
//     <div class="four wide column center aligned">
//         <div id="chart_divEvolution" style="width: 900px; height: 500px;"></div>
//     </div>
//   `
// })
// export class EvolutionComponent extends GoogleChartComponent {
//   private options;
//   private data;
//   private chart;
//   constructor(){
//     console.log("Here is EvolutionComponent")
//   }
//
//   drawGraph(){
//     console.log("DrawGraph Evolution...");
//     this.data = this.createDataTable([
//       ['Evolution', 'Imports', 'Exports'],
//       ['A', 8695000, 6422800],
//       ['B', 3792000, 3694000],
//       ['C', 8175000, 800800]
//     ]);
//
//     this.options = {
//       title: 'Evolution, 2014',
//       chartArea: {width: '50%'},
//       hAxis: {
//         title: 'Value in USD',
//         minValue: 0
//       },
//       vAxis: {
//         title: 'Members'
//       }
//     };
//
//     this.chart = this.createBarChart(document.getElementById('chart_divEvolution'));
//     this.chart.draw(this.data, this.options);
//   }
// }
//
// import { Component, OnInit} from '@angular/core';
// declare var google:any;
// @Component({
//   selector: 'chart'
// })
// export class GoogleChartComponent implements OnInit {
//   private static googleLoaded:any;
//
//   constructor(){
//       console.log("Here is GoogleChartComponent")
//   }
//
//   getGoogle() {
//       return google;
//   }
//   ngOnInit() {
//     console.log('ngOnInit');
//     if(!GoogleChartComponent.googleLoaded) {
//       GoogleChartComponent.googleLoaded = true;
//       google.charts.load('current',  {packages: ['corechart', 'bar']});
//     }
//     google.charts.setOnLoadCallback(() => this.drawGraph());
//   }
//
//   drawGraph(){
//       console.log("DrawGraph base class!!!! ");
//   }
//
//   createBarChart(element:any):any {
//       return new google.visualization.BarChart(element);
//   }
//
//   createDataTable(array:any[]):any {
//       return google.visualization.arrayToDataTable(array);
//   }
// }
//
//
// //TODO second option https://www.highcharts.com/demo/combo-dual-axes/grid-light
//
//
// //this was tacken from corporate-profile.component.ts and will go through and
// //get all the people on that companies Team
// /*
//  const myCallback = () => {
//    for (const i of this.currentAccount.leadership) {
//      this.userService.getUserbyID(i.userId).toPromise().then(user => { this.users.push(user); myCallback2();});
//    }
// */
//
//
// //create 3/2 arrays for the different skills that the employees are going to be
// //ranked on.
//
// //this function will go through each of the employees and grab a piece of data
// //i can use this as a template to get the shit that i need
//
// /*
// const myCallback2 = () => {
//
//   for (const i of this.users) {
//     for (const j of i.certification) {
//       this.CQAC.push('Degree: ' + j.CertificationName + ', DateEarned: ' + j.DateEarned);
//     }
//     for (const j of i.award) {
//       this.CQAC.push('Awarded: ' + j);
//     }
//     for (const j of i.clearance) {
//       this.CQAC.push('Type: ' + j.clearanceType + ', Awarded: ' + j.awarded + ', Expiration: ' + j.expiration);
//     }
//   }
// };
// */
// //my shit
// //now i have two arrays containing the education and the strengths of each
// //employee
// /*
// var skill = [];
// var edu = [];
// var Ecount = 0;
// var Scount = 0;
// var numOfEmployees = 0;
// for ( const i of this.user ) {
//   for ( const j of i.education ) {
//     edu[j] = j;
//     Ecount++;
//   }
//   for ( const k of i.strength ) {
//     skill[k] =  k;
//     Scount++;
//   }
//   numOfEmployees++;
// }
// */
// //code for generating the chart. this one is horizontal bar chart
// //TODO make it dynamic with the employee information
// /*angular.module("app", ["chart.js"]).controller("BarCtrl",
//   function ($scope) {
//     for(var i = 0; i < numOfEmployees; i++){
//         $scope.lables = ['Engineer'+i];
//     }
//
//     $scope.series = ['skill'];
//     for(var i = 0; i < numOfEmployees; i++){
//       //var level = 0;
//       var newLevel;
//       for(const j in edu[i]){
//         if(j == "ns"){
//           newLevel = 0;
//         }
//         if(j == "hs"){
//           newLevel = 1;
//         }
//         if(j == "ba"){
//           newLevel = 2;
//         }
//         if(j == "bs"){
//           newLevel = 3;
//         }
//         if(j == "ms"){
//           newLevel = 4;
//         }
//         if(j == "phd"){
//           newLevel = 5;
//         }
//         $scope.data += [newLevel];
//         newLevel = 0;
//       }
//     }
//     $scope.options = {legend: {display: true}};
//     .chart-horizontal-bar.chart-labels = ["N/A", "HS", "BA", "BS", "MS", "PHD"];
// });
//
//
//
//
// */
