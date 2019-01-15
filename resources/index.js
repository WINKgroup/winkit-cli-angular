const { modelTemplate, serverModelTemplate, dataFactoryTemplate } = require('./templates/file_templates/model');
const { serviceTemplate } = require('./templates/file_templates/service');
const { componentDetailStyleTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate } = require('./templates/file_templates/detail');
const { componentListStyleTemplate, componentListViewModelTemplate, componentListViewTemplate } = require('./templates/file_templates/list');
const { moduleTemplate, configTemplate, moduleRoutingTemplate, mappableTemplate } = require('./templates/file_templates/main');
const { REGEXS, checkAlreadyExist, elementTypes, getModulePaths, validateName, nonUpdateableModels, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, getPrimaryKeysList } = require('./helpers/helpers');
const { staticTexts, dynamicTexts } = require('./helpers/texts');
const windowKeyList = require('./helpers/windowKeysList');

module.exports = {
    modelTemplate, serverModelTemplate, serviceTemplate, componentDetailStyleTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate, componentListStyleTemplate, componentListViewModelTemplate, componentListViewTemplate, moduleTemplate, windowKeyList, REGEXS, checkAlreadyExist, elementTypes, getModulePaths, validateName, staticTexts, dynamicTexts, nonUpdateableModels, configTemplate, moduleRoutingTemplate, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, dataFactoryTemplate, getPrimaryKeysList, mappableTemplate
};
