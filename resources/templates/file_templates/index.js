const { modelTemplate, serverModelTemplate, dataFactoryTemplate } = require('./templates/file_templates/model');
const { serviceTemplate } = require('./templates/file_templates/service');
const { componentDetailStyleTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate } = require('./templates/file_templates/detail');
const { componentListStyleTemplate, componentListViewModelTemplate, componentListViewTemplate } = require('./templates/file_templates/list');
const { moduleTemplate, configTemplate, moduleRoutingTemplate, mappableTemplate } = require('./templates/file_templates/main');

module.exports = {
    modelTemplate, serverModelTemplate, dataFactoryTemplate, serviceTemplate, componentDetailStyleTemplate, componentDetailViewModelTemplate, componentDetailViewTemplate, componentListStyleTemplate, componentListViewModelTemplate, componentListViewTemplate, moduleTemplate, configTemplate, moduleRoutingTemplate, mappableTemplate
};
