
/**
 * Common types for export functionality
 */

export interface ExportFile {
  filename: string;
  blob: Blob;
}

export interface ExportOption {
  name: string;
  description: string;
  formats: string;
  folderName: string;
  generateFiles: (logo: File) => Promise<ExportFile[]>;
}
