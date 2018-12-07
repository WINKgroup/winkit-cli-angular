'use strict';
const gulp = require('gulp');
const prompt = require('inquirer').createPromptModule();
const fs = require('fs');
const color = require('gulp-color');
const mkdirp = require('mkdirp');
const git = require('gulp-git');
const del = require('del');
const deleteLines = require('gulp-delete-lines');
const shell = require('gulp-shell');

const { modelTemplate, serverModelTemplate, serviceTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate, componentDetailStyleTemplate, componentListViewModelTemplate, componentListViewTemplate, componentListStyleTemplate, windowKeyList, moduleTemplate, REGEXS, validateName, getModulePaths, elementTypes, checkAlreadyExist, staticTexts, dynamicTexts, nonUpdateableModels, configTemplate, moduleRoutingTemplate, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, dataFactoryTemplate
} = require('./resources/index');

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
function generateContent(match, name) {
    const dataArr = match.split(',');
    const firstElArr = dataArr[0].split('.');
    switch (firstElArr[0]) {
        case 'eval':
            return eval(dataArr[1]);
        case 'path.relative':
            return dataArr[2] === 'correspondingModelPath' ? './../server/models/Server' + name : './interface/Mappable';
        case 'selectedServer':
            return config.selectedServer === dataArr[1] ? dataArr[2] : dataArr[3];
        case 'ThisName':
            if (firstElArr[1]) {
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
 * @returns {Promise<boolean>}
 */
async function parseTasks(name, taskList, counter = 0, results = []) {
    if (taskList && taskList.length) {
      switch(true) {
        case taskList[counter].indexOf( elementTypes.SERVICE.toUpperCase() ) > -1:
          results.push( await create( elementTypes.SERVICE, name ) );
          break;
        case taskList[counter].indexOf( elementTypes.LIST.toUpperCase() ) > -1:
          results.push( await create( elementTypes.LIST, name ) );
          break;
        case taskList[counter].indexOf( elementTypes.DETAIL.toUpperCase() ) > -1:
          results.push( await create( elementTypes.DETAIL, name ) );
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
    const endOfImportsRegex = ngClassName ? REGEXS.endOfImports : null;
    const newContent = moduleContent.replace(endOfImportsRegex, (m, p1, p2, p3) => `${p1.trim()}\nimport {${ngClassName}} from '${relativeClassPath}';\n${p2.replace(/^\s+/,'')}\n${p3.replace(/^\s+/,'')}`)
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
                console.log(dynamicTexts.createModel(name)[0]);
                const modelContent = modelTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const serverModelContent = serverModelTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                const dataFactoryContent = dataFactoryTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/models/${name}.ts`, modelContent, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/models/Server${name}.ts`, serverModelContent, 'utf-8');
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/models/${name}DataFactory.ts`, dataFactoryContent, 'utf-8');
                console.log(color(staticTexts.modelCreated[0], staticTexts.modelCreated[1]));
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
                console.log(dynamicTexts.createService(name)[0]);
                const serviceFileRelative = `service/${nameLowerCase}.service`;
                const serviceContent = serviceTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/service/${nameLowerCase}.service.ts`, serviceContent, 'utf-8');
                addToModuleOrRouting(name + 'Service', `src/app/modules/${nameLowerCase}/${nameLowerCase}.module.ts`, './' + serviceFileRelative, /providers\: \[[\w\s\n\,]*\]/m);
                console.log(color(staticTexts.serviceCreated[0], staticTexts.serviceCreated[1]));
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
          console.log(dynamicTexts.createDetail(name)[0]);
          const detailFileRelative = `${nameLowerCase}-detail/${nameLowerCase}-detail.component`;
          let content = componentDetailViewModelTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
          fs.writeFileSync(`src/app/modules/${nameLowerCase}/${detailFileRelative}.ts`, content, 'utf-8');
          content = componentDetailViewTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
          fs.writeFileSync(`src/app/modules/${nameLowerCase}/${detailFileRelative}.html`, content, 'utf-8');
          content = componentDetailStyleTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
          fs.writeFileSync(`src/app/modules/${nameLowerCase}/${detailFileRelative}.scss`, content, 'utf-8');
          addToModuleOrRouting(name + 'DetailComponent',
                               `src/app/modules/${nameLowerCase}/${nameLowerCase}.module.ts`,
                               './' + detailFileRelative,
                               /(declarations|exports): \[[\w\s\n\,]*\]/gm);
          addToModuleOrRouting(name + 'DetailComponent',
                               `src/app/modules/${nameLowerCase}/${nameLowerCase}.routing.ts`,
                               `./${detailFileRelative}`,
                               /component\: PlatformLayoutComponent\,(?:(?:.|\s)*?)children:\s*\[(?:\s|.)/m, 8,
                               `{\n${' '.repeat(10)}canActivate: [AdminGuard],\n${' '.repeat(10)}path: '${nameLowerCase}/:id',\n${' '.repeat(10)}component: ${name}DetailComponent\n${' '.repeat(8)}}`);
          console.log(color(staticTexts.detailCreated[0], staticTexts.detailCreated[1]));
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
                console.log(dynamicTexts.createList(name)[0]);
                const listFileRelative = `${nameLowerCase}-list/${nameLowerCase}-list.component`;
                let content = componentListViewModelTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${listFileRelative}.ts`, content, 'utf-8');
                content = componentListViewTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
                fs.writeFileSync(`src/app/modules/${nameLowerCase}/${listFileRelative}.html`, content, 'utf-8');
                content = componentListStyleTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
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
                    message: dynamicTexts.provideIconForList(name)[0]
                }).then(res => {
                    let iconName = res['iconName'];
                    if (iconName === null || iconName.length === 0) {
                        console.log(color(staticTexts.creatingListNoIcon[0], staticTexts.creatingListNoIcon[1]));
                    } else if (!/^[a-z0-9]{2,}(?:_[a-z0-9]{2,})*$/.test(iconName)) {
                        console.log(color(staticTexts.incorrectIcon[0], staticTexts.incorrectIcon[1]));
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
                    console.log(color(staticTexts.listCreated[0], staticTexts.listCreated[1]));
                    resolve(true);
                });
            };
        });
    });
}

/**
 * Generates the model's corresponding module, routing and configuration files.
 * @param {string} name - Name of model.
 * @returns {boolean}
 */
function createModuleFiles(name) {
    const content = moduleTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
    fs.writeFileSync(`src/app/modules/${name.toLowerCase()}/${name.toLowerCase()}.module.ts`, content, 'utf-8');
    const routingContent = moduleRoutingTemplate.replace(REGEXS.fileTemplate, (_, match) => generateContent(match, name));
    fs.writeFileSync(`src/app/modules/${name.toLowerCase()}/${name.toLowerCase()}.routing.ts`, routingContent, 'utf-8');
    fs.writeFileSync(`src/app/modules/${name.toLowerCase()}/${name.toLowerCase()}.conf.json`, configTemplate, 'utf-8');
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
      case elementTypes.MODEL:
        return createModelFiles(name).then( filesCreated => {
          if (filesCreated) {
            if (!taskList) {
              return prompt({
                  type: 'checkbox',
                  name: 'tasks',
                  message: dynamicTexts.whichElementsForModel(name),
                  choices: [
                    `${elementTypes.SERVICE.toUpperCase()} => src/app/modules/${nameLowerCase}/service/${nameLowerCase
                  }.service.ts`,
                    `${elementTypes.LIST.toUpperCase()} => src/app/modules/${nameLowerCase}/${nameLowerCase}-list`,
                    `${elementTypes.DETAIL.toUpperCase()} => src/app/modules/${nameLowerCase}/${nameLowerCase}-detail`,
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
      case elementTypes.SERVICE:
        return createServiceFiles(name).then( filesCreated => filesCreated ? parseTasks(name, taskList) : Promise.resolve(false) );
      case elementTypes.LIST:
        return createListFiles(name);
      case elementTypes.DETAIL:
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
        console.log(color(staticTexts.notInitiated[0], staticTexts.notInitiated[1]));
        return Promise.resolve(false);
    }
    return new Promise(async resolve => {
        const isValidName = validateName(name);
        if (isValidName) {
            name = name[0].toUpperCase() + name.substr(1);
        }
        const { alreadyExists, moduleExists, modelAlreadyExists, serverModelAlreadyExists } = checkAlreadyExist(elementType, name);
        let errorMsg;
        let createThisElementFirst;
        let promptName = 'newName';
        switch (true) {
            case !name:
                errorMsg = staticTexts.provideName;
                break;
            case name.length < 3:
                errorMsg = staticTexts.nameTooShort;
                break;
            case !isValidName:
                errorMsg = staticTexts.nameIncorrect;
                break;
            case alreadyExists:
                errorMsg = dynamicTexts.nameAlreadyExists(elementType);
                break;
            case elementType !== elementTypes.MODEL && !modelAlreadyExists && !serverModelAlreadyExists:
                errorMsg = dynamicTexts.nameModelNotFound(elementType, name, elementType === elementTypes.SERVICE);
                promptName = 'choise';
                createThisElementFirst = elementTypes.MODEL;
                taskList = elementType === elementTypes.SERVICE ? [elementType.toUpperCase()] : [elementTypes.SERVICE.toUpperCase(), elementType.toUpperCase()];
                break;
            case elementType === elementTypes.DETAIL || elementType === elementTypes.LIST:
                const serviceExists = checkAlreadyExist(elementTypes.SERVICE, name).alreadyExists;
                if (!serviceExists) {
                    errorMsg = dynamicTexts.nameServiceNotFound(elementType, name);
                    promptName = 'choise';
                    createThisElementFirst = elementTypes.SERVICE;
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
                    console.log(staticTexts.continuing[0]);
                    resolve(await create(createThisElementFirst, name, taskList));
                } else {
                    console.log(color(staticTexts.aborting[0], staticTexts.aborting[1]));
                    resolve(false);
                }
            });
        } else {
            if (moduleExists) {
                const filesCreated = await createFiles(elementType, name, taskList);
                resolve(filesCreated);
            } else {
                mkdirp(`src/app/modules/${name.toLowerCase()}/`, async (err) => {
                    if (err) {
                        resolve(false);
                    } else {
                        createModuleFiles(name);
                        const filesCreated = await createFiles(elementType, name, taskList);
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
function writeNewServerContent(filePath, serverContent, newPropArray, typesToImport, propMap = null) {
    // console.log('writeNewServerContent', typesToImport)
    const newServerContent = serverContent
        .replace(REGEXS.endOfImports, (m, p1, p2, p3) => typesToImport && typesToImport.length ? `${p1.replace(/\s+$/m, '')}\n\/\/ TODO verify the following imports: ${typesToImport.join(', ')};\n\n${p3.replace(/^\s+/m, '')}` : p1.trim() + '\n\n' + p3)
        .replace(REGEXS.modelPropDeclarations, (m, p1, p2) => {
            const currPropDeclarationsArray = (p2 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
            if (newPropArray && newPropArray.length) {
                return p1 + '\n' + (propMap || newPropArray).map( (prop, i) => {
                    if (!prop.skipUpdate) {
                        return `  ${prop.name || newPropArray[i].name}${prop.optional && !prop.value ? '?' : ''}${prop.type && !prop.value ? ': ' + prop.type : ''}${prop.value ? ' = ' + prop.value : ''}`
                    } else {
                        const skippedProp = currPropDeclarationsArray.filter(el => (new RegExp(`^\\s*${prop.name}[?:]`)).test(el))[0];
                        return skippedProp ? '  ' + skippedProp.trim().replace(/;*$/, '') : '';
                    }
                }).filter(newPropDeclaration => newPropDeclaration.length).join(';\n')
            + ';';
            } else {
                return p1
            }})
        .replace(REGEXS.serverModelMapMethods, (m, p1, p2, p3, p4, p5) => newPropArray && newPropArray.length ? (
            p1 + '\n' + ' '.repeat(4)
                + newPropArray.map( (prop, i) => {
                        const userPropName = propMap ? propMap[i].name : false;
                        const currPropInitializationsArray = (p5 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
                        if (!prop.skipUpdate) {
                            return p2 === 'serverObject'
                                ? `${p3}.${prop.name} = typeof ${p2}.${userPropName || prop.name} !== 'undefined' ? ${p2}.${userPropName || prop.name} : null`
                                : `${p3}.${userPropName || prop.name} = typeof ${p2}.${prop.name} !== 'undefined' ? ${p2}.${prop.name} : null`;
                        } else {
                            const skippedProp = currPropInitializationsArray.filter(el => (new RegExp(`^\\s*${p3}.${prop.name}`)).test(el))[0];
                            return skippedProp ? skippedProp.trim().replace(/;*$/, '') : '';
                        }
                    }).filter(newPropDeclaration => newPropDeclaration.length).join(';\n' + ' '.repeat(4))
                + ';'
        ) : p1);
    fs.writeFileSync(filePath, newServerContent);
}

/**
 * Modifies content of a Model file.
 * @param {string} filePath - Path of the Model file.
 * @param {string} currentContent - Current content of the Model file.
 * @param {*[]} newPropArray - Array of objects with data for latest model properties.
 * @param {string[]} [typesToImport] - Array of typescript type names found in newPropArray.
 */
function writeNewModelContent(filePath, currentContent, newPropArray, typesToImport) {
    const newContent = currentContent
        .replace(REGEXS.endOfImports, (m, p1, p2, p3) => typesToImport && typesToImport.length ? `${p1.trim()}\n\/\/ TODO verify the following imports: ${typesToImport.join(', ')};\n\n${p3.replace(/^\s+/m, '')}` : p1.trim() + '\n\n' + p3)
        .replace(REGEXS.modelPropDeclarations, (m, p1, p2) => {
            const currPropDeclarationsArray = (p2 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
            if (newPropArray && newPropArray.length) {
                return p1 + '\n' + newPropArray.map( prop => {
                        if (!prop.skipUpdate) {
                           return `  ${prop.name}${prop.optional && !prop.value ? '?' : ''}${prop.type && !prop.value ? ': ' + prop.type : ''}${prop.value ? ' = ' + prop.value : ''}`
                        } else {
                            const skippedProp = currPropDeclarationsArray.filter(el => (new RegExp(`^\\s*${prop.name}[?:]`)).test(el))[0];
                            return skippedProp ? '  ' + skippedProp.trim().replace(/;*$/, '') : '';
                        }
                    }).filter(newPropDeclaration => newPropDeclaration.length).join(';\n') + ';';
            } else {
                return p1;
            }})
        .replace(REGEXS.modelConstructor, (_, p1, p2, p3, p4, p5) => {
            const currConstructorArgs = (p2 + ',\n').match(/^\s*.+,[\r\n]/gm) || [];
            const currConstructorDeclarations = (p5 + '\n').match(/^\s*.+;[\r\n]/gm) || [];
            if (newPropArray && newPropArray.length) {
                return p1 + (p1.endsWith(',') ? '\n' : ',\n') + ' '.repeat(14)
                    + newPropArray.map( prop => {
                            if (!prop.skipUpdate) {
                                return `${prop.name}?${prop.type && !prop.value ? ': ' + prop.type : ''}`;
                            } else {
                                const skippedProp = currConstructorArgs.filter(el => (new RegExp(`^\\s*${prop.name}[?:]`)).test(el))[0];
                                return skippedProp ? skippedProp.trim().replace(/,*$/, '') : '';
                            }
                        }).filter(newPropDeclaration => newPropDeclaration.length).join(',\n' + ' '.repeat(14))
                    + p3 + p4 + '\n' + ' '.repeat(4)
                    + newPropArray.map( prop => {
                            if (!prop.skipUpdate) {
                                return `this.${prop.name} = typeof ${prop.name} !== 'undefined' ? ${prop.name} : ${prop.value ? prop.value : 'null'}`;
                            } else {
                                const skippedProp = currConstructorDeclarations.filter(el => (new RegExp(`^\\s*this.${prop.name}`)).test(el))[0];
                                return skippedProp ? skippedProp.trim().replace(/;*$/, '') : '';
                            }
                        }).filter(newPropDeclaration => newPropDeclaration.length).join(';\n' + ' '.repeat(4)) + ';';
            } else {
                return (p1.endsWith(',') ? p1.slice(0, -1) : p1) + p3 + p4;
            }
        });
    fs.writeFileSync(filePath, newContent);
}

/**
 * Modifies the content of the Model's data factory file.
 * @param {string} filePath - Path of the Model file.
 * @param {string} currentContent - Current content of the Model file.
 * @param {*[]} newPropArray - Array of objects with data for latest model properties.
 */
function writeNewDataFactoryContent(filePath, currentContent, newPropArray) {
    const typesToImport = getTypesToImport(newPropArray, '', /^\b[A-Z]\w*\b/);
    const newContent = currentContent
        .replace(REGEXS.endOfImports, (m, p1, p2, p3) => typesToImport && typesToImport.length ? `${p1.replace(/\s+$/m, '')}\n\/\/ TODO verify the following imports: ${typesToImport.join(', ')};\n\n${p3.replace(/^\s+/m, '')}` : p1.trim() + '\n\n' + p3)
        .replace(REGEXS.formControlList, (_, p1, p2, p3) => newPropArray && newPropArray.length ? (
            p1 + '\n' + ' '.repeat(6)
            + newPropArray.map( prop => '{' + Object.keys(prop).map( k => `${k}: ${prop[k]}` ).join(', ') + '}' )
                          .join(',\n' + ' '.repeat(6))
            + '\n' + ' '.repeat(4) + p3
        ): p1 + p3);
    fs.writeFileSync(filePath, newContent);
}

/**
 * Implements the logic related to updating a Model file.
 * @param {string} name - Model name.
 * @param {{properties: any[], any}} moduleConfig
 * @returns {Promise<boolean>}
 */
function updateModel(name, moduleConfig) {
    return new Promise(resolve => {
        console.log(color(dynamicTexts.updating(elementTypes.MODEL, name)[0], dynamicTexts.updating(elementTypes.MODEL, name)[1]));
        const {modelPath, serverModelPath} = getModulePaths(name, true);
        fs.readFile(modelPath, 'utf8', (err, currentContent) => {
            if (err) {
                return resolve(false)
            }
            const typesToImport = getTypesToImport(moduleConfig['properties'], 'type');
            const successText = dynamicTexts.updateSuccess(name, typesToImport);
            writeNewModelContent(modelPath, currentContent, moduleConfig['properties'], typesToImport);
            fs.readFile(serverModelPath, 'utf8', (err1, serverContent) => {
                if (err1) {
                    return resolve(false);
                }
                if (moduleConfig['properties'].length === 0) {
                    writeNewServerContent(serverModelPath, serverContent, []);
                    console.log(color(successText[0], successText[1]));
                    return resolve(true);
                }
                prompt({
                    type: 'list',
                    name: 'serverPropMapping',
                    message: dynamicTexts.updateMethod(name)[0],
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
                                const userPropMap = getUserPropMap(res, moduleConfig['properties']);
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
 * @returns {Promise<boolean>}
 */
function updateDetail(name, moduleConfig) {
    return new Promise(resolve => {
        const {dataFactoryPath} = getModulePaths(name, true);
        const formControlList = moduleConfig['properties'].filter( el => el.hasOwnProperty('htmlConfig') && !el.skipUpdate )
                                                          .map( el => ({name: `'${el.name}'`, ...el.htmlConfig}) );
        fs.readFile(dataFactoryPath, 'utf8', (err, dataFactoryContent) => {
            console.log(color(dynamicTexts.updating(name, elementTypes.DETAIL)[0], dynamicTexts.updating(name, elementTypes.DETAIL)[1]));
            if (err) {
                return resolve(false)
            };
            writeNewDataFactoryContent(dataFactoryPath, dataFactoryContent, formControlList);
            console.log(color(staticTexts.detailUpdated[0], staticTexts.detailUpdated[1]));
            return resolve(true)
        });
    });
}

/**
 * Handles the initial logic related to updating elements.
 * @param {elementTypes} elementType - Member of the elementTypes enum.
 * @param {string} name - Model name.
 * @returns {boolean}
 */
async function update(elementType, name) {
    const {modelAlreadyExists, serverModelAlreadyExists, detailAlreadyExist} = checkAlreadyExist(null, name);
    if (nonUpdateableModels.includes(name.toLowerCase())) {
        console.log(color(dynamicTexts.nonUpdateableModel(name)[0], dynamicTexts.nonUpdateableModel(name)[1]));
        return false;
    }
    if (!modelAlreadyExists) {
        console.log(color(dynamicTexts.updateModelNotFound(name)[0], dynamicTexts.updateModelNotFound(name)[1]));
        return false;
    }
    if (!serverModelAlreadyExists) {
        console.log(color(dynamicTexts.updateServerModelNotFound(name)[0], dynamicTexts.updateServerModelNotFound(name)[1]));
        return false;
    }
    const moduleConfig = require(process.cwd() + '/' + getModulePaths(name).config);
    if (moduleConfig['properties'].length > 1) {
        const duplicatesArr = getDuplicateValuesByPropName(moduleConfig['properties'], 'name');
        if (duplicatesArr && duplicatesArr.length) {
            console.log(color(dynamicTexts.duplicatePropNamesFound(duplicatesArr)[0], dynamicTexts.duplicatePropNamesFound(duplicatesArr)[1]));
            return false;
        }
    }
    name = name[0].toUpperCase() + name.substr(1);
    switch (elementType) {
        case elementTypes.MODEL:
            const modelUpdated = await updateModel(name, moduleConfig);
            if (modelUpdated) {
                update(elementTypes.DETAIL, name);
            } else {
                return;
            }
            break;
        case elementTypes.DETAIL:
            if (!detailAlreadyExist) {
                console.log(color(dynamicTexts.detailNotFound(name)[0], dynamicTexts.detailNotFound(name)[1]));
                return;
            }
            updateDetail(name, moduleConfig);
        default:
            return;
    }
}

async function cloneRepo() {
    return new Promise(async resolve => {
        console.log(color(staticTexts.cloning[0], staticTexts.cloning[1]));

        function onError(e) {
            console.log(e);
            resolve(false);
        }

        git.init((err) => {
            if (err) onError(err, resolve);
            else {
                git.addRemote('origin', 'https://gitlab.com/winkular/winkular.git', (err) => {
                    if (err) onError(err);
                    else {
                        git.pull('origin', 'master', {args: '--rebase'}, (err) => {
                            git.removeRemote('origin', (err1) => {
                                if (err1) onError(err1);
                                else {
                                    if (err) {
                                        onError(err);
                                    } else {
                                        console.log(color(staticTexts.cloned[0], staticTexts.cloned[1]));
                                        resolve(true);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
    });
}

async function configure() {
    return new Promise(async resolve => {
        const fileToCheck = 'src/environments/environment.ts';
        if (!fs.existsSync(fileToCheck)) {
            prompt({
                type: 'list',
                name: 'serverType',
                message: staticTexts.selectServer[0],
                choices: ['strapi', 'firestore']
            }).then(async (res) => {
                console.log(color(dynamicTexts.configuring(res['serverType'])[0], dynamicTexts.configuring(res['serverType'])[1]));
                config.selectedServer = res["serverType"];
                const newConfigContent = JSON.stringify(config, null, 4);
                fs.writeFileSync('./winkit.conf.json', newConfigContent);
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
                    gulp.src('.gitignore')
                        .pipe(deleteLines({
                            'filters': [
                                /\/src\//i
                            ]
                        }))
                        .pipe(gulp.dest('./'))
                        .on('error', () => {
                            resolve(false);
                        })
                        .on('end', () => {
                            shell.task(['git add . && git commit -m "project initialized"'])(err => {
                                if (err) resolve(false);
                                console.log(color(staticTexts.configured[0], staticTexts.configured[1]));
                                console.log(color(staticTexts.enjoy[0], staticTexts.enjoy[1]));
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
                });
            });
        } else {
            console.log(color(staticTexts.alreadyInitialized[0], staticTexts.alreadyInitialized[1]));
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
            console.log(color(staticTexts.alreadyCloned[0], staticTexts.alreadyCloned[1]));
            resolve(await configure());
        }
    });
}

gulp.task('init', async () => {
    return await init();
});

gulp.task('create:model', async () => {
    return await create(elementTypes.MODEL, null);
});

gulp.task('update:model', async () => {
    return await update(elementTypes.MODEL, null);
});

gulp.task('create:service', async () => {
    return await create(elementTypes.SERVICE, null);
});

gulp.task('create:detail', async () => {
    return await create(elementTypes.DETAIL, null);
});

gulp.task('create:list', async () => {
    return await create(elementTypes.LIST, null);
});

gulp.task('delete:model', async () => {
    return await deleteModel(null);
});


// Export all methods
module.exports = {
    init: init,
    createModel: (name) => create(elementTypes.MODEL, name),
    createService: (name) => create(elementTypes.SERVICE, name),
    createList: (name) => create(elementTypes.LIST, name),
    createDetail: (name) => create(elementTypes.DETAIL, name),
    updateModel: (name) => update(elementTypes.MODEL, name),
    updateDetail: (name) => update(elementTypes.DETAIL, name),
    deleteModel: (name) => deleteModel(name)
};