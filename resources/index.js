const { modelTemplate, serverModelTemplate, dataFactoryTemplate } = require('./file_templates/model');
const { serviceTemplate } = require('./file_templates/service');
const { componentDetailStyleTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate } = require('./file_templates/detail');
const { componentListStyleTemplate, componentListViewModelTemplate, componentListViewTemplate } = require('./file_templates/list');
const { moduleTemplate, configTemplate, moduleRoutingTemplate } = require('./file_templates/main');
const { REGEXS, checkAlreadyExist, elementTypes, getModulePaths, validateName, nonUpdateableModels, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName } = require('./helpers/helpers');
const { staticTexts, dynamicTexts } = require('./helpers/texts');
const windowKeyList = require('./helpers/windowKeysList');

module.exports = {
    modelTemplate, serverModelTemplate, serviceTemplate, componentDetailStyleTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate, componentListStyleTemplate, componentListViewModelTemplate, componentListViewTemplate, moduleTemplate, windowKeyList, REGEXS, checkAlreadyExist, elementTypes, getModulePaths, validateName, staticTexts, dynamicTexts, nonUpdateableModels, configTemplate, moduleRoutingTemplate, getTypesToImport, getUserPropMap, getDuplicateValuesByPropName, dataFactoryTemplate
}
