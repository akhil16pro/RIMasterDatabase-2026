import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { usePDFPreview } from "@/lib/usePDFPreview";
import { LegislationModificationForm } from "@/components/form/LegislationModificationForm";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-legislations/modifications/edit/$slug",
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      parentSlug: (search.parentSlug as string) || "default",
    };
  },
  staticData: {
    breadcrumb: (params: any, search: any) => {
      return [
        {
          key: "modifications",
          path: `/${params.lang}/federal-legislations/modifications/${search?.parentSlug}`,
        },
        {
          key: "edit",
          path: `/${params.lang}/federal-legislations/modifications/edit/${params.slug}`,
        },
      ];
    },
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { parentSlug } = Route.useSearch();

  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [thankYouPopup, setThankYouPopup] = useState(false);

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "federalLegislationModificationEditFormData",
      slug,
      i18n.language,
    ],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        // const [createRes, editRes] = await Promise.all([
        //   apiClient
        //     .get(`${i18n.language}/modifications/create/${slug}`)
        //     .json<any>(),
        //   apiClient
        //     .get(`${i18n.language}/modifications/edit/${slug}`)
        //     .json<any>(),
        // ]);
        // console.log(createRes?.data, "createRes");
        // console.log(editRes?.data, "editRes");
        // return { ...createRes?.data, ...editRes?.data };

        const res = await apiClient
          .get(i18n.language + `/modifications/edit/${slug}`)
          .json<any>();
        // console.log("federal_modification_edit_form_data", res?.data);

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
  //     local_government: userSession?.user?.userEmirateName || "",

  //     lm_title: "",
  //     lm_title_arabic: "",
  //     lm_short_title: "",
  //     lm_short_title_arabic: "",

  //     lm_year: "",
  //     lm_issue_date: "",
  //     lm_effective_date: "",
  //     lm_gazette_number: "",
  //     lm_gazette_number_arabic: "",
  //     lm_official_gazette_issue_date: "",
  //     lm_gazette_title: "",
  //     lm_gazette_title_arabic: "",
  //     lm_pdf_file: null,
  //     lm_pdf_file_arabic: null,
  //   },
  //   onSubmit: async ({ value }) => {
  //     setIsSubmitting(true);

  //     try {
  //       const formData = new FormData();

  //       formData.append("lm_has_english_version", value.lm_has_english_version);
  //       formData.append("lm_title", value.lm_title);
  //       formData.append("lm_title_arabic", value.lm_title_arabic);
  //       formData.append("lm_short_title", value.lm_short_title);
  //       formData.append("lm_short_title_arabic", value.lm_short_title_arabic);

  //       formData.append("lm_year", value.lm_year.toString());
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
  //         .post(i18n.language + `/modifications/update/${slug}`, {
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
  //   if (data?.lawData) {
  //     form.setFieldValue(
  //       "lm_has_english_version",
  //       data.lawData?.lm_has_english_version?.toString() || "2",
  //     );

  //     form.setFieldValue("lm_title", data?.lawData?.lm_title || "");
  //     form.setFieldValue(
  //       "lm_title_arabic",
  //       data?.lawData?.lm_title_arabic || "",
  //     );
  //     form.setFieldValue("lm_short_title", data?.lawData?.lm_short_title || "");
  //     form.setFieldValue(
  //       "lm_short_title_arabic",
  //       data?.lawData?.lm_short_title_arabic || "",
  //     );

  //     form.setFieldValue("lm_year", data?.lawData?.lm_year?.toString() || "");
  //     form.setFieldValue("lm_issue_date", data?.lawData?.lm_issue_date || "");

  //     form.setFieldValue("lm_pdf_file", "");
  //     form.setFieldValue("lm_pdf_file_arabic", "");
  //     form.setFieldValue(
  //       "lm_gazette_number",
  //       data?.lawData?.lm_gazette_number || "",
  //     );
  //     form.setFieldValue(
  //       "lm_gazette_number_arabic",
  //       data?.lawData?.lm_gazette_number_arabic || "",
  //     );
  //     form.setFieldValue(
  //       "lm_official_gazette_issue_date",
  //       data?.lawData?.lm_official_gazette_issue_date || "",
  //     );
  //     form.setFieldValue(
  //       "lm_gazette_title",
  //       data?.lawData?.lm_gazette_title || "",
  //     );
  //     form.setFieldValue(
  //       "lm_gazette_title_arabic",
  //       data?.lawData?.lm_gazette_title_arabic || "",
  //     );
  //   }
  // }, [data, form, userSession]);

  // const handleClearFile = (fieldName: string, previewKey: string) => {
  //   form.setFieldValue(fieldName as any, null);

  //   setDeletedFiles((prev) => [...prev, previewKey]);
  // };

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
        .post(i18n.language + `/modifications/update/${slug}`, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();

      if (res?.status) {
        toast.success(res?.message || t("success"));

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
      title={
        t("edit_governments_legislations") +
        `<small>${data?.parentLaw?.label}</small>`
      }
    >
      <LegislationModificationForm
        mode="edit"
        initialValues={initialValues}
        data={data}
        onSubmit={handleStore}
        isSubmitting={isSubmitting}
        previewEN={previewEN}
        previewAR={previewAR}
        isLoadingEN={isLoadingEN}
        isLoadingAR={isLoadingAR}
      />
      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("updated_successfully")}
        description={
          data?.parentLaw?.success_message || t("law_updated_success_message")
        }
        onConfirm={() => {
          queryClient.invalidateQueries({
            queryKey: ["federalLegislationModificationEditFormData"],
          });
          queryClient.invalidateQueries({
            queryKey: ["federal_legislations_modifications_table"],
          });
          navigate({
            to: `/${i18n.language}/federal-legislations/modifications/${parentSlug}`,
          });
        }}
      />
    </DashboardLayout>
  );
}
