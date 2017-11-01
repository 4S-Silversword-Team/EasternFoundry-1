import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent {

   @Input() public Data: any[];
   @Input() public current: number;
   detailsOn = false;
   careerDetails: any = {
     index: String,
     PositionTitle: String,
     Employer: String,
     StartDate: String,
     EndDate: String,
     Description: String,
   }

  public refresh(year: number) {
    for (let index of this.Data){
      jQuery('#c-year-' + index.StartDate.replace('', '').replace('', '')).removeClass();
      $('#c-brief-' + index.StartDate.replace('', '').replace('', '')).removeClass();
      $('#c-detail-' + index.StartDate.replace('', '').replace('', '')).removeClass();

      if (index.StartDate.replace('', '').replace('', '') > year) {
        $('#c-year-' + index.StartDate.replace('', '').replace('', '')).addClass('career-year');
        $('#c-brief-' + index.StartDate.replace('', '').replace('', '')).addClass('pre');
        $('#c-brief-' + index.StartDate.replace('', '').replace('', '')).addClass('career-brief');
        $('#c-detail-' + index.StartDate.replace('', '').replace('', '')).addClass('hidden');
      } else if (index.StartDate.replace('', '').replace('', '') < year) {
        $('#c-year-' + index.StartDate.replace('', '').replace('', '')).addClass('career-year');
        $('#c-brief-' + index.StartDate.replace('', '').replace('', '')).addClass('after');
        $('#c-brief-' + index.StartDate.replace('', '').replace('', '')).addClass('career-brief');
        $('#c-detail-' + index.StartDate.replace('', '').replace('', '')).addClass('hidden');
      } else {
        $('#c-year-' + index.StartDate.replace('', '').replace('', '')).addClass('hidden');
        $('#c-brief-' + index.StartDate.replace('', '').replace('', '')).addClass('hidden');
        $('#c-detail-' + index.StartDate.replace('', '').replace('', '')).addClass('career-detail');
      }
    }
  }

  setDetails(data, i) {
    this.careerDetails.index = i
    this.careerDetails.PositionTitle = data.PositionTitle
    this.careerDetails.Employer = data.Employer
    this.careerDetails.StartDate = data.StartDate
    this.careerDetails.EndDate = data.EndDate
    this.careerDetails.Description = data.Description
    this.detailsOn = true
  }

}
