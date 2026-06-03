import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { CustomForm, type FieldConfig } from "@/components/form/CustomForm";
import { usePDFPreview } from "@/lib/usePDFPreview";
import EditBadge from "@/components/ui/EditBadge";
import { useCallback } from "react";
import { FILE_ACCEPT_STRING } from "@/lib/fileFormats";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-decisions/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/local-decisions/view/${params.slug}`,
    }),
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const [emirateID, setEmirateID] = useState<number>(null);
  const queryClient = useQueryClient();
  const [decisionTypeByEmirate, setDecisionTypeByEmirate] = useState([]);

  const isAdmin = userSession?.user?.roles?.includes("admin");
  const [initialValues, setInitialValues] = useState({
    dm_emirate_id: !isAdmin ? userSession?.user?.userEmirateName : "",
    dm_decision_type_id: "",
    dm_court_id: "",
    dm_title: "",
    dm_title_arabic: "",
    dm_decision_date: "",
    dm_number: "",

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
    queryKey: ["localViewDecisionFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-decision/edit/${slug}`)
          .json<any>();
        // console.log("local_decision_view_form_data", res?.data);
        return res?.data;
      } catch (error) {
        console.log("local_decision_form_data_error", error);
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
        ["localViewDecisionFormData", slug, i18n.language],
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
        ["localViewDecisionFormData", slug, i18n.language],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            decisionTypeList: [],
          };
        },
      );
    }
  }, [emirateListChange, emirateID, slug, i18n.language, queryClient]);

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
      onValueChange: (val) => {
        emirateChange(val);
      },
      disabled: isAdmin ? false : true,
      // disabled: true,
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
      preview: data?.decisionData?.dm_file,
      onClick: () => previewEN(),
      isLoading: isLoadingEN,
    },
    {
      name: "dm_file_arabic",
      label: t("court_decision_file_arabic"),
      type: "file",
      accept: FILE_ACCEPT_STRING,
      preview: data?.decisionData?.dm_file_arabic,
      onClick: () => previewAR(),
      isLoading: isLoadingAR,
    },
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

  useEffect(() => {
    if (data?.decisionData) {
      setInitialValues({
        dm_emirate_id: data?.decisionData?.dm_emirate_id?.toString() || "",
        dm_entity_id: data?.decisionData?.dm_entity_id?.toString() || "",
        dm_court_id: data?.decisionData?.dm_court_id,
        dm_number: data?.decisionData?.dm_number,

        // local_government: userSession?.user?.userEmirateName || "",
        dm_decision_type_id: data?.decisionData?.dm_decision_type_id,
        dm_title: data?.decisionData?.dm_title,
        dm_title_arabic: data?.decisionData?.dm_title_arabic,
        dm_decision_date: data?.decisionData?.dm_decision_date,

        dm_year: data?.decisionData?.dm_year,
        dm_authority_title: data?.decisionData?.dm_authority_title,
        dm_authority_title_arabic:
          data?.decisionData?.dm_authority_title_arabic,
        dm_details: data?.decisionData?.dm_details,
        dm_details_arabic: data?.decisionData?.dm_details_arabic,
        dm_file: null,
        dm_file_arabic: null,
      });
    }
  }, [data]);
  return (
    <DashboardLayout isLoading={isLoading} title={t("view_decision")}>
      <CustomForm
        fields={fields}
        defaultValues={initialValues}
        data={data}
        mode="view"
      />
      <EditBadge data={data?.decisionData} />
    </DashboardLayout>
  );
}
