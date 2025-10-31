export const getFileExtension = (
  fileName?: string | null,
  mimeType?: string | null,
): string | null => {
  if (fileName) {
    const parts = fileName.split(".");
    const ext = parts.pop();
    if (ext) {
      return ext.toLowerCase();
    }
  }

  if (mimeType) {
    const [, subtype] = mimeType.split("/");
    if (subtype) {
      return subtype.toLowerCase();
    }
  }

  return null;
};

export const getFileTypeColor = (extension: string) => {
  switch (extension) {
    case "pdf":
      return "bg-red-100 text-red-800";
    case "doc":
    case "docx":
      return "bg-blue-100 text-blue-800";
    case "ppt":
    case "pptx":
    case "pps":
    case "ppsx":
      return "bg-orange-100 text-orange-800";
    case "xls":
    case "xlsx":
      return "bg-emerald-100 text-emerald-800";
    case "txt":
      return "bg-green-100 text-green-800";
    case "zip":
    case "rar":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
