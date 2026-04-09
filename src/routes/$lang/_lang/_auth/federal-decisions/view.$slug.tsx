import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/label";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";

import { usePDFPreview } from "@/lib/usePDFPreview";
import { useState, useEffect } from "react";
import { CustomForm } from "@/components/form/CustomForm";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-decisions/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/federal-decisions/view/${params.slug}`,
    }),
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

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
    queryKey: ["federalViewDecisionFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/federal-decision/edit/${slug}`)
          .json<any>();
        // console.log("federal_decision_view_form_data", res?.data);
        return res?.data;
      } catch (error) {
        console.log("federal_decision_form_data_error", error);
        return null;
      }
    },
  });
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
      preview: data?.decisionData?.dm_file,
      onClick: () => previewEN(),
      isLoading: isLoadingEN,
    },
    {
      name: "dm_file_arabic",
      label: t("attachment_arabic"),
      type: "file",
      accept: ".pdf",
      preview: data?.decisionData?.dm_file_arabic,
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

  return (
    <DashboardLayout isLoading={isLoading} title={t("view_decision")}>
      <CustomForm
        fields={fields}
        defaultValues={initialValues}
        data={data}
        t={t}
        mode="view"
      />
    </DashboardLayout>
  );
}
