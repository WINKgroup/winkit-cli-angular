import {Component} from '@angular/core';

/**
 * standard Layout extended by platform pages that automatically includes the UI components in the View.
 * if you need to do something just for platform, you can do it here instead the AppComponent
 */
@Component({
  selector: 'app-layout',
  templateUrl: './platform-layout.component.html'
})
export class PlatformLayoutComponent {
}
