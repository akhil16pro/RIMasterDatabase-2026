import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import { useState } from "react";

import { toast } from "sonner";

import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect } from "react";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { CustomForm } from "@/components/form/CustomForm";

export const Route = createFileRoute("/$lang/_lang/_auth/local-decisions/add")({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => {
      return {
        key: "add",
        path: `/${params.lang}/local-decisions/add`,
      };
    },
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
    queryKey: ["localDecisionFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-decision/create`)
          .json<any>();
        // console.log("local_decision_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("local_decision_form_data_error", error);
        return null;
      }
    },
  });

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
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
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
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_year",
      label: t("decision_year"),
      type: "select",
      optionsKey: "yearList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_authority_title",
      label: t("authority_title"),
      type: "text",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_authority_title_arabic",
      label: t("authority_title_arabic"),
      type: "text",
      dir: "rtl",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_details",
      label: t("details_english"),
      type: "editor",
      className: "col-span-full",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_details_arabic",
      label: t("details_arabic"),
      type: "editor",
      dir: "rtl",
      className: "col-span-full",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },

    {
      name: "dm_file",
      label: t("attachment"),
      type: "file",
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
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
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
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
      .post(i18n.language + `/local-decision/store`, {
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
        queryKey: ["localDecisionTable"],
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

      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("submitted_successfully")}
        description={t("decision_created_success_message")}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/local-decisions`,
          });
        }}
      />
    </DashboardLayout>
  );
}
