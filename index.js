'use strict';

const {init, createModel, createService, createList, createDetail, updateModel, updateDetail, deleteModel} = require('./gulpfile');
const {elementTypes} = require('./resources/index');

const AngularCommands = {
    init: 'init',
    i: 'i',
    generate: 'generate',
    g: 'g',
    update: 'update',
    u: 'u',
    delete: 'delete',
    d: 'd',
    help: 'help',
    version: 'version'
};

const version = '0.0.1';

const command = {
    command: 'angular <command>',
    action: (command, args) => {
        const path = args.parent.rawArgs[0];
        const schematic = args.parent.rawArgs[4];
        const modelName = args.parent.rawArgs[5];
        if (command === AngularCommands.help) {
            showHelp();
        } else if (schematic === AngularCommands.help) {
            showHelp(command);
        } else {
            switch (command) {
                case AngularCommands.init:
                case AngularCommands.i:
                    if (schematic) {
                        init(schematic.toLowerCase());
                    } else {
                        console.log(`You must specify a name for the project.`);
                    }
                    break;
                case AngularCommands.generate:
                case AngularCommands.g:
                    switch (schematic) {
                        case elementTypes.MODEL:
                            createModel(modelName);
                            break;
                        case elementTypes.SERVICE:
                            createService(modelName);
                            break;
                        case elementTypes.DETAIL:
                            createDetail(modelName);
                            break;
                        case elementTypes.LIST:
                            createList(modelName);
                            break;
                        case AngularCommands.help:
                            showHelp(schematic);
                            break;
                        default:
                            console.log(`\nSchematic '${schematic}' does not exist on winkit angular generate!\n`);
                            break;
                    }
                    break;
                case AngularCommands.update:
                case AngularCommands.u:
                    switch (schematic) {
                        case elementTypes.MODEL:
                            updateModel(modelName);
                            break;
                        case elementTypes.DETAIL:
                            updateDetail(modelName);
                            break;
                        case AngularCommands.help:
                            showHelp(schematic);
                            break;
                        default:
                            console.log(`\nSchematic '${schematic}' does not exist on winkit angular generate!\n`);
                            break;
                    }
                    break;
                case AngularCommands.delete:
                case AngularCommands.d:
                    deleteModel(modelName);
                    break;
                case AngularCommands.help:
                    showHelp();
                    break;
                case AngularCommands.version:
                    console.log(version);
                    break;
                default:
                    console.log(`\nCommand '${command}' does not exist on WDK Angular CLI!\n`);
                    break;
            }
        }
    },
    onHelp: () => {
        showHelp();
    }
};

function showHelp(command) {
    switch (command) {
        case AngularCommands.init:
        case AngularCommands.i:
            console.log('Usage: angular init|i <projectName>');
            console.log('\nInitialize a new WDK Angular application.\n');
            break;
        case AngularCommands.generate:
        case AngularCommands.g:
            console.log('Usage: angular generate <component> <modelName>\n');
            console.log('Available components commands:');
            console.log('  model|m <modelName> : Generates new model.');
            console.log('  service|s <modelName> : Generates new service.');
            console.log('  detail|d <modelName> : Generates new detail component.');
            console.log('  list|l <modelName> : Generates new list component.\n');
            break;
        case AngularCommands.update:
        case AngularCommands.u:
            console.log('Usage: angular update <component> <modelName>\n');
            console.log('Available components commands:');
            console.log('  model|m <modelName> : Update model and its server model.\n');
            break;
        case AngularCommands.delete:
        case AngularCommands.d:
            console.log('Usage: angular delete <modelName>\n');
            break;
        case AngularCommands.version:
            break;
        default:
            console.log('Usage: angular <command> <component> <modelName>\n');
            console.log('Available Commands:');
            console.log('  init|i <projectName> : Initialize a new WDK Angular application.');
            console.log('  generate|g <component> <modelName> : Generates files based on a schematic.');
            console.log('  update|u <component> <modelName> : Updates your application and its dependencies.');
            console.log('  version : version Outputs WDK Angular CLI version.');
            console.log('  <command> help : Help.\n');
            break;
    }
}

module.exports = {command};