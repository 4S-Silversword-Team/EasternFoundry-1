import { Component, Input, OnInit } from '@angular/core';

@Component({
  // selector: 'app-availablebar',
  // templateUrl: './availablebar.component.html',
  // styleUrls: ['./availablebar.component.css']
     selector: 'app-networks',
     templateUrl: './networks.component.html',
     styleUrls: ['./networks.component.css']
})
// export class AvailablebarComponent implements OnInit {
  export class NetworksComponent implements OnInit {
  @Input() values: string[] = []
  @Input() dates: string[] = []

  ruler: string[] =[]

  constructor() {

  }

  ngOnInit() {
    let temp: boolean = true
    this.ruler.push('./assets/img/profile/ruler-start.png')
    for( let index of this.values) {
      if(temp) {
        this.ruler.push('./assets/img/profile/ruler-one.png')
      } else {
        this.ruler.push('./assets/img/profile/ruler-two.png')
      }
      temp = !temp
    }
    this.ruler.pop()
  }

}
