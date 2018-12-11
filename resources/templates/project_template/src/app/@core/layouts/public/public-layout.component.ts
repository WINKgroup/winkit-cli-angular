import {Component} from '@angular/core';

/**
 * standard Layout extended by public pages that automatically includes the UI components in the View.
 * if you need to do something just for public pages, you can do it here instead the AppComponent
 */
@Component({
  selector: 'app-layout',
  styleUrls: ['./public-layout.component.scss'],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {
}
