export interface CompressImageWorkerMessage {
  type: 'compress';
  data: {
    imageData: ArrayBuffer;
    fileName: string;
    mimeType: string;
    orientation: number;
    maxSide: number;
    thumbSize: number;
    quality: number;
    preferWebp: boolean;
  };
}

export interface CompressImageWorkerResponse {
  type: 'success' | 'error';
  data?: {
    compressedData: ArrayBuffer;
    thumbnailData: ArrayBuffer;
    compressedFileName: string;
    thumbnailFileName: string;
  };
  error?: string;
}

export interface CompressImageWorkerResult {
  compressedFile: Blob;
  thumbnail: Blob;
  compressedFileName: string;
  thumbnailFileName: string;
}
