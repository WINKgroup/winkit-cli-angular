'use strict';
const gulp = require('gulp');
const prompt = require('inquirer').createPromptModule();
const fs = require('fs');
const fsExtra = require('fs-extra');
const color = require('gulp-color');
const mkdirp = require('mkdirp');
const del = require('del');
const shell = require('gulp-shell');
const TEMPLATES = require('./resources/templates/file_templates/index');
const UTILS = require('./resources/helpers/index');
const {version} = require('./package.json');

let config;
try {
    config = require(process.cwd() + '/winkit.conf');
} catch (e) {
    config = {};
}

/**
 * A string replacer.
 * @param {string} match
 * @param {string} name
 * @returns {string}
 */
function generateContent(match, name = null) {
    const dataArr = match.split(',');
    const firstElArr = dataArr[0].split('.');
    switch (firstElArr[0]) {
        case 'eval':
            return eval(dataArr[1]);
        case 'path.relative':
            return dataArr[2] === 'correspondingModelPath' ? './../server/models/Server' + name : './interface/Mappable';
        case 'selectedServer':
            return config.selectedServer === dataArr[1] ? dataArr[2] : dataArr[3];
        case 'config':
            return config[firstElArr[1]];
        case 'ThisName':
            if (firstElArr[1] && name[firstElArr[1].replace(/[^a-z]/gi, '')]) {
                return name[firstElArr[1].replace(/[^a-z]/gi, '')]();
            }
            return name;
        default:
            return match;
    }
}

/**
 * Recursively triggers the create() method for elements of the taskList array.
 * @param {string} name - Name of model.
 * @param {elementTypes[]} taskList - Array of elementTypes enum members.
 * @param {number} [counter = 0] - used in reccurence.
 * @param {[]} [results = []] - used in reccurence.
 * @returns {Promise<boolean>}
 */
async function parseTasks(name, taskList, counter = 0, results = []) {
    if (taskList && taskList.length) {
        switch(true) {
            case taskList[counter].indexOf( UTILS.elementTypes.SERVICE.toUpperCase() ) > -1:
                results.push( await create( UTILS.elementTypes.SERVICE, name ) );
                break;
            case taskList[counter].indexOf( UTILS.elementTypes.LIST.toUpperCase() ) > -1:
                results.push( await create( UTILS.elementTypes.LIST, name ) );
                break;
            case taskList[counter].indexOf( UTILS.elementTypes.DETAIL.toUpperCase() ) > -1:
                results.push( await create( UTILS.elementTypes.DETAIL, name ) );
                break;
        }
        if (counter + 1 === taskList.length) {
            return Promise.all(results);
        } else {
            parseTasks(name, taskList, ++counter, results);
        }
    } else {
        return Promise.resolve(true);
    }
}

/**
 * Adds ngClassName import in file and pushedElement or ngClassName to an array that matches the arrayPositionRegex pattern.
 * @param {string} ngClassName
 * @param {string} modulePath - Path of amended file.
 * @param {string} relativeClassPath - Relative path of ngClassName.
 * @param {RegExp} arrayPositionRegex - Position of target array.
 * @param {number} indent - The indentation of the element pushed to the array.
 * @param {string} [pushedElement] - Optional element to be pushed to array instead of ngClassName.
 * @returns {boolean}
 */
function addToModuleOrRouting(ngClassName, modulePath, relativeClassPath, arrayPositionRegex, indent = 4, pushedElement = null) {
    const moduleContent = fs.readFileSync(modulePath, 'utf8');
    if (moduleContent.includes(pushedElement || ngClassName)) {
        return false;
    }
    const endOfImportsRegex = ngClassName ? UTILS.REGEXS.endOfImports : null;
    const newContent = moduleContent
        .replace(endOfImportsRegex, (m, p1, p2, p3) => {
            return `${p1.trim()}\nimport {${ngClassName}} from '${relativeClassPath}';\n${p2.replace(/^\s+/,'')}\n${p3.replace(/^\s+/,'')}`;
        })
        .replace(arrayPositionRegex, match => {
            const lastChar = match.slice(-1).trim();
            return match.slice(0, -1).trim() + '\n'
                + ' '.repeat(indent) + (pushedElement || ngClassName)
                + ',\n' + (lastChar ? ' '.repeat(indent > 2 ? indent - 2 : 0) + lastChar : lastChar)
        });
    if (newContent) {
        fs.writeFileSync(modulePath, newContent, 'utf8');
    } else {
        return true;
    }
}

/**
 * Generates 3 files inside modules/<name>/models/ folder: <name>.ts, Server<name>.ts and <name>DataFactory.ts.
 * @param {string} name - Name of the model.
 * @returns {Promise<boolean>}
 */
function createModelFiles(name) {
    const nameLowerCase = name.toLowerCase();
    return new Promise(resolve => {
        mkdirp(`src/app/modules/${nameLowerCase}/models/`, (err) => {
            if (err) {
                resolve(false);
            } else {
                console.log(UTILS.dynamicTexts.createModel(name)[0]);
                const modelContent = TEMPLATES.modelTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const serverModelContent = TEMPLATES.serverModelTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const dataFactoryContent = TEMPLATES.dataFactoryTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                if (!modelContent || !serverModelContent || !dataFactoryContent) {
                    console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
                    resolve(false);
                }
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/models/${name}.ts`, modelContent, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/models/Server${name}.ts`, serverModelContent, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/models/${name}DataFactory.ts`, dataFactoryContent, 'utf-8');
                console.log(color(UTILS.staticTexts.modelCreated[0], UTILS.staticTexts.modelCreated[1]));
                resolve(true);
            }
        });
    });
}

/**
 * Generates the model's service file inside modules/<name>/service/ folder and provides the service in <name>.module.ts.
 * @param {string} name - Name of the model.
 * @returns {Promise<boolean>}
 */
function createServiceFiles(name) {
    const nameLowerCase = name.toLowerCase();
    return new Promise(resolve => {
        mkdirp(`src/app/modules/${nameLowerCase}/service/`, (err) => {
            if (err) {
                resolve(false);
            } else {
                console.log(UTILS.dynamicTexts.createService(name)[0]);
                const serviceFileRelative = `service/${nameLowerCase}.service`;
                const serviceContent = TEMPLATES.serviceTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                if (!serviceContent) {
                    console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
                    resolve(false);
                }
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/service/${nameLowerCase}.service.ts`, serviceContent, 'utf-8');
                addToModuleOrRouting(name + 'Service', `src/app/modules/${nameLowerCase}/${nameLowerCase}.module.ts`, './' + serviceFileRelative, /providers\: \[[\w\s\n\,]*\]/m);
                console.log(color(UTILS.staticTexts.serviceCreated[0], UTILS.staticTexts.serviceCreated[1]));
                resolve(true);
            }
        });
    });
}

/**
 * Generates the model's detail files inside modules/<name>/<name>-detail/ folder, imports the detail component in <name>.module.ts and adds the detail route to <name>.routing.ts.
 * @param {string} name - Name of the model.
 * @returns {Promise<boolean>}
 */
function createDetailFiles(name) {
    const nameLowerCase = name.toLowerCase();
    return new Promise(resolve => {
        mkdirp(`src/app/modules/${nameLowerCase}/${nameLowerCase}-detail/`, (err) => {
            if (err) {
                resolve(false);
            } else {
                console.log(UTILS.dynamicTexts.createDetail(name)[0]);
                const detailFileRelative = `${nameLowerCase}-detail/${nameLowerCase}-detail.component`;
                const detailTScontent = TEMPLATES.componentDetailViewModelTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const detailHTMLcontent = TEMPLATES.componentDetailViewTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const detailSCSScontent = TEMPLATES.componentDetailStyleTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                if (!detailTScontent || !detailHTMLcontent || !detailSCSScontent) {
                    console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
                    resolve(false);
                }
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${detailFileRelative}.ts`, detailTScontent, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${detailFileRelative}.html`, detailHTMLcontent, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${detailFileRelative}.scss`, detailSCSScontent, 'utf-8');
                addToModuleOrRouting(name + 'DetailComponent',
                    `src/app/modules/${nameLowerCase}/${nameLowerCase}.module.ts`,
                    './' + detailFileRelative,
                    /(declarations|exports): \[[\w\s\n\,]*\]/gm);
                addToModuleOrRouting(name + 'DetailComponent',
                    `src/app/modules/${nameLowerCase}/${nameLowerCase}.routing.ts`,
                    `./${detailFileRelative}`,
                    /component\: PlatformLayoutComponent\,(?:(?:.|\s)*?)children:\s*\[(?:\s|.)/m, 8,
                    `{\n${' '.repeat(10)}canActivate: [AdminGuard],\n${' '.repeat(10)}path: '${nameLowerCase}/:id',\n${' '.repeat(10)}component: ${name}DetailComponent\n${' '.repeat(8)}}`);
                console.log(color(UTILS.staticTexts.detailCreated[0], UTILS.staticTexts.detailCreated[1]));
                resolve(true);
            };
        });
    });
}

/**
 * Generates the model's list files inside modules/<name>/<name>-list/ folder, imports the list component in <name>.module.ts and adds the list routes to <name>.routing.ts and @core/sidebar/sidebar-routes.config.ts.
 * @param {string} name - Name of the model.
 * @returns {Promise<boolean>}
 */
function createListFiles(name) {
    const nameLowerCase = name.toLowerCase();
    return new Promise(resolve => {
        mkdirp(`src/app/modules/${nameLowerCase}/${nameLowerCase}-list/`, (err) => {
            if (err) {
                resolve(false);
            } else {
                console.log(UTILS.dynamicTexts.createList(name)[0]);
                const listFileRelative = `${nameLowerCase}-list/${nameLowerCase}-list.component`;
                const tsContent = TEMPLATES.componentListViewModelTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const htmlContent = TEMPLATES.componentListViewTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const scssContent = TEMPLATES.componentListStyleTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                if (!tsContent || !htmlContent || !scssContent) {
                    console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
                    resolve(false);
                }
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${listFileRelative}.ts`, content, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${listFileRelative}.html`, content, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${listFileRelative}.scss`, content, 'utf-8');
                let arrayPositionRegex = /(declarations|exports): \[[\w\s\n\,]*\]/gm;
                addToModuleOrRouting(name + 'ListComponent', `src/app/modules/${nameLowerCase}/${nameLowerCase}.module.ts`, './' + listFileRelative, arrayPositionRegex);
                addToModuleOrRouting(name + 'ListComponent',
                    `src/app/modules/${nameLowerCase}/${nameLowerCase}.routing.ts`,
                    `./${listFileRelative}`,
                    /component\: PlatformLayoutComponent\,(?:(?:.|\s)*?)children:\s*\[(?:\s|.)/m, 8,
                    `{\n${' '.repeat(10)}canActivate: [AdminGuard],\n${' '.repeat(10)}path: '${nameLowerCase}-list',\n${' '.repeat(10)}component: ${name}ListComponent\n${' '.repeat(8)}}`);
                prompt({
                    type: 'input',
                    name: 'iconName',
                    message: UTILS.dynamicTexts.provideIconForList(name)[0]
                }).then(res => {
                    let iconName = res['iconName'];
                    if (iconName === null || iconName.length === 0) {
                        console.log(color(UTILS.staticTexts.creatingListNoIcon[0], UTILS.staticTexts.creatingListNoIcon[1]));
                    } else if (!/^[a-z0-9]{2,}(?:_[a-z0-9]{2,})*$/.test(iconName)) {
                        console.log(color(UTILS.staticTexts.incorrectIcon[0], UTILS.staticTexts.incorrectIcon[1]));
                        iconName = 'web_asset';
                    } else {
                        console.log(color(`\nCreating list with ${iconName} icon...\n`, 'YELLOW'));
                    }
                    addToModuleOrRouting(null,
                        `src/app/modules/${nameLowerCase}/${nameLowerCase}.routing.ts`,
                        null,
                        /ModuleRouting = \{(?:(?:.|\s)*)\}/m, 2,
                        `routeInfo: {\n${' '.repeat(4)}path: '/${nameLowerCase}-list',\n${' '.repeat(4)}title: '${name} list',\n${' '.repeat(4)}icon: '${iconName}',\n${' '.repeat(4)}autorizedUsers: [UserRole.ADMIN]\n${' '.repeat(2)}}`);
                    addToModuleOrRouting(`${name.toUpperCase()}_ROUTING`,
                        'src/app/@core/sidebar/sidebar-routes.config.ts',
                        `../../modules/${nameLowerCase}/${nameLowerCase}.routing`,
                        /export const SIDEBAR_ROUTES: RouteInfo\[\] \= \[(?:(?:.|\s)*)\]/m, 2,
                        `${name.toUpperCase()}_ROUTING.routeInfo`);
                    console.log(color(UTILS.staticTexts.listCreated[0], UTILS.staticTexts.listCreated[1]));
                    resolve(true);
                });
            };
        });
    });
}

/**
 * Writes a new or overwrites old Mappable.ts model with passed primaryKey;
 * @returns {boolean}
 */
function createMappableFile() {
    const tsContent = TEMPLATES.mappableTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match));
    if (!tsContent) {
        console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
        return false;
    }
    fs.writeFileSync('src/app/@core/models/Mappable.ts', tsContent, 'utf-8');
    return true;
}

/**
 * Generates the model's corresponding module, routing and configuration files.
 * @param {string} name - Name of model.
 * @returns {boolean}
 */
function createModuleFiles(name) {
    const moduleContent = TEMPLATES.moduleTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
    const routingContent = TEMPLATES.moduleRoutingTemplate.replace(UTILS.REGEXS.fileTemplate, (_, match) => generateContent(match, name));
    if (!moduleContent || !routingContent) {
        console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
        return false;
    }
    fs.writeFileSync(`src/app/modules/${name.toLowerCase()}/${name.toLowerCase()}.module.ts`, content, 'utf-8');
    fs.writeFileSync(`src/app/modules/${name.toLowerCase()}/${name.toLowerCase()}.routing.ts`, routingContent, 'utf-8');
    fs.writeFileSync(`src/app/modules/${name.toLowerCase()}/${name.toLowerCase()}.conf.json`, TEMPLATES.configTemplate, 'utf-8');
    addToModuleOrRouting(name + 'Module',
        'src/app/modules/modules.module.ts',
        `./${name.toLowerCase()}/${name.toLowerCase()}.module`,
        /imports\: ?\[[\w\s\n\,\(\)\.]*\]/gm);
    return true;
}

/**
 * @param {elementTypes} elementType - Member of the elementTypes enum.
 * @param {string} name - Model name.
 * @param {elementTypes[]} taskList
 * @returns {Promise<boolean>}
 */
function createFiles(elementType, name, taskList) {
    console.log('\ncreating files for', elementType);
    const nameLowerCase = name.toLowerCase();
    switch(elementType) {
        case UTILS.elementTypes.MODEL:
            return createModelFiles(name).then( filesCreated => {
                if (filesCreated) {
                    if (!taskList) {
                        return prompt({
                            type: 'checkbox',
                            name: 'tasks',
                            message: UTILS.dynamicTexts.whichElementsForModel(name),
                            choices: [
                                `${UTILS.elementTypes.SERVICE.toUpperCase()} => src/app/modules/${nameLowerCase}/service/${nameLowerCase
                                    }.service.ts`,
                                `${UTILS.elementTypes.LIST.toUpperCase()} => src/app/modules/${nameLowerCase}/${nameLowerCase}-list`,
                                `${UTILS.elementTypes.DETAIL.toUpperCase()} => src/app/modules/${nameLowerCase}/${nameLowerCase}-detail`,
                            ],
                        }).then( async res => {
                            return await parseTasks(name, res['tasks']);
                        });
                    } else {
                        return parseTasks(name, taskList);
                    }
                } else {
                    return Promise.resolve(false);
                }
            });
        case UTILS.elementTypes.SERVICE:
            return createServiceFiles(name).then( filesCreated => filesCreated ? parseTasks(name, taskList) : Promise.resolve(false) );
        case UTILS.elementTypes.LIST:
            return createListFiles(name);
        case UTILS.elementTypes.DETAIL:
            return createDetailFiles(name);
    }
}

/**
 *
 * @param {elementTypes} elementType - Member of the elementTypes enum.
 * @param {string} [name] - Name of model.
 * @param {elementTypes[]} taskList - Array containing members of elementTypes enum.
 * @returns {Promise<boolean>}
 */
function create(elementType, name = null, taskList = null) {
    if (!config.selectedServer) {
        console.log(color(UTILS.staticTexts.notInitiated[0], UTILS.staticTexts.notInitiated[1]));
        return Promise.resolve(false);
    }
    return new Promise(async resolve => {
        const isValidName = UTILS.validateName(name);
        if (isValidName) {
            name = name[0].toUpperCase() + name.substr(1);
        }
        const { alreadyExists, moduleExists, modelAlreadyExists, serverModelAlreadyExists } = UTILS.checkAlreadyExist(elementType, name);
        let errorMsg;
        let createThisElementFirst;
        let promptName = 'newName';
        switch (true) {
            case !name:
                errorMsg = UTILS.staticTexts.provideName;
                break;
            case name.length < 3:
                errorMsg = UTILS.staticTexts.nameTooShort;
                break;
            case !isValidName:
                errorMsg = UTILS.staticTexts.nameIncorrect;
                break;
            case alreadyExists:
                errorMsg = UTILS.dynamicTexts.nameAlreadyExists(elementType);
                break;
            case elementType !== UTILS.elementTypes.MODEL && !modelAlreadyExists && !serverModelAlreadyExists:
                errorMsg = UTILS.dynamicTexts.nameModelNotFound(elementType, name, elementType === UTILS.elementTypes.SERVICE);
                promptName = 'choise';
                createThisElementFirst = UTILS.elementTypes.MODEL;
                taskList = elementType === UTILS.elementTypes.SERVICE ? [elementType.toUpperCase()] : [UTILS.elementTypes.SERVICE.toUpperCase(), elementType.toUpperCase()];
                break;
            case elementType === UTILS.elementTypes.DETAIL || elementType === UTILS.elementTypes.LIST:
                const serviceExists = UTILS.checkAlreadyExist(UTILS.elementTypes.SERVICE, name).alreadyExists;
                if (!serviceExists) {
                    errorMsg = UTILS.dynamicTexts.nameServiceNotFound(elementType, name);
                    promptName = 'choise';
                    createThisElementFirst = UTILS.elementTypes.SERVICE;
                    taskList = [elementType.toUpperCase()];
                }
                break;
        }
        if (errorMsg && errorMsg.length) {
            prompt({
                type: 'input',
                name: promptName,
                message: errorMsg[0],
            }).then(async res => {
                if (promptName === 'newName' && res['newName'] && res['newName'].length) {
                    resolve(await create(elementType, res['newName'], taskList));
                } else if (promptName === 'choise' && (!res["choise"] || res["choise"].toLowerCase()[0] === 'y')) {
                    console.log(UTILS.staticTexts.continuing[0]);
                    resolve(await create(createThisElementFirst, name, taskList));
                } else {
                    console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
                    resolve(false);
                }
            });
        } else {
            if (moduleExists) {
                const filesCreated = await createFiles(elementType, name, taskList);
                update(elementType, name, true);
                resolve(filesCreated);
            } else {
                mkdirp(`src/app/modules/${name.toLowerCase()}/`, async (err) => {
                    if (err) {
                        resolve(false);
                    } else {
                        createModuleFiles(name);
                        const filesCreated = await createFiles(elementType, name, taskList);
                        update(elementType, name, true);
                        resolve(filesCreated);
                    }
                });
            }
        }
    });
}

function deleteModel(name = null) {
    // TODO
    return false;
}

/**
 * Modifies content of a ServerModel file.
 * @param {string} filePath - Path of the ServerModel file.
 * @param {string} serverContent - Current content of the ServerModel file.
 * @param {*[]} newPropArray - Array of objects with data for latest model properties.
 * @param {string[]} [typesToImport] - Array of typescript type names found in newPropArray.
 * @param {*[]} [propMap] - Modified newPropArray array with custom 'name' properties of objects.
 */
function writeNewServerContent(filePath, serverContent, newPropArray = [], typesToImport = null, propMap = null) {
    const primaryKeyList = UTILS.getPrimaryKeysList(UTILS.elementTypes.SERVER_MODEL, config.primaryKey);
    const propArray = primaryKeyList.concat(newPropArray);
    if (propMap) {
        propMap.unshift.apply(propMap, primaryKeyList);
    }
    const newServerContent = serverContent
        .replace(UTILS.REGEXS.endOfImports, (m, p1, p2, p3) => typesToImport && typesToImport.length ? `${p1.replace(/\s+$/m, '')}\n\/\/ TODO verify the following imports: ${typesToImport.join(', ')};\n\n${p3.replace(/^\s+/m, '')}` : p1.trim() + '\n\n' + p3)
        .replace(UTILS.REGEXS.modelPropDeclarations, (m, p1, p2, p3) => {
            const currPropDeclarationsArray = (p3 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
            return p1.trim() + '\n' + propArray.map( (prop, i) => {
                    const userPropName = propMap ? propMap[i].name : false;
                    if (!prop.skipUpdate) {
                        return `  ${userPropName || prop.serverName || prop.name}${prop.optional && !prop.hasOwnProperty('value') ? '?' : ''}${prop.type && !prop.hasOwnProperty('value') ? ': ' + prop.type : ''}${prop.hasOwnProperty('value') ? ' = ' + JSON.stringify(prop.value) : ''}`
                    } else {
                        const skippedProp = currPropDeclarationsArray.filter(el => (new RegExp(`^\\s*${prop.name}[?:]`)).test(el))[0];
                        return skippedProp ? '  ' + skippedProp.trim().replace(/;*$/, '') : '';
                    }
                }).filter(newPropDeclaration => newPropDeclaration.length).join(';\n')
                + ';';
        })
        .replace(UTILS.REGEXS.serverModelMapMethods, (m, p1, p2, p3, p4, p5) => (
            p1 + '\n' + ' '.repeat(4)
            + primaryKeyList.map( (prop, i) => {
            return p2 === 'mapReverse'
                ? `    ${p4}.${prop.mapReverseName || prop.name} = typeof ${p3}.${prop.mapReverseRelationship || prop.serverName || prop.name} !== 'undefined' ? ${p3}.${prop.mapReverseRelationship || prop.serverName || prop.name} : ${prop.hasOwnProperty('value') ? JSON.stringify(prop.value) : null}`
                : `    ${p4}.${prop.serverName || prop.name} = typeof ${p3}.${prop.relationship || prop.name} !== 'undefined' ? ${p3}.${prop.relationship || prop.name} : ${prop.hasOwnProperty('value') ? JSON.stringify(prop.value) : null}`;
            }) + ';'
        ))
        .replace(UTILS.REGEXS.serverModelAttrGetters, (m, p1, p2, p3) => (
            p1 + newPropArray
                .filter( el => p2 === 'getMappedAttribute' ? el.hasOwnProperty('map') : el.hasOwnProperty('mapReverse') )
                .map( el => `\n${' '.repeat(12)}case '${el.name}':\n${' '.repeat(16)}return ${el.map || el.mapReverse}`)
        ));
    if (!newServerContent) {
        console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
        return false;
    }
    fs.writeFileSync(filePath, newServerContent);
}

/**
 * Modifies content of a Model file.
 * @param {string} filePath - Path of the Model file.
 * @param {string} currentContent - Current content of the Model file.
 * @param {*[]} newPropArray - Array of objects with data for latest model properties.
 * @param {string[]} [typesToImport = null] - Array of typescript type names found in newPropArray.
 */
function writeNewModelContent(filePath, currentContent, newPropArray = [], typesToImport = null) {
    const primaryKeyList = UTILS.getPrimaryKeysList(UTILS.elementTypes.MODEL, config.primaryKey);
    const propArray = primaryKeyList.concat(newPropArray);
    const newContent = currentContent
        .replace(UTILS.REGEXS.endOfImports, (m, p1, p2, p3) => typesToImport && typesToImport.length ? `${p1.trim()}\n\/\/ TODO verify the following imports: ${typesToImport.join(', ')};\n\n${p3.replace(/^\s+/m, '')}` : p1.trim() + '\n\n' + p3)
        .replace(UTILS.REGEXS.modelPropDeclarations, (m, p1, p2, p3) => {
            const currPropDeclarationsArray = (p3 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
            return p1.trim() + '\n' + propArray.map( prop => {
                if (!prop.skipUpdate) {
                    return `  ${prop.name}${prop.optional && !prop.hasOwnProperty('value') ? '?' : ''}${prop.type && !prop.hasOwnProperty('value') ? ': ' + prop.type : ''}${prop.hasOwnProperty('value') ? ' = ' + JSON.stringify(prop.value) : ''}`
                } else {
                    const skippedProp = currPropDeclarationsArray.filter(el => (new RegExp(`^\\s*${prop.name}[?:]`)).test(el))[0];
                    return skippedProp ? '  ' + skippedProp.trim().replace(/;*$/, '') : '';
                }
            }).filter(newPropDeclaration => newPropDeclaration.length).join(';\n') + ';';
        })
        .replace(UTILS.REGEXS.modelConstructor, (_, p1, p2, p3, p4, p5, p6) => {
            const currConstructorArgs = (p3 + ',\n').match(/^\s*.+,[\r\n]/gm) || [];
            const currConstructorDeclarations = (p6 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
            return p1 + propArray.map( prop => {
                    if (typeof prop.relationship === 'string') {
                        return '';
                    } else if (!prop.skipUpdate) {
                        return `${prop.name}?${prop.type && !prop.hasOwnProperty('value') ? ': ' + prop.type : ''}`;
                    } else {
                        const skippedProp = currConstructorArgs.filter(el => (new RegExp(`^\\s*${prop.name}[?:]`)).test(el))[0];
                        return skippedProp ? skippedProp.trim().replace(/,*$/, '') : '';
                    }
                }).filter(newPropDeclaration => newPropDeclaration.length).join(',\n' + ' '.repeat(14))
                + p4 + propArray.map( prop => {
                    if (!prop.skipUpdate) {
                        return `this.${prop.name} = typeof ${prop.relationship || prop.name} !== 'undefined' ? ${prop.relationship || prop.name} : ${prop.hasOwnProperty('value') ? JSON.stringify(prop.value) : 'null'}`;
                    } else {
                        const skippedProp = currConstructorDeclarations.filter(el => (new RegExp(`^\\s*this.${prop.name}`)).test(el))[0];
                        return skippedProp ? skippedProp.trim().replace(/;*$/, '') : '';
                    }
                }).filter(newPropDeclaration => newPropDeclaration && newPropDeclaration.length).join(';\n' + ' '.repeat(4)) + ';';
        });
    if (!newContent) {
        console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
        return false;
    }
    fs.writeFileSync(filePath, newContent);
}

/**
 * Modifies the content of the Model's data factory file.
 * @param {string} filePath - Path of the Model file.
 * @param {string} currentContent - Current content of the Model file.
 * @param {*[]} newPropArray - Array of objects with data for latest model properties.
 */
function writeNewDataFactoryContent(filePath, currentContent, newPropArray = []) {
    const typesToImport = UTILS.getTypesToImport(newPropArray, '', /^\b[A-Z]\w*\b/);
    const primaryKeyList = UTILS.getPrimaryKeysList(UTILS.elementTypes.DATA_FACTORY, config.primaryKey);
    const propArray = primaryKeyList.concat(newPropArray);
    const newContent = currentContent
        .replace(UTILS.REGEXS.endOfImports, (m, p1, p2, p3) => typesToImport && typesToImport.length ? `${p1.replace(/\s+$/m, '')}\n\/\/ TODO verify the following imports: ${typesToImport.join(', ')};\n\n${p3.replace(/^\s+/m, '')}` : p1.trim() + '\n\n' + p3)
        .replace(UTILS.REGEXS.formControlList, (_, p1, p2, p3) => propArray && propArray.length ? (
            p1 + '\n' + ' '.repeat(6)
            + propArray.map( prop => '{' + Object.keys(prop).map( k => `${k}: ${prop[k]}` ).join(', ') + '}' )
                       .join(',\n' + ' '.repeat(6))
            + '\n' + ' '.repeat(4) + p3
        ): p1 + p3);
    if (!newContent) {
        console.log(color(UTILS.staticTexts.aborting[0], UTILS.staticTexts.aborting[1]));
        return false;
    }
    fs.writeFileSync(filePath, newContent);
}

/**
 * Implements the logic related to updating a Model file.
 * @param {string} name - Model name.
 * @param {{properties: any[], any}} moduleConfig
 * @param {boolean} [runSilent = false] - Run update without command line output.
 * @returns {Promise<boolean>}
 */
function updateModel(name, moduleConfig, runSilent = false) {
    return new Promise(resolve => {
        if (!runSilent) {
            console.log(color(UTILS.dynamicTexts.updating(UTILS.elementTypes.MODEL, name)[0], UTILS.dynamicTexts.updating(UTILS.elementTypes.MODEL, name)[1]));
        }
        const {modelPath, serverModelPath} = UTILS.getModulePaths(name, true);
        fs.readFile(modelPath, 'utf8', (err, currentContent) => {
            if (err) {
                return resolve(false)
            }
            const typesToImport = UTILS.getTypesToImport(moduleConfig['properties'], 'type');
            const successText = UTILS.dynamicTexts.updateSuccess(name, typesToImport);
            writeNewModelContent(modelPath, currentContent, moduleConfig['properties'], typesToImport);
            fs.readFile(serverModelPath, 'utf8', (err1, serverContent) => {
                if (err1) {
                    return resolve(false);
                }
                if (runSilent) {
                    writeNewServerContent(serverModelPath, serverContent, moduleConfig['properties'], typesToImport);
                    return resolve(true);
                }
                if (moduleConfig['properties'].length === 0) {
                    writeNewServerContent(serverModelPath, serverContent, []);
                    console.log(color(successText[0], successText[1]));
                    return resolve(true);
                }
                prompt({
                    type: 'list',
                    name: 'serverPropMapping',
                    message: UTILS.dynamicTexts.updateMethod(name)[0],
                    choices: ['automatic', 'manual']
                }).then(res => {
                    switch (res['serverPropMapping']) {
                        case 'automatic':
                            writeNewServerContent(serverModelPath, serverContent, moduleConfig['properties'], typesToImport);
                            console.log(color(successText[0], successText[1]));
                            return resolve(true);
                        case 'manual':
                            const questions = moduleConfig['properties'].map(el => ({
                                type: 'input',
                                name: el.name,
                                message: el.name + ': '
                            }));
                            prompt(questions).then(res => {
                                // IMPORTANT: res is an object with keys matching newPropArray prop names
                                const userPropMap = UTILS.getUserPropMap(res, moduleConfig['properties']);
                                writeNewServerContent(serverModelPath, serverContent, moduleConfig['properties'], typesToImport, userPropMap);
                                console.log(color(successText[0], successText[1]));
                                return resolve(true);
                            });
                    }
                });
            });
        });
    });
}

/**
 * Implements the logic related to adding new properties to the model's detail.
 * @param {string} name - Model name.
 * @param {{properties: any[], any}} moduleConfig
 * @param {boolean} [runSilent = false] - Run update without command line output.
 * @returns {Promise<boolean>}
 */
function updateDetail(name, moduleConfig, runSilent = false) {
    return new Promise(resolve => {
        if (!runSilent) {
            console.log(color(UTILS.dynamicTexts.updating(name, UTILS.elementTypes.DETAIL)[0], UTILS.dynamicTexts.updating(name, UTILS.elementTypes.DETAIL)[1]));
        }
        const {dataFactoryPath} = UTILS.getModulePaths(name, true);
        const formControlList = moduleConfig['properties']
            .filter( el => el.hasOwnProperty('htmlConfig') && !el.skipUpdate )
            .map( el => {
              let formControl = {name: `'${el.name}'`, type: 'FormControlType.TEXT', ...el.htmlConfig};
              formControl.primaryKey = el.primaryKey;
              return formControl;
            });
        fs.readFile(dataFactoryPath, 'utf8', (err, dataFactoryContent) => {
            if (err) {
                return resolve(false)
            }
            writeNewDataFactoryContent(dataFactoryPath, dataFactoryContent, formControlList);
            if (!runSilent) {
                console.log(color(UTILS.staticTexts.detailUpdated[0], UTILS.staticTexts.detailUpdated[1]));
            }
            return resolve(true)
        });
    });
}

/**
 * Handles the initial logic related to updating elements.
 * @param {elementTypes} elementType - Member of the elementTypes enum.
 * @param {string} name - Model name.
 * @param {boolean} [runSilent = false] - Run update without command line output.
 * @returns {boolean}
 */
async function update(elementType, name, runSilent = false) {
    const {modelAlreadyExists, serverModelAlreadyExists, detailAlreadyExist} = UTILS.checkAlreadyExist(null, name);
    if (UTILS.nonUpdateableModels.includes(name.toLowerCase())) {
        console.log(color(UTILS.dynamicTexts.nonUpdateableModel(name)[0], UTILS.dynamicTexts.nonUpdateableModel(name)[1]));
        return false;
    }
    if (!modelAlreadyExists) {
        console.log(color(UTILS.dynamicTexts.updateModelNotFound(name)[0], UTILS.dynamicTexts.updateModelNotFound(name)[1]));
        return false;
    }
    if (!serverModelAlreadyExists) {
        console.log(color(UTILS.dynamicTexts.updateServerModelNotFound(name)[0], UTILS.dynamicTexts.updateServerModelNotFound(name)[1]));
        return false;
    }
    const moduleConfig = require(process.cwd() + '/' + UTILS.getModulePaths(name).config);
    const moduleProperties = moduleConfig['properties'];
    if (moduleProperties && moduleProperties.length > 1) {
        const duplicateNamesList = UTILS.getDuplicateValuesByPropName(moduleProperties, 'name');
        if (duplicateNamesList && duplicateNamesList.length) {
            console.log(color(UTILS.dynamicTexts.duplicatePropNamesFound('name', duplicateNamesList)[0], UTILS.dynamicTexts.duplicatePropNamesFound('name', duplicateNamesList)[1]));
            return false;
        }
    }
    name = name[0].toUpperCase() + name.substr(1);
    switch (elementType) {
        case UTILS.elementTypes.MODEL:
            const modelUpdated = await updateModel(name, moduleConfig, runSilent);
            if (modelUpdated && detailAlreadyExist) {
                update(UTILS.elementTypes.DETAIL, name, runSilent);
            } else {
                return;
            }
            break;
        case UTILS.elementTypes.DETAIL:
            if (!detailAlreadyExist) {
                console.log(color(UTILS.dynamicTexts.detailNotFound(name)[0], UTILS.dynamicTexts.detailNotFound(name)[1]));
                return;
            }
            return await updateDetail(name, moduleConfig, runSilent);
        default:
            return;
    }
}

async function cloneRepo() {
    return new Promise(async resolve => {
        console.log(color(UTILS.staticTexts.cloning[0], UTILS.staticTexts.cloning[1]));

        function onError(e) {
            console.log(e);
            resolve(false);
        }
        fsExtra.copy(`${__dirname}/resources/templates/project_template`, './', err => {
            if (err) {
                onError(err)
            }
            console.log(color(UTILS.staticTexts.cloned[0], UTILS.staticTexts.cloned[1]));
            resolve(true);
        })
    });
}

async function configure() {
    return new Promise(async resolve => {
        const fileToCheck = 'src/environments/environment.ts';
        if (!fs.existsSync(fileToCheck)) {
            const serverTypePrompt = {
                type: 'list',
                name: 'serverType',
                message: UTILS.staticTexts.selectServer[0],
                choices: ['strapi', 'firestore']
            };
            const primaryKeyPrompt = {
                type: 'input',
                name: 'primaryKey',
                transformer: val => val.replace(/[^\w]/g, ''),
                message: '[optional] Provide custom primary key (min. 2 characters) which will be used for all models or leave empty to use default key:'
            };
            prompt([serverTypePrompt, primaryKeyPrompt]).then(async (res) => {
                console.log(color(UTILS.dynamicTexts.configuring(res['serverType'])[0], UTILS.dynamicTexts.configuring(res['serverType'])[1]));
                config.selectedServer = res["serverType"];
                if (res['primaryKey'] && res['primaryKey'].replace(/[^\w]/g, '').length >= 2) {
                    config.primaryKey = res['primaryKey'].replace(/[^\w]/g, '');
                } else {
                    console.log(color(UTILS.staticTexts.invalidPrimaryKey[0], UTILS.staticTexts.invalidPrimaryKey[1]));
                    config.primaryKey = 'id';
                }
                const newConfigContent = JSON.stringify(config, null, 4);
                fs.writeFileSync('./winkit.conf.json', newConfigContent);
                fs.writeFileSync('./.winkitrc', `v${version}`);
                createMappableFile();
                Promise.all([
                    new Promise((resolve1, reject1) => {
                        gulp.src(['implementableServers/' + res["serverType"] + '/services/**/*'])
                            .pipe(gulp.dest('src/app/@core/services/'))
                            .on('error', reject1)
                            .on('end', resolve1);
                    }),
                    new Promise((resolve2, reject2) => {
                        gulp.src(['implementableServers/' + res["serverType"] + '/environments/**/*'])
                            .pipe(gulp.dest('src/environments/'))
                            .on('error', reject2)
                            .on('end', resolve2);
                    }),
                    new Promise((resolve3, reject3) => {
                        gulp.src(['implementableServers/' + res["serverType"] + '/user/**/*'])
                            .pipe(gulp.dest('src/app/modules/user/service/'))
                            .on('error', reject3)
                            .on('end', resolve3);
                    }),
                    new Promise((resolve4, reject4) => {
                        gulp.src(['implementableServers/' + res["serverType"] + '/media-manager/**/*'])
                            .pipe(gulp.dest('src/app/shared/components/media-manager/'))
                            .on('error', reject4)
                            .on('end', resolve4);
                    })
                ]).then(() => {
                    del.sync(['implementableServers/**']);
                    update(UTILS.elementTypes.MODEL, 'user', true);
                    console.log(color(UTILS.staticTexts.configured[0], UTILS.staticTexts.configured[1]));
                    console.log(color(UTILS.staticTexts.enjoy[0], UTILS.staticTexts.enjoy[1]));
                    gulp.src('./package.json', {read: false})
                        .pipe(shell([
                            'npm run firstRun'
                        ]))
                        .on('end', () => {
                            resolve(true);
                        })
                        .on('error', () => {
                            resolve(false);
                        });
                });
            });
        } else {
            console.log(color(UTILS.staticTexts.alreadyInitialized[0], UTILS.staticTexts.alreadyInitialized[1]));
            resolve(false);
        }
    });
}

async function init(projectName) {
    return new Promise(async (resolve, reject) => {
        const fileToCheck = projectName + '/src/main.ts';
        if (!fs.existsSync(fileToCheck)) {
            mkdirp(projectName, async (err) => {
                if (err) {
                    resolve(false);
                } else {
                    process.chdir(`${projectName}/`);
                    const res = await cloneRepo();
                    if (res) {
                        resolve(await configure());
                    } else {
                        resolve(false);
                    }
                }
            });
        } else {
            console.log(color(UTILS.staticTexts.alreadyCloned[0], UTILS.staticTexts.alreadyCloned[1]));
            resolve(await configure());
        }
    });
}

gulp.task('init', async () => {
    return await init();
});

gulp.task('create:model', async () => {
    return await create(UTILS.elementTypes.MODEL, null);
});

gulp.task('update:model', async () => {
    return await update(UTILS.elementTypes.MODEL, null);
});

gulp.task('create:service', async () => {
    return await create(UTILS.elementTypes.SERVICE, null);
});

gulp.task('create:detail', async () => {
    return await create(UTILS.elementTypes.DETAIL, null);
});

gulp.task('create:list', async () => {
    return await create(UTILS.elementTypes.LIST, null);
});

gulp.task('delete:model', async () => {
    return await deleteModel(null);
});


// Export all methods
module.exports = {
    init: init,
    createModel: (name) => create(UTILS.elementTypes.MODEL, name),
    createService: (name) => create(UTILS.elementTypes.SERVICE, name),
    createList: (name) => create(UTILS.elementTypes.LIST, name),
    createDetail: (name) => create(UTILS.elementTypes.DETAIL, name),
    updateModel: (name) => update(UTILS.elementTypes.MODEL, name),
    updateDetail: (name) => update(UTILS.elementTypes.DETAIL, name),
    deleteModel: (name) => deleteModel(name)
};
