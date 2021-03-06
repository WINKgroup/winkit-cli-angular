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
import {ModelProperty} from '../../../@core/models/ModelConfig';
import config from '../**ThisName.toLowerCase()**.conf.json';

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
        config.properties.forEach((prop: ModelProperty) => {
            if (!prop.existsOnModelOnly) {
                const serverName = prop.serverName || prop.name;
                o[serverName] = this.getMappedAttribute(obj, prop);
            }
        });
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
        config.properties.forEach((prop: ModelProperty) => {
            if (!prop.existsOnServerOnly) {
                const localName = prop.mapReverseName || prop.name;
                o[localName] = this.getReverseMappedAttribute(serverObject, prop);
            }
        });
        return o;
    }

    /**
     * Computes the value of a given Server**ThisName** object attribute based on the **ThisName** object
     *
     * @param {**ThisName**} model
     * @param {ModelProperty} prop
     */
    private static getMappedAttribute(model: **ThisName**, prop: ModelProperty): any {
        const localName = prop.relationship || prop.name;
        const defaultValue = prop.hasOwnProperty('value') ? prop.value : null;
        switch (prop.name) {
            default:
                return typeof model[localName] !== 'undefined' ? model[localName] : defaultValue;
        }
    }

    /**
     * Computes the value of a given **ThisName** object attribute based on the Server**ThisName** object
     *
     * @param {Server**ThisName**} serverObject
     * @param {ModelProperty} prop
     */
    private static getReverseMappedAttribute(serverObject: Server**ThisName**, prop: ModelProperty): any {
        const serverName = prop.mapReverseRelationship || prop.serverName || prop.name;
        const defaultValue = prop.hasOwnProperty('value') ? prop.value : null;
        switch (prop.name) {
            default:
                return typeof serverObject[serverName] !== 'undefined' ? serverObject[serverName] : defaultValue;
        }
    }
}

`;

const dataFactoryTemplate = `import {FormControlList, FormControlType} from '../../../@core/models/FormControlTypes';

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
        {name: 'id', disabled: true, type: FormControlType.TEXT, order: 0, ngIf: !that.isNew}
    ];
    return customControlList.concat(generatedFormControls);
  }

}

`;

module.exports.modelTemplate = modelTemplate;
module.exports.serverModelTemplate = serverModelTemplate;
module.exports.dataFactoryTemplate = dataFactoryTemplate;
