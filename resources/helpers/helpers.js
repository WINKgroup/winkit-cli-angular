const fs = require('fs');
const windowKeyList = require('./windowKeysList');

/**
 * Enum for element type strings.
 * @readonly
 * @enum {string}
 */
const elementTypes = {
    MODEL: 'model',
    SERVER_MODEL: 'serverModel',
    DATA_FACTORY: 'dataFactory',
    SERVICE: 'service',
    LIST: 'list',
    DETAIL: 'detail',
};

const nonUpdateableModels = ['authenticationservicemodel', 'baseservicemodel', 'responseerror', 'usermedia', 'userservicemodel'];

const REGEXS = {
    fileTemplate: /\*\*(.+?)\*\*/gim,
    todoVerifyImports: /\/\/ TODO verify the following imports\: .+?;/g,
    endOfImports: /(import(?:.|\s)*?;\s+)((?:\/\/ TODO verify the following imports\: .+;\s+)*)((?:(?:\/{1,2}\*? ?(?:.|\s)+?(?:\/\/|\*\/|;)\s)+|\@NgModule|export class|export const))/m,
    modelPropDeclarations: /(class \w+ (?:(?:implements|extends) [\w\<\>\[\]]+ )?{\s+)((?:[_wu]?id\??\: string\;){0,4})((?:(?:\r|\n|\r\n)?\s*\w+\??(?: ?[\:\=] ?.*\;|\;))*)/m,
    serverModelMapMethods: /(static map(?:Reverse)? ?\((\w+?)\: (?:Server)?\w+\)\: (?:Server)?\w+? \{\s*?const (\w+?) ?\= ?.*?;)((?:(?:\r|\n|\r\n)?\s*\3\.[_w]?id ?\= ?.*\2\..+){0,3};)((?:(?:\r|\n|\r\n)?\s*\3\.\w+ ?\= ?.*\2\..+)*)/gm,
    modelPropLine: /(\w+?)(\??)((?: ?\: ?.*)|$|(?: ?\= ?(.*)))/,
    modelConstructor: /(constructor\s?\()((?:[_wu]?id\? ?\: ?string){0,3})\,?((?:\s*\w+\??(?: ?\: ?.*\,?|\,|))*?)(\s*\)\s?\{\s*)((?:\s*?this\.[_wu]?id ?\= ?.+;){0,3})((?:\s*?this\.\w+ ?\= ?.*?;)*)/m,
    properNames: /\b[A-Z]\w*\b/gm,
    formControlList: /(const generatedFormControls\: ?FormControlList ?\= ?\[)((?:.|\s)*?)(\];)/
};

/**
 * Consumes an array of objects and a lookup key.
 * @param {Array.<Object.<string, *>>} configProps - An array of objects that have own property equal to 2nd param of method.
 * @param {string} lookupKey
 * @param {RegExp} [regex]
 * @returns {Array<string>} An array of typescript Class, Interface, Directive, etc. names.
 */
function getTypesToImport(configProps, lookupKey, regex = REGEXS.properNames) {
    return configProps.reduce( (prev, propInfo) => {
        let typeArr;
        if (lookupKey && lookupKey.length) {
            typeArr = propInfo.hasOwnProperty(lookupKey) ? propInfo[lookupKey].match(regex) : null;
        } else {
            typeArr = Object.keys(propInfo).map( k => propInfo[k].toString().match(regex) ).filter( val => val && val.length );
        }
        return typeArr !== null ? prev.concat(...typeArr) : prev;
    }, [] ).filter( (el, i, arr) => arr.indexOf(el) === i && !windowKeyList.includes(el) && !windowKeyList.includes(el[0].toUpperCase() + el.slice(1)) );
}

/**
 * Substitutes the name values of objects in the configProps array with corresponding values from the userPropNames object.
 * @param {Object.<string>} userPropNames
 * @param {Array.<{name: string, any}>} configProps
 * @returns {Array.<{name: string, any}>}
 */
function getUserPropMap(userPropNames, configProps) {
    return Object.keys(userPropNames).map( (key, i) => userPropNames[key] && userPropNames[key].length
        ? Object.assign({}, configProps[i], {name: userPropNames[key]})
        : configProps[i]);
}

/**
 * Checks if an array of objects contains duplicates under the 'propName' key.
 * @param {Array.<{name: string, any}>} configProps
 * @param {string} propName
 * @returns {Array.<string>} Array of names of detected duplicates.
 */
function getDuplicateValuesByPropName(configProps, propName) {
    return configProps.map( el => el[propName] ).reduce((prev, curr, i, arr) => (curr !== undefined && arr.indexOf(curr) !== i && prev.indexOf(curr) === -1 ? prev.concat(curr) : prev), []);
}


/**
 * @param {string} name - The name of the module.
 * @param {boolean} [withExtensions=false] Inidicates whether the paths should include extensions.
 * @returns {{config: string, modulePath: string, modelPath: string, serverModelPath: string, dataFactoryPath: string, servicePath: string, detailPath: string, listPath: string}} An object containing module file paths.
 */
function getModulePaths(name, withExtensions = false) {
    const nameLowerCase = name.toLowerCase();
    const modelRoot = `src/app/modules/${nameLowerCase}`;
    let paths = {
        config: `${modelRoot}/${nameLowerCase}.conf`,
        modulePath: `${modelRoot}/${nameLowerCase}.module`,
        modelPath: `${modelRoot}/models/${name}`,
        serverModelPath: `${modelRoot}/models/Server${name}`,
        dataFactoryPath: `${modelRoot}/models/${name}DataFactory`,
        servicePath: `${modelRoot}/service/${nameLowerCase}.service`,
        detailPath: `${modelRoot}/${nameLowerCase}-detail/${nameLowerCase}-detail.component`,
        listPath: `${modelRoot}/${nameLowerCase}-list/${nameLowerCase}-list.component`
    }
    if (withExtensions) {
        for (let key in paths) {
            if (key === 'detailPath' || key === 'listPath') {
                paths[key + 'HTML'] = paths[key] + '.html';
                paths[key + 'SCSS'] = paths[key] + '.scss';
                paths[key + 'CSS'] = paths[key] + '.css';
                paths[key + 'CSSMAP'] = paths[key] + '.css.map';
            }
            paths[key] = key === 'config' ? paths[key] + '.json' : paths[key] + '.ts';
        }
    }
    return paths;
}

/**
 * Verifies if the passed name contains only letters and is minimum 3 characters long.
 * @param {string} name
 * @returns {boolean}
 */
function validateName(name) {
    return typeof name === 'string' && /^[_a-zA-Z]{3,}$/.test(name);
}

/**
 * @param {elementTypes} elementType - A member of elementTypes enum.
 * @param {string} name - Name of model.
 * @returns {{alreadyExists: boolean, moduleExists: boolean, modelAlreadyExists: boolean, serverModelAlreadyExists: boolean, detailAlreadyExist: boolean}} An object with booleans indicating the existence of the element type with provided name and corresponding elements.
 */
function checkAlreadyExist(elementType, name) {
    const isValidName = validateName(name);
    let alreadyExists;
    const nameLowerCase = isValidName && name.toLowerCase();
    switch(elementType) {
        case elementTypes.MODEL:
            alreadyExists = fs.existsSync(`src/app/modules/${nameLowerCase}/models/${name}.ts`) && fs.existsSync(`src/app/modules/${nameLowerCase}/models/Server${name}.ts`);
            break;
        case elementTypes.SERVICE:
            alreadyExists = fs.existsSync(`src/app/modules/${nameLowerCase}/service/${nameLowerCase}.service.ts`);
            break;
        case elementTypes.DETAIL:
            alreadyExists = fs.existsSync(`src/app/modules/${nameLowerCase}/${nameLowerCase}-detail/${nameLowerCase}-detail.component.ts`);
            break;
        case elementTypes.LIST:
            alreadyExists = fs.existsSync(`src/app/modules/${nameLowerCase}/${nameLowerCase}-list/${nameLowerCase}-list.component.ts`);
            break;
        default:
            alreadyExists = false;
    }
    return {
        alreadyExists,
        moduleExists: fs.existsSync(`src/app/modules/${nameLowerCase}/${nameLowerCase}.module.ts`) && fs.existsSync(`src/app/modules/${nameLowerCase}/${nameLowerCase}.conf.json`),
        modelAlreadyExists: fs.existsSync(`src/app/modules/${nameLowerCase}/models/${name}.ts`),
        serverModelAlreadyExists: fs.existsSync(`src/app/modules/${nameLowerCase}/models/Server${name}.ts`),
        detailAlreadyExist: fs.existsSync(`src/app/modules/${nameLowerCase}/${nameLowerCase}-detail/${nameLowerCase}-detail.component.ts`)
    };
}

/**
 *
 * @param {elementTypes} writeTo
 * @param {string} primaryKey
 * @returns {Object[]}
 */
function getPrimaryKeysList(writeTo, primaryKey) {
    switch (writeTo) {
        case elementTypes.MODEL:
        case elementTypes.SERVER_MODEL:
            if (primaryKey && typeof primaryKey === 'string' && primaryKey.length) {
                return [{name: primaryKey, type: 'string'}];
            } else {
                const name = writeTo === 'model' ? 'id' : '_id';
                return [{name, type: 'string'}, {name: 'wid', relationship: 'id', type: 'string'}];
            }
        case elementTypes.DATA_FACTORY:
            const name = primaryKey && typeof primaryKey === 'string' && primaryKey.length ? `'${primaryKey}'` : '\'id\'';
            return [{ name, disabled: true, type: 'FormControlType.TEXT', order: 0, ngIf:'!that.isNew' }];
        default:
            return [];
    }

}

module.exports = {
    elementTypes, getModulePaths, checkAlreadyExist, REGEXS, validateName, nonUpdateableModels, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, getPrimaryKeysList
};