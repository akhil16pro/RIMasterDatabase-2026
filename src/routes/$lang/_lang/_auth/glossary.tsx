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
import {
  BookOpenText,
  Download,
  PenLine,
  Plus,
  Trash2,
  Upload,
  CircleCheck,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table } from "@/components/ui/Table";
import { toast } from "sonner";

import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { Pagination } from "@/components/ui/Pagination";

export const Route = createFileRoute("/$lang/_lang/_auth/glossary")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["glossary"],
    enabled: !!userSession?.accessToken,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/glossary`, {
            headers: {
              Authorization: `Bearer ${userSession?.accessToken}`,
            },
          })
          .json();
        // console.log("GLOSSARY_DATA", res?.data);
        return res?.data;
      } catch (error) {
        console.log("GLOSSARY_DATA_ERROR", error);
        return null;
      }
    },
  });

  const campaignStartDate = new Date(data?.campaign?.from_date);
  const campaignEndDate = new Date(data?.campaign?.to_date);

  const isCampaignActive =
    campaignStartDate <= new Date() && campaignEndDate >= new Date();

  return (
    <>
      {isLoading ? (
        <RouteLoader key="dashboard-loader" />
      ) : error ? (
        <RoteError key="dashboard-error" />
      ) : (
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
                  title={data?.translator?.glossary || t("glossary")}
                  campaign={data?.campaign}
                  translator={data?.translator}
                />
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-wrap md:justify-end gap-2"
                >
                  {isCampaignActive && data?.campaign && (
                    <>
                      <div className="md:flex-1">
                        <AddGlossaryModal translator={data?.translator} />
                      </div>

                      <DefaultButton
                        title={
                          data?.translator?.download_excel_template ||
                          t("download-excel-template")
                        }
                        icon={<Download className="size-5" />}
                        onClick={() => {
                          window.open(data?.campaign?.url, "_blank");
                        }}
                      />

                      <UploadExcelModal translator={data?.translator} />
                    </>
                  )}
                  <DefaultButton
                    title={data?.translator?.guideline || t("guideline")}
                    icon={<BookOpenText className="size-5" />}
                  />
                </motion.div>

                <GlossaryTable />
              </div>
            </section>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}

function GlossaryTable() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const userSession = useAtomValue(userSessionAtom);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["glossaryTable", pagination.currentPage],
    enabled: !!userSession?.accessToken,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(
            i18n.language + `/glossary/table?page=${pagination.currentPage}`,
            {
              headers: {
                Authorization: `Bearer ${userSession?.accessToken}`,
              },
            },
          )
          .json();
        // console.log("GLOSSARY_TABLE_DATA", res?.data);
        return res?.data;
      } catch (error) {
        console.log("GLOSSARY_TABLE_DATA_ERROR", error);
        return null;
      }
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ slug, status }: { slug: string; status: number }) => {
      return await apiClient
        .post(`${i18n.language}/glossary/status/${slug}/${status}`, {
          headers: {
            Authorization: `Bearer ${userSession?.accessToken}`,
          },
        })
        .json();
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || t("success"));
      queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(t("error-occurred"));
    },
  });

  return (
    <>
      {data && (
        <Table
          pageStartIndex={data?.pagination?.page_start_index}
          tableHead={data?.glossary_headers}
          tableData={data?.glossaries}
          EditAction={EditAction}
          DeleteAction={DeleteAction}
          translator={data?.translator}
          onStatusToggle={
            userSession?.user?.roles.includes("admin")
              ? (slug: string, value: boolean) => {
                  const status = value === true ? 1 : 3;
                  toggleStatusMutation.mutate({ slug, status });
                }
              : undefined
          }
        />
      )}

      {data?.pagination && (
        <Pagination
          currentPage={data?.pagination?.current_page}
          totalPages={data?.pagination?.last_page}
          onPageChange={(page: number) => {
            setPagination((prev) => ({
              ...prev,
              currentPage: page,
            }));
          }}
        />
      )}
    </>
  );
}

function EditAction({ slug, translator }: { slug: string; translator?: any }) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const userSession = useAtomValue(userSessionAtom);
  // console.log(slug, "edit slug");

  const { data } = useQuery({
    queryKey: ["glossaryEdit", slug],
    queryFn: async () => {
      const res = await apiClient
        .get(i18n.language + "/glossary/edit/" + slug, {
          headers: {
            Authorization: `Bearer ${userSession?.accessToken}`,
          },
        })
        .json();
      return res?.data;
    },
  });

  const form = useForm({
    defaultValues: {
      title: data?.glossaryData?.title || "",
      title_arabic: data?.glossaryData?.title_arabic || "",
      description: data?.glossaryData?.description || "",
      description_arabic: data?.glossaryData?.description_arabic || "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/glossary/update/" + slug, {
            headers: {
              Authorization: `Bearer ${userSession?.accessToken}`,
            },
            json: {
              title: value.title,
              title_arabic: value.title_arabic,
              description: value.description,
              description_arabic: value.description_arabic,
            },
          })
          .json();

        if (res?.status) {
          toast.success(res?.message || t("success"));
          queryClient.invalidateQueries({ queryKey: ["glossary"] });
          setOpen(false);
        } else {
          toast.error(res?.message || t("error-occurred"));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.message || t("error-occurred"));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <DefaultButton
            icon={<PenLine className="size-4" stroke="url(#button_linear)" />}
            rounded={true}
            iconGradient={"edit"}
            toolTip={t("edit")}
            toolTipClass="editTip"
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("edit-glossary")}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 items-start">
            <form.Field
              name="title"
              validators={{
                onSubmit: ({ value }) => (!value ? t("title-required") : null),
              }}
              children={(field) => (
                <Input
                  id="title"
                  name="title"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("title-english")}
                  className=""
                  dir="ltr"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                />
              )}
            />
            <form.Field
              name="title_arabic"
              validators={{
                onSubmit: ({ value }) => (!value ? t("title-required") : null),
              }}
              children={(field) => (
                <Input
                  id="title_arabic"
                  name="title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("title-arabic")}
                  className=""
                  dir="rtl"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                />
              )}
            />
            <form.Field
              name="description"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? t("description-required") : null,
              }}
              children={(field) => (
                <Input
                  id="description"
                  name="description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("description-english")}
                  dir="ltr"
                  type="textarea"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                />
              )}
            />
            <form.Field
              name="description_arabic"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? t("description-required") : null,
              }}
              children={(field) => (
                <Input
                  id="description_arabic"
                  name="description_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("description-arabic")}
                  dir="rtl"
                  type="textarea"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                />
              )}
            />
            <div className="inline-flex gap-2 text-[var(--textColor)] text-[1.2rem]">
              <label className="text-muted-foreground">{t("status")}</label>
              <div className="flex gap-1 items-center">
                <label className="font-bold">{t("draft")}</label>
                <CircleCheck className="size-[14px]" strokeWidth={1} />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start mt-2">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("update")}
              onClick={form.handleSubmit}
              icon={<Pencil className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function DeleteAction({
  slug,
  translator,
}: {
  slug: string;
  translator?: any;
}) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["settings"]);
  const userSession = useAtomValue(userSessionAtom);
  // console.log(slug, "delete slug");
  const form = useForm({
    defaultValues: {
      slug: slug,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .get(i18n.language + "/glossary/delete/" + value.slug, {
            headers: {
              Authorization: `Bearer ${userSession?.accessToken}`,
            },
          })
          .json();
        // console.log(res);

        form.reset();

        if (res?.status) {
          toast.success(res?.message || t("success"));
          queryClient.invalidateQueries({ queryKey: ["glossary"] });
          // setOpen(false);
        } else {
          toast.error(res?.message || t("error-occurred"));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.message || t("error-occurred"));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <DefaultButton
            icon={
              <Trash2 className="size-4" stroke="url(#button_linear_red)" />
            }
            rounded={true}
            iconGradient={"delete"}
            toolTip={t("delete")}
            toolTipClass="deleteTip"
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {translator?.delete_glossary || t("delete-glossary")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex">
            <p className=" text-lg font-secondary text-[var(--textColor)]">
              {translator?.are_you_sure ||
                t("are-you-sure-you-want-to-delete-this-glossary")}
            </p>
          </div>
          <DialogFooter className="sm:justify-end mt-2">
            <DefaultButton
              type="button"
              variant="dark"
              title={translator?.cancel || t("cancel")}
              onClick={() => setOpen(false)}
              icon={<X className="size-5" />}
              isDisabled={isSubmitting}
              iconGradient="gray"
            />
            <DefaultButton
              type="submit"
              variant="dark"
              title={translator?.delete || t("delete")}
              onClick={form.handleSubmit}
              icon={<Trash2 className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              iconGradient="delete"
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function AddGlossaryModal({ translator }: { translator?: any }) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["settings"]);
  const userSession = useAtomValue(userSessionAtom);

  const form = useForm({
    defaultValues: {
      title: "",
      title_arabic: "",
      description: "",
      description_arabic: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/glossary/create", {
            headers: {
              Authorization: `Bearer ${userSession?.accessToken}`,
            },
            json: {
              title: value.title,
              title_arabic: value.title_arabic,
              description: value.description,
              description_arabic: value.description_arabic,
            },
          })
          .json();

        form.reset();

        if (res?.status) {
          toast.success(res?.message || t("success"));
          queryClient.invalidateQueries({ queryKey: ["glossary"] });
          // setOpen(false);
        } else {
          toast.error(res?.message || t("error-occurred"));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.message || t("error-occurred"));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <DefaultButton
            title={translator?.add_glossary || t("add-glossary")}
            variant="dark"
            icon={<Plus className="size-5" />}
            className=""
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {translator?.add_glossary || t("add-glossary")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 items-start">
            <form.Field
              name="title"
              validators={{
                onSubmit: ({ value }) => (!value ? t("title-required") : null),
              }}
              children={(field) => (
                <Input
                  id="title"
                  name="title"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("title-english")}
                  className=""
                  dir="ltr"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                />
              )}
            />
            <form.Field
              name="title_arabic"
              validators={{
                onSubmit: ({ value }) => (!value ? t("title-required") : null),
              }}
              children={(field) => (
                <Input
                  id="title_arabic"
                  name="title_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("title-arabic")}
                  className=""
                  dir="rtl"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                />
              )}
            />
            <form.Field
              name="description"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? t("description-required") : null,
              }}
              children={(field) => (
                <Input
                  id="description"
                  name="description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("description-english")}
                  dir="ltr"
                  type="textarea"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                />
              )}
            />
            <form.Field
              name="description_arabic"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? t("description-required") : null,
              }}
              children={(field) => (
                <Input
                  id="description_arabic"
                  name="description_arabic"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label={t("description-arabic")}
                  dir="rtl"
                  type="textarea"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                />
              )}
            />
            <div className="inline-flex gap-2 text-[var(--textColor)] text-[1.2rem]">
              <label className="text-muted-foreground">{t("status")}</label>
              <div className="flex gap-1 items-center">
                <label className="font-bold">{t("draft")}</label>
                <CircleCheck className="size-[14px]" strokeWidth={1} />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start mt-2">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("add-item")}
              onClick={form.handleSubmit}
              icon={<Plus className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function UploadExcelModal({ translator }: { translator?: any }) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["settings"]);
  const userSession = useAtomValue(userSessionAtom);

  const form = useForm({
    defaultValues: {
      file: null,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        if (value.file) {
          formData.append("excel_file", value.file);
        }

        // console.log(formData.get("excel_file"), "formData");

        const res = await apiClient
          .post(i18n.language + "/glossary/upload-excel-template", {
            headers: {
              Authorization: `Bearer ${userSession?.accessToken}`,
              "Content-Type": undefined,
            },
            body: formData,
          })
          .json();
        form.reset();
        if (res?.status) {
          toast.success(res?.message || t("success"));
          queryClient.invalidateQueries({ queryKey: ["glossary"] });
          setTimeout(() => {
            setOpen(false);
          }, 100);
        } else {
          toast.error(res?.message || t("error-occurred"));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.message || t("error-occurred"));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <DefaultButton
            className=""
            title={translator?.upload_excel || t("upload-excel")}
            icon={<Upload className="size-5" />}
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {translator?.upload_excel || t("upload-excel")}
            </DialogTitle>
          </DialogHeader>

          <form.Field
            name="file"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) return t("file-required");

                const fileName = value.name.toLowerCase();
                const allowedExtensions = [".csv", ".xls", ".xlsx"];
                const isValid = allowedExtensions.some((ext) =>
                  fileName.endsWith(ext),
                );

                if (!isValid) return t("file-must-be-excel-or-csv");
                return null;
              },
            }}
            children={(field) => (
              <Input
                id="file"
                name="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]; // Get the actual File object
                  field.handleChange(file);
                }}
                label={t("file")}
                className=""
                type="file"
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
            className="w-full"
          />

          <DialogFooter className="sm:justify-start mt-2">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("upload-file")}
              onClick={form.handleSubmit}
              icon={<Plus className="size-5" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
