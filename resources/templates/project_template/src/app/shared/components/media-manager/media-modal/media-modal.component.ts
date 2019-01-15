import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {BaseComponent} from '../../../../@core/base-component/base.component';
import {Media, MediaType} from '../Media';
import {Subscription} from 'rxjs/index';
import {SessionService} from '../../../../@core/services/session.service';
import {Utils} from '../../../../@core/static/Utils';
import {StorageService} from '../storage.service';
import config from '../../../../winkit.conf.json';

const primaryKey = config.primaryKey || 'id';

/**
 * menage loggedInUser media, show the already uploaded images, choose from them or upload a new one!
 */
@Component({
  selector: 'media-modal',
  templateUrl: './media-modal.component.html',
  styleUrls: ['./media-modal.component.scss']
})
export class MediaModalComponent extends BaseComponent implements OnInit, OnDestroy {

  loading: boolean;
  onConfirmPressed: (url: string) => any;
  url: string;
  type: string;
  mediaList: Media[] = [];
  /**
   * you can menage IMAGE & PDF as format.
   *
   * @type {[MediaType , MediaType]}
   */
  allowedTypes: MediaType[] = [MediaType.IMAGE, MediaType.PDF];
  mediaListSubscription: Subscription;
  accept = '';
  fullAccept = {'img': 'image/jpg, image/jpeg, image/png, image/gif, image/JPG, image/JPEG, image/PNG, image/GIF', pdf: ', application/pdf'};

  constructor(private activeModal: NgbActiveModal,
              private storageService: StorageService,
              public sanitizer: DomSanitizer,
              protected injector: Injector) {
    super(injector);
    this.setTitle('Media');
  }

  async ngOnInit() {
    this.loading = true;
    if (this.allowedTypes.indexOf(MediaType.IMAGE) > -1) {
      this.accept = this.fullAccept.img;
    }
    if (this.allowedTypes.indexOf(MediaType.PDF) > -1) {
      this.accept += this.fullAccept.pdf;
    }
    this.storageService.getMediaByUserId(SessionService.getLoggedInUser()[primaryKey]).then(s => {
      this.mediaListSubscription = s.subscribe(media => {
        this.mediaList = media;
        this.loading = false;
      });
    }).catch(e => {
      this.handleAPIError(e);
    });
  }

  confirm() {
    this.onConfirmPressed(this.url);
  }

  ngOnDestroy(): void {
    this.mediaListSubscription.unsubscribe();
  }

  closeModal() {
    this.activeModal.close();
  }

  /**
   * get Url sanitized to see it in View.
   *
   * @param {Media} media
   * @returns {SafeStyle}
   */
  getSanitizedUrl(media?: Media) {
    return Utils.getBypassedSecurityTrustStyle(!media ? 'assets/img/noimage.png' : (media.type === MediaType.IMAGE ? media.url : 'assets/img/pdf_icon.png'), this.sanitizer);
  }

  selectMedia(media?: Media) {
    this.url = media && this.url !== media.url ? media.url : null;
    this.type = media ? media.type.toString() : null;
  }

  /**
   * check the fine and if is ok upload it
   *
   * @param {FileList} files
   */
  handleFileInput(files: FileList) {
    console.log(files.item(0));
    const file = files.item(0);
    if (file.size > 3000000) {
      this.showErrorNotification(this.translateService.instant('File too big'), {message: this.translateService.instant('Please select a file smaller than 3MB')});
    } else {
      const type = this.fullAccept.pdf.indexOf(file.type) > -1 ? MediaType.PDF : MediaType.IMAGE;
      this.loading = true;
      this.storageService.upload(SessionService.getLoggedInUser()[primaryKey], file, type, (progress: number) => {
        console.log(progress);
      }).then((media: Media) => {
        console.log('media', media);
        this.url = media.url;
        this.type = media.type.toString();
        this.loading = false;
      });
    }
  }
}
