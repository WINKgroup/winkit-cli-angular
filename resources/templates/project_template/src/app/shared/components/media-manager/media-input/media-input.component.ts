import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MediaModalComponent} from '../media-modal/media-modal.component';
import {Utils} from '../../../../@core/static/Utils';
import {MediaType} from '../Media';

/**
 * common input to preview & change a media input.
 */
@Component({
  selector: 'media-input',
  templateUrl: './media-input.component.html',
  styleUrls: ['./media-input.component.scss']
})
export class MediaInputComponent {

  @Input() height: string;
  @Input() width: string;
  @Input() url: string;
  @Input() allowedTypes: MediaType[];
  @Output() urlChange: EventEmitter<string>;

  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal) {
    this.urlChange = new EventEmitter();
  }

  /**
   * get Url sanitized to see it in View.
   *
   * @returns {SafeStyle}
   */
  getSanitizedUrl() {
    return Utils.getBypassedSecurityTrustStyle(this.url ? (this.url.indexOf('.pdf') > -1 ? 'assets/img/pdf_icon.png' : this.url ) : 'assets/img/noimage.png', this.sanitizer);
  }

  /**
   * open media modal to change the value of the input.
   */
  openMediaModal() {
    const activeModal = this.modalService.open(MediaModalComponent, {size: 'lg'});
    activeModal.componentInstance.url = this.url;
    if (this.allowedTypes) {
      activeModal.componentInstance.allowedTypes = this.allowedTypes;
    }
    const onConfirmPressed = (url: string) => {
      this.url = url;
      this.urlChange.emit(this.url);
      activeModal.close();
    };
    activeModal.componentInstance.onConfirmPressed = onConfirmPressed;
  }
}
