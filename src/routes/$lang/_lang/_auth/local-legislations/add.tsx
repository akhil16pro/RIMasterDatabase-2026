import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";

import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { Plus } from "lucide-react";
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
  "/$lang/_lang/_auth/local-legislations/add",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "add",
      path: `/${params.lang}/local-legislations/add`,
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
    queryKey: ["localLegislationFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/local-legislation/create`)
          .json<any>();
        // console.log("local_legislation_form_data", res?.data);

        return res?.data;
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
      lm_pdf_file: "",
      lm_pdf_file_arabic: "",
      lm_gazette_number: "",
      lm_gazette_number_arabic: "",
      lm_official_gazette_issue_date: "",
      lm_gazette_title: "",
      lm_gazette_title_arabic: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        formData.append("lm_created_by", userSession?.user?.id || "");
        formData.append("lm_has_english_version", value.lm_has_english_version);
        formData.append(
          "local_government",
          userSession?.user?.userEmirateId || "",
        );
        formData.append("lm_sector_id", value.lm_sector_id);
        formData.append("lm_law_type_id", value.lm_law_type_id);
        formData.append("lm_title", value.lm_title);
        formData.append("lm_title_arabic", value.lm_title_arabic);
        formData.append("lm_short_title", value.lm_short_title);
        formData.append("lm_short_title_arabic", value.lm_short_title_arabic);
        formData.append("lm_description", value.lm_description);
        formData.append("lm_description_arabic", value.lm_description_arabic);
        formData.append("lm_year", value.lm_year);
        formData.append("lm_issue_date", value.lm_issue_date);
        formData.append("lm_effective_date", value.lm_effective_date);
        formData.append("lm_gazette_number", value.lm_gazette_number);
        formData.append(
          "lm_gazette_number_arabic",
          value.lm_gazette_number_arabic,
        );
        formData.append(
          "lm_official_gazette_issue_date",
          value.lm_official_gazette_issue_date,
        );
        formData.append("lm_gazette_title", value.lm_gazette_title);
        formData.append(
          "lm_gazette_title_arabic",
          value.lm_gazette_title_arabic,
        );

        if (value.lm_pdf_file) {
          formData.append("lm_pdf_file", value.lm_pdf_file);
        }
        if (value.lm_pdf_file_arabic) {
          formData.append("lm_pdf_file_arabic", value.lm_pdf_file_arabic);
        }

        const res = await apiClient
          .post(i18n.language + "/local-legislation/store", {
            headers: {
              "Content-Type": undefined,
            },
            body: formData,
          })
          .json<any>();

        // console.log(res, "local_legislation_store_res");
        if (res?.status) {
          form.reset();
          toast.success(res?.message || t("success"));
          queryClient.invalidateQueries({
            queryKey: ["localLegislationTable"],
          });
          setTimeout(() => {
            setThankYouPopup(true);
          }, 150);

          // setTimeout(() => {
          //   queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
          // }, 100);
        }
      } catch (error) {
        console.error("Add request failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <DashboardLayout isLoading={isLoading} title={t("add_legislation")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-full">
            <Label className="text-black/70">{t("has_english")}</Label>
            <form.Field
              name="lm_has_english_version"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("required_field") : undefined,
              }}
              children={(field) => (
                <>
                  <RadioGroup
                    className="flex gap-4"
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                    defaultValue="2"
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
                  {field.state.meta.errors.length > 0 && (
                    <Label errorLabel={true}>
                      {field.state.meta.errors[0] || t("invalid-field")}
                    </Label>
                  )}
                </>
              )}
            />
          </div>
          <form.Field
            name="local_government"
            children={(field) => (
              <Input
                id="local_government"
                name="local_government"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("local_government")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                disabled={true}
              />
            )}
          />
          <form.Field
            name="lm_sector_id"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                id="lm_sector_id"
                name="lm_sector_id"
                value={field.state.value?.toString() || ""}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("sector")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
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
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                id="lm_law_type_id"
                name="lm_law_type_id"
                value={field.state.value?.toString() || ""}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("legislation_type")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
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
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start"
                  >
                    <form.Field
                      name="lm_title"
                      validators={{
                        onChange: ({ value }) =>
                          !value ? t("required_field") : undefined,

                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <Input
                          id="lm_title"
                          name="lm_title"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("legislation_title_english")}
                          error={
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0
                          }
                          errorMessage={field.state.meta.errors[0]}
                          onBlur={field.handleBlur}
                        />
                      )}
                    />
                    <form.Field
                      name="lm_short_title"
                      children={(field) => (
                        <Input
                          id="lm_short_title"
                          name="lm_short_title"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("legislation_short_title_english")}
                          error={field.state.meta.errors.length > 0}
                          errorMessage={field.state.meta.errors[0]}
                        />
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          />
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <form.Field
              name="lm_title_arabic"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("required_field") : undefined,

                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="text"
                  id="lm_title_arabic"
                  name="lm_title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("legislation_title_arabic")}
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  errorMessage={field.state.meta.errors[0]}
                  onBlur={field.handleBlur}
                  dir="rtl"
                />
              )}
            />
            <form.Field
              name="lm_short_title_arabic"
              children={(field) => (
                <Input
                  type="text"
                  id="lm_short_title_arabic"
                  name="lm_short_title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("legislation_short_title_arabic")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  dir="rtl"
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
                    className="col-span-full "
                  >
                    <form.Field
                      name="lm_description"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <div className="space-y-2 relative">
                          <Label htmlFor="lm_description">
                            {t("legislation_details_english")}
                          </Label>
                          <CKEditorCustom
                            value={field.state.value}
                            onChange={(data) => field.handleChange(data)}
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

          <div className="col-span-full">
            <form.Field
              name="lm_description_arabic"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
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
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Select
                id="lm_year"
                name="lm_year"
                value={field.state.value?.toString()}
                onValueChange={(e) => field.handleChange(e)}
              >
                <SelectTrigger
                  label={t("legislation_year")}
                  hasValue={!!field.state.value}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
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
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <form.Field
              name="lm_issue_date"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="date"
                  id="lm_issue_date"
                  name="lm_issue_date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("issued_date")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                />
              )}
            />

            <form.Field
              name="lm_effective_date"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Input
                  type="date"
                  id="lm_effective_date"
                  name="lm_effective_date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("effective_date")}
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
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
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                        onChange: ({ value }) => {
                          if (!value) return null;

                          // Ensure we have a File object
                          const file =
                            value instanceof FileList ? value[0] : value;
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
                      }}
                      children={(field) => (
                        <Input
                          type="file"
                          id="lm_pdf_file"
                          name="lm_pdf_file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.handleChange(file);
                          }}
                          onBlur={field.handleBlur}
                          label={t("attachment_english")}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
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
            validators={{
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
            }}
            children={(field) => (
              <Input
                type="file"
                id="lm_pdf_file_arabic"
                name="lm_pdf_file_arabic"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.handleChange(file);
                }}
                onBlur={field.handleBlur}
                label={t("attachment_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
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
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start"
                  >
                    <form.Field
                      name="lm_gazette_number"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <Input
                          type="text"
                          id="lm_gazette_number"
                          name="lm_gazette_number"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("gazette_number")}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
                        />
                      )}
                    />
                    <form.Field
                      name="lm_gazette_title"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value ? t("required_field") : null,
                      }}
                      children={(field) => (
                        <Input
                          type="text"
                          id="lm_gazette_title"
                          name="lm_gazette_title"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("gazette_title_english")}
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={field.state.meta.errors[0]}
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
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                id="lm_gazette_number_arabic"
                name="lm_gazette_number_arabic"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("gazette_number_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                dir="rtl"
              />
            )}
          />

          <form.Field
            name="lm_gazette_title_arabic"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="text"
                id="lm_gazette_title_arabic"
                name="lm_gazette_title_arabic"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("gazette_title_arabic")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                dir="rtl"
              />
            )}
          />
          <form.Field
            name="lm_official_gazette_issue_date"
            validators={{
              onSubmit: ({ value }) => (!value ? t("required_field") : null),
            }}
            children={(field) => (
              <Input
                type="date"
                id="lm_official_gazette_issue_date"
                name="lm_official_gazette_issue_date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                label={t("gazette_issue_date")}
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          />

          <div className="col-span-full">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("submit")}
              onClick={form.handleSubmit}
              icon={<Plus className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </form>
      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("submitted_successfully")}
        description={t("law_created_success_message")}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/local-legislations`,
          });
        }}
      />
    </DashboardLayout>
  );
}
