const modelTemplate = `import {Mappable} from '../../../@core/models/Mappable';
import {Server**ThisName**} from './Server**ThisName**';

export class **ThisName** implements Mappable<**ThisName**> {
  id: string;
  wid: string;

  constructor()
  constructor(id?: string) {
    this.id = typeof id !== 'undefined' ? id : null;
    this.wid = typeof id !== 'undefined' ? id : null;
  }
  
  /**
   * call this method to map the Server**ThisName** to **ThisName**
   *
   * @param {Server**ThisName**} obj
   * @returns {**ThisName**}
   */
  map(obj: Server**ThisName**): **ThisName** {
    const u = Server**ThisName**.mapReverse(obj);
    console.log('###u', u);
    Object.keys(this).forEach(k => {
      this[k] = u[k];
    });
    return this;
  }
  
  /**
   * call this method to map the **ThisName** to Server**ThisName**
   *
   * @returns {Server**ThisName**}
   */
  mapReverse(): Server**ThisName** {
    return Server**ThisName**.map(this);
  }

}

`;

const serverModelTemplate = `import {**ThisName**} from './**ThisName**';

export class Server**ThisName** {
  _id?: string;
  wid?: string;
  
  /**
   * call this method to map the **ThisName** to Server**ThisName**
   *
   * @param {**ThisName**} obj
   * @returns {Server**ThisName**}
   */
  static map(obj: **ThisName**): Server**ThisName** {
    const o = {} as Server**ThisName**;
    o._id = typeof obj.id !== 'undefined' ? obj.id : null;
    o.wid = typeof obj.id !== 'undefined' ? obj.id : null;
    return o;
  }

  /**
   * call this method to map the Server**ThisName** to **ThisName**
   *
   * @param {Server**ThisName**} serverObject
   * @returns {**ThisName**}
   */
  static mapReverse(serverObject: Server**ThisName**): **ThisName** {
    const o = {} as **ThisName**;
    o.id = typeof serverObject._id !== 'undefined' ? serverObject._id : null;
    o.wid = typeof serverObject._id !== 'undefined' ? serverObject._id : null;
    return o;
  }
}

`;

const dataFactoryTemplate = `import {FormControlList} from '../../../@core/models/FormControlTypes';

export class **ThisName**DataFactory {
  /**
   * Call this method to get a FormControlList array (containing form element data).
   *
   * @param {any} that An object which can be used to initialize values in the returned FormControlList.
   * @param {FormControlList} customControlList A FormControlList passed by the user.
   * @return {FormControlList} customControlList concatenated with a FormControlList generated automatically using the 'winkit angular update detail **ThisName**' command.
   */
  static getFormControls = (that, customControlList: FormControlList = []): FormControlList => {
    const generatedFormControls: FormControlList = [
    ];
    return customControlList.concat(generatedFormControls);
  }

}

`;

module.exports.modelTemplate = modelTemplate;
module.exports.serverModelTemplate = serverModelTemplate;
module.exports.dataFactoryTemplate = dataFactoryTemplate;
