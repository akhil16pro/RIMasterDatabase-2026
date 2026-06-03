import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { usePDFPreview } from "@/lib/usePDFPreview";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CustomForm, type FieldConfig } from "@/components/form/CustomForm";
import EditBadge from "@/components/ui/EditBadge";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/international-treaty/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/international-treaty/view/${params.slug}`,
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
  const isAdmin = userSession?.user?.roles?.includes("admin");
  const { data, isLoading, error } = useQuery({
    queryKey: ["internationalTreatiesFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const [createRes, editRes] = await Promise.all([
          apiClient
            .get(`${i18n.language}/international-treaty/create`)
            .json<any>(),
          apiClient
            .get(`${i18n.language}/international-treaty/edit/${slug}`)
            .json<any>(),
        ]);

        return { ...createRes?.data, ...editRes?.data };
      } catch (error) {
        console.log("international_treaties_form_data_error", error);
        return null;
      }
    },
  });

  const { preview: previewEN, isLoading: isLoadingEN } = usePDFPreview(
    data?.treatyData?.it_slug,
    "en",
    "international-treaty",
  );
  const { preview: previewAR, isLoading: isLoadingAR } = usePDFPreview(
    data?.treatyData?.it_slug,
    "ar",
    "international-treaty",
  );
  const [initialValues, setInitialValues] = useState({
    it_treaty_type: "1",
    it_sector_id: "",
    it_country_id: "",
    it_entity_id: "",
    it_title: "",
    it_title_arabic: "",
    it_treaty_date: "",
    it_treaty_year: "",
    it_expiry_date: "",
    it_attachment: "",
    it_attachment_arabic: "",
  });

  const fields: FieldConfig[] = [
    {
      name: "it_treaty_type",
      label: t("treaty_type"),
      type: "radio",
      optionsKey: "treatyTypeList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "it_sector_id",
      label: t("sector"),
      type: "select",
      optionsKey: "sectorList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
      condition: {
        key: "it_treaty_type",
        value: "2",
      },
    },
    {
      name: "it_country_id",
      label: t("country"),
      type: "select",
      optionsKey: "countryList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
      condition: {
        key: "it_treaty_type",
        value: "1",
      },
    },

    {
      name: "it_title",
      label: t("title_english"),
      type: "text",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "it_title_arabic",
      label: t("title_arabic"),
      type: "text",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "it_treaty_date",
      label: t("treaty_date"),
      type: "date",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
      onChange: (field: any) => {
        field.form.setFieldValue("it_expiry_date", "");
      },
    },
    {
      name: "it_treaty_year",
      label: t("treaty_year"),
      type: "select",
      optionsKey: "yearList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "it_expiry_date",
      label: t("treaty_expiry_date"),
      type: "date",
      validators: {
        onChange: ({ value, fieldApi }) => {
          if (!value) return null;
          const selectedDate = new Date(value);
          const treatyDate = new Date(
            fieldApi.form.getFieldValue("it_treaty_date"),
          );
          if (treatyDate >= selectedDate) {
            return t(
              "the_expiry_date_must_be_after_or_equal_to_the_treaty_date",
            );
          }
          return null;
        },
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
      valueEffect: {
        key: "it_treaty_date",
      },
    },
    {
      name: "it_attachment",
      label: t("treaty_file_english"),
      type: "file",

      preview: deletedFiles.includes("it_attachment")
        ? undefined
        : data?.treatyData?.it_attachment,

      onClearPreview: () => {
        setDeletedFiles((prev) => [...prev, "it_attachment"]);
      },
      onClick: () => previewEN(),
      isLoading: isLoadingEN,
    },
    {
      name: "it_attachment_arabic",
      label: t("treaty_file_arabic"),
      type: "file",

      preview: deletedFiles.includes("it_attachment_arabic")
        ? undefined
        : data?.treatyData?.it_attachment_arabic,

      onClearPreview: () => {
        setDeletedFiles((prev) => [...prev, "it_attachment_arabic"]);
      },
      onClick: () => previewAR(),
      isLoading: isLoadingAR,
    },
  ];

  if (isAdmin) {
    fields.splice(1, 0, {
      name: "it_entity_id",
      label: t("entity"),
      type: "select",
      optionsKey: "entityList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    });
  }
  useEffect(() => {
    if (data?.treatyData) {
      setInitialValues({
        it_entity_id: data?.treatyData?.it_entity_id?.toString() || "",
        it_treaty_type: data?.treatyData?.it_treaty_type?.toString() || "1",
        it_sector_id: data?.treatyData?.it_sector_id?.toString() || "",
        it_country_id: data?.treatyData?.it_country_id?.toString() || "",

        it_title: data?.treatyData?.it_title || "",
        it_title_arabic: data?.treatyData?.it_title_arabic || "",
        it_treaty_date: data?.treatyData?.it_treaty_date || "",
        it_treaty_year: data?.treatyData?.it_treaty_year?.toString() || "",
        it_expiry_date: data?.treatyData?.it_expiry_date || "",
        it_attachment: null,
        it_attachment_arabic: null,
      });
    }
  }, [data]);
  return (
    <DashboardLayout isLoading={isLoading} title={t("view_treaty")}>
      <CustomForm
        fields={fields}
        defaultValues={initialValues}
        data={data}
        mode="view"
      />
      <EditBadge data={data?.treatyData} />
    </DashboardLayout>
  );
}
