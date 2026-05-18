import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";

import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/label";

import { FileUpload } from "@/components/ui/FileUpload";
import { AnimatePresence, motion } from "motion/react";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useTranslation } from "react-i18next";
import { usePDFPreview } from "@/lib/usePDFPreview";
interface LegislationFormProps {
  initialValues: any;
  onSubmit: (values: any) => Promise<void>;
  data: any;
  isSubmitting: boolean;
  mode: "add" | "edit" | "view";
  previewEN?: string;
  previewAR?: string;
  isLoadingEN?: boolean;
  isLoadingAR?: boolean;
}
export function LegislationForm({
  initialValues,
  onSubmit,
  data,
  isSubmitting,
  mode,
  previewEN,
  previewAR,
  isLoadingEN,
  isLoadingAR,
}: LegislationFormProps) {
  const { t } = useTranslation();
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => await onSubmit(value),
  });

  const handleClearFile = (fieldName: string, previewKey: string) => {
    form.setFieldValue(fieldName as any, null);

    setDeletedFiles((prev) => [...prev, previewKey]);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-full">
            <Label className="text-black/70">{t("has_english")}</Label>
            <form.Field
              name="lm_has_english_version"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("required_field") : undefined,
              }}
              children={(field) => (
                <>
                  <RadioGroup
                    className="flex gap-4"
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                    defaultValue="2"
                    disabled={mode === "view" && true}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="1"
                        id="yes"
                        error={field.state.meta.errors.length > 0}
                      />
                      <Label
                        normalLabel={true}
                        htmlFor="yes"
                        className="cursor-pointer"
                      >
                        {t("yes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="2"
                        id="no"
                        error={field.state.meta.errors.length > 0}
                      />
                      <Label
                        normalLabel={true}
                        htmlFor="no"
                        className="cursor-pointer"
                      >
                        {t("no")}
                      </Label>
                    </div>
                  </RadioGroup>
                  {field.state.meta.errors.length > 0 && (
                    <Label errorLabel={true}>
                      {field.state.meta.errors[0] || t("invalid-field")}
                    </Label>
                  )}
                </>
              )}
            />
          </div>

          <form.Field
            name="lm_sector_id"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                key={`lm_sector_id-${field.state.value}`}
                id="lm_sector_id"
                name="lm_sector_id"
                value={field.state.value?.toString() || ""}
                onValueChange={(e) => field.handleChange(e)}
                readOnly={mode === "view" && true}
                disabled={mode === "view" && true}
              >
                <SelectTrigger
                  label={t("sector")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                >
                  <SelectValue placeholder={t("select_sector")} />
                </SelectTrigger>
                <SelectContent>
                  {data?.sectorList?.map((item: any) => (
                    <SelectItem
                      key={`sector-${item.value}`}
                      value={item.value.toString()}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <form.Field
            name="lm_law_type_id"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                key={`lm_law_type_id-${field.state.value}`}
                id="lm_law_type_id"
                name="lm_law_type_id"
                value={field.state.value?.toString() || ""}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("legislation_type")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  readOnly={mode === "view" && true}
                  disabled={mode === "view" && true}
                >
                  <SelectValue placeholder={t("select_legislation_type")} />
                </SelectTrigger>
                <SelectContent>
                  {data?.lawTypeList?.map((item: any) => (
                    <SelectItem
                      key={`lawType-${item.value}`}
                      value={item.value.toString()}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <form.Subscribe
            selector={(state) => state.values.lm_has_english_version}
            children={(hasEnglish) => (
              <AnimatePresence>
                {hasEnglish === "1" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className=" col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start"
                  >
                    <form.Field
                      name="lm_title"
                      validators={{
                        onChange: ({ value }) =>
                          !value ? t("required_field") : undefined,

                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <Input
                          id="lm_title"
                          name="lm_title"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("legislation_full_title_english")}
                          error={
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0
                          }
                          errorMessage={field.state.meta.errors[0]}
                          onBlur={field.handleBlur}
                          readOnly={mode === "view" && true}
                        />
                      )}
                    />
                    <form.Field
                      name="lm_short_title"
                      children={(field) => (
                        <Input
                          id="lm_short_title"
                          name="lm_short_title"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("legislation_short_title_english")}
                          error={field.state.meta.errors.length > 0}
                          errorMessage={field.state.meta.errors[0]}
                          readOnly={mode === "view" && true}
                        />
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          />
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <form.Field
              name="lm_title_arabic"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("required_field") : undefined,

                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="text"
                  id="lm_title_arabic"
                  name="lm_title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("legislation_full_title_arabic")}
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  errorMessage={field.state.meta.errors[0]}
                  onBlur={field.handleBlur}
                  dir="rtl"
                  readOnly={mode === "view" && true}
                />
              )}
            />
            <form.Field
              name="lm_short_title_arabic"
              children={(field) => (
                <Input
                  type="text"
                  id="lm_short_title_arabic"
                  name="lm_short_title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("legislation_short_title_arabic")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  dir="rtl"
                  readOnly={mode === "view" && true}
                />
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => state.values.lm_has_english_version}
            children={(hasEnglish) => (
              <AnimatePresence>
                {hasEnglish === "1" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="col-span-full "
                  >
                    <form.Field
                      name="lm_description"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <div className="space-y-2 relative">
                          <Label htmlFor="lm_description">
                            {t("legislation_details_english")}
                          </Label>
                          <CKEditorCustom
                            value={field.state.value}
                            onChange={(data) => field.handleChange(data)}
                            readOnly={mode === "view" && true}
                          />
                          {field.state.meta.errors ? (
                            <Label
                              htmlFor="lm_description"
                              errorLabel={true}
                              floating={true}
                            >
                              {field.state.meta.errors.join(", ")}
                            </Label>
                          ) : null}
                        </div>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          />

          <div className="col-span-full">
            <form.Field
              name="lm_description_arabic"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <div className="space-y-2 relative">
                  <Label htmlFor="lm_description_arabic">
                    {t("legislation_details_arabic")}
                  </Label>
                  <CKEditorCustom
                    dir="rtl"
                    value={field.state.value}
                    onChange={(data) => field.handleChange(data)}
                    readOnly={mode === "view" && true}
                  />
                  {field.state.meta.errors ? (
                    <Label
                      htmlFor="lm_description_arabic"
                      errorLabel={true}
                      floating={true}
                    >
                      {field.state.meta.errors.join(", ")}
                    </Label>
                  ) : null}
                </div>
              )}
            />
          </div>
          <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-full ">
            <Label className="text-black/70">
              {t("legislation_modifications")}
            </Label>
            <form.Field
              name="lm_has_modifications"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("required_field") : undefined,
              }}
              children={(field) => (
                <>
                  <RadioGroup
                    className="flex gap-4"
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                    defaultValue="2"
                    disabled={mode === "view" && true}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="1"
                        id="lm_has_modifications_yes"
                        error={field.state.meta.errors.length > 0}
                      />
                      <Label
                        normalLabel={true}
                        htmlFor="lm_has_modifications_yes"
                        className="cursor-pointer"
                      >
                        {t("yes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="2"
                        id="lm_has_modifications_no"
                        error={field.state.meta.errors.length > 0}
                      />
                      <Label
                        normalLabel={true}
                        htmlFor="lm_has_modifications_no"
                        className="cursor-pointer"
                      >
                        {t("no")}
                      </Label>
                    </div>
                  </RadioGroup>
                  {field.state.meta.errors.length > 0 && (
                    <Label errorLabel={true}>
                      {field.state.meta.errors[0] || t("invalid-field")}
                    </Label>
                  )}
                </>
              )}
            />
          </div>
          <form.Field
            name="lm_year"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                key={`lm_year-${field.state.value}`}
                id="lm_year"
                name="lm_year"
                value={field.state.value?.toString()}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("legislation_year")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  readOnly={mode === "view" && true}
                  disabled={mode === "view" && true}
                >
                  <SelectValue placeholder={t("select_legislation_year")} />
                </SelectTrigger>
                <SelectContent>
                  {data?.yearList?.map((item: any) => (
                    <SelectItem
                      key={`year-${item.value}`}
                      value={item.value.toString()}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <form.Field
            name="lm_number"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                id="lm_number"
                name="lm_number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("legislation_number")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                readOnly={mode === "view" && true}
              />
            )}
          />

          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <form.Field
              name="lm_issue_date"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="date"
                  id="lm_issue_date"
                  name="lm_issue_date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("issued_date")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  readOnly={mode === "view" && true}
                />
              )}
            />

            <form.Field
              name="lm_effective_date"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="date"
                  id="lm_effective_date"
                  name="lm_effective_date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("effective_date")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  readOnly={mode === "view" && true}
                />
              )}
            />
          </div>
          <form.Subscribe
            selector={(state) => state.values.lm_has_english_version}
            children={(hasEnglish) => (
              <AnimatePresence>
                {hasEnglish === "1" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className=""
                  >
                    <form.Field
                      name="lm_pdf_file"
                      validators={{
                        onSubmit: ({ value }) => {
                          if (mode === "edit") {
                            return data?.lawData?.lm_pdf_file
                              ? deletedFiles.includes("lm_pdf_file") &&
                                  !value &&
                                  t("required_field")
                              : !value && t("required_field");
                          } else {
                            return !value ? t("required_field") : null;
                          }
                        },
                        onChange: ({ value }) => {
                          if (!value) return null;

                          // Ensure we have a File object
                          const file =
                            value instanceof FileList ? value[0] : value;
                          if (!file || !(file instanceof File)) return null;

                          const fileName = file.name.toLowerCase(); // Use file.name
                          const allowedExtensions = [".pdf"];
                          const isValid = allowedExtensions.some((ext) =>
                            fileName.endsWith(ext),
                          );

                          if (!isValid) return t("file_must_be_pdf");

                          const maxSize = 5 * 1024 * 1024; // 5MB
                          if (file.size > maxSize) return t("file_too_large");

                          return null;
                        },
                      }}
                      children={(field) => (
                        <Input
                          type="file"
                          id="lm_pdf_file"
                          name="lm_pdf_file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.handleChange(file);
                          }}
                          onBlur={field.handleBlur}
                          label={t("legislation_file_english")}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
                          preview={
                            deletedFiles.includes("lm_pdf_file")
                              ? undefined
                              : data?.lawData?.lm_pdf_file
                          }
                          onClearPreview={() => {
                            field.handleChange(null);
                            setDeletedFiles((prev) => [...prev, "lm_pdf_file"]);
                          }}
                          onClick={previewEN}
                          isLoading={isLoadingEN}
                          readOnly={mode === "view" && true}
                        />
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          />

          <form.Field
            name="lm_pdf_file_arabic"
            validators={{
              onSubmit: ({ value }) => {
                if (mode === "edit") {
                  return (
                    deletedFiles.includes("lm_pdf_file_arabic") &&
                    !value &&
                    t("required_field")
                  );
                } else {
                  return !value ? t("required_field") : null;
                }
              },
              onChange: ({ value }) => {
                if (!value) return null;

                // Ensure we have a File object
                const file = value instanceof FileList ? value[0] : value;
                if (!file || !(file instanceof File)) return null;

                const fileName = file.name.toLowerCase(); // Use file.name
                const allowedExtensions = [".pdf"];
                const isValid = allowedExtensions.some((ext) =>
                  fileName.endsWith(ext),
                );

                if (!isValid) return t("file_must_be_pdf");

                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) return t("file_too_large");

                return null;
              },
            }}
            children={(field) => (
              <Input
                type="file"
                id="lm_pdf_file_arabic"
                name="lm_pdf_file_arabic"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.handleChange(file);
                }}
                onBlur={field.handleBlur}
                label={t("legislation_file_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                preview={
                  deletedFiles.includes("lm_pdf_file_arabic")
                    ? undefined
                    : data?.lawData?.lm_pdf_file_arabic
                }
                onClearPreview={() => {
                  field.handleChange(null);
                  setDeletedFiles((prev) => [...prev, "lm_pdf_file_arabic"]);
                }}
                onClick={previewAR}
                isLoading={isLoadingAR}
                readOnly={mode === "view" && true}
              />
            )}
          />

          <form.Subscribe
            selector={(state) => state.values.lm_has_english_version}
            children={(hasEnglish) => (
              <AnimatePresence>
                {hasEnglish === "1" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start"
                  >
                    <form.Field
                      name="lm_gazette_number"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <Input
                          type="text"
                          id="lm_gazette_number"
                          name="lm_gazette_number"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("official_gazette_number")}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
                          readOnly={mode === "view" && true}
                        />
                      )}
                    />
                    <form.Field
                      name="lm_gazette_title"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <Input
                          type="text"
                          id="lm_gazette_title"
                          name="lm_gazette_title"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("official_gazette_title_english")}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
                          readOnly={mode === "view" && true}
                        />
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          />

          <form.Field
            name="lm_gazette_number_arabic"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                id="lm_gazette_number_arabic"
                name="lm_gazette_number_arabic"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("official_gazette_number_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                dir="rtl"
                readOnly={mode === "view" && true}
              />
            )}
          />

          <form.Field
            name="lm_gazette_title_arabic"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                id="lm_gazette_title_arabic"
                name="lm_gazette_title_arabic"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("official_gazette_title_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                dir="rtl"
                readOnly={mode === "view" && true}
              />
            )}
          />
          <form.Field
            name="lm_official_gazette_issue_date"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="date"
                id="lm_official_gazette_issue_date"
                name="lm_official_gazette_issue_date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("official_gazette_date")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                readOnly={mode === "view" && true}
              />
            )}
          />
          <form.Field
            name="lm_official_gazette_publish_date"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="date"
                id="lm_official_gazette_publish_date"
                name="lm_official_gazette_publish_date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("official_gazette_publish_date")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                readOnly={mode === "view" && true}
              />
            )}
          />
          {mode !== "view" && (
            <div className="col-span-full">
              <DefaultButton
                type="submit"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                variant="dark"
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
    </>
  );
}
