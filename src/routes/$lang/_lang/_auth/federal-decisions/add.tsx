import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { CustomForm, type FieldConfig } from "@/components/form/CustomForm";
import { FILE_ACCEPT_STRING, validateDocumentFile } from "@/lib/fileFormats";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-decisions/add",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "add",
      path: `/${params.lang}/federal-decisions/add`,
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
  const isAdmin = userSession?.user?.roles?.includes("admin");
  const [initialValues, setInitialValues] = useState({
    // local_government: userSession?.user?.userEmirateName || "",
    dm_decision_type_id: "",
    dm_court_id: "",
    dm_entity_id: "",

    dm_title: "",
    dm_title_arabic: "",
    dm_decision_date: "",
    dm_number: "",
    dm_year: "",
    // dm_authority_title: "",
    // dm_authority_title_arabic: "",
    dm_details: "",
    dm_details_arabic: "",
    dm_file: "",
    dm_file_arabic: "",
    dm_location_emirate: "",
  });

  useEffect(() => {
    if (userSession?.user) {
      setInitialValues((prev) => ({
        ...prev,
        // local_government: userSession?.user?.userEmirateName || "",
      }));
    }
  }, [userSession]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["federalDecisionFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/federal-decision/create`)
          .json<any>();
        console.log("federal_decision_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("federal_decision_form_data_error", error);
        return null;
      }
    },
  });

  const fields: FieldConfig[] = [
    {
      name: "dm_court_id",
      label: t("federal_court"),
      type: "select",
      optionsKey: "decisionCourtList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_decision_type_id",
      label: t("court_decision_type"),
      type: "select",
      optionsKey: "decisionTypeList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },

    {
      name: "dm_title",
      label: t("court_decision_title_english"),
      type: "text",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_title_arabic",
      label: t("court_decision_title_arabic"),
      type: "text",
      dir: "rtl",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_decision_date",
      label: t("court_decision_date"),
      type: "date",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_number",
      label: t("court_decision_number"),
      type: "number",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_year",
      label: t("court_decision_year"),
      type: "select",
      optionsKey: "yearList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_details",
      label: t("court_decision_details_english"),
      type: "editor",
      className: "col-span-full",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },
    {
      name: "dm_details_arabic",
      label: t("court_decision_details_arabic"),
      type: "editor",
      className: "col-span-full",
      dir: "rtl",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    },

    {
      name: "dm_file",
      label: t("court_decision_file_english"),
      type: "file",
      accept: FILE_ACCEPT_STRING,
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
        onChange: ({ value }) => validateDocumentFile(value, t),
      },
    },
    {
      name: "dm_file_arabic",
      label: t("court_decision_file_arabic"),
      type: "file",
      accept: FILE_ACCEPT_STRING,
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
        onChange: ({ value }) => validateDocumentFile(value, t),
      },
    },
    {
      name: "dm_location_emirate",
      label: t("location"),
      type: "multiSelect",
      optionsKey: "emirateList",
      validators: {
        onSubmit: ({ value }) => {
          if (!value || value.length === 0) return t("required_field");
          return null;
        },
      },
    },
    // {
    //   name: "dm_authority_title",
    //   label: t("authority_title"),
    //   type: "text",
    //   validators: {
    //     onSubmit: ({ value }) => (!value ? t("required_field") : null),
    //   },
    // },
    // {
    //   name: "dm_authority_title_arabic",
    //   label: t("authority_title_arabic"),
    //   type: "text",
    //   dir: "rtl",
    //   validators: {
    //     onSubmit: ({ value }) => (!value ? t("required_field") : null),
    //   },
    // },
  ];

  if (isAdmin) {
    fields.unshift({
      name: "dm_entity_id",
      label: t("entity"),
      type: "select",
      optionsKey: "entityList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
    });
  }

  const handleStore = async (values: any) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item as string);
          });
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });
    console.log("FormData content:", Object.fromEntries(formData.entries()));
    try {
      const res = await apiClient
        .post(i18n.language + `/federal-decision/store`, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();

      if (res?.status) {
        toast.success(res?.message || t("success"));
        queryClient.invalidateQueries({
          queryKey: ["federalDecisionTable"],
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
    <DashboardLayout isLoading={isLoading} title={t("add_decision")}>
      <CustomForm
        key={"customFormAdd"}
        fields={fields}
        defaultValues={initialValues}
        onSubmit={handleStore}
        data={data}
        mode="add"
        isSubmitting={isSubmitting}
      />

      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("submitted_successfully")}
        description={t("decision_created_success_message")}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/federal-decisions`,
          });
        }}
      />
    </DashboardLayout>
  );
}
