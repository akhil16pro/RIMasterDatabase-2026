import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  Heading,
  List,
  Link,
  Table,
  TableToolbar,
  Alignment,
} from "ckeditor5";
import { useTranslation } from "react-i18next";
import "ckeditor5/ckeditor5.css";
import "@/assets/scss/partials/ckeditorCustom.css";

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  dir?: string;
  readOnly?: boolean;
}

const CKEditorCustom = ({
  value,
  onChange,
  placeholder,
  disabled,
  dir,
  readOnly,
}: CKEditorProps) => {
  const { i18n } = useTranslation();
  const isRTL = dir === "rtl" ? "rtl" : i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="ck-editor-wrapper prose-none mb-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CKEditor
        editor={ClassicEditor}
        disabled={disabled || readOnly}
        config={{
          licenseKey: "GPL",
          placeholder: placeholder || "Start typing...",
          language: {
            ui: isRTL === "rtl" ? "ar" : "en",
            content: isRTL === "rtl" ? "ar" : "en",
          },
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            List,
            Link,
            Table,
            TableToolbar,
            Alignment,
            Undo,
          ],
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "|",
            "link",
            "insertTable",
            "|",
            "bulletedList",
            "numberedList",
            "alignment",
          ],
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        data={value}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        dir={dir}
      />
    </div>
  );
};

export default CKEditorCustom;
