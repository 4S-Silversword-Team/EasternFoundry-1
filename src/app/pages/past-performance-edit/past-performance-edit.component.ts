import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PastperformanceService } from '../../services/pastperformance.service';
import { Location } from '@angular/common'

import { PastPerformance } from '../../classes/past-performance'


@Component({
  selector: 'app-past-performance-edit',
  providers: [PastperformanceService],
  templateUrl: './past-performance-edit.component.html',
  styleUrls: ['./past-performance-edit.component.css']
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
    if ( this.router.url !== 'past-performance-create' ) {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => this.currentPastPerformance = res[0] );
      //this.pastPerformanceService.dumbMethod()
      //console.log(this.pastPerformanceService)
    }
  }

  ngOnInit() {
  }

  uploadImage() {

  }

}
