import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PastPerformance } from '../../classes/past-performance'
import { PastperformanceService } from '../../services/pastperformance.service'


@Component({
  selector: 'app-past-performance-edit',
  templateUrl: './past-performance-edit.component.html',
  styleUrls: ['./past-performance-edit.component.css'],
  providers: [ PastperformanceService ]
})
export class PastPerformanceEditComponent implements OnInit {

  currentPastPerformance: PastPerformance = new PastPerformance()

  agencyType: string[] = ['Pro', 'Amature'];
  officeType: string[] = ['Pro', 'Amature'];
  clearedType: string[] = ['Pro', 'Amature'];

  ppImage: string;
  ppInputWidth: number = 300;
  employeeWidth: number = 600;
  writeWidth: number = 800;
  rate: number = 0


  constructor(
    private pastPerformanceService: PastperformanceService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {
    this.currentPastPerformance.id = this.route.snapshot.params['id']
    //this.currentPastPerformance = this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id)
    this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id).toPromise().then(res => this.currentPastPerformance = res)

  }
  ngOnInit() {
  }

  uploadImage() {

  }
  updatePP(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model['_id'];
    this.pastPerformanceService.updatePP(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
    window.scrollTo(0, 0);
    this.router.navigate(['past-performance', this.route.snapshot.params['id']]);
  }
  addEmployee(modelEmployees: Array<Object>){
    modelEmployees.push({title: "", stillwith: false})
  }
  deleteArrayIndex(modelArray: Array<Object>, i: number){
    modelArray.splice(i, 1);
  }
  back() {
    this.location.back()
  }

}
