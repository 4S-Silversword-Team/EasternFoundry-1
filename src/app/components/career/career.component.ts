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

  public refresh(year: number) {
    for (let index of this.Data){
      jQuery('#c-year-' + index.Year).removeClass();
      $('#c-brief-' + index.Year).removeClass();
      $('#c-detail-' + index.Year).removeClass();

      if (index.Year > year) {
        $('#c-year-' + index.Year).addClass('career-year');
        $('#c-brief-' + index.Year).addClass('pre');
        $('#c-brief-' + index.Year).addClass('career-brief');
        $('#c-detail-' + index.Year).addClass('hidden');
      } else if (index.Year < year) {
        $('#c-year-' + index.Year).addClass('career-year');
        $('#c-brief-' + index.Year).addClass('after');
        $('#c-brief-' + index.Year).addClass('career-brief');
        $('#c-detail-' + index.Year).addClass('hidden');
      } else {
        $('#c-year-' + index.Year).addClass('hidden');
        $('#c-brief-' + index.Year).addClass('hidden');
        $('#c-detail-' + index.Year).addClass('career-detail');
      }
    }
  }

}
