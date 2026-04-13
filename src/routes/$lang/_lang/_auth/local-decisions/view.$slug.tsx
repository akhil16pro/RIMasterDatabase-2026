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
import { useState, useEffect } from "react";
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
import { CustomForm } from "@/components/form/CustomForm";
import { usePDFPreview } from "@/lib/usePDFPreview";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-decisions/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/local-decisions/view/${params.slug}`,
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
    queryKey: ["localViewDecisionFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-decision/edit/${slug}`)
          .json<any>();
        // console.log("local_decision_view_form_data", res?.data);
        return res?.data;
      } catch (error) {
        console.log("local_decision_form_data_error", error);
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
      colSpan: 2,
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_details_arabic",
      label: t("details_arabic"),
      type: "editor",
      colSpan: 2,
      dir: "rtl",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
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
      {/* <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
        <Input
          value={userSession?.user?.userEmirateName || ""}
          label={t("local_government")}
          disabled={true}
          readOnly={true}
        />

        <Select
          value={data?.decisionData?.dm_decision_type_id.toString() || ""}
        >
          <SelectTrigger
            label={t("decision_type")}
            hasValue={!!data?.decisionData?.dm_decision_type_id}
            readOnly={true}
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
        <Input
          type="text"
          value={data?.decisionData?.dm_title}
          label={t("legislation_title_english")}
          readOnly={true}
        />
        <Input
          type="text"
          value={data?.decisionData?.dm_title_arabic}
          label={t("legislation_title_arabic")}
          readOnly={true}
          dir="rtl"
        />
        <Input
          type="date"
          value={data?.decisionData?.dm_decision_date}
          label={t("decision_date")}
          readOnly={true}
        />

        <Select value={data?.decisionData?.dm_year.toString()}>
          <SelectTrigger
            label={t("decision_year")}
            hasValue={!!data?.decisionData?.dm_year}
            readOnly={true}
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
        <Input
          type="text"
          value={data?.decisionData?.dm_authority_title}
          label={t("authority_title")}
          readOnly={true}
        />

        <Input
          type="text"
          value={data?.decisionData?.dm_authority_title_arabic}
          label={t("authority_title_arabic")}
          readOnly={true}
          dir="rtl"
        />

        <div className="col-span-2">
          <div className="space-y-2 relative">
            <Label htmlFor="dm_details">{t("details_english")}</Label>
            <CKEditorCustom
              value={data?.decisionData?.dm_details}
              disabled={true}
            />
          </div>
        </div>

        <div className="col-span-2">
          <div className="space-y-2 relative">
            <Label htmlFor="dm_details_arabic">{t("details_arabic")}</Label>
            <CKEditorCustom
              dir="rtl"
              value={data?.decisionData?.dm_details_arabic}
              disabled={true}
            />
          </div>
        </div>

        <Input
          type="file"
          accept=".pdf"
          label={t("attachment_english")}
          disabled={true}
          preview={data?.decisionData?.dm_file}
          onClick={previewEN}
          isLoading={isLoadingEN}
        />

        <Input
          type="file"
          accept=".pdf"
          label={t("attachment_arabic")}
          disabled={true}
          preview={data?.decisionData?.dm_file_arabic}
          onClick={previewAR}
          isLoading={isLoadingAR}
        />
        <Input
          type="text"
          value={data?.decisionData?.user_info?.name}
          label={t("submitted_by")}
          readOnly={true}
        />
      </div> */}
    </DashboardLayout>
  );
}
