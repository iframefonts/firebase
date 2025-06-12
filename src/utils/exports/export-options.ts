
/**
 * Export options aggregator
 */

import { ExportOption } from './types';
import { socialMediaExportOption } from './social-media-export';
import { websiteExportOption } from './website-export';
import { printExportOption } from './print-export';

export const getExportOptions = (): ExportOption[] => [
  socialMediaExportOption,
  websiteExportOption,
  printExportOption
];
