import {
    FormControlGeneric, FormControlMedia,
    FormControlSelect, FormControlTextArea
} from './FormControlTypes';

export interface ModelProperty {
    name: string;
    type?: string;
    isOptional?: boolean;
    value?: any;
    isManuallyUpdated?: boolean;
    serverName?: string;
    serverType?: string;
    existsOnServerOnly?: boolean;
    existsOnModelOnly?: boolean;
    mapReverseName?: string;
    relationship?: string;
    mapReverseRelationship?: string;
    htmlConfig?: FormControlGeneric | FormControlSelect | FormControlMedia | FormControlTextArea;
}

export type ModelConfig  = ModelProperty[];
