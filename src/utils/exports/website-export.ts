
/**
 * Website export options
 */

import { ExportFile, ExportOption } from './types';
import { createSvgToCanvas, createPngFromCanvas } from './canvas-utils';
import { convertPdfToPng } from './pdf-utils';

export const websiteExportOption: ExportOption = {
  name: "Website",
  description: "SVG and PNG files for web use",
  formats: "SVG, PNG @ 2x and 1x resolutions",
  folderName: "website",
  generateFiles: async (logo: File): Promise<ExportFile[]> => {
    const files: ExportFile[] = [];
    
    try {
      console.log('Generating website files for:', logo.name, 'type:', logo.type);
      
      if (logo.type === 'image/svg+xml') {
        try {
          const canvas = await createSvgToCanvas(logo);
          console.log('Canvas created from SVG, dimensions:', canvas.width, 'x', canvas.height);
          
          // Add original SVG
          files.push({ filename: 'logo.svg', blob: logo });
          
          // Generate PNG files
          try {
            const png2x = await createPngFromCanvas(canvas, canvas.width * 2, canvas.height * 2);
            if (png2x.size > 0) {
              files.push({ filename: 'logo@2x.png', blob: png2x });
            }
          } catch (error) {
            console.error('Error creating 2x PNG:', error);
          }
          
          try {
            const png1x = await createPngFromCanvas(canvas, canvas.width, canvas.height);
            if (png1x.size > 0) {
              files.push({ filename: 'logo@1x.png', blob: png1x });
            }
          } catch (error) {
            console.error('Error creating 1x PNG:', error);
          }
        } catch (canvasError) {
          console.error('Error creating canvas from SVG:', canvasError);
          // Still include the SVG file even if conversion fails
          files.push({ filename: 'logo.svg', blob: logo });
        }
      } else if (logo.type === 'application/pdf') {
        // Create an SVG placeholder - in a real app, would convert PDF to SVG
        const svgPlaceholder = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#f0f0f0"/><text x="150" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="#666">PDF Logo</text></svg>'], 
          { type: 'image/svg+xml' });
        
        files.push({ filename: 'logo.svg', blob: svgPlaceholder });
        
        // Convert PDF to PNGs
        try {
          const png2x = await convertPdfToPng(logo, 400, 400);
          if (png2x.size > 0) {
            files.push({ filename: 'logo@2x.png', blob: png2x });
          }
        } catch (error) {
          console.error('Error converting PDF to 2x PNG:', error);
        }
        
        try {
          const png1x = await convertPdfToPng(logo, 200, 200);
          if (png1x.size > 0) {
            files.push({ filename: 'logo@1x.png', blob: png1x });
          }
        } catch (error) {
          console.error('Error converting PDF to 1x PNG:', error);
        }
      }
      
      console.log(`Website export generated ${files.length} files`);
      return files;
    } catch (error) {
      console.error('Error generating website files:', error);
      // Return at least an empty array to not break the entire export
      return files;
    }
  }
};
