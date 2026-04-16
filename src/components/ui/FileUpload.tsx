import React, { useState, useRef, useCallback, useEffect } from "react";
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface FileUploadProps {
  /** Externally controlled file list */
  files?: File[];
  /** Callback when files are added or removed */
  onChange?: (files: File[]) => void;
  /** Acceptable file types (e.g. ".pdf,.doc,.docx") */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes (default 10MB) */
  maxSize?: number;
  /** Additional wrapper classes */
  className?: string;
  /** External progress map { "filename": progressValue } */
  uploadProgress?: Record<string, number>;
  /** External error map { "filename": "error message" } */
  errors?: Record<string, string>;
  /** External value for form integrations */
  value?: any;
}

export function FileUpload({
  files: externalFiles,
  onChange,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  uploadProgress: externalProgress,
  errors: externalErrors,
  value,
}: FileUploadProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [internalProgress, setInternalProgress] = useState<Record<string, number>>({});
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use value if provided (to support some form integrations), else try externalFiles, else internal
  const resolvedFiles = Array.isArray(value) ? value : (externalFiles !== undefined ? externalFiles : internalFiles);
  const files = resolvedFiles.filter(f => f instanceof File); // just in case
  const progresses = externalProgress !== undefined ? externalProgress : internalProgress;
  const errors = externalErrors !== undefined ? externalErrors : internalErrors;

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`;
    }
    // Basic type validation based on extension if accept is specific
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) return fileExt === type;
        return file.type.match(new RegExp(type.replace("*", ".*")));
      });
      if (!isAccepted) {
        return "File type not supported";
      }
    }
    return null;
  };

  const processFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles: File[] = [];
      const newErrors = { ...internalErrors };

      newFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors[file.name] = error;
        } else {
          // If not multiple, replace the queue. Otherwise, append (preventing exact duplicates by name)
          if (!multiple && validFiles.length === 0) {
            validFiles.push(file);
          } else if (multiple && !files.find((f) => f.name === file.name)) {
            validFiles.push(file);
          }
        }
      });

      setInternalErrors(newErrors);

      let updatedFiles = files;
      if (validFiles.length > 0) {
        updatedFiles = multiple ? [...files, ...validFiles] : [validFiles[0]];
        setInternalFiles(updatedFiles);
        onChange?.(updatedFiles);

        // Simulate progress for valid files if strictly internal
        if (externalProgress === undefined) {
          validFiles.forEach((file) => {
            simulateProgress(file.name);
          });
        }
      }
    },
    [files, multiple, maxSize, accept, onChange, internalErrors, externalProgress]
  );

  const simulateProgress = (fileName: string) => {
    let currentProgress = 0;
    setInternalProgress((prev) => ({ ...prev, [fileName]: 0 }));
    
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setInternalProgress((prev) => ({ ...prev, [fileName]: Math.min(100, Math.round(currentProgress)) }));
    }, 200);
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again if it was removed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (fileName: string) => {
      const updatedFiles = files.filter((f) => f.name !== fileName);
      setInternalFiles(updatedFiles);
      onChange?.(updatedFiles);
      
      setInternalProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });
      
      setInternalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fileName];
        return newErrors;
      });
    },
    [files, onChange]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out",
          "hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500",
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
        />
        
        <div className="flex bg-blue-100 dark:bg-blue-900/40 p-4 rounded-full mb-4">
          <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
          Click or drag files to upload
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
          Support for documents (PDF, DOC, DOCX, XLS, TXT). Maximum file size {(maxSize / (1024 * 1024)).toFixed(0)}MB.
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {files.map((file) => {
            const progressValue = progresses[file.name] || 0;
            const error = errors[file.name];
            const isComplete = progressValue === 100 && !error;

            return (
              <div
                key={file.name}
                className={cn(
                  "relative flex items-center p-4 bg-white dark:bg-slate-900 border rounded-xl shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2",
                  error ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-800"
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  
                  {error ? (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300 ease-out rounded-full"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
                        {progressValue}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center shrink-0">
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  ) : error ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  ) : null}
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.name);
                    }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
