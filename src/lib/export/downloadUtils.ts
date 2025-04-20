
/**
 * Download generated file content as a file.
 */
export const downloadFile = (
  content: string | Uint8Array,
  filename: string,
  mimeType: string,
  isBinary: boolean = false
): void => {
  const blob = isBinary
    ? new Blob([content as Uint8Array], { type: mimeType })
    : new Blob([content as string], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
