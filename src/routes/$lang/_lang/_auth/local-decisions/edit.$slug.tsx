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
import { useEffect, useCallback } from "react";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { usePDFPreview } from "@/lib/usePDFPreview";
import { CustomForm } from "@/components/form/CustomForm";
import { useRouter } from "@tanstack/react-router";

import { type FieldConfig } from "@/components/form/CustomForm";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-decisions/edit/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "edit",
      path: `/${params.lang}/local-decisions/edit/${params.slug}`,
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
  const [emirateID, setEmirateID] = useState<number>(null);

  const [decisionTypeByEmirate, setDecisionTypeByEmirate] = useState([]);
  const isAdmin = userSession?.user?.roles?.includes("admin");

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const [initialValues, setInitialValues] = useState({
    // local_government: userSession?.user?.userEmirateName || "",
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
    queryKey: ["localEditDecisionFormData", i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-decision/edit/${slug}`)
          .json<any>();
        console.log("local_decision_edit_form_data", res?.data);
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
        ["localEditDecisionFormData", i18n.language],
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
        ["localEditDecisionFormData", i18n.language],
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
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => {
          return data?.decisionData?.dm_file
            ? deletedFiles.includes("dm_file") && !value && t("required_field")
            : !value && t("required_field");
        },
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
      preview: deletedFiles.includes("dm_file")
        ? undefined
        : data?.decisionData?.dm_file,

      onClearPreview: () => {
        setDeletedFiles((prev) => [...prev, "dm_file"]);
      },
      onClick: () => previewEN(),
      isLoading: isLoadingEN,
    },
    {
      name: "dm_file_arabic",
      label: t("court_decision_file_arabic"),
      type: "file",
      accept: ".pdf",
      validators: {
        onSubmit: ({ value }) => {
          return data?.decisionData?.dm_file_arabic
            ? deletedFiles.includes("dm_file_arabic") &&
                !value &&
                t("required_field")
            : !value && t("required_field");
        },
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
      preview: deletedFiles.includes("dm_file_arabic")
        ? undefined
        : data?.decisionData?.dm_file_arabic,

      onClearPreview: () => {
        setDeletedFiles((prev) => [...prev, "dm_file_arabic"]);
      },
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
        dm_entity_id: data?.decisionData?.dm_entity_id?.toString() || "",
        // local_government: userSession?.user?.userEmirateName || "",
        dm_emirate_id: Array.isArray(data?.decisionData?.dm_emirates)
          ? data?.decisionData?.dm_emirates[0]
          : data?.decisionData?.dm_emirate_id,
        dm_court_id: data?.decisionData?.dm_court_id,
        dm_number: data?.decisionData?.dm_number,

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
        .post(i18n.language + `/local-decision/update/${slug}`, {
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
    <DashboardLayout isLoading={isLoading} title={t("edit_decision")}>
      <CustomForm
        key={data?.decisionData?.updated_at || "customFormLoading"}
        fields={fields}
        defaultValues={initialValues}
        onSubmit={handleStore}
        data={data}
        mode="edit"
        isSubmitting={isSubmitting}
      />

      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("updated_successfully")}
        description={t("decision_updated_success_message")}
        onConfirm={() => {
          queryClient.invalidateQueries({
            queryKey: ["localEditDecisionFormData"],
          });
          queryClient.invalidateQueries({
            queryKey: ["localDecisionTable"],
          });

          // navigate({
          //   to: `/${i18n.language}/local-decisions`,
          // });
        }}
      />
    </DashboardLayout>
  );
}
