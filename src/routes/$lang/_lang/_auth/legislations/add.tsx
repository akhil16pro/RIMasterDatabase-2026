import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { BookOpenText, CircleCheck, Plus } from "lucide-react";
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
import { Label } from "@radix-ui/react-label";
import { ThankYouPopup } from "@/components/ui/thankYouPopup";
import { useEffect } from "react";
export const Route = createFileRoute("/$lang/_lang/_auth/legislations/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const [thankYouPopup, setThankYouPopup] = useState(false);

  const form = useForm({
    defaultValues: {
      local_government: "Dubai",
      sector: "",
      description: "",
      description_arabic: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/glossary/create", {
            json: {
              title: value.title,
              title_arabic: value.title_arabic,
              description: value.description,
              description_arabic: value.description_arabic,
            },
          })
          .json<any>();

        form.reset();

        if (res?.status) {
          toast.success(res?.message || t("success"));
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
          }, 100);
          // setOpen(false);
        }
      } catch (error) {
        console.error("Add request failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setThankYouPopup(true);
    }, 1000);
  }, []);

  return (
    <AnimatePresence mode={"wait"}>
      <div
        key="dashboard-content"
        className="flex flex-col items-center justify-center w-full h-full flex-1 mainBody "
      >
        <section className="w-full flex-1 relative mainWrapper ">
          <DashboardSidebar delay={0} />

          <div className="contentBox">
            <DashboardTopbar
              delay={0}
              title={t("add_governments_legislations")}
            />

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
              <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-2">
                <label className="text-black/70">{t("has_english")}</label>
                <form.Field
                  name="has_english"
                  children={(field) => (
                    <>
                      <RadioGroup
                        defaultValue="option-one"
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label
                            htmlFor="yes"
                            className="text-[1.2rem] font-secondary font-light cursor-pointer"
                          >
                            {t("yes")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label
                            htmlFor="no"
                            className="text-[1.2rem] font-secondary font-light cursor-pointer"
                          >
                            {t("no")}
                          </Label>
                        </div>
                      </RadioGroup>
                      {field.state.meta.errors.length > 0 && (
                        <span className="bg-[var(--brandRed)] text-[.85rem] inline-flex px-2 py-[2px] rounded-[3px] font-secondary text-white">
                          {field.state.meta.errors[0] || t("invalid-field")}
                        </span>
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
                name="sector"
                children={(field) => (
                  <Select
                    id="sector"
                    name="sector"
                    value={field.state.value}
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
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <form.Field
                name="legislation_type"
                children={(field) => (
                  <Select
                    id="legislation_type"
                    name="legislation_type"
                    value={field.state.value}
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
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <form.Field
                name="issued_date"
                children={(field) => (
                  <Input
                    type="date"
                    id="issued_date"
                    name="issued_date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("issued_date")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="legislation_full_title_english"
                children={(field) => (
                  <Input
                    type="text"
                    id="legislation_full_title_english"
                    name="legislation_full_title_english"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("legislation_full_title_english")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="legislation_full_title_arabic"
                children={(field) => (
                  <Input
                    type="text"
                    id="legislation_full_title_arabic"
                    name="legislation_full_title_arabic"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("legislation_full_title_arabic")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    dir="rtl"
                  />
                )}
              />
              <form.Field
                name="effective_date"
                children={(field) => (
                  <Input
                    type="date"
                    id="effective_date"
                    name="effective_date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("effective_date")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="legislation_year"
                children={(field) => (
                  <Select
                    id="legislation_year"
                    name="legislation_year"
                    value={field.state.value}
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
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <form.Field
                name="legislation_number"
                children={(field) => (
                  <Input
                    type="text"
                    id="legislation_number"
                    name="legislation_number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("legislation_number")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10">
                <form.Field
                  name="legislation_details_english"
                  children={(field) => (
                    <Input
                      id="legislation_details_english"
                      name="legislation_details_english"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      label={t("legislation_details_english")}
                      type="textarea"
                      error={field.state.meta.errors.length > 0 ? true : false}
                      errorMessage={t(field.state.meta.errors[0])}
                    />
                  )}
                />
                <form.Field
                  name="legislation_details_arabic"
                  children={(field) => (
                    <Input
                      id="legislation_details_arabic"
                      name="legislation_details_arabic"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      label={t("legislation_details_arabic")}
                      dir="rtl"
                      type="textarea"
                      error={field.state.meta.errors.length > 0 ? true : false}
                      errorMessage={t(field.state.meta.errors[0])}
                    />
                  )}
                />
              </div>
              <form.Field
                name="official_gazette_title_english"
                children={(field) => (
                  <Input
                    type="text"
                    id="official_gazette_title_english"
                    name="official_gazette_title_english"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("official_gazette_title_english")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="official_gazette_title_arabic"
                children={(field) => (
                  <Input
                    type="text"
                    id="official_gazette_title_arabic"
                    name="official_gazette_title_arabic"
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
                name="official_gazette_date"
                children={(field) => (
                  <Input
                    type="date"
                    id="official_gazette_date"
                    name="official_gazette_date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("official_gazette_date")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="official_gazette_number"
                children={(field) => (
                  <Input
                    type="text"
                    id="official_gazette_number"
                    name="official_gazette_number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("official_gazette_number")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-2">
                <label className="text-black/70">
                  {t("has_modifications")}
                </label>
                <form.Field
                  name="has_modifications"
                  children={(field) => (
                    <>
                      <RadioGroup
                        defaultValue="option-one"
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="yes"
                            id="has_modifications_yes"
                          />
                          <Label
                            htmlFor="has_modifications_yes"
                            className="text-[1.2rem] font-secondary font-light cursor-pointer"
                          >
                            {t("yes")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="no"
                            id="has_modifications_no"
                          />
                          <Label
                            htmlFor="has_modifications_no"
                            className="text-[1.2rem] font-secondary font-light cursor-pointer"
                          >
                            {t("no")}
                          </Label>
                        </div>
                      </RadioGroup>
                      {field.state.meta.errors.length > 0 && (
                        <span className="bg-[var(--brandRed)] text-[.85rem] inline-flex px-2 py-[2px] rounded-[3px] font-secondary text-white">
                          {field.state.meta.errors[0] || t("invalid-field")}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              <form.Field
                name="parent_legislation"
                children={(field) => (
                  <Select
                    id="parent_legislation"
                    name="parent_legislation"
                    value={field.state.value}
                    onValueChange={(e) => field.handleChange(e)}
                  >
                    <SelectTrigger
                      label={t("parent_legislation")}
                      hasValue={!!field.state.value}
                      error={field.state.meta.errors.length > 0 ? true : false}
                      errorMessage={field.state.meta.errors[0]}
                    >
                      <SelectValue
                        placeholder={t("name_of_the_parent_legislation")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* <form.Field
                name="parent_legislation_issued_date"
                children={(field) => (
                  <Input
                    type="date"
                    id="parent_legislation_issued_date"
                    name="parent_legislation_issued_date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("parent_legislation_issued_date")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="legislation_full_title_english"
                children={(field) => (
                  <Input
                    type="text"
                    id="legislation_full_title_english"
                    name="legislation_full_title_english"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("legislation_full_title_english")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="legislation_full_title_arabic"
                children={(field) => (
                  <Input
                    type="text"
                    id="legislation_full_title_arabic"
                    name="legislation_full_title_arabic"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("legislation_full_title_arabic")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    dir="rtl"
                  />
                )}
              /> 
              <form.Field
                name="official_gazette_title_english"
                children={(field) => (
                  <Input
                    type="text"
                    id="official_gazette_title_english"
                    name="official_gazette_title_english"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("official_gazette_title_english")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="official_gazette_title_arabic"
                children={(field) => (
                  <Input
                    type="text"
                    id="official_gazette_title_arabic"
                    name="official_gazette_title_arabic"
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
                name="official_gazette_date"
                children={(field) => (
                  <Input
                    type="date"
                    id="official_gazette_date"
                    name="official_gazette_date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("official_gazette_date")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />
              <form.Field
                name="official_gazette_number"
                children={(field) => (
                  <Input
                    type="text"
                    id="official_gazette_number"
                    name="official_gazette_number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("official_gazette_number")}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                  />
                )}
              />*/}
              <form.Field
                name="attachment"
                children={(field) => (
                  <Input
                    type="file"
                    id="attachment"
                    name="attachment"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label={t("attachment")}
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
          </div>
        </section>
        <ThankYouPopup
          type="success"
          open={thankYouPopup}
          setOpen={setThankYouPopup}
          title={t("submitted_successfully")}
          description={`The <strong>${t("legislations")}</strong> have been submitted successfully. This is now under review and will be notified accordingly.`}
        />
      </div>
    </AnimatePresence>
  );
}
