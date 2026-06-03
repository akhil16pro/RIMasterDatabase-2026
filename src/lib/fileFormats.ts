export const ALLOWED_FILE_EXTENSIONS = [".pdf"];
export const FILE_ACCEPT_STRING = ALLOWED_FILE_EXTENSIONS.join(",");

export const PASSWORD_MIN_LENGTH = Number(import.meta.env?.PASSWORDLIMITE || 8);

export const validateDocumentFile = (
  value: any,
  t: (key: string) => string,
  maxSizeMB: number = 5,
) => {
  if (!value) return null;
  const file = value instanceof FileList ? value[0] : value;
  if (!file || !(file instanceof File)) return null;
  const fileName = file.name.toLowerCase();
  const isValid = ALLOWED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (!isValid) return t("file_must_be_pdf");
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) return t("file_too_large");
  return null;
};
