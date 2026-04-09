import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";

import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { Plus } from "lucide-react";
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
import { CustomForm } from "@/components/form/CustomForm";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-decisions/add",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "add",
      path: `/${params.lang}/federal-decisions/add`,
    }),
  },
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [thankYouPopup, setThankYouPopup] = useState(false);

  const [initialValues, setInitialValues] = useState({
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
    dm_file: "",
    dm_file_arabic: "",
  });

  useEffect(() => {
    if (userSession?.user) {
      setInitialValues((prev) => ({
        ...prev,
        local_government: userSession?.user?.userEmirateName || "",
      }));
    }
  }, [userSession]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["federalDecisionFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/federal-decision/create`)
          .json<any>();
        console.log("federal_decision_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("federal_decision_form_data_error", error);
        return null;
      }
    },
  });

  // const form = useForm({
  //   defaultValues: {
  //     local_government: userSession?.user?.userEmirateName || "",
  //     dm_decision_type_id: "",
  //     dm_title: "",
  //     dm_title_arabic: "",
  //     dm_decision_date: "",
  //     dm_year: "",
  //     dm_authority_title: "",
  //     dm_authority_title_arabic: "",
  //     dm_details: "",
  //     dm_details_arabic: "",
  //     dm_file: "",
  //     dm_file_arabic: "",
  //   },
  //   onSubmit: async ({ value }) => {
  //     setIsSubmitting(true);

  //     try {
  //       const formData = new FormData();

  //       formData.append("dm_created_by", userSession?.user?.id || "");

  //       formData.append(
  //         "local_government",
  //         userSession?.user?.userEmirateId || "",
  //       );
  //       formData.append("dm_decision_type_id", value.dm_decision_type_id);
  //       formData.append("dm_title", value.dm_title);
  //       formData.append("dm_title_arabic", value.dm_title_arabic);
  //       formData.append("dm_decision_date", value.dm_decision_date);

  //       formData.append("dm_year", value.dm_year);
  //       formData.append("dm_authority_title", value.dm_authority_title);
  //       formData.append(
  //         "dm_authority_title_arabic",
  //         value.dm_authority_title_arabic,
  //       );
  //       formData.append("dm_details", value.dm_details);
  //       formData.append("dm_details_arabic", value.dm_details_arabic);

  //       if (value.dm_file) {
  //         formData.append("dm_file", value.dm_file);
  //       }
  //       if (value.dm_file_arabic) {
  //         formData.append("dm_file_arabic", value.dm_file_arabic);
  //       }

  //       const res = await apiClient
  //         .post(i18n.language + "/local-decision/store", {
  //           headers: {
  //             "Content-Type": undefined,
  //           },
  //           body: formData,
  //         })
  //         .json<any>();

  //       // console.log(res, "local_decision_store_res");
  //       if (res?.status) {
  //         form.reset();
  //         toast.success(res?.message || t("success"));
  //         queryClient.invalidateQueries({
  //           queryKey: ["federalDecisionTable"],
  //         });
  //         setTimeout(() => {
  //           setThankYouPopup(true);
  //         }, 150);
  //       }
  //     } catch (error) {
  //       console.error("Add request failed:", error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   },
  // });

  const fields: FieldConfig[] = [
    {
      name: "local_government",
      label: t("local_government"),
      type: "text",
      disabled: true,
    },
    {
      name: "dm_decision_type_id",
      label: t("decision_type"),
      type: "select",
      optionsKey: "decisionTypeList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },

    { name: "dm_title", label: t("legislation_title_english"), type: "text" },
    {
      name: "dm_title_arabic",
      label: t("legislation_title_arabic"),
      type: "text",
      dir: "rtl",
    },
    {
      name: "dm_decision_date",
      label: t("decision_date"),
      type: "date",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },
    {
      name: "dm_year",
      label: t("decision_year"),
      type: "select",
      optionsKey: "yearList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },
    {
      name: "dm_authority_title",
      label: t("authority_title"),
      type: "text",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },
    {
      name: "dm_authority_title_arabic",
      label: t("authority_title_arabic"),
      type: "text",
      dir: "rtl",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },
    {
      name: "dm_details",
      label: t("details_english"),
      type: "editor",
      colSpan: 2,
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },
    {
      name: "dm_details_arabic",
      label: t("details_arabic"),
      type: "editor",
      colSpan: 2,
      dir: "rtl",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
      },
    },

    {
      name: "dm_file",
      label: t("attachment"),
      type: "file",
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
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
      },
    },
    {
      name: "dm_file_arabic",
      label: t("attachment_arabic"),
      type: "file",
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required-field") : null),
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
      },
    },
  ];

  const handleStore = async (values) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    console.log("FormData content:", Object.fromEntries(formData.entries()));
    const res = await apiClient
      .post(i18n.language + `/federal-decision/store`, {
        headers: {
          "Content-Type": undefined,
        },
        body: formData,
      })
      .json<any>();

    if (res?.status) {
      setIsSubmitting(false);

      toast.success(res?.message || t("success"));
      queryClient.invalidateQueries({
        queryKey: ["federalDecisionTable"],
      });
      setTimeout(() => {
        setThankYouPopup(true);
      }, 150);
    }
  };

  return (
    <DashboardLayout isLoading={isLoading} title={t("add_decision")}>
      <CustomForm
        key={"customFormAdd"}
        fields={fields}
        defaultValues={initialValues}
        onSubmit={handleStore}
        data={data}
        t={t}
        mode="add"
        isSubmitting={isSubmitting}
      />
      {/* <form
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

        

          <form.Field
            name="dm_year"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Select
                id="dm_year"
                name="dm_year"
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
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
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
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.handleChange(file);
                }}
                onBlur={field.handleBlur}
                label={t("attachment_english")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          />

          <form.Field
            name="dm_file_arabic"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
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
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.handleChange(file);
                }}
                onBlur={field.handleBlur}
                label={t("attachment_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          />

          <div className="col-span-full">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("submit")}
              onClick={form.handleSubmit}
              icon={<Plus className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </form> */}
      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("submitted_successfully")}
        description={t("decision_created_success_message")}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/federal-decisions`,
          });
        }}
      />
    </DashboardLayout>
  );
}
