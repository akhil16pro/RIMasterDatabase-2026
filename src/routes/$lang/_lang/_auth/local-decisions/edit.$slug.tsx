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
import { usePDFPreview } from "@/lib/usePDFPreview";
import { CustomForm } from "@/components/form/CustomForm";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-decisions/edit/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "edit",
      path: `/${params.lang}/local-decisions/edit/${params.slug}`,
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
    queryKey: ["localEditDecisionFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-decision/edit/${slug}`)
          .json<any>();
        // console.log("local_decision_edit_form_data", res?.data);
        return res?.data;
      } catch (error) {
        console.log("local_decision_form_data_error", error);
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
  //     dm_file: null,
  //     dm_file_arabic: null,
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
  //       formData.append(
  //         "dm_decision_type_id",
  //         value.dm_decision_type_id.toString() || "",
  //       );
  //       formData.append("dm_title", value.dm_title || "");
  //       formData.append("dm_title_arabic", value.dm_title_arabic || "");
  //       formData.append("dm_decision_date", value.dm_decision_date || "");
  //       formData.append("dm_details", value.dm_details || "");
  //       formData.append("dm_details_arabic", value.dm_details_arabic || "");
  //       formData.append("dm_year", value.dm_year.toString() || "");
  //       formData.append("dm_authority_title", value.dm_authority_title || "");
  //       formData.append(
  //         "dm_authority_title_arabic",
  //         value.dm_authority_title_arabic || "",
  //       );

  //       if (value.dm_file) {
  //         formData.append("dm_file", value.dm_file);
  //       }
  //       if (value.dm_file_arabic) {
  //         formData.append("dm_file_arabic", value.dm_file_arabic);
  //       }

  //       const res = await apiClient
  //         .post(i18n.language + `/local-decision/update/${slug}`, {
  //           headers: {
  //             "Content-Type": undefined,
  //           },
  //           body: formData,
  //         })
  //         .json<any>();

  //       // console.log(res, "local_legislation_update_res");
  //       if (res?.status) {
  //         // form.reset();
  //         toast.success(res?.message || t("success"));

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

  // useEffect(() => {
  //   if (data?.decisionData) {
  //     form.setFieldValue(
  //       "local_government",
  //       userSession?.user?.userEmirateName || "",
  //     );
  //     form.setFieldValue(
  //       "dm_decision_type_id",
  //       data?.decisionData?.dm_decision_type_id.toString() || "",
  //     );
  //     form.setFieldValue("dm_title", data?.decisionData?.dm_title || "");
  //     form.setFieldValue(
  //       "dm_title_arabic",
  //       data?.decisionData?.dm_title_arabic || "",
  //     );
  //     form.setFieldValue(
  //       "dm_decision_date",
  //       data?.decisionData?.dm_decision_date || "",
  //     );
  //     form.setFieldValue(
  //       "dm_year",
  //       data?.decisionData?.dm_year.toString() || "",
  //     );
  //     form.setFieldValue(
  //       "dm_authority_title",
  //       data?.decisionData?.dm_authority_title || "",
  //     );
  //     form.setFieldValue(
  //       "dm_authority_title_arabic",
  //       data?.decisionData?.dm_authority_title_arabic || "",
  //     );
  //     form.setFieldValue("dm_details", data?.decisionData?.dm_details || "");
  //     form.setFieldValue(
  //       "dm_details_arabic",
  //       data?.decisionData?.dm_details_arabic || "",
  //     );

  //     form.setFieldValue("dm_file", "");
  //     form.setFieldValue("dm_file_arabic", "");
  //   }
  // }, [data, form, userSession]);

  const { preview: previewEN, isLoading: isLoadingEN } = usePDFPreview(
    data?.decisionData?.dm_slug,
    "en",
    "decision",
  );
  const { preview: previewAR, isLoading: isLoadingAR } = usePDFPreview(
    data?.decisionData?.dm_slug,
    "ar",
    "decision",
  );

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
        onSubmit: ({ value }) => {
          return data?.decisionData?.dm_file
            ? deletedFiles.includes("dm_file") && !value && t("required-field")
            : !value && t("required-field");
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
      },
      preview: deletedFiles.includes("dm_file")
        ? undefined
        : data?.decisionData?.dm_file,

      onClearPreview: () => {
        setDeletedFiles((prev) => [...prev, "dm_file"]);
      },
      onClick: () => previewEN(),
      isLoading: isLoadingEN,
    },
    {
      name: "dm_file_arabic",
      label: t("attachment_arabic"),
      type: "file",
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => {
          return data?.decisionData?.dm_file_arabic
            ? deletedFiles.includes("dm_file_arabic") &&
                !value &&
                t("required-field")
            : !value && t("required-field");
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
      },
      preview: deletedFiles.includes("dm_file_arabic")
        ? undefined
        : data?.decisionData?.dm_file_arabic,

      onClearPreview: () => {
        setDeletedFiles((prev) => [...prev, "dm_file_arabic"]);
      },
      onClick: () => previewAR(),
      isLoading: isLoadingAR,
    },
  ];

  useEffect(() => {
    if (data?.decisionData) {
      setInitialValues({
        local_government: userSession?.user?.userEmirateName || "",
        dm_decision_type_id: data?.decisionData?.dm_decision_type_id,
        dm_title: data?.decisionData?.dm_title,
        dm_title_arabic: data?.decisionData?.dm_title_arabic,
        dm_decision_date: data?.decisionData?.dm_decision_date,

        dm_year: data?.decisionData?.dm_year,
        dm_authority_title: data?.decisionData?.dm_authority_title,
        dm_authority_title_arabic:
          data?.decisionData?.dm_authority_title_arabic,
        dm_details: data?.decisionData?.dm_details,
        dm_details_arabic: data?.decisionData?.dm_details_arabic,
        dm_file: null,
        dm_file_arabic: null,
      });
    }
  }, [data]);

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
      .post(i18n.language + `/local-decision/update/${slug}`, {
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
    <DashboardLayout isLoading={isLoading} title={t("edit_decision")}>
      <CustomForm
        key={data?.decisionData?.updated_at || "customFormLoading"}
        fields={fields}
        defaultValues={initialValues}
        onSubmit={handleStore}
        data={data}
        t={t}
        mode="edit"
        isSubmitting={isSubmitting}
      />

      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("updated_successfully")}
        description={t("decision_updated_success_message")}
        onConfirm={() => {
          queryClient.invalidateQueries({
            queryKey: ["localEditDecisionFormData"],
          });
          queryClient.invalidateQueries({
            queryKey: ["localDecisionTable"],
          });

          // navigate({
          //   to: `/${i18n.language}/local-decisions`,
          // });
        }}
      />
    </DashboardLayout>
  );
}
