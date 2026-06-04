import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
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
import { toast } from "@/lib/toast";

import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { Pagination } from "@/components/ui/Pagination";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import EditBadge from "@/components/ui/EditBadge";
export const Route = createFileRoute("/$lang/_lang/_auth/glossary")({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => {
      return {
        key: "glossary",
        path: `/${params.lang}/glossary`,
      };
    },
  },
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

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiClient
        .get(i18n.language + `/glossary/download-excel-template`)
        .blob();

      const url = window.URL.createObjectURL(response);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template.xlsx");
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error?.message || t("download_failed"));
    }
  };

  return (
    <DashboardLayout
      isLoading={isLoading}
      isRefetching={isRefetching}
      error={error}
      title={t("glossary")}
      campaign={data?.campaign}
    >
      {((isCampaignActive && data?.campaign) ||
        userSession?.user?.roles.includes("admin")) && (
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
            <AddModal data={data} />
          </div>

          <DefaultButton
            title={t("download_glossary_template")}
            icon={<Download className="size-5" />}
            onClick={handleDownloadTemplate}
          />

          <UploadExcelModal />
          {/* <DefaultButton
            title={t("guideline")}
            icon={<BookOpenText className="size-5" />}
          /> */}
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

  const processedTableData = React.useMemo(() => {
    return data?.table_values?.map((row: any) => ({
      ...row,
      actions: row.actions?.map((action: any) => {
        let ActionComponent;
        switch (action.type) {
          case "view":
            ActionComponent = ViewAction;
            break;
          case "edit":
            ActionComponent = EditAction;
            break;

          case "delete":
            ActionComponent = DeleteAction;
            break;
          default:
            ActionComponent = null;
        }

        return {
          ...action,

          render: ActionComponent,
        };
      }),
    }));
  }, [data?.table_values, i18n.language]);

  return (
    <>
      {data && (
        <Table
          pageStartIndex={data?.pagination?.page_start_index}
          tableHead={data?.table_headers}
          tableData={processedTableData}
          translator={data?.translator}
          statistics={data?.statistics}
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
      // console.log(res?.data, "view data");
      setLoading(false);
      setOpen(true);
      return res?.data;
    },
    enabled: loading,
    staleTime: 0,
  });

  const userSession = useAtomValue(userSessionAtom);

  const isAdmin = userSession?.user?.roles?.includes("admin");

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

        <DialogContent className="lg:max-w-4xl" aria-describedby={undefined}>
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
            <Select
              key={data?.glossaryData?.classification_id}
              value={data?.glossaryData?.classification_id?.toString() || ""}
            >
              <SelectTrigger
                label={t("classification")}
                hasValue={!!data?.glossaryData?.classification_id}
                readOnly={true}
              >
                <SelectValue placeholder={t("select_classification")} />
              </SelectTrigger>
              <SelectContent>
                {data?.classificationList?.map((item: any) => (
                  <SelectItem
                    key={`classification-${item.value}`}
                    value={item.value?.toString()}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              key={data?.glossaryData?.sector}
              value={data?.glossaryData?.sector?.toString() || ""}
            >
              <SelectTrigger
                label={t("sector")}
                hasValue={!!data?.glossaryData?.sector}
                readOnly={true}
              >
                <SelectValue placeholder={t("select_sector")} />
              </SelectTrigger>
              <SelectContent>
                {data?.sectorList?.map((item: any) => (
                  <SelectItem
                    key={`sector-${item.value}`}
                    value={item.value?.toString()}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAdmin && (
              <Select
                key={data?.glossaryData?.entity_id}
                value={data?.glossaryData?.entity_id?.toString() || ""}
              >
                <SelectTrigger
                  label={t("entity")}
                  hasValue={!!data?.glossaryData?.entity_id}
                  readOnly={true}
                >
                  <SelectValue placeholder={t("select_entity")} />
                </SelectTrigger>
                <SelectContent>
                  {data?.entityList?.map((item: any) => (
                    <SelectItem
                      key={`sector-${item.value}`}
                      value={item.value?.toString()}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {/* <Input
              id="created_by"
              name="created_by"
              value={data?.glossaryData?.user_info?.name}
              label={t("created_by")}
              type="text"
              isLoading={isLoading}
              readOnly
            /> */}
            {/* <Input
              id="entity_name"
              name="entity_name"
              value={data?.glossaryData?.entity_info?.title}
              label={t("entity_name")}
              type="text"
              isLoading={isLoading}
              readOnly
            /> 
            
            
            */}
            <div className="inline-flex gap-2 text-[var(--textColor)] text-[1.2rem] col-span-full">
              <label
                className="text-muted-foreground"
                aria-describedby={undefined}
              >
                {t("status")}
              </label>
              <div className="flex gap-1 items-center">
                <label
                  aria-describedby={undefined}
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
            <EditBadge data={data?.glossaryData} className="col-span-full" />
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

  const isAdmin = userSession?.user?.roles?.includes("admin");
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
      sector_id: "",
      entity_id: "",
      classification_id: "",
      title: "",
      title_arabic: "",
      description: "",
      description_arabic: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("sector_id", value.sector_id || "");
        if (isAdmin) {
          formData.append("entity_id", value.entity_id || "");
        }
        formData.append("classification_id", value.classification_id || "");
        formData.append("title", value.title);
        formData.append("title_arabic", value.title_arabic);
        formData.append("description", value.description);
        formData.append("description_arabic", value.description_arabic);

        const res = await apiClient
          .post(i18n.language + "/glossary/update/" + slug, {
            headers: {
              "Content-Type": undefined,
            },
            body: formData,
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
      form.setFieldValue("sector_id", data.glossaryData?.sector || "");
      form.setFieldValue("entity_id", data.glossaryData?.entity_id || "");
      form.setFieldValue(
        "classification_id",
        data.glossaryData?.classification_id || "",
      );
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
            <form.Field
              name="classification_id"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Select
                  id="classification_id"
                  name="classification_id"
                  value={field.state.value?.toString() || ""}
                  onValueChange={(e) => field.handleChange(e)}
                >
                  <SelectTrigger
                    label={t("classification")}
                    hasValue={!!field.state.value}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    onClear={() => field.handleChange(null)}
                  >
                    <SelectValue placeholder={t("select_classification")} />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.classificationList?.map((item: any) => (
                      <SelectItem
                        key={`classification-${item.value}`}
                        value={item.value?.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <form.Field
              name="sector_id"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Select
                  id="sector_id"
                  name="sector_id"
                  value={field.state.value?.toString() || ""}
                  onValueChange={(e) => field.handleChange(e)}
                >
                  <SelectTrigger
                    label={t("sector")}
                    hasValue={!!field.state.value}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    onClear={() => field.handleChange(null)}
                  >
                    <SelectValue placeholder={t("select_sector")} />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.sectorList?.map((item: any) => (
                      <SelectItem
                        key={`sector-${item.value}`}
                        value={item.value?.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {isAdmin && (
              <form.Field
                name="entity_id"
                validators={{
                  onSubmit: ({ value }) =>
                    !value ? t("required_field") : null,
                }}
                children={(field) => (
                  <Select
                    id="entity_id"
                    name="entity_id"
                    value={field.state.value?.toString() || ""}
                    onValueChange={(e) => field.handleChange(e)}
                  >
                    <SelectTrigger
                      label={t("entity")}
                      hasValue={!!field.state.value}
                      error={field.state.meta.errors.length > 0 ? true : false}
                      errorMessage={field.state.meta.errors[0]}
                      onClear={() => field.handleChange(null)}
                    >
                      <SelectValue placeholder={t("select_entity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.entityList?.map((item: any) => (
                        <SelectItem
                          key={`sector-${item.value}`}
                          value={item.value?.toString()}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            <div className="inline-flex gap-2 text-[var(--textColor)] text-[1.2rem] col-span-full">
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
          .delete(i18n.language + "/glossary/" + value.slug)
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

function AddModal({ data }: { data: any }) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const userSession = useAtomValue(userSessionAtom);

  const isAdmin = userSession?.user?.roles?.includes("admin");

  const form = useForm({
    defaultValues: {
      sector_id: "",
      entity_id: "",
      classification_id: "",
      title: "",
      title_arabic: "",
      description: "",
      description_arabic: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("sector_id", value.sector_id || "");
        if (isAdmin) {
          formData.append("entity_id", value.entity_id || "");
        }
        formData.append("classification_id", value.classification_id || "");
        formData.append("title", value.title);
        formData.append("title_arabic", value.title_arabic);
        formData.append("description", value.description);
        formData.append("description_arabic", value.description_arabic);
        const res = await apiClient
          .post(i18n.language + "/glossary/create", {
            headers: {
              "Content-Type": undefined,
            },
            body: formData,
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

  console.log(data);

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
            <form.Field
              name="classification_id"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Select
                  id="classification_id"
                  name="classification_id"
                  value={field.state.value?.toString() || ""}
                  onValueChange={(e) => field.handleChange(e)}
                >
                  <SelectTrigger
                    label={t("classification")}
                    hasValue={!!field.state.value}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    onClear={() => field.handleChange(null)}
                  >
                    <SelectValue placeholder={t("select_classification")} />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.classificationList?.map((item: any) => (
                      <SelectItem
                        key={`classification-${item.value}`}
                        value={item.value?.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <form.Field
              name="sector_id"
              validators={{
                onSubmit: ({ value }) => (!value ? t("required_field") : null),
              }}
              children={(field) => (
                <Select
                  id="sector_id"
                  name="sector_id"
                  value={field.state.value?.toString() || ""}
                  onValueChange={(e) => field.handleChange(e)}
                >
                  <SelectTrigger
                    label={t("sector")}
                    hasValue={!!field.state.value}
                    error={field.state.meta.errors.length > 0 ? true : false}
                    errorMessage={field.state.meta.errors[0]}
                    onClear={() => field.handleChange(null)}
                  >
                    <SelectValue placeholder={t("select_sector")} />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.sectorList?.map((item: any) => (
                      <SelectItem
                        key={`sector-${item.value}`}
                        value={item.value?.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {isAdmin && (
              <form.Field
                name="entity_id"
                validators={{
                  onSubmit: ({ value }) =>
                    !value ? t("required_field") : null,
                }}
                children={(field) => (
                  <Select
                    id="entity_id"
                    name="entity_id"
                    value={field.state.value?.toString() || ""}
                    onValueChange={(e) => field.handleChange(e)}
                  >
                    <SelectTrigger
                      label={t("entity")}
                      hasValue={!!field.state.value}
                      error={field.state.meta.errors.length > 0 ? true : false}
                      errorMessage={field.state.meta.errors[0]}
                      onClear={() => field.handleChange(null)}
                    >
                      <SelectValue placeholder={t("select_entity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.entityList?.map((item: any) => (
                        <SelectItem
                          key={`sector-${item.value}`}
                          value={item.value?.toString()}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}

            <div className="inline-flex gap-2 text-[var(--textColor)] text-[1.2rem] col-span-full">
              <label
                className="text-muted-foreground"
                aria-describedby={undefined}
              >
                {t("status")}
              </label>
              <div className="flex gap-1 items-center">
                <label className="font-bold" aria-describedby={undefined}>
                  {t("draft")}
                </label>
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
            title={t("upload_glossary")}
            icon={<Upload className="size-5" />}
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("upload_glossary")}</DialogTitle>
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
                // label={t("file")}
                className=""
                type="file"
                error={field.state.meta.errors.length > 0 ? true : false}
                errorMessage={field.state.meta.errors[0]}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            )}
            className="w-full"
          />

          <DialogFooter className="sm:justify-start mt-2">
            <DefaultButton
              type="submit"
              variant="dark"
              title={t("submit")}
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
