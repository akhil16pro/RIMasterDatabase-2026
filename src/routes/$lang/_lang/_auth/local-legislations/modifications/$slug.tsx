import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { PenLine, Plus, Trash2, X, Eye, History } from "lucide-react";
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
import { useNavigate } from "@tanstack/react-router";
import { SearchBox } from "@/components/ui/search";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-legislations/modifications/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "modifications",
      path: `/${params.lang}/local-legislations/modifications/${params.slug}`,
    }),
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const userSession = useAtomValue(userSessionAtom);

  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["local_legislations_modifications", slug, i18n.language],
    enabled: !!userSession?.accessToken,

    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/modifications/list/${slug}`)
          .json<any>();

        // console.log("local_legislations_modifications_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("local_legislations_data_error", error);
        return null;
      }
    },
  });

  return (
    <DashboardLayout
      isLoading={isLoading}
      title={data?.title || t("modifications")}
    >
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
          <DefaultButton
            title={t("add_modification")}
            variant="dark"
            icon={<Plus className="size-5" />}
            className=""
            onClick={() => {
              navigate({
                to:
                  "/" +
                  i18n.language +
                  "/local-legislations/modifications/add/" +
                  slug,
              });
            }}
          />
        </div>

        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="order-5 md:order-none"
        />
      </motion.div>

      <PageTable search={search} slug={slug} />
    </DashboardLayout>
  );
}

function PageTable({ search, slug }: { search: string; slug: string }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const userSession = useAtomValue(userSessionAtom);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: [
      "local_legislations_modifications_table",
      slug,
      pagination.currentPage,
      i18n.language,
    ],
    enabled: !!userSession?.accessToken,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(
            i18n.language +
              `/modifications/table/${slug}?page=${pagination.currentPage}`,
          )
          .json<any>();
        // console.log("LOCAL_LEGISLATION_TABLE_DATA", res?.data);
        return res?.data;
      } catch (error) {
        console.log("LOCAL_LEGISLATION_TABLE_DATA_ERROR", error);
        return null;
      }
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ slug, status }: { slug: string; status: number }) => {
      return await apiClient
        .post(`${i18n.language}/modifications/status/${slug}/${status}`)
        .json<any>();
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || t("success"));
      queryClient.invalidateQueries({
        queryKey: ["local_legislations_modifications_table"],
      });
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

function ViewAction({ slug, action }: { slug: string; action: any }) {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const handleView = () => {
    navigate({
      to: `/${i18n.language}/local-legislations/modifications/view/${slug}`,
      search: {
        parentSlug: action?.parent_slug,
      },
    });
  };

  return (
    <DefaultButton
      icon={<Eye className="size-4" stroke="url(#button_linear_green)" />}
      rounded={true}
      iconGradient={"view"}
      toolTip={t("view")}
      toolTipClass="viewTip"
      onClick={handleView}
    />
  );
}

function EditAction({ slug, action }: { slug: string; action: any }) {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({
      to: `/${i18n.language}/local-legislations/modifications/edit/${slug}`,
      search: {
        parentSlug: action?.parent_slug,
      },
    });
  };

  return (
    <DefaultButton
      icon={<PenLine className="size-4" stroke="url(#button_linear)" />}
      rounded={true}
      iconGradient={"edit"}
      toolTip={t("edit")}
      toolTipClass="editTip"
      onClick={handleEdit}
    />
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
          .get(i18n.language + "/modifications/delete/" + value.slug)
          .json<any>();

        if (res?.status) {
          setAnimationWait(false);
          setOpen(false);
          form.reset();
          toast.success(res?.message || t("success"));
          await queryClient.invalidateQueries({
            queryKey: ["local_legislations_modifications_table"],
          });
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
            <DialogTitle>{t("delete_modification")}</DialogTitle>
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
