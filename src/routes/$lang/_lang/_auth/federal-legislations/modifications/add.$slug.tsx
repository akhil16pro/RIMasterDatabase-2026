import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";

import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import { Plus } from "lucide-react";
import { useState } from "react";

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

import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { LegislationModificationForm } from "@/components/form/LegislationModificationForm";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-legislations/modifications/add/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any, search: any) => {
      return [
        {
          key: "modifications",
          path: `/${params.lang}/federal-legislations/modifications/${params.slug}`,
        },
        {
          key: "add",
          path: `/${params.lang}/federal-legislations/modifications/add/${params.slug}`,
        },
      ];
    },
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["federal_modificationFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/modifications/create/${slug}`)
          .json<any>();
        // console.log("modification_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("local_legislation_form_data_error", error);
        return null;
      }
    },
  });

  const [initialValues, setInitialValues] = useState({
    lm_has_english_version: "2",
    lm_title: "",
    lm_title_arabic: "",
    lm_short_title: "",
    lm_short_title_arabic: "",
    lm_description: "",
    lm_description_arabic: "",
    lm_year: "",
    lm_issue_date: "",
    lm_effective_date: "",
    lm_pdf_file: "",
    lm_pdf_file_arabic: "",
    lm_gazette_number: "",
    lm_gazette_number_arabic: "",
    lm_official_gazette_issue_date: "",
    lm_gazette_title: "",
    lm_gazette_title_arabic: "",
    lm_gazzette_date_string: "",
  });

  const handleStore = async (values: any) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    console.log("FormData content:", Object.fromEntries(formData.entries()));
    try {
      const res = await apiClient
        .post(i18n.language + `/modifications/store/` + slug, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();

      if (res?.status) {
        toast.success(res?.message || t("success"));
        queryClient.invalidateQueries({
          queryKey: ["federal_legislations_modifications_table", slug],
        });
        setTimeout(() => {
          setThankYouPopup(true);
        }, 150);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      isLoading={isLoading}
      title={t("add_modification") + `<small>${data?.label}</small>`}
    >
      <LegislationModificationForm
        mode="add"
        initialValues={initialValues}
        data={data}
        onSubmit={handleStore}
        isSubmitting={isSubmitting}
      />
      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("submitted_successfully")}
        description={data?.success_message}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/federal-legislations/modifications/${slug}`,
          });
        }}
      />
    </DashboardLayout>
  );
}
