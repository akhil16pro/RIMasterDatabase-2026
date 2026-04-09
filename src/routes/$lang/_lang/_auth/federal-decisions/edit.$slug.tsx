import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";

import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { Pencil } from "lucide-react";
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
import { useEffect } from "react";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-decisions/edit/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "edit",
      path: `/${params.lang}/federal-decisions/edit/${params.slug}`,
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
    queryKey: ["federalEditDecisionFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const [createRes, editRes] = await Promise.all([
          apiClient.get(`${i18n.language}/federal-decision/create`).json<any>(),
          apiClient
            .get(`${i18n.language}/federal-decision/edit/${slug}`)
            .json<any>(),
        ]);

        return { ...createRes?.data, ...editRes?.data };
      } catch (error) {
        console.log("federal_decision_form_data_error", error);
        return null;
      }
    },
  });

  const form = useForm({
    defaultValues: {
      local_government: userSession?.user?.userEmirateName || "",
      dm_decision_type_id: "",
      dm_title: "",
      dm_title_arabic: "",
      dm_decision_date: "",
      dm_year: "",
      dm_authority_title: "",
      dm_authority_title_arabic: "",
      dm_details: "",
      dm_details_arabic: "",
      dm_file: null,
      dm_file_arabic: null,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        formData.append("dm_created_by", userSession?.user?.id || "");
        formData.append(
          "local_government",
          userSession?.user?.userEmirateId || "",
        );
        formData.append(
          "dm_decision_type_id",
          value.dm_decision_type_id.toString() || "",
        );
        formData.append("dm_title", value.dm_title || "");
        formData.append("dm_title_arabic", value.dm_title_arabic || "");
        formData.append("dm_decision_date", value.dm_decision_date || "");
        formData.append("dm_details", value.dm_details || "");
        formData.append("dm_details_arabic", value.dm_details_arabic || "");
        formData.append("dm_year", value.dm_year.toString() || "");
        formData.append("dm_authority_title", value.dm_authority_title || "");
        formData.append(
          "dm_authority_title_arabic",
          value.dm_authority_title_arabic || "",
        );

        if (value.dm_file) {
          formData.append("dm_file", value.dm_file);
        }
        if (value.dm_file_arabic) {
          formData.append("dm_file_arabic", value.dm_file_arabic);
        }

        const res = await apiClient
          .post(i18n.language + `/federal-decision/update/${slug}`, {
            headers: {
              "Content-Type": undefined,
            },
            body: formData,
          })
          .json<any>();

        // console.log(res, "local_legislation_update_res");
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
    if (data?.decisionData) {
      form.setFieldValue(
        "local_government",
        userSession?.user?.userEmirateName || "",
      );
      form.setFieldValue(
        "dm_decision_type_id",
        data?.decisionData?.dm_decision_type_id.toString() || "",
      );
      form.setFieldValue("dm_title", data?.decisionData?.dm_title || "");
      form.setFieldValue(
        "dm_title_arabic",
        data?.decisionData?.dm_title_arabic || "",
      );
      form.setFieldValue(
        "dm_decision_date",
        data?.decisionData?.dm_decision_date || "",
      );
      form.setFieldValue(
        "dm_year",
        data?.decisionData?.dm_year.toString() || "",
      );
      form.setFieldValue(
        "dm_authority_title",
        data?.decisionData?.dm_authority_title || "",
      );
      form.setFieldValue(
        "dm_authority_title_arabic",
        data?.decisionData?.dm_authority_title_arabic || "",
      );
      form.setFieldValue("dm_details", data?.decisionData?.dm_details || "");
      form.setFieldValue(
        "dm_details_arabic",
        data?.decisionData?.dm_details_arabic || "",
      );

      form.setFieldValue("dm_file", "");
      form.setFieldValue("dm_file_arabic", "");
    }
  }, [data, form, userSession]);

  const handleClearFile = (fieldName: string, previewKey: string) => {
    form.setFieldValue(fieldName as any, null);

    setDeletedFiles((prev) => [...prev, previewKey]);
  };

  return (
    <DashboardLayout isLoading={isLoading} title={t("edit_decision")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <form.Field
            name="local_government"
            children={(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("local_government")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                disabled={true}
              />
            )}
          />

          <form.Field
            name="dm_decision_type_id"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Select
                key={field.state.value}
                value={field.state.value?.toString() || ""}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("decision_type")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                >
                  <SelectValue placeholder={t("select_decision_type")} />
                </SelectTrigger>
                <SelectContent>
                  {data?.decisionTypeList?.map((item: any) => (
                    <SelectItem
                      key={`decisionType-${item.value}`}
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
            name="dm_title"
            validators={{
              onChange: ({ value }) =>
                !value ? t("required-field") : undefined,

              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("legislation_title_english")}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                errorMessage={field.state.meta.errors[0]}
                onBlur={field.handleBlur}
              />
            )}
          />
          <form.Field
            name="dm_title_arabic"
            validators={{
              onChange: ({ value }) =>
                !value ? t("required-field") : undefined,

              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("legislation_title_arabic")}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                errorMessage={field.state.meta.errors[0]}
                onBlur={field.handleBlur}
                dir="rtl"
              />
            )}
          />

          <form.Field
            name="dm_decision_date"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("decision_date")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          />

          {/* <form.Field
            name="dm_number"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("decision_number")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          /> */}

          <form.Field
            name="dm_year"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Select
                key={field.state.value}
                value={field.state.value?.toString()}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("decision_year")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                >
                  <SelectValue placeholder={t("select_decision_year")} />
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
            name="dm_authority_title"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("authority_title")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          />

          <form.Field
            name="dm_authority_title_arabic"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("authority_title_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                dir="rtl"
              />
            )}
          />

          <div className="col-span-2">
            <form.Field
              name="dm_details"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required-field") : null),
              }}
              children={(field) => (
                <div className="space-y-2 relative">
                  <Label htmlFor="dm_details">{t("details_english")}</Label>
                  <CKEditorCustom
                    value={field.state.value}
                    onChange={(data) => field.handleChange(data)}
                  />
                  {field.state.meta.errors ? (
                    <Label
                      htmlFor="dm_details"
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

          <div className="col-span-2">
            <form.Field
              name="dm_details_arabic"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required-field") : null),
              }}
              children={(field) => (
                <div className="space-y-2 relative">
                  <Label htmlFor="dm_details_arabic">
                    {t("details_arabic")}
                  </Label>
                  <CKEditorCustom
                    dir="rtl"
                    value={field.state.value}
                    onChange={(data) => field.handleChange(data)}
                  />
                  {field.state.meta.errors ? (
                    <Label
                      htmlFor="dm_details_arabic"
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

          <form.Field
            name="dm_file"
            validators={{
              onSubmit: ({ value }) => {
                return data?.decisionData?.dm_file
                  ? deletedFiles.includes("dm_file") &&
                      !value &&
                      t("required-field")
                  : !value && t("required-field");
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
                onBlur={field.handleBlur}
                label={t("attachment_english")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                preview={
                  deletedFiles.includes("dm_file")
                    ? undefined
                    : data?.decisionData?.dm_file
                }
                onClearPreview={() => {
                  field.handleChange(null);
                  setDeletedFiles((prev) => [...prev, "dm_file"]);
                }}
              />
            )}
          />

          <form.Field
            name="dm_file_arabic"
            validators={{
              onSubmit: ({ value }) => {
                return data?.decisionData?.dm_file_arabic
                  ? deletedFiles.includes("dm_file_arabic") &&
                      !value &&
                      t("required-field")
                  : !value && t("required-field");
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
                onBlur={field.handleBlur}
                label={t("attachment_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                preview={
                  deletedFiles.includes("dm_file_arabic")
                    ? undefined
                    : data?.decisionData?.dm_file_arabic
                }
                onClearPreview={() => {
                  field.handleChange(null);
                  setDeletedFiles((prev) => [...prev, "dm_file_arabic"]);
                }}
              />
            )}
          />

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
        description={t("decision_updated_success_message")}
        onConfirm={() => {
          queryClient.invalidateQueries({
            queryKey: ["federalEditDecisionFormData"],
          });
          queryClient.invalidateQueries({
            queryKey: ["federalDecisionTable"],
          });
          // navigate({
          //   to: `/${i18n.language}/local-decisions`,
          // });
        }}
      />
    </DashboardLayout>
  );
}
