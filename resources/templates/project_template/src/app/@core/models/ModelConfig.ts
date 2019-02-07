import {
    FormControlGeneric, FormControlMedia,
    FormControlSelect, FormControlTextArea
} from './FormControlTypes';

export interface ModelProperty {
    name: string;
    type?: string;
    isOptional?: boolean;
    value?: any;
    skipUpdate?: boolean;
    serverName?: string;
    serverType?: string;
    mapReverseName?: string;
    relationship?: string;
    mapReverseRelationship?: string;
    htmlConfig?: FormControlGeneric | FormControlSelect | FormControlMedia | FormControlTextArea;
}

export type ModelConfig  = ModelProperty[];
