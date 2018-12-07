const staticTexts = {
    modelCreated: ['\nMODEL CREATED!\n', 'MAGENTA'],
    serviceCreated: ['\nSERVICE CREATED!\n', 'MAGENTA'],
    detailCreated: ['\nDETAIL CREATED!\n', 'MAGENTA'],
    listCreated: ['\nLIST CREATED!\n', 'MAGENTA'],
    creatingListNoIcon: ['\nCreating list without an icon...\n', 'YELLOW'],
    incorrectIcon: ['\nCreating list without an icon...\n', 'YELLOW'],
    notInitiated: ['\nWink Angular project not found in folder. To initiate a project run \'winkit init\'\n', 'RED'],
    provideName: ['\nPlease provide a name (min. 3 characters):', 'RED'],
    nameTooShort: ['\nName must be min. 3 characters long:', 'RED'],
    nameIncorrect: ['\nOnly letters and "_" allowed in name (min. 3 characters):', 'RED'],
    continuing: ['continuing', ''],
    aborting: ['\nPROCESS ABORTED\n', 'RED'],
    cloning: ['Cloning WDK Angular...', 'BLUE'],
    cloned: ['WDK Angular cloned...', 'BLUE'],
    selectServer: ['What type of server do you want to use?', ''],
    configured: ['WDK Angular correctly configured!', 'BLUE'],
    enjoy: ['ENJOY', 'MAGENTA'],
    alreadyInitialized: ['WDK Angular already initialized!', 'MAGENTA'],
    alreadyCloned: ['WDK Angular already cloned!', 'MAGENTA'],
    detailUpdated: ['Detail updated!', 'MAGENTA'],
    shouldUpdateDetail: ['Update detail automatically? (Y/n)', '']
};

const dynamicTexts = {
    createModel: name => [`\nCreating ${name} model...`, ''],
    createService: name => [`\nCreating ${name} service...`, ''],
    createDetail: name => [`\nCreating ${name} detail...`, ''],
    createList: name => [`\nCreating ${name} list...`, ''],
    provideIconForList: name => [`Provide the name of the icon that will be used for the ${name} list or press enter to not use an icon.\nFor available icon names, consult this page: https://material.io/tools/icons/?style=baseline\nIf the icon isn't displayed correctly in the sidebar, verify its name in 'src/app/@core/sidebar/sidebar-routes.config.ts'.\n>>`, ''],
    whichElementsForModel: name => [`What do you want to generate for the model <${name}>?`, ''],
    nameAlreadyExists: elementType => [`\n${elementType.toUpperCase()} with this name already exists. Please provide a new name:`, 'RED'],
    nameModelNotFound: (elementType, name, isService) => [`\nModel for ${elementType} not found.\n\nDo you want to generate the <${name}> model${ isService ? ' ' : ' and <' + name + 'Service> service ' }automatically? (Y/n)`, 'RED'],
    nameServiceNotFound: (elementType, name) => [`\nService for ${elementType} not found.\n\nDo you want to generate the <${name}Service> service automatically? (Y/n)`, 'RED'],
    nonUpdateableModel: name => [`\nModel <${name}> cannot be updated using WDK Angular CLI. Exiting...\n`, 'RED'],
    updateModelNotFound: name => [`\nModel <${name}> not found! Please check spelling (including letter capitalization) of the provided name.\n`, 'RED'],
    updateServerModelNotFound: name => [`\nServer model <${name}> not found! Aborting...\n`, 'RED'],
    updating: (elementType, name) => [`\nUpdating <${name}> ${elementType}...`, 'BLUE'],
    noNewProps: name => [`\nNew properties not found in <${name}> model.`, 'RED'],
    updateMethod: name => [`Would you like to update the Server${name} model automatically using default property name associations or manually map property names?`, ''],
    updateSuccess: (name, typesToImport) => typesToImport && typesToImport.length ? [`\nModel <${name}> updated.\n\nBefore continuing, please verify imports of the following objects in ${name}.ts and Server${name}.ts files: ${typesToImport.join(', ')}.`, 'MAGENTA'] : [`\nModel <${name}> successfully updated.`, 'MAGENTA'],
    configuring: serverType => [`Configuring WDK Angular for ${serverType}...`, 'BLUE'],
    duplicatePropNamesFound: duplicatesArr => [`\nDuplicate property names found: ${duplicatesArr.join(', ')}. Please use unique names only.`, 'RED'],
    detailNotFound: name => [`\nDetail for ${name} model not found. Aborting...`, 'RED']
};

module.exports = {
    staticTexts,
    dynamicTexts
};