import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import { useState } from "react";

import { toast } from "@/lib/toast";

import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect, useCallback } from "react";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { CustomForm } from "@/components/form/CustomForm";
import { useMemo } from "react";

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
    // local_government: userSession?.user?.userEmirateName || "",
    dm_decision_type_id: "",
    dm_court_id: "",
    dm_emirate_id: "",
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
    dm_decision_number: "",
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
      label: t("local_government "),
      type: "select",
      optionsKey: "emirateList",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
      },
      onValueChange: (val) => {
        emirateChange(val);
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
    },
    {
      name: "dm_title_arabic",
      label: t("court_decision_title_arabic"),
      type: "text",
      dir: "rtl",
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
      name: "dm_decision_number",
      label: t("court_decision_number"),
      type: "text",
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
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
        onChange: ({ value }) => {
          if (!value) return null;

          // Ensure we have a File object
          const file = value instanceof FileList ? value[0] : value;
          if (!file || !(file instanceof File)) return null;

          const fileName = file.name.toLowerCase(); // Use file.name
          const allowedExtensions = [".pdf"];
          const isValid = allowedExtensions.some((ext) =>
            fileName.endsWith(ext),
          );

          if (!isValid) return t("file_must_be_pdf");

          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) return t("file_too_large");

          return null;
        },
      },
    },
    {
      name: "dm_file_arabic",
      label: t("court_decision_file_arabic"),
      type: "file",
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => (!value ? t("required_field") : null),
        onChange: ({ value }) => {
          if (!value) return null;

          // Ensure we have a File object
          const file = value instanceof FileList ? value[0] : value;
          if (!file || !(file instanceof File)) return null;

          const fileName = file.name.toLowerCase(); // Use file.name
          const allowedExtensions = [".pdf"];
          const isValid = allowedExtensions.some((ext) =>
            fileName.endsWith(ext),
          );

          if (!isValid) return t("file_must_be_pdf");

          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) return t("file_too_large");

          return null;
        },
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

  const handleStore = async (values) => {
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
