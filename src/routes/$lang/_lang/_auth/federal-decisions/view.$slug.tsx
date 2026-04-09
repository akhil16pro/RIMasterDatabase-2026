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

  const { data, isLoading, error } = useQuery({
    queryKey: ["federalViewDecisionFormData", slug, i18n.language],
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

  return (
    <DashboardLayout isLoading={isLoading} title={t("view_decision")}>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
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
          readOnly={true}
          preview={data?.decisionData?.dm_file}
          onClick={previewEN}
          isLoading={isLoadingEN}
        />

        <Input
          type="file"
          accept=".pdf"
          label={t("attachment_arabic")}
          readOnly={true}
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
      </div>
    </DashboardLayout>
  );
}
