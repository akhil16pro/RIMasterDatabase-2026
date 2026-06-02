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
import { toast } from "@/lib/toast";
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
import { LegislationForm } from "@/components/form/LegislationForm";
import EditBadge from "@/components/ui/EditBadge";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-legislations/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/federal-legislations/view/${params.slug}`,
    }),
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["federalLegislationFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const [createRes, editRes] = await Promise.all([
          apiClient
            .get(`${i18n.language}/federal-legislation/create`)
            .json<any>(),
          apiClient
            .get(`${i18n.language}/federal-legislation/edit/${slug}`)
            .json<any>(),
        ]);

        return { ...createRes?.data, ...editRes?.data };
      } catch (error) {
        console.log("federal_legislation_form_data_error", error);
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
    lm_law_type_id: "",
    lm_sector_id: "",
    lm_title: "",
    lm_title_arabic: "",
    lm_short_title: "",
    lm_short_title_arabic: "",
    lm_description: "",
    lm_description_arabic: "",
    lm_year: "",
    lm_has_modified: "2",
    lm_number: "",
    lm_issue_date: "",
    lm_effective_date: "",
    lm_pdf_file: "",
    lm_pdf_file_arabic: "",
    lm_gazette_number: "",
    lm_gazette_number_arabic: "",
    lm_official_gazette_issue_date: "",
    lm_gazzette_date_string: "",
    lm_gazette_title: "",
    lm_gazette_title_arabic: "",
  });
  useEffect(() => {
    if (userSession?.user) {
      setInitialValues((prev) => ({
        ...prev,
      }));
    }
  }, [userSession]);

  useEffect(() => {
    if (data?.lawData) {
      setInitialValues({
        lm_has_english_version:
          data.lawData?.lm_has_english_version?.toString() || "2",
        lm_law_type_id: data?.lawData?.lm_law_type_id?.toString() || "",
        lm_sector_id: data?.lawData?.lm_sector_id?.toString() || "",
        lm_title: data?.lawData?.lm_title,
        lm_title_arabic: data?.lawData?.lm_title_arabic,
        lm_short_title: data?.lawData?.lm_short_title,
        lm_short_title_arabic: data?.lawData?.lm_short_title_arabic,
        lm_description: data?.lawData?.lm_description,
        lm_description_arabic: data?.lawData?.lm_description_arabic,
        lm_year: data?.lawData?.lm_year?.toString() || "",
        lm_has_modified: data?.lawData?.lm_has_modified?.toString() || "2",
        lm_number: data?.lawData?.lm_number,
        lm_issue_date: data?.lawData?.lm_issue_date,
        lm_effective_date: data?.lawData?.lm_effective_date,
        lm_pdf_file: null,
        lm_pdf_file_arabic: null,
        lm_gazette_number: data?.lawData?.lm_gazette_number,
        lm_gazette_number_arabic: data?.lawData?.lm_gazette_number_arabic,
        lm_official_gazette_issue_date:
          data?.lawData?.lm_official_gazette_issue_date,
        lm_gazzette_date_string: data?.lawData?.lm_gazzette_date_string,
        lm_gazette_title: data?.lawData?.lm_gazette_title,
        lm_gazette_title_arabic: data?.lawData?.lm_gazette_title_arabic,
      });
    }
  }, [data]);

  return (
    <DashboardLayout isLoading={isLoading} title={t("view_legislation")}>
      <LegislationForm
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
