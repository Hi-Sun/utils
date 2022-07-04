declare module 'blob-polyfill' {
  type NativeBlob = Blob;
  export declare const Blob: {
    prototype: NativeBlob;
    new(blobParts?: BlobPart[], options?: BlobPropertyBag): NativeBlob;
  };
  export function File(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
  export function FileReader(): FileReader;
  export function URL(url: string | URL, base?: string | URL): URL;
}
