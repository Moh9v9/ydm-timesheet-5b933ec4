
import { enTranslations } from './en';
import { arTranslations } from './ar';

// Combining all translations into a single object
export const translations = {
  en: enTranslations,
  ar: arTranslations
};

// Export each language's translations separately for direct imports
export { enTranslations, arTranslations };
