import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { usePDFPreview } from "@/lib/usePDFPreview";
import EditBadge from "@/components/ui/EditBadge";
import { LegislationModificationForm } from "@/components/form/LegislationModificationForm";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-legislations/modifications/view/$slug",
)({
  component: RouteComponent,

  staticData: {
    breadcrumb: (params: any, search: any) => {
      return [
        {
          key: "modifications",
          path: `/${params.lang}/local-legislations/modifications/${search?.parentSlug}`,
        },
        {
          key: "view",
          path: `/${params.lang}/local-legislations/modifications/view/${params.slug}`,
        },
      ];
    },
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["localLegislationModificationViewFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/modifications/edit/${slug}`)
          .json<any>();
        // console.log("modification_view_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("modification_view_form_data_error", error);
        return null;
      }
    },
  });
  const { preview: previewEN, isLoading: isLoadingEN } = usePDFPreview(
    data?.lawData?.lm_slug,
    "en",
    "legislation",
  );
  const { preview: previewAR, isLoading: isLoadingAR } = usePDFPreview(
    data?.lawData?.lm_slug,
    "ar",
    "legislation",
  );

  const [initialValues, setInitialValues] = useState({
    lm_has_english_version: "2",
    local_government: userSession?.user?.userEmirateName || "",
    lm_title: "",
    lm_title_arabic: "",
    lm_short_title: "",
    lm_short_title_arabic: "",
    lm_year: "",
    lm_issue_date: "",
    lm_effective_date: "",
    lm_gazette_number: "",
    lm_gazette_number_arabic: "",
    lm_official_gazette_issue_date: "",
    lm_gazette_title: "",
    lm_gazette_title_arabic: "",
    lm_pdf_file: null,
    lm_pdf_file_arabic: null,
    lm_gazzette_date_string: "",
    lm_description: "",
    lm_description_arabic: "",
  });
  useEffect(() => {
    if (userSession?.user) {
      setInitialValues((prev) => ({
        ...prev,
        // local_government: userSession?.user?.userEmirateName || "",
      }));
    }
  }, [userSession]);

  useEffect(() => {
    if (data?.lawData) {
      setInitialValues({
        lm_has_english_version:
          data.lawData?.lm_has_english_version?.toString() || "2",
        local_government: userSession?.user?.userEmirateName || "",
        lm_title: data.lawData?.lm_title || "",
        lm_title_arabic: data.lawData?.lm_title_arabic || "",
        lm_short_title: data.lawData?.lm_short_title || "",
        lm_short_title_arabic: data.lawData?.lm_short_title_arabic || "",
        lm_year: data.lawData?.lm_year?.toString() || "",
        lm_issue_date: data.lawData?.lm_issue_date || "",
        lm_effective_date: data.lawData?.lm_effective_date || "",
        lm_gazette_number: data.lawData?.lm_gazette_number || "",
        lm_gazette_number_arabic: data.lawData?.lm_gazette_number_arabic || "",
        lm_official_gazette_issue_date:
          data.lawData?.lm_official_gazette_issue_date || "",
        lm_gazette_title: data.lawData?.lm_gazette_title || "",
        lm_gazette_title_arabic: data.lawData?.lm_gazette_title_arabic || "",
        lm_pdf_file: null,
        lm_pdf_file_arabic: null,
        lm_gazzette_date_string: data.lawData?.lm_gazzette_date_string || "",
        lm_description: data.lawData?.lm_description || "",
        lm_description_arabic: data.lawData?.lm_description_arabic || "",
      });
    }
  }, [data]);

  return (
    <DashboardLayout
      isLoading={isLoading}
      title={
        t("view_modification") + `<small>${data?.parentLaw?.label}</small>`
      }
    >
      <LegislationModificationForm
        mode="view"
        initialValues={initialValues}
        data={data}
        previewEN={previewEN}
        previewAR={previewAR}
        isLoadingEN={isLoadingEN}
        isLoadingAR={isLoadingAR}
      />
      <EditBadge data={data?.lawData} />
    </DashboardLayout>
  );
}
