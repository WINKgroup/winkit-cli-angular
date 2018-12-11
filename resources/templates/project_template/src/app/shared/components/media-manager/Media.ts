export interface Media {
  type: MediaType;
  url: string;
  progress?: number;
}

/**
 * accepted file types in MediaModalComponent
 */
export enum MediaType {
  IMAGE = 'IMAGE' as any,
  PDF = 'PDF' as any,
}
