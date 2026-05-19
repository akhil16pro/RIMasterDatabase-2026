import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/label";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";

import { usePDFPreview } from "@/lib/usePDFPreview";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatePresence, motion } from "motion/react";
import { CustomForm } from "@/components/form/CustomForm";
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
      validators: {
        onSubmit: ({ value }) => {
          return data?.treatyData?.it_attachment
            ? deletedFiles.includes("it_attachment") &&
                !value &&
                t("required_field")
            : !value && t("required_field");
        },
        onChange: ({ value }) => {
          if (!value) return null;
          const file = value instanceof FileList ? value[0] : value;

          if (!(file instanceof File)) return null;

          const fileName = file.name.toLowerCase();
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
      validators: {
        onSubmit: ({ value }) => {
          return data?.treatyData?.it_attachment_arabic
            ? deletedFiles.includes("it_attachment_arabic") &&
                !value &&
                t("required_field")
            : !value && t("required_field");
        },
        onChange: ({ value }) => {
          if (!value) return null;
          const file = value instanceof FileList ? value[0] : value;

          if (!(file instanceof File)) return null;

          const fileName = file.name.toLowerCase();
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

  useEffect(() => {
    if (data?.treatyData) {
      setInitialValues({
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
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
        <div className="flex gap-5 text-black  text-[1.2rem] col-span-full w-full">
          <Label className="text-black/70">{t("treaty_type")}</Label>
          <RadioGroup
            className="flex gap-col-4 gap-row-1 flex-wrap"
            value={data?.treatyData?.it_treaty_type.toString()}
            defaultValue={data?.treatyData?.it_treaty_type.toString()}
            disabled={true}
          >
            {data?.treatyTypeList?.map((item: any) => (
              <div
                className="flex items-center space-x-2"
                key={`treatyType-${item.value}`}
              >
                <RadioGroupItem
                  value={item.value.toString()}
                  id={item.label.toString()}
                />
                <Label
                  normalLabel={true}
                  htmlFor={item.label}
                  className="cursor-pointer"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <AnimatePresence>
          {data?.treatyData?.it_treaty_type === 2 ? (
            <Select
              key={data?.treatyData?.it_sector_id}
              id="it_sector_id"
              name="it_sector_id"
              value={data?.treatyData?.it_sector_id?.toString() || ""}
              disabled={true}
            >
              <SelectTrigger
                label={t("sector")}
                hasValue={!!data?.treatyData?.it_sector_id}
              >
                <SelectValue placeholder={t("select_sector")} />
              </SelectTrigger>
              <SelectContent>
                {data?.sectorList?.map((item: any) => (
                  <SelectItem
                    key={`sector-${item.value}`}
                    value={item.value.toString()}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              key={data?.treatyData?.it_country_id}
              id="it_country_id"
              name="it_country_id"
              value={data?.treatyData?.it_country_id?.toString() || ""}
              disabled={true}
            >
              <SelectTrigger
                label={t("country")}
                hasValue={!!data?.treatyData?.it_country_id}
              >
                <SelectValue placeholder={t("select_country")} />
              </SelectTrigger>
              <SelectContent>
                {data?.countryList?.map((item: any) => (
                  <SelectItem
                    key={`country-${item.value}`}
                    value={item.value.toString()}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </AnimatePresence>

        <div className="col-span-full grid  md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <Input
            type="text"
            id="it_title"
            name="it_title"
            value={data?.treatyData?.it_title}
            label={t("title")}
            readOnly={true}
          />

          <Input
            type="text"
            id="it_title_arabic"
            name="it_title_arabic"
            value={data?.treatyData?.it_title_arabic}
            label={t("title_arabic")}
            dir="rtl"
            readOnly={true}
          />
        </div>

        <Input
          type="date"
          id="it_treaty_date"
          name="it_treaty_date"
          value={data?.treatyData?.it_treaty_date}
          label={t("treaty_date")}
          readOnly={true}
        />

        <Select
          key={data?.treatyData?.it_treaty_year}
          id="it_treaty_year"
          name="it_treaty_year"
          value={data?.treatyData?.it_treaty_year?.toString()}
          disabled={true}
        >
          <SelectTrigger
            label={t("treaty_year")}
            hasValue={!!data?.treatyData?.it_treaty_year}
          >
            <SelectValue placeholder={t("select_treaty_year")} />
          </SelectTrigger>
          <SelectContent>
            {data?.yearList?.map((item: any) => (
              <SelectItem
                key={`year-${item.value}`}
                value={item.value.toString()}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          id="it_expiry_date"
          name="it_expiry_date"
          value={data?.treatyData?.it_expiry_date}
          label={t("treaty_expiry_date")}
          readOnly={true}
        />

        <div className="col-span-full grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <Input
            type="file"
            accept=".pdf"
            label={t("treaty_file_english")}
            preview={data?.treatyData?.it_attachment}
            onClick={previewEN}
            isLoading={isLoadingEN}
            readOnly={true}
          />

          <Input
            type="file"
            accept=".pdf"
            label={t("treaty_file_arabic")}
            preview={data?.treatyData?.it_attachment_arabic}
            onClick={previewAR}
            isLoading={isLoadingAR}
            readOnly={true}
          />
        </div>
      </div> */}
    </DashboardLayout>
  );
}
