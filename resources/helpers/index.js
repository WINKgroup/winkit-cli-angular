const { REGEXS, checkAlreadyExist, elementTypes, getModulePaths, validateName, nonUpdateableModels, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, getPrimaryKeysList } = require('./helpers');
const { staticTexts, dynamicTexts } = require('./texts');
const windowKeyList = require('./windowKeysList');

module.exports = {
    windowKeyList, REGEXS, checkAlreadyExist, elementTypes, getModulePaths, validateName, staticTexts, dynamicTexts, nonUpdateableModels, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, getPrimaryKeysList
};
