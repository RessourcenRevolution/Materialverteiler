import { ActionError, isInputError } from "astro:actions";
import { useTranslations, type TranslationKey } from "~/i18n/ui";

/**
 * Retrieves a translated error message for a specific form field.
 *
 * This function checks if an `ActionError` object contains an input error
 * for a given field name. If it does, it returns the first error message,
 * translated into the current language.
 *
 * @param fieldName - The name of the form field to check for an error.
 * @param error - The `ActionError` object from Astro Actions, which may contain validation errors.
 * @param prefix - An optional prefix to prepend to the translations key.
 * @returns The translated error message string if an error for the specified field exists; otherwise, `undefined`.
 */
export function fieldError(
  fieldName: string,
  error?: ActionError,
  prefix: string = ""
) {
  const t = useTranslations();
  if (error && isInputError(error) && error.fields[fieldName]) {
    return t(
      (prefix +
        error.fields[fieldName][0]) as TranslationKey 
    );
  }
  return;
}
