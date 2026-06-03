import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { LegislationForm } from "@/components/form/LegislationForm";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-legislations/add",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "add",
      path: `/${params.lang}/federal-legislations/add`,
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["federalLegislationFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/federal-legislation/create`)
          .json<any>();
        // console.log("federal_legislation_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("federal_legislation_form_data_error", error);
        return null;
      }
    },
  });

  // const form = useForm({
  //   defaultValues: {
  //     lm_has_english_version: "2",
  //     lm_law_type_id: "",
  //     lm_sector_id: "",
  //     lm_title: "",
  //     lm_title_arabic: "",
  //     lm_short_title: "",
  //     lm_short_title_arabic: "",
  //     lm_description: "",
  //     lm_description_arabic: "",
  //     lm_year: "",
  //     lm_has_modified: "2",
  //     lm_number: "",
  //     lm_issue_date: "",
  //     lm_effective_date: "",
  //     lm_pdf_file: "",
  //     lm_pdf_file_arabic: "",
  //     lm_gazette_number: "",
  //     lm_gazette_number_arabic: "",
  //     lm_official_gazette_issue_date: "",
  //     lm_gazzette_date_string: "",
  //     lm_gazette_title: "",
  //     lm_gazette_title_arabic: "",
  //   },
  //   onSubmit: async ({ value }) => {
  //     setIsSubmitting(true);

  //     try {
  //       const formData = new FormData();

  //       formData.append("lm_created_by", userSession?.user?.id || "");
  //       formData.append("lm_has_english_version", value.lm_has_english_version);
  //       formData.append("lm_sector_id", value.lm_sector_id);
  //       formData.append("lm_law_type_id", value.lm_law_type_id);
  //       formData.append("lm_title", value.lm_title);
  //       formData.append("lm_title_arabic", value.lm_title_arabic);
  //       formData.append("lm_short_title", value.lm_short_title);
  //       formData.append("lm_short_title_arabic", value.lm_short_title_arabic);
  //       formData.append("lm_description", value.lm_description);
  //       formData.append("lm_description_arabic", value.lm_description_arabic);
  //       formData.append("lm_year", value.lm_year);
  //       formData.append("lm_number", value.lm_number);
  //       formData.append("lm_has_modified", value.lm_has_modified);
  //       formData.append("lm_issue_date", value.lm_issue_date);
  //       formData.append("lm_effective_date", value.lm_effective_date);
  //       formData.append("lm_gazette_number", value.lm_gazette_number);

  //       formData.append(
  //         "lm_gazette_number_arabic",
  //         value.lm_gazette_number_arabic,
  //       );
  //       formData.append(
  //         "lm_official_gazette_issue_date",
  //         value.lm_official_gazette_issue_date,
  //       );
  //       formData.append(
  //         "lm_gazzette_date_string",
  //         value.lm_gazzette_date_string,
  //       );
  //       formData.append("lm_gazette_title", value.lm_gazette_title);
  //       formData.append(
  //         "lm_gazette_title_arabic",
  //         value.lm_gazette_title_arabic,
  //       );

  //       if (value.lm_pdf_file) {
  //         formData.append("lm_pdf_file", value.lm_pdf_file);
  //       }
  //       if (value.lm_pdf_file_arabic) {
  //         formData.append("lm_pdf_file_arabic", value.lm_pdf_file_arabic);
  //       }

  //       const res = await apiClient
  //         .post(i18n.language + "/federal-legislation/store", {
  //           headers: {
  //             "Content-Type": undefined,
  //           },
  //           body: formData,
  //         })
  //         .json<any>();

  //       if (res?.status) {
  //         form.reset();
  //         toast.success(res?.message || t("success"));
  //         queryClient.invalidateQueries({
  //           queryKey: ["federalLegislationTable"],
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

  const [initialValues, setInitialValues] = useState({
    lm_entity_id: "",
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
        .post(i18n.language + `/federal-legislation/store`, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();

      console.log(res?.status, "submit");

      if (res?.status) {
        toast.success(res?.message || t("success"));
        queryClient.invalidateQueries({
          queryKey: ["federalLegislationTable"],
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
    <DashboardLayout isLoading={isLoading} title={t("add_legislation")}>
      <LegislationForm
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
        description={t("law_created_success_message")}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/federal-legislations`,
          });
        }}
      />
    </DashboardLayout>
  );
}
