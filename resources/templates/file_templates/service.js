const serviceTemplate = `import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../../../@core/services/base.service';
import { **ThisName** } from '../models/**ThisName**';

@Injectable()
export class **ThisName**Service extends BaseService<**ThisName**> {

  constructor(injector: Injector) {
    super(injector);
  }

  protected modelConstructor(): **ThisName** {
    return new **ThisName**();
  }

  setPagination(pageSize?: number, filters?: { [key: string]: string }, orderByFieldName?: string) {
    this.reset();
    this.init('**ThisName.toLowerCase()**s', pageSize, filters, orderByFieldName);
  }

  get**ThisName**ById(id: string): Promise<**ThisName**> {
    this.setPagination();
    return this.getObject(id);
  }

  update**ThisName**(**ThisName.toLowerCase()**: **ThisName**): Promise<boolean> {
    return this.patchObject(**ThisName.toLowerCase()**);
  }

  delete**ThisName**(id: string): Promise<boolean> {
    return this.deleteObject(id);
  }

  create**ThisName**(**ThisName.toLowerCase()**: **ThisName**): Promise<boolean> {
    return this.postObject(**ThisName.toLowerCase**);
  }
}

`;

module.exports.serviceTemplate = serviceTemplate;
