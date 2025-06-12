
/**
 * Print export options
 */

import { ExportFile, ExportOption } from './types';
import { convertSvgToPdf } from './pdf-utils';

export const printExportOption: ExportOption = {
  name: "Print",
  description: "High-resolution PDF file",
  formats: "PDF (CMYK color space)",
  folderName: "print",
  generateFiles: async (logo: File): Promise<ExportFile[]> => {
    const files: ExportFile[] = [];
    
    try {
      console.log('Generating print files for:', logo.name, 'type:', logo.type);
      
      if (logo.type === 'image/svg+xml') {
        try {
          // Convert SVG to PDF
          const pdfBlob = await convertSvgToPdf(logo);
          if (pdfBlob.size > 0) {
            files.push({ filename: 'logo-cmyk.pdf', blob: pdfBlob });
          }
        } catch (error) {
          console.error('Error converting SVG to PDF:', error);
        }
      } else if (logo.type === 'application/pdf') {
        // Just use the original PDF file
        files.push({ filename: 'logo-cmyk.pdf', blob: logo });
      }
      
      console.log(`Print export generated ${files.length} files`);
      return files;
    } catch (error) {
      console.error('Error generating print files:', error);
      return files;
    }
  }
};
