
/**
 * Zip file creation utilities
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getExportOptions } from './export-options';

export const createAndDownloadZip = async (
  logoFile: File, 
  selectedOptions: string[],
  setIsExporting: (value: boolean) => void,
  setExportProgress: (value: number) => void
): Promise<void> => {
  console.log('Starting zip creation for logo:', logoFile.name, 'type:', logoFile.type);
  
  const allExportOptions = getExportOptions();
  const exportOptions = allExportOptions.filter(option => selectedOptions.includes(option.name));
  
  console.log('Selected export options:', exportOptions.map(o => o.name));
  
  try {
    const zip = new JSZip();
    const totalSteps = exportOptions.length;
    let currentStep = 0;
    let totalFilesAdded = 0;
    
    for (const option of exportOptions) {
      console.log(`Processing export option: ${option.name}`);
      
      try {
        const folder = zip.folder(option.folderName);
        if (!folder) {
          console.error(`Failed to create folder: ${option.folderName}`);
          continue;
        }
        
        const files = await option.generateFiles(logoFile);
        console.log(`Generated ${files.length} files for ${option.name}:`, files.map(f => f.filename));
        
        files.forEach(file => {
          if (file.blob && file.blob.size > 0) {
            // Check if filename contains a folder path
            if (file.filename.includes('/')) {
              const pathParts = file.filename.split('/');
              const subfolderName = pathParts[0];
              const fileName = pathParts[1];
              
              // Create or get the subfolder
              let subfolder = folder.folder(subfolderName);
              if (subfolder) {
                subfolder.file(fileName, file.blob);
                totalFilesAdded++;
                console.log(`Added file to subfolder: ${subfolderName}/${fileName}`);
              }
            } else {
              // File goes directly in the main folder
              folder.file(file.filename, file.blob);
              totalFilesAdded++;
              console.log(`Added file to main folder: ${file.filename}`);
            }
          } else {
            console.warn(`Skipping empty or invalid file: ${file.filename}`);
          }
        });
      } catch (optionError) {
        console.error(`Error processing export option ${option.name}:`, optionError);
        // Continue with other options even if one fails
      }
      
      currentStep++;
      setExportProgress(Math.floor((currentStep / totalSteps) * 100));
    }
    
    console.log(`Total files added to zip: ${totalFilesAdded}`);
    
    if (totalFilesAdded === 0) {
      throw new Error('No files were generated for export');
    }
    
    console.log('Generating zip file...');
    const content = await zip.generateAsync({ type: 'blob' });
    console.log('Zip file generated, size:', content.size);
    
    saveAs(content, `${logoFile.name.split('.')[0]}-export.zip`);
    return Promise.resolve();
  } catch (error) {
    console.error('Export error:', error);
    return Promise.reject(error);
  }
};
