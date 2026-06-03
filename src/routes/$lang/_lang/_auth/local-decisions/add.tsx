import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect, useCallback } from "react";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { CustomForm, type FieldConfig } from "@/components/form/CustomForm";
import { FILE_ACCEPT_STRING, validateDocumentFile } from "@/lib/fileFormats";
export const Route = createFileRoute("/$lang/_lang/_auth/local-decisions/add")({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => {
      return {
        key: "add",
        path: `/${params.lang}/local-decisions/add`,
      };
    },
  },
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [thankYouPopup, setThankYouPopup] = useState(false);

  const [emirateID, setEmirateID] = useState<number>(null);

  const [decisionTypeByEmirate, setDecisionTypeByEmirate] = useState([]);
  const isAdmin = userSession?.user?.roles?.includes("admin");

  const [initialValues, setInitialValues] = useState({
    dm_emirate_id: !isAdmin ? userSession?.user?.userEmirateName : "",
    dm_decision_type_id: "",
    dm_court_id: "",
    dm_entity_id: "",

    dm_title: "",
    dm_title_arabic: "",
    dm_decision_date: "",
    dm_number: "",

    // dm_year: "",
    // dm_authority_title: "",
    // dm_authority_title_arabic: "",
    dm_details: "",
    dm_details_arabic: "",
    dm_file: "",
    dm_file_arabic: "",
  });

  useEffect(() => {
    if (userSession?.user) {
      setInitialValues((prev) => ({
        ...prev,
        // local_government: userSession?.user?.userEmirateName || "",
      }));

      if (!isAdmin) {
        setEmirateID(userSession?.user?.userEmirateId);
      }
    }
  }, [userSession]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["localDecisionFormData", i18n.language],
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-decision/create`)
          .json<any>();
        console.log("local_decision_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("local_decision_form_data_error", error);
        return null;
      }
    },
  });

  const { data: emirateListChange } = useQuery({
    queryKey: ["emirateListChnage", emirateID, i18n.language],
    queryFn: async () => {
      const res = await apiClient
        .get(
          i18n.language +
            `/local-decision/get-decision-type-by-emirate/${emirateID}`,
        )
        .json<any>();

      return res?.data;
    },
    enabled: !!emirateID,
  });

  useEffect(() => {
    if (emirateID && emirateListChange?.decisionTypeList) {
      queryClient.setQueryData(
        ["localDecisionFormData", i18n.language],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            decisionTypeList: emirateListChange.decisionTypeList,
          };
        },
      );
    } else if (emirateID === null) {
      queryClient.setQueryData(
        ["localDecisionFormData", i18n.language],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            decisionTypeList: [],
          };
        },
      );
    }
  }, [emirateListChange, emirateID, i18n.language, queryClient]);

  const emirateChange = useCallback((value: any) => {
    setEmirateID(value);
  }, []);

  const fields: FieldConfig[] = [
    {
      name: "dm_emirate_id",
      label: t("local_government"),
      type: "select",
      optionsKey: "emirateList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
      onValueChange: (val, form) => {
        emirateChange(val);
        if (form) {
          form.setFieldValue("dm_decision_type_id", "");
        }
      },
      disabled: isAdmin ? false : true,
    },
    {
      name: "dm_court_id",
      label: t("local_court"),
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
      dir: "rtl",
      className: "col-span-full",
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

    // {
    //   name: "dm_year",
    //   label: t("decision_year"),
    //   type: "select",
    //   optionsKey: "yearList",
    //   validators: {
    //     onSubmit: ({ value }) => (!value ? t("required_field") : null),
    //   },
    // },
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
        formData.append(key, value as string | Blob);
      }
    });
    console.log("FormData content:", Object.fromEntries(formData.entries()));
    try {
      const res = await apiClient
        .post(i18n.language + `/local-decision/store`, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();

      if (res?.status) {
        toast.success(res?.message || t("success"));
        queryClient.invalidateQueries({
          queryKey: ["localDecisionTable"],
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

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      dm_emirate_id: emirateID || "",
    });
  }, [emirateID]);

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
            to: `/${i18n.language}/local-decisions`,
          });
        }}
      />
    </DashboardLayout>
  );
}
