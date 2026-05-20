import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";

import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import { Plus } from "lucide-react";
import { useState } from "react";

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

import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { LegislationModificationForm } from "@/components/form/LegislationModificationForm";
export const Route = createFileRoute(
  "/$lang/_lang/_auth/federal-legislations/modifications/add/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any, search: any) => {
      return [
        {
          key: "modifications",
          path: `/${params.lang}/federal-legislations/modifications/${params.slug}`,
        },
        {
          key: "add",
          path: `/${params.lang}/federal-legislations/modifications/add/${params.slug}`,
        },
      ];
    },
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["federal_modificationFormData", i18n.language],
    enabled: !!userSession?.accessToken,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/modifications/create/${slug}`)
          .json<any>();
        // console.log("modification_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("local_legislation_form_data_error", error);
        return null;
      }
    },
  });

  // const form = useForm({
  //   defaultValues: {
  //     lm_has_english_version: "2",
  //     lm_title: "",
  //     lm_title_arabic: "",
  //     lm_short_title: "",
  //     lm_short_title_arabic: "",
  //     lm_description: "",
  //     lm_description_arabic: "",
  //     lm_year: "",
  //     lm_issue_date: "",
  //     lm_effective_date: "",
  //     lm_pdf_file: "",
  //     lm_pdf_file_arabic: "",
  //     lm_gazette_number: "",
  //     lm_gazette_number_arabic: "",
  //     lm_official_gazette_issue_date: "",
  //     lm_gazette_title: "",
  //     lm_gazette_title_arabic: "",
  //   },
  //   onSubmit: async ({ value }) => {
  //     setIsSubmitting(true);

  //     try {
  //       const formData = new FormData();

  //       formData.append("lm_created_by", userSession?.user?.id || "");
  //       formData.append("lm_has_english_version", value.lm_has_english_version);

  //       formData.append("lm_title", value.lm_title);
  //       formData.append("lm_title_arabic", value.lm_title_arabic);
  //       formData.append("lm_short_title", value.lm_short_title);
  //       formData.append("lm_short_title_arabic", value.lm_short_title_arabic);
  //       formData.append("lm_description", value.lm_description);
  //       formData.append("lm_description_arabic", value.lm_description_arabic);
  //       formData.append("lm_year", value.lm_year);
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
  //         .post(i18n.language + "/modifications/store/" + slug, {
  //           headers: {
  //             "Content-Type": undefined,
  //           },
  //           body: formData,
  //         })
  //         .json<any>();

  //       // console.log(res, "local_legislation_store_res");
  //       if (res?.status) {
  //         form.reset();
  //         toast.success(res?.message || t("success"));
  //         queryClient.invalidateQueries({
  //           queryKey: ["federal_legislations_modifications_table", slug],
  //         });
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

  const [initialValues, setInitialValues] = useState({
    lm_has_english_version: "2",
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
    lm_gazzette_date_string: "",
  });

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
        .post(i18n.language + `/modifications/store/` + slug, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();

      if (res?.status) {
        toast.success(res?.message || t("success"));
        queryClient.invalidateQueries({
          queryKey: ["federal_legislations_modifications_table", slug],
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
    <DashboardLayout
      isLoading={isLoading}
      title={t("add_modification") + `<small>${data?.label}</small>`}
    >
      {/* <form
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
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          label={t("legislation_full_title_english")}
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("legislation_full_title_arabic")}
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
                          label={t("official_gazette_number")}
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
                          label={t("official_gazette_title_english")}
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
                label={t("official_gazette_number_arabic")}
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
                label={t("official_gazette_title_arabic")}
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
                label={t("official_gazette_date")}
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
                          label={t("legislation_file_english")}
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
                label={t("legislation_file_arabic")}
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
      </form> */}
      <LegislationModificationForm
        mode="add"
        initialValues={initialValues}
        data={data}
        onSubmit={handleStore}
        isSubmitting={isSubmitting}
      />
      <ThankYouPopup
        type="success"
        open={thankYouPopup}
        setOpen={setThankYouPopup}
        title={t("submitted_successfully")}
        description={data?.success_message}
        onConfirm={() => {
          navigate({
            to: `/${i18n.language}/federal-legislations/modifications/${slug}`,
          });
        }}
      />
    </DashboardLayout>
  );
}
