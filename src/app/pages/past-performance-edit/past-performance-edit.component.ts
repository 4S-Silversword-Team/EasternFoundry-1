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
    this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id).toPromise().then(res => this.currentPastPerformance = res[0])

  }
  ngOnInit() {
  }

  uploadImage() {

  }

  back() {
    this.location.back()
  }

}
