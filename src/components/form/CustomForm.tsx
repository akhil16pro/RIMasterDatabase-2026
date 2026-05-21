import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/FileUpload";
import { AnimatePresence } from "motion/react";
import CKEditorCustom from "@/components/ui/CKEditor";

interface CustomFormProps {
  defaultValues: any;
  fields: FieldConfig[];
  onSubmit: (values: any) => Promise<void>;
  data: any;
  isSubmitting: boolean;
  mode: "add" | "edit" | "view";
}

export function CustomForm({
  defaultValues,
  fields,
  onSubmit,
  data,
  isSubmitting,
  mode,
}: CustomFormProps) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => await onSubmit(value),
  });
  const { t } = useTranslation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
        {fields.map((cfg) => {
          if (cfg.type === "radio") {
            return (
              <RadioButtonComponent
                form={form}
                cfg={cfg}
                data={data}
                mode={mode}
                key={`${cfg.name}-radio`}
              />
            );
          }

          if (cfg.condition) {
            return (
              <form.Subscribe
                key={`${cfg.name}-condition`}
                selector={(state) => state.values[cfg?.condition.key]}
                children={(value) => (
                  <AnimatePresence>
                    {value === cfg?.condition.value && (
                      <InputComponent
                        form={form}
                        cfg={cfg}
                        data={data}
                        mode={mode}
                      />
                    )}
                  </AnimatePresence>
                )}
              />
            );
          }

          return (
            <InputComponent
              form={form}
              cfg={cfg}
              data={data}
              mode={mode}
              key={`${cfg.name}-inputNormal`}
            />
          );
        })}

        {mode !== "view" && (
          <div className="col-span-full" key="submit-button">
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

const InputComponent = ({
  form,
  cfg,
  data,
  mode,
}: {
  form: any;
  cfg: any;
  data: any;
  mode: any;
}) => {
  const { t } = useTranslation();

  return (
    <form.Field
      key={cfg.name}
      name={cfg.name as any}
      validators={cfg.validators}
      children={(field) => {
        // 1. Handle Selects
        if (cfg.type === "select") {
          return (
            <div className={cn(cfg?.className)} key={`${field.name}-select`}>
              <Select
                value={field.state.value?.toString()}
                onValueChange={(val) => {
                  field.handleChange(val);
                  if (cfg.onValueChange) {
                    cfg.onValueChange(val);
                  }
                }}
              >
                <SelectTrigger
                  label={cfg.label}
                  error={field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.errors[0]}
                  readOnly={mode === "view" || cfg?.disabled}
                  hasValue={field.state.value}
                  onClear={() => {
                    field.handleChange(null);
                    if (cfg.onClear) {
                      cfg.onClear();
                    }
                    if (cfg.onValueChange) {
                      cfg.onValueChange(null);
                    }
                  }}
                >
                  <SelectValue placeholder={t("select_option")} />
                </SelectTrigger>
                <SelectContent>
                  {data?.[cfg.optionsKey!]?.map((item: any) => (
                    <SelectItem
                      key={`${field.name}-opt-${item.value}`}
                      value={item.value.toString()}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        // 2. Handle CKEditor
        if (cfg.type === "editor") {
          return (
            <div
              className={cn("space-y-2 relative", cfg?.className)}
              key={`${field.name}-editor`}
            >
              <Label error={field.state.meta.errors.length > 0 ? true : false}>
                {cfg.label}
              </Label>
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

        // 3. Handle File Upload
        if (cfg.type === "upload") {
          return (
            <div
              className={cn("space-y-2 relative", cfg?.className)}
              key={`${field.name}-upload`}
            >
              <Label>{cfg.label}</Label>
              <FileUpload
                multiple={cfg.multiple}
                accept={cfg.accept}
                onChange={(files) => console.log("Current ready files:", files)}
              />
              {field.state.meta.errors ? (
                <Label errorLabel={true} floating={true}>
                  {field.state.meta.errors.join(", ")}
                </Label>
              ) : null}
            </div>
          );
        }

        // 4. Handle Value Effect
        if (cfg.valueEffect) {
          return (
            <div
              className={cn(cfg?.className)}
              key={`${field.name}-valueEffect`}
            >
              <ValueEffectComponent
                field={field}
                form={form}
                cfg={cfg}
                mode={mode}
              />
            </div>
          );
        }

        // 5. Handle Standard Inputs
        return (
          <div className={cn(cfg?.className)} key={`${field.name}-input`}>
            <Input
              type={cfg.type}
              label={cfg.label}
              value={cfg.type !== "file" ? field.state.value : undefined}
              accept={cfg.type === "file" ? cfg.accept : undefined}
              onChange={(e) => {
                const val =
                  cfg.type === "file" ? e.target.files?.[0] : e.target.value;
                field.handleChange(val);
                cfg.onChange?.(field);
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
  );
};

const ValueEffectComponent = ({ field, form, cfg, mode }: any) => {
  return (
    <form.Subscribe selector={(state) => state.values[cfg?.valueEffect.key]}>
      {(value) => (
        <Input
          type={cfg.type}
          label={cfg.label}
          value={cfg.type !== "file" ? field.state.value : undefined}
          accept={cfg.type === "file" ? cfg.accept : undefined}
          onChange={(e) => {
            const val =
              cfg.type === "file" ? e.target.files?.[0] : e.target.value;
            field.handleChange(val);
            cfg.onChange?.(field);
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
          min={value}
        />
      )}
    </form.Subscribe>
  );
};

const RadioButtonComponent = ({ form, cfg, data, mode }: any) => {
  return (
    <div className="flex gap-5 text-black text-[1.2rem] col-span-full w-full">
      <Label className="text-black/70">{cfg.label}</Label>

      <form.Field
        key={cfg.name}
        name={cfg.name as any}
        validators={cfg.validators}
        children={(field) => {
          return (
            <div
              className={cn(cfg?.className)}
              key={`${field.name}-radioGroupContainer`}
            >
              <RadioGroup
                className="flex gap-col-4 gap-row-1 flex-wrap"
                value={field.state.value?.toString()}
                onValueChange={field.handleChange}
              >
                {data?.[cfg.optionsKey!]?.map((item: any) => (
                  <div
                    key={`${field.name}-radioItem-${item.value}`}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={item.value.toString()}
                      id={item.value.toString()}
                    />
                    <Label htmlFor={item.value.toString()}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {field.state.meta.errors ? (
                <Label errorLabel={true} floating={true}>
                  {field.state.meta.errors.join(", ")}
                </Label>
              ) : null}
            </div>
          );
        }}
      />
    </div>
  );
};

export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "password"
    | "number"
    | "textarea"
    | "date"
    | "file"
    | "select"
    | "editor"
    | "radio"
    | "custom";
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
  condition?: {
    key: string;
    value: any;
  };
  valueEffect?: {
    key: string;
  };
  className?: string;
  multiple?: boolean;
  onChange?: (field: any) => void;
}
