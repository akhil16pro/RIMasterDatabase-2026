import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";

import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { Plus, Trash2, Pencil } from "lucide-react";
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

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { usePDFPreview } from "@/lib/usePDFPreview";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/international-treaties/edit/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "edit",
      path: `/${params.lang}/international-treaties/edit/${params.slug}`,
    }),
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [thankYouPopup, setThankYouPopup] = useState(false);

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["internationalTreatiesFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const [createRes, editRes] = await Promise.all([
          apiClient
            .get(`${i18n.language}/international-treaty/create`)
            .json<any>(),
          apiClient
            .get(`${i18n.language}/international-treaty/edit/${slug}`)
            .json<any>(),
        ]);

        console.log(
          "international_treaties_form_data",
          editRes?.data,
          "editRes?.data",
        );

        return { ...createRes?.data, ...editRes?.data };
      } catch (error) {
        console.log("international_treaties_form_data_error", error);
        return null;
      }
    },
  });

  const form = useForm({
    defaultValues: {
      it_treaty_type: "1",
      it_sector_id: "",
      it_country_id: "",

      it_title: "",
      it_title_arabic: "",
      it_treaty_date: "",
      it_treaty_year: "",
      it_expiry_date: "",
      it_attachment: "",
      it_attachment_arabic: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        formData.append("it_created_by", userSession?.user?.id || "");
        formData.append(
          "it_treaty_type",
          value?.it_treaty_type?.toString() || "",
        );
        formData.append("it_sector_id", value?.it_sector_id?.toString() || "");
        formData.append(
          "it_country_id",
          value?.it_country_id?.toString() || "",
        );
        formData.append("it_title", value.it_title);
        formData.append("it_title_arabic", value.it_title_arabic);
        formData.append("it_treaty_date", value.it_treaty_date);
        formData.append("it_treaty_year", value.it_treaty_year);
        formData.append("it_expiry_date", value.it_expiry_date);

        if (value.it_attachment) {
          formData.append("it_attachment", value.it_attachment);
        }
        if (value.it_attachment_arabic) {
          formData.append("it_attachment_arabic", value.it_attachment_arabic);
        }

        const res = await apiClient
          .post(i18n.language + `/international-treaty/update/${slug}`, {
            headers: {
              "Content-Type": undefined,
            },
            body: formData,
          })
          .json<any>();

        console.log(res, "international_treaties_update_res");
        if (res?.status) {
          // form.reset();
          toast.success(res?.message || t("success"));

          setTimeout(() => {
            setThankYouPopup(true);
          }, 150);
        }
      } catch (error) {
        console.error("Add request failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (data?.treatyData) {
      form.setFieldValue(
        "it_treaty_type",
        data.treatyData?.it_treaty_type?.toString() || "1",
      );
      if (data.treatyData?.it_treaty_type?.toString() === "1") {
        form.setFieldValue(
          "it_country_id",
          data?.treatyData?.it_country_id?.toString() || "",
        );
      }
      if (data.treatyData?.it_treaty_type?.toString() === "2") {
        form.setFieldValue(
          "it_sector_id",
          data?.treatyData?.it_sector_id?.toString() || "",
        );
      }
      form.setFieldValue("it_title", data?.treatyData?.it_title || "");
      form.setFieldValue(
        "it_title_arabic",
        data?.treatyData?.it_title_arabic || "",
      );
      form.setFieldValue(
        "it_treaty_date",
        data?.treatyData?.it_treaty_date || "",
      );
      form.setFieldValue(
        "it_treaty_year",
        data?.treatyData?.it_treaty_year || "",
      );
      form.setFieldValue(
        "it_expiry_date",
        data?.treatyData?.it_expiry_date || "",
      );
      form.setFieldValue("it_attachment", "");
      form.setFieldValue("it_attachment_arabic", "");
    }
  }, [data, form, userSession]);

  const handleClearFile = (fieldName: string, previewKey: string) => {
    form.setFieldValue(fieldName as any, null);

    setDeletedFiles((prev) => [...prev, previewKey]);
  };

  const { preview: previewEN, isLoading: isLoadingEN } = usePDFPreview(
    data?.treatyData?.it_slug,
    "en",
    "international-treaty",
  );
  const { preview: previewAR, isLoading: isLoadingAR } = usePDFPreview(
    data?.treatyData?.it_slug,
    "ar",
    "international-treaty",
  );

  return (
    <DashboardLayout isLoading={isLoading} title={t("edit_treaty")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <div className="flex gap-5 text-black  text-[1.2rem] col-span-full w-full">
            <Label className="text-black/70">{t("treaty_type")}</Label>
            <form.Field
              name="it_treaty_type"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("required_field") : undefined,
              }}
              children={(field) => (
                <>
                  <RadioGroup
                    className="flex gap-col-4 gap-row-1 flex-wrap"
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                    defaultValue="1"
                  >
                    {data?.treatyTypeList?.map((item: any) => (
                      <div
                        className="flex items-center space-x-2"
                        key={`treatyType-${item.value}`}
                      >
                        <RadioGroupItem
                          value={item.value.toString()}
                          id={item.label.toString()}
                          error={field.state.meta.errors.length > 0}
                        />
                        <Label
                          normalLabel={true}
                          htmlFor={item.label}
                          className="cursor-pointer"
                        >
                          {item.label}
                        </Label>
                      </div>
                    ))}
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

          <form.Subscribe
            selector={(state) => state.values.it_treaty_type}
            children={(treatyType) => (
              <AnimatePresence>
                {treatyType === "2" ? (
                  <form.Field
                    name="it_sector_id"
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? t("required_field") : null,
                    }}
                    children={(field) => (
                      <Select
                        key={field.state.value}
                        id="it_sector_id"
                        name="it_sector_id"
                        value={field.state.value?.toString() || ""}
                        onValueChange={(e) => field.handleChange(e)}
                      >
                        <SelectTrigger
                          label={t("sector")}
                          hasValue={!!field.state.value}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
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
                ) : (
                  <form.Field
                    name="it_country_id"
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? t("required_field") : null,
                    }}
                    children={(field) => (
                      <Select
                        key={field.state.value}
                        id="it_country_id"
                        name="it_country_id"
                        value={field.state.value?.toString() || ""}
                        onValueChange={(e) => field.handleChange(e)}
                      >
                        <SelectTrigger
                          label={t("country")}
                          hasValue={!!field.state.value}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
                        >
                          <SelectValue placeholder={t("select_country")} />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.countryList?.map((item: any) => (
                            <SelectItem
                              key={`country-${item.value}`}
                              value={item.value.toString()}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </AnimatePresence>
            )}
          />
          <div className="col-span-full grid  md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <form.Field
              name="it_title"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="text"
                  id="it_title"
                  name="it_title"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("title")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                />
              )}
            />

            <form.Field
              name="it_title_arabic"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="text"
                  id="it_title_arabic"
                  name="it_title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("title_arabic")}
                  dir="rtl"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                />
              )}
            />
          </div>

          <form.Field
            name="it_treaty_date"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="date"
                id="it_treaty_date"
                name="it_treaty_date"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  field.form.setFieldValue("it_expiry_date", "");
                }}
                label={t("treaty_date")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          />

          <form.Field
            name="it_treaty_year"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                key={field.state.value}
                id="it_treaty_year"
                name="it_treaty_year"
                value={field.state.value?.toString()}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("treaty_year")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                >
                  <SelectValue placeholder={t("select_treaty_year")} />
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
            name="it_expiry_date"
            validators={{
              onChange: ({ value, fieldApi }) => {
                if (!value) return null;
                const selectedDate = new Date(value);
                const treatyDate = new Date(
                  fieldApi.form.getFieldValue("it_treaty_date"),
                );
                if (treatyDate >= selectedDate) {
                  return t(
                    "the_expiry_date_must_be_after_or_equal_to_the_treaty_date",
                  );
                }
                return null;
              },
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <form.Subscribe selector={(state) => state.values.it_treaty_date}>
                {(treatyDateValue) => (
                  <Input
                    type="date"
                    id="it_expiry_date"
                    name="it_expiry_date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("expiry_date")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    min={treatyDateValue}
                  />
                )}
              </form.Subscribe>
            )}
          />

          <div className="col-span-full grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <form.Field
              name="it_attachment"
              validators={{
                onSubmit: ({ value }) => {
                  return data?.treatyData?.it_attachment
                    ? deletedFiles.includes("it_attachment") &&
                        !value &&
                        t("required_field")
                    : !value && t("required_field");
                },
                onChange: ({ value }) => {
                  if (!value) return null;
                  const file = value instanceof FileList ? value[0] : value;

                  if (!(file instanceof File)) return null;

                  const fileName = file.name.toLowerCase();
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
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.handleChange(file);
                  }}
                  label={t("attachment_english")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  preview={
                    deletedFiles.includes("it_attachment")
                      ? undefined
                      : data?.treatyData?.it_attachment
                  }
                  onClearPreview={() => {
                    field.handleChange(null);
                    setDeletedFiles((prev) => [...prev, "it_attachment"]);
                  }}
                  onClick={previewEN}
                  isLoading={isLoadingEN}
                />
              )}
            />

            <form.Field
              name="it_attachment_arabic"
              validators={{
                onSubmit: ({ value }) => {
                  return data?.treatyData?.it_attachment_arabic
                    ? deletedFiles.includes("it_attachment_arabic") &&
                        !value &&
                        t("required_field")
                    : !value && t("required_field");
                },
                onChange: ({ value }) => {
                  if (!value) return null;
                  const file = value instanceof FileList ? value[0] : value;

                  if (!(file instanceof File)) return null;

                  const fileName = file.name.toLowerCase();
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
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.handleChange(file);
                  }}
                  label={t("attachment_arabic")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  preview={
                    deletedFiles.includes("it_attachment_arabic")
                      ? undefined
                      : data?.treatyData?.it_attachment_arabic
                  }
                  onClearPreview={() => {
                    field.handleChange(null);
                    setDeletedFiles((prev) => [
                      ...prev,
                      "it_attachment_arabic",
                    ]);
                  }}
                  onClick={previewAR}
                  isLoading={isLoadingAR}
                />
              )}
            />
          </div>

          <div className="col-span-full">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("update")}
              onClick={form.handleSubmit}
              icon={<Pencil className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </form>
      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("updated_successfully")}
        description={t("international_treaties_updated_success_message")}
        onConfirm={() => {
          queryClient.invalidateQueries({
            queryKey: ["internationalTreatiesFormData"],
          });
          queryClient.invalidateQueries({
            queryKey: ["internationalTreatiesTable"],
          });
          // navigate({
          //   to: `/${i18n.language}/local-legislations`,
          // });
        }}
      />
    </DashboardLayout>
  );
}
