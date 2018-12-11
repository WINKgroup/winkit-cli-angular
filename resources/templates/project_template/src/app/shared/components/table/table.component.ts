import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {Utils} from '../../../@core/static/Utils';
import {environment} from '../../../../environments/environment';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

declare const require: any;

/**
 * show your list in a table
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() loading: boolean;
  @Input() headers: { key: string, title: string, isCustom: boolean, eventId?: string, path?: string }[];
  @Input() list: any[];
  @Input() showIndexHeader: boolean;
  @Input() elementsPerPage: number;
  @Input() hasNextPage: boolean;
  @Input() currentPage: number;
  @Input() showExportActions: boolean;
  @Input() exportableFormats: ExportableFormats[];
  @Output() loadMoreItems: EventEmitter<any> = new EventEmitter();
  @Output() currentPageChange: EventEmitter<number> = new EventEmitter();
  @Output() onChecked: EventEmitter<{ element: any, value: boolean }> = new EventEmitter();

  utils = Utils;
  environment = environment;
  translateService: TranslateService;

  constructor(private injector: Injector) {
    this.translateService = injector.get(TranslateService);
  }

  ngOnInit() {
  }

  /**
   * go to previous page
   */
  onPreviousClicked() {
    this.currentPage--;
    this.currentPageChange.emit(this.currentPage);
  }

  /**
   * go to next page
   */
  onNextClicked() {
    if (this.currentPage < this.getPages().length) {
      this.currentPage++;
      this.currentPageChange.emit(this.currentPage);
    } else {
      this.loadMoreItems.emit();
    }
  }

  /**
   * go to specified page
   */
  goToPage(index: number) {
    this.currentPage = index;
    this.currentPageChange.emit(this.currentPage);
  }

  /**
   * get total pages
   */
  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < Number(this.list.length / this.elementsPerPage); i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  /**
   * emitted if user clicks on the checkbox associated to the element
   */
  onElementChecked(element: any, $event: any) {
    const htmlElement = ((window.event) ? ($event.srcElement) : ($event.currentTarget));
    this.onChecked.emit({element: element, value: (htmlElement as HTMLInputElement).checked});
  }

  /**
   * export your list.
   */
  exportList(type: ExportableFormats) {
    if (type === 'XLSX') {
      this.exportAsXLSX();
    } else {
      this.exportAsCSV();
    }
  }

  /**
   * export your list as CSV
   */
  exportAsCSV(skipSwal?: boolean) {
    const onSuccess = () => {
      if (this.hasNextPage) {
        this.exportAsCSV(true);
      } else {
        const Json2csvParser = require('json2csv').Parser;
        const fields = [];
        Object.keys(this.list[0]).forEach(f => {
          if (f !== 'password' && f !== 'media' && f !== 'fullName') {
            fields.push(f);
          }
        });
        const json2csvParser = new Json2csvParser({fields, delimiter: ';'});
        const csv = json2csvParser.parse(this.list);
        const blob = new Blob([csv]);
        if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
          window.navigator.msSaveBlob(blob, `list_${(new Date()).toLocaleString()}.csv`);
        } else {
          const a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = `list_${(new Date()).toLocaleString()}.csv`;
          document.body.appendChild(a);
          a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a);
        }
      }
    };
    this.initExport(skipSwal, onSuccess);
  }

  /**
   * export your list as XLSX
   */
  exportAsXLSX(skipSwal?: boolean) {
    const onSuccess = () => {
      if (this.hasNextPage) {
        this.exportAsXLSX(true);
      } else {
        const fieldsFinal = [];
        const macrosections = [];
        const unexportedFields = [];
        const headers = [];
        Object.keys(this.list[0]).forEach(f => {
          if (f !== 'password' && f !== 'media' && f !== 'fullName') {
              fieldsFinal.push(f);
              macrosections.push(this.translateService.instant(f));
              headers.push(f);
          } else {
            unexportedFields.push(f);
          }
        });
        const data = this.list.map(s => {
          s = Utils.clone(s);
          unexportedFields.forEach(f => {
            if (f !== 'id') {
              delete s[f];
            }
          });
          return s as any;
        });
        const heading = [
          macrosections,
          fieldsFinal
        ];
        console.log('DATA', data);
        const ws = XLSX.utils.aoa_to_sheet(heading);
        XLSX.utils.sheet_add_json(ws, data, {
          header: headers,
          skipHeader: true,
          origin: 2
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, this.translateService.instant('List'));
        const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
        if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
          window.navigator.msSaveBlob(new Blob([wbout]), `${this.translateService.instant('List')}_${(new Date()).toLocaleString()}.xlsx`);
        } else {
          const a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(new Blob([wbout]));
          a.download = `${this.translateService.instant('List')}_${(new Date()).toLocaleString()}.xlsx`;
          document.body.appendChild(a);
          a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a);
        }
      }
    };
    this.initExport(skipSwal, onSuccess);
  }

  /**
   * load more items while there is a next page, after start to export it.
   *
   * @param {boolean} skipSwal
   * @param {() => any} onSuccess
   */
  private initExport(skipSwal: boolean, onSuccess: () => any) {
    if (skipSwal) {
      this.loadMoreItems.emit(onSuccess);
    } else {
      Swal({
        title: this.translateService.instant('Are you sure?'),
        html: `${this.translateService.instant('This process will export all elements filtered by selected filters.')}<br>${this.translateService.instant('Don\'t abuse of this feature.')}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.translateService.instant('Yes, continue!'),
        cancelButtonText: this.translateService.instant('No')
      }).then((result) => {
        if (result.value) {
          this.loadMoreItems.emit(onSuccess);
        }
      });
    }
  }
}

export type ExportableFormats = 'CSV' | 'XLSX';
