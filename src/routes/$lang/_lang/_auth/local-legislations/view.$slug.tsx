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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/label";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect } from "react";

import CKEditorCustom from "@/components/ui/CKEditor";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-legislations/view/$slug",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["localLegislationFormData", slug, i18n.language],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const [createRes, editRes] = await Promise.all([
          apiClient
            .get(`${i18n.language}/local-legislation/create`)
            .json<any>(),
          apiClient
            .get(`${i18n.language}/local-legislation/edit/${slug}`)
            .json<any>(),
        ]);

        return { ...createRes?.data, ...editRes?.data };
      } catch (error) {
        console.log("local_legislation_form_data_error", error);
        return null;
      }
    },
  });

  const form = useForm({
    defaultValues: {
      lm_has_english_version: "2",
      local_government: userSession?.user?.userEmirateName || "",
      lm_law_type_id: "",
      lm_sector_id: "",
      lm_title: "",
      lm_title_arabic: "",
      lm_short_title: "",
      lm_short_title_arabic: "",
      lm_description: "",
      lm_description_arabic: "",
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
    },
  });

  useEffect(() => {
    if (data?.lawData) {
      form.setFieldValue(
        "lm_has_english_version",
        data.lawData?.lm_has_english_version.toString() || "2",
      );
      form.setFieldValue(
        "local_government",
        userSession?.user?.userEmirateName || "",
      );
      form.setFieldValue(
        "lm_law_type_id",
        data?.lawData?.lm_law_type_id.toString() || "",
      );
      form.setFieldValue(
        "lm_sector_id",
        data?.lawData?.lm_sector_id.toString() || "",
      );
      form.setFieldValue("lm_title", data?.lawData?.lm_title || "");
      form.setFieldValue(
        "lm_title_arabic",
        data?.lawData?.lm_title_arabic || "",
      );
      form.setFieldValue("lm_short_title", data?.lawData?.lm_short_title || "");
      form.setFieldValue(
        "lm_short_title_arabic",
        data?.lawData?.lm_short_title_arabic || "",
      );
      form.setFieldValue("lm_description", data?.lawData?.lm_description || "");
      form.setFieldValue(
        "lm_description_arabic",
        data?.lawData?.lm_description_arabic || "",
      );
      form.setFieldValue("lm_year", data?.lawData?.lm_year.toString() || "");
      form.setFieldValue("lm_issue_date", data?.lawData?.lm_issue_date || "");
      form.setFieldValue(
        "lm_effective_date",
        data?.lawData?.lm_effective_date || "",
      );
      form.setFieldValue("lm_pdf_file", "");
      form.setFieldValue("lm_pdf_file_arabic", "");
      form.setFieldValue(
        "lm_gazette_number",
        data?.lawData?.lm_gazette_number || "",
      );
      form.setFieldValue(
        "lm_gazette_number_arabic",
        data?.lawData?.lm_gazette_number_arabic || "",
      );
      form.setFieldValue(
        "lm_official_gazette_issue_date",
        data?.lawData?.lm_official_gazette_issue_date || "",
      );
      form.setFieldValue(
        "lm_gazette_title",
        data?.lawData?.lm_gazette_title || "",
      );
      form.setFieldValue(
        "lm_gazette_title_arabic",
        data?.lawData?.lm_gazette_title_arabic || "",
      );
    }
  }, [data, form, userSession]);

  const handleClearFile = (fieldName: string, previewKey: string) => {
    form.setFieldValue(fieldName as any, null);

    setDeletedFiles((prev) => [...prev, previewKey]);
  };

  return (
    <DashboardLayout
      isLoading={isLoading}
      title={t("view_governments_legislations")}
    >
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
        <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-2">
          <Label className="text-black/70">{t("has_english")}</Label>
          <form.Field
            name="lm_has_english_version"
            children={(field) => (
              <>
                <RadioGroup
                  className="flex gap-4"
                  value={field.state.value}
                  defaultValue="2"
                  disabled={true}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="1"
                      id="yes"
                      error={field.state.meta.errors.length > 0}
                    />
                    <Label
                      normalLabel={true}
                      htmlFor="yes"
                      className="cursor-pointer"
                    >
                      {t("yes")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="2"
                      id="no"
                      error={field.state.meta.errors.length > 0}
                    />
                    <Label
                      normalLabel={true}
                      htmlFor="no"
                      className="cursor-pointer"
                    >
                      {t("no")}
                    </Label>
                  </div>
                </RadioGroup>
              </>
            )}
          />
        </div>
        <form.Field
          name="local_government"
          children={(field) => (
            <Input
              value={field.state.value}
              label={t("local_government")}
              disabled={true}
            />
          )}
        />
        <form.Field
          name="lm_sector_id"
          validators={{
            onSubmit: ({ value }) => (!value ? t("required-field") : null),
          }}
          children={(field) => (
            <Select
              key={field.state.value}
              value={field.state.value?.toString() || ""}
              onValueChange={(e) => field.handleChange(e)}
            >
              <SelectTrigger
                label={t("sector")}
                hasValue={!!field.state.value}
                readOnly={true}
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
          )}
        />
        <form.Field
          name="lm_law_type_id"
          validators={{
            onSubmit: ({ value }) => (!value ? t("required-field") : null),
          }}
          children={(field) => (
            <Select
              key={field.state.value}
              value={field.state.value?.toString() || ""}
              onValueChange={(e) => field.handleChange(e)}
            >
              <SelectTrigger
                label={t("legislation_type")}
                hasValue={!!field.state.value}
                readOnly={true}
              >
                <SelectValue placeholder={t("select_legislation_type")} />
              </SelectTrigger>
              <SelectContent>
                {data?.lawTypeList?.map((item: any) => (
                  <SelectItem
                    key={`lawType-${item.value}`}
                    value={item.value.toString()}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <form.Subscribe
          selector={(state) => state.values.lm_has_english_version}
          children={(hasEnglish) => (
            <AnimatePresence>
              {hasEnglish === "1" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start"
                >
                  <form.Field
                    name="lm_title"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? t("required-field") : undefined,

                      onSubmit: ({ value }) =>
                        !value ? t("required-field") : null,
                    }}
                    children={(field) => (
                      <Input
                        type="text"
                        value={field.state.value}
                        label={t("legislation_title_english")}
                        readOnly
                      />
                    )}
                  />
                  <form.Field
                    name="lm_short_title"
                    children={(field) => (
                      <Input
                        type="text"
                        value={field.state.value}
                        label={t("legislation_short_title_english")}
                        readOnly
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        />
        <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <form.Field
            name="lm_title_arabic"
            validators={{
              onChange: ({ value }) =>
                !value ? t("required-field") : undefined,

              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                label={t("legislation_title_arabic")}
                dir="rtl"
                readOnly
              />
            )}
          />
          <form.Field
            name="lm_short_title_arabic"
            children={(field) => (
              <Input
                type="text"
                value={field.state.value}
                label={t("legislation_short_title_arabic")}
                dir="rtl"
                readOnly
              />
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => state.values.lm_has_english_version}
          children={(hasEnglish) => (
            <AnimatePresence>
              {hasEnglish === "1" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-2 "
                >
                  <form.Field
                    name="lm_description"
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? t("required-field") : null,
                    }}
                    children={(field) => (
                      <div className="space-y-2 relative">
                        <Label htmlFor="lm_description">
                          {t("legislation_details_english")}
                        </Label>
                        <CKEditorCustom
                          value={field.state.value}
                          onChange={(data) => field.handleChange(data)}
                          readOnly={true}
                        />
                        {field.state.meta.errors ? (
                          <Label
                            htmlFor="lm_description"
                            errorLabel={true}
                            floating={true}
                          >
                            {field.state.meta.errors.join(", ")}
                          </Label>
                        ) : null}
                      </div>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        />

        <div className="col-span-2">
          <form.Field
            name="lm_description_arabic"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <div className="space-y-2 relative">
                <Label htmlFor="lm_description_arabic">
                  {t("legislation_details_arabic")}
                </Label>
                <CKEditorCustom
                  dir="rtl"
                  value={field.state.value}
                  onChange={(data) => field.handleChange(data)}
                  readOnly={true}
                />
                {field.state.meta.errors ? (
                  <Label
                    htmlFor="lm_description_arabic"
                    errorLabel={true}
                    floating={true}
                  >
                    {field.state.meta.errors.join(", ")}
                  </Label>
                ) : null}
              </div>
            )}
          />
        </div>
        <form.Field
          name="lm_year"
          validators={{
            onSubmit: ({ value }) => (!value ? t("required-field") : null),
          }}
          children={(field) => (
            <Select
              key={field.state.value}
              value={field.state.value?.toString()}
            >
              <SelectTrigger
                label={t("legislation_year")}
                hasValue={!!field.state.value}
                readOnly={true}
              >
                <SelectValue placeholder={t("select_legislation_year")} />
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
          )}
        />
        <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <form.Field
            name="lm_issue_date"
            children={(field) => (
              <Input
                type="date"
                value={field.state.value}
                label={t("issued_date")}
                readOnly={true}
              />
            )}
          />

          <form.Field
            name="lm_effective_date"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required-field") : null),
            }}
            children={(field) => (
              <Input
                type="date"
                value={field.state.value}
                label={t("effective_date")}
                readOnly={true}
              />
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => state.values.lm_has_english_version}
          children={(hasEnglish) => (
            <AnimatePresence>
              {hasEnglish === "1" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className=""
                >
                  <form.Field
                    name="lm_pdf_file"
                    children={(field) => (
                      <Input
                        type="file"
                        accept=".pdf"
                        label={t("attachment_english")}
                        preview={data?.lawData?.lm_pdf_file}
                        readOnly={true}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        />

        <form.Field
          name="lm_pdf_file_arabic"
          children={(field) => (
            <Input
              type="file"
              accept=".pdf"
              label={t("attachment_arabic")}
              preview={data?.lawData?.lm_pdf_file_arabic}
              readOnly={true}
            />
          )}
        />

        <form.Subscribe
          selector={(state) => state.values.lm_has_english_version}
          children={(hasEnglish) => (
            <AnimatePresence>
              {hasEnglish === "1" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start"
                >
                  <form.Field
                    name="lm_gazette_number"
                    children={(field) => (
                      <Input
                        type="text"
                        value={field.state.value}
                        label={t("gazette_number")}
                        readOnly={true}
                      />
                    )}
                  />
                  <form.Field
                    name="lm_gazette_title"
                    children={(field) => (
                      <Input
                        type="text"
                        value={field.state.value}
                        label={t("gazette_title_english")}
                        readOnly={true}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        />

        <form.Field
          name="lm_gazette_number_arabic"
          children={(field) => (
            <Input
              type="text"
              value={field.state.value}
              label={t("gazette_number_arabic")}
              readOnly={true}
              dir="rtl"
            />
          )}
        />

        <form.Field
          name="lm_gazette_title_arabic"
          children={(field) => (
            <Input
              type="text"
              value={field.state.value}
              label={t("gazette_title_arabic")}
              readOnly={true}
              dir="rtl"
            />
          )}
        />
        <form.Field
          name="lm_official_gazette_issue_date"
          children={(field) => (
            <Input
              type="date"
              value={field.state.value}
              label={t("gazette_issue_date")}
              readOnly={true}
            />
          )}
        />
      </div>
    </DashboardLayout>
  );
}
