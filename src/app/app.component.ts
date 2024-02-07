import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  subscriptions: Subscription[] = [];

  showSpinner = false;
  
  constructor(public sharedService: SharedService) {
    this.subscriptions.push(
      sharedService.showSpinner.subscribe(res => {
        this.showSpinner = res;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
