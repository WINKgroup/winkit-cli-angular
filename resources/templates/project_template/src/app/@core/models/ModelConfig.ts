import {
    FormControlGeneric, FormControlMedia,
    FormControlSelect, FormControlTextArea
} from './FormControlTypes';

export interface ModelProperty {
    name: string;
    type?: string;
    optional?: boolean;
    value?: any;
    skipUpdate?: boolean;
    serverName?: string;
    serverType?: string;
    mapReverseName?: string;
    relationship?: string;
    mapReverseRelationship?: string;
    map?: string;
    mapReverse?: string;
    htmlConfig?: FormControlGeneric | FormControlSelect | FormControlMedia | FormControlTextArea;
}

export type ModelConfig  = ModelProperty[];
