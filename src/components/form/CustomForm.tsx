import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";

import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/label";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { FileUpload } from "@/components/ui/FileUpload";

import CKEditorCustom from "@/components/ui/CKEditor";

interface CustomFormProps {
  defaultValues: any;
  fields: FieldConfig[];
  onSubmit: (values: any) => Promise<void>;
  data: any;
  isSubmitting: boolean;
  t: any;
  mode: "add" | "edit" | "view";
}

export function CustomForm({
  defaultValues,
  fields,
  onSubmit,
  data,
  isSubmitting,
  t,
  mode,
}: CustomFormProps) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => await onSubmit(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
        {fields.map((cfg) => (
          <form.Field
            key={cfg.name}
            name={cfg.name as any}
            validators={cfg.validators}
            children={(field) => {
              // 1. Handle Selects
              if (cfg.type === "select") {
                return (
                  <Select
                    key={`${cfg.name}-${field.state.value}`}
                    value={field.state.value?.toString()}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      label={cfg.label}
                      error={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      readOnly={mode === "view"}
                    >
                      <SelectValue placeholder={t("select_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.[cfg.optionsKey!]?.map((item: any) => (
                        <SelectItem
                          key={item.value}
                          value={item.value.toString()}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }

              // 2. Handle CKEditor
              if (cfg.type === "editor") {
                return (
                  <div
                    className={cn(
                      "space-y-2 relative",
                      cfg.colSpan && `md:col-span-${cfg.colSpan}`,
                    )}
                  >
                    <Label>{cfg.label}</Label>
                    <CKEditorCustom
                      dir={cfg.dir}
                      value={field.state.value}
                      onChange={field.handleChange}
                      readOnly={mode === "view"}
                    />
                    {field.state.meta.errors ? (
                      <Label errorLabel={true} floating={true}>
                        {field.state.meta.errors.join(", ")}
                      </Label>
                    ) : null}
                  </div>
                );
              }

              if (cfg.type === "upload") {
                return (
                  <div
                    className={cn(
                      "space-y-2 relative",
                      cfg.colSpan && `md:col-span-${cfg.colSpan}`,
                    )}
                  >
                    <Label>{cfg.label}</Label>
                    <FileUpload
                      multiple={cfg.multiple}
                      accept={cfg.accept}
                      onChange={(files) =>
                        console.log("Current ready files:", files)
                      }
                    />
                    {field.state.meta.errors ? (
                      <Label errorLabel={true} floating={true}>
                        {field.state.meta.errors.join(", ")}
                      </Label>
                    ) : null}
                  </div>
                );
              }

              // 3. Handle Standard Inputs (Text, Date, File)
              return (
                <div
                  className={cn(cfg.colSpan && `md:col-span-${cfg.colSpan}`)}
                >
                  <Input
                    type={cfg.type}
                    label={cfg.label}
                    value={cfg.type !== "file" ? field.state.value : undefined}
                    accept={cfg.type === "file" ? cfg.accept : undefined}
                    onChange={(e) => {
                      const val =
                        cfg.type === "file"
                          ? e.target.files?.[0]
                          : e.target.value;
                      field.handleChange(val);
                    }}
                    disabled={cfg.disabled}
                    dir={cfg.dir}
                    error={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]}
                    onClick={cfg.onClick}
                    isLoading={cfg.isLoading}
                    preview={cfg.preview}
                    onClearPreview={() => {
                      field.handleChange(null);
                      cfg.onClearPreview?.();
                    }}
                    readOnly={mode === "view"}
                  />
                </div>
              );
            }}
          />
        ))}

        {mode !== "view" && (
          <div className="col-span-full">
            <DefaultButton
              type="submit"
              variant="dark"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              title={mode === "add" ? t("submit") : t("update")}
              icon={
                mode === "add" ? (
                  <Plus className="size-5" />
                ) : (
                  <Pencil className="size-5" />
                )
              }
            />
          </div>
        )}
      </div>
    </form>
  );
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "date" | "file" | "select" | "editor" | "radio" | "custom";
  optionsKey?: string;
  validators?: any;
  colSpan?: number;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
  readOnly?: boolean;
  accept?: string;
  preview?: string;
  isLoading?: boolean;
  onClick?: () => void;
  onClearPreview?: () => void;
}
