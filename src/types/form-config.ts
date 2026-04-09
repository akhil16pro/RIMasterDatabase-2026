export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'date' | 'file' | 'select' | 'editor' | 'radio' | 'custom';
  optionsKey?: string; 
  validators?: any;
  colSpan?: number;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
  accept?: string;
  preview?: string;
  isLoadingPreview?: boolean;
  onClick?: () => void;
}
