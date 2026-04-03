import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import DashboardLayout from "@/components/layouts/DashboardLayout";
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
  Eye,
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
import { useEffect } from "react";

export const Route = createFileRoute("/$lang/_lang/_auth/glossary")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["glossary", i18n.language],
    enabled: !!userSession?.accessToken,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/glossary`)
          .json<any>();
        // console.log("GLOSSARY_DATA", res?.data);

        return res?.data;
      } catch (error) {
        console.log("GLOSSARY_DATA_ERROR", error);
        return null;
      }
    },
  });

  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const campaignStartDate = new Date(data?.campaign?.from_date);
  campaignStartDate.setHours(0, 0, 0, 0);
  const campaignEndDate = new Date(data?.campaign?.to_date);
  campaignEndDate.setHours(23, 59, 59, 999);

  const isCampaignActive = campaignStartDate <= now && campaignEndDate >= now;

  return (
    <DashboardLayout
      isLoading={isLoading}
      isRefetching={isRefetching}
      error={error}
      title={t("glossary")}
      campaign={data?.campaign}
    >
      {isCampaignActive && data?.campaign && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="flex flex-wrap md:justify-end gap-2"
        >
          <div className="md:flex-1">
            <AddModal />
          </div>

          <DefaultButton
            title={t("download_excel_template")}
            icon={<Download className="size-5" />}
            onClick={() => {
              window.open(data?.campaign?.url, "_blank");
            }}
          />

          <UploadExcelModal />
          <DefaultButton
            title={t("guideline")}
            icon={<BookOpenText className="size-5" />}
          />
        </motion.div>
      )}

      <PageTable />
    </DashboardLayout>
  );
}

function PageTable() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const userSession = useAtomValue(userSessionAtom);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["glossaryTable", pagination.currentPage, i18n.language],
    enabled: !!userSession?.accessToken,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/glossary/table?page=${pagination.currentPage}`)
          .json<any>();
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
        .post(`${i18n.language}/glossary/status/${slug}/${status}`)
        .json<any>();
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || t("success"));
      queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || t("error-occurred"));
    },
  });

  return (
    <>
      {data && (
        <Table
          pageStartIndex={data?.pagination?.page_start_index}
          tableHead={data?.table_headers}
          tableData={data?.table_values}
          EditAction={EditAction}
          DeleteAction={DeleteAction}
          ViewAction={ViewAction}
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

function ViewAction({ slug }: { slug: string }) {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["glossaryView", slug],
    queryFn: async () => {
      const res = await apiClient
        .get(i18n.language + "/glossary/edit/" + slug)
        .json<any>();
      // console.log(res?.data, "dsf");
      setLoading(false);
      setOpen(true);
      return res?.data;
    },
    enabled: loading,
    staleTime: 0,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DefaultButton
          icon={<Eye className="size-4" stroke="url(#button_linear_green)" />}
          rounded={true}
          iconGradient={"view"}
          toolTip={t("view")}
          toolTipClass="viewTip"
          onClick={() => setLoading(true)}
        />

        <DialogContent className="lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("glossary_details")}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 items-start">
            <Input
              id="title"
              name="title"
              value={data?.glossaryData?.title}
              label={t("title_english")}
              className=""
              isLoading={isLoading}
              readOnly
            />

            <Input
              id="title_arabic"
              name="title_arabic"
              value={data?.glossaryData?.title_arabic}
              label={t("title_arabic")}
              className=""
              dir="rtl"
              isLoading={isLoading}
              readOnly
            />

            <Input
              id="description"
              name="description"
              value={data?.glossaryData?.description}
              label={t("description_english")}
              type="textarea"
              isLoading={isLoading}
              readOnly
            />

            <Input
              id="description_arabic"
              name="description_arabic"
              value={data?.glossaryData?.description_arabic}
              label={t("description_arabic")}
              dir="rtl"
              type="textarea"
              isLoading={isLoading}
              readOnly
            />

            <Input
              id="created_by"
              name="created_by"
              value={data?.glossaryData?.user_info?.name}
              label={t("created_by")}
              type="text"
              isLoading={isLoading}
              readOnly
            />
            <Input
              id="entity_name"
              name="entity_name"
              value={data?.glossaryData?.entity_info?.title}
              label={t("entity_name")}
              type="text"
              isLoading={isLoading}
              readOnly
            />

            <div className="inline-flex gap-2 text-[var(--textColor)] text-[1.2rem]">
              <label className="text-muted-foreground">{t("status")}</label>
              <div className="flex gap-1 items-center">
                <label
                  className={cn(
                    "font-bold",
                    data?.glossaryData?.status === 1
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-danger)]",
                  )}
                >
                  {data?.glossaryData?.status === 1
                    ? t("published")
                    : t("draft")}
                </label>
                <CircleCheck
                  className={cn(
                    "size-[14px] ",
                    data?.glossaryData?.status === 1
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-danger)]",
                  )}
                  strokeWidth={1}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function EditAction({ slug }: { slug: string }) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading } = useQuery({
    queryKey: ["glossaryEdit", slug],
    queryFn: async () => {
      const res = await apiClient
        .get(i18n.language + "/glossary/edit/" + slug)
        .json<any>();
      setLoading(false);
      setOpen(true);
      return res?.data;
    },
    enabled: loading,
    staleTime: 0,
  });

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
          queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
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

  useEffect(() => {
    if (data?.glossaryData) {
      form.setFieldValue("title", data.glossaryData?.title || "");
      form.setFieldValue("title_arabic", data.glossaryData?.title_arabic || "");
      form.setFieldValue("description", data.glossaryData?.description || "");
      form.setFieldValue(
        "description_arabic",
        data.glossaryData?.description_arabic || "",
      );
    }
  }, [data, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DefaultButton
          icon={<PenLine className="size-4" stroke="url(#button_linear)" />}
          rounded={true}
          iconGradient={"edit"}
          toolTip={t("edit")}
          toolTipClass="editTip"
          onClick={() => setLoading(true)}
        />

        <DialogContent className="lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("edit_glossary")}</DialogTitle>
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
                  label={t("title_english")}
                  className=""
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={field.state.meta.errors[0]}
                  isLoading={isLoading}
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
                  label={t("title_arabic")}
                  className=""
                  dir="rtl"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                  isLoading={isLoading}
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
                  label={t("description_english")}
                  type="textarea"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                  isLoading={isLoading}
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
                  label={t("description_arabic")}
                  dir="rtl"
                  type="textarea"
                  error={field.state.meta.errors.length > 0 ? true : false}
                  errorMessage={t(field.state.meta.errors[0])}
                  isLoading={isLoading}
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
  setAnimationWait,
}: {
  slug: string;
  setAnimationWait: (value: boolean) => void;
}) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const userSession = useAtomValue(userSessionAtom);

  const form = useForm({
    defaultValues: {
      slug: slug,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .get(i18n.language + "/glossary/delete/" + value.slug)
          .json<any>();

        if (res?.status) {
          setAnimationWait(false);
          setOpen(false);
          form.reset();
          toast.success(res?.message || t("success"));
          await queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
          setTimeout(() => {
            setAnimationWait(true);
          }, 700);
        }
      } catch (error) {
        console.error("Delete request failed:", error);
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
            <DialogTitle>{t("delete_glossary")}</DialogTitle>
          </DialogHeader>
          <div className="flex">
            <p className=" text-lg font-secondary text-[var(--textColor)]">
              {t("are_you_sure")}
            </p>
          </div>
          <DialogFooter className="sm:justify-end mt-2">
            <DefaultButton
              type="button"
              variant="dark"
              title={t("cancel")}
              onClick={() => setOpen(false)}
              icon={<X className="size-5" />}
              isDisabled={isSubmitting}
              iconGradient="gray"
            />
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("delete")}
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

function AddModal() {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

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
            title={t("add_glossary")}
            variant="dark"
            icon={<Plus className="size-5" />}
            className=""
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("add_glossary")}</DialogTitle>
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
                  label={t("title_english")}
                  className=""
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
                  label={t("title_arabic")}
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
                  label={t("description_english")}
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
                  label={t("description_arabic")}
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
              title={t("add_item")}
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

function UploadExcelModal() {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

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

        const res = await apiClient
          .post(i18n.language + "/glossary/upload-excel-template", {
            headers: {
              "Content-Type": undefined,
            },
            body: formData,
          })
          .json<any>();

        if (res?.status) {
          form.reset();
          await queryClient.invalidateQueries({ queryKey: ["glossaryTable"] });
          toast.success(res?.message || t("success"));
          setOpen(false);
        }
      } catch (error) {
        console.error("Excel upload failed:", error);
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
            title={t("upload_excel")}
            icon={<Upload className="size-5" />}
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("upload_excel")}</DialogTitle>
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
              title={t("upload_file")}
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
