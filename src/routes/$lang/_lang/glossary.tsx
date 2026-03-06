import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/ui/sectionTitle";
import BarChart from "@/components/ui/BarChart";
import { cn } from "@/lib/utils";

import { isMobile } from "react-device-detect";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table } from "@/components/ui/Table";

export const Route = createFileRoute("/$lang/_lang/glossary")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  let isLoading = false;
  let error = false;
  let isRefetching = false;
  const data = {
    title: "Glossary",
  };

  return (
    <AnimatePresence mode={"wait"}>
      {isLoading || isRefetching ? (
        <RouteLoader key="dashboard-loader" />
      ) : error ? (
        <RoteError key="dashboard-error" />
      ) : (
        <div
          key="dashboard-content"
          className="flex flex-col items-center justify-center w-full h-full flex-1 mainBody "
        >
          <section className="w-full flex-1 relative mainWrapper ">
            <DashboardSidebar delay={0} />

            <div className="contentBox">
              <DashboardTopbar
                delay={0}
                title={data.title}
                timeCounter={true}
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
                className="flex flex-wrap md:justify-end gap-2"
              >
                <div className="md:flex-1">
                  <AddGlossaryModal />
                </div>

                <DefaultButton
                  title={t("download-excel-template")}
                  icon={<Download className="size-5" />}
                />
                <DefaultButton
                  title={t("upload-excel")}
                  icon={<Upload className="size-5" />}
                />
                <DefaultButton
                  title={t("guideline")}
                  icon={<BookOpenText className="size-5" />}
                />
              </motion.div>

              <GlossaryTable />
            </div>
          </section>
        </div>
      )}
    </AnimatePresence>
  );
}

function GlossaryTable() {
  const { t } = useTranslation();

  const tableHead = [
    { title: t("no"), key: "no" },
    { title: t("title"), key: "title" },
    { title: t("description"), key: "description" },
    { title: t("status"), key: "status" },
    { title: t("actions"), key: "action" },
  ];

  const tableData = [
    {
      title: "State",
      description: "United Arab Emirates.",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Ministry",
      description: "Ministry of Health & Prevention",
      status: false,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Minister",
      description: "Minister of Health & Prevention",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Health Authority",
      description:
        "Any federal or local government authority concerned with health affairs in the State.",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Mental Health",
      description:
        "A state of psychological and social stability, through which individuals can attain their goals in accordance with their personal capabilities, deal with life pressures, work, be productive, and contribute to society.",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Concerned Entities",
      description:
        "Any federal or local government body related to the protection of mental health in the State, or directly or indirectly related to implementing the provisions hereof.",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Mental health facility",
      description:
        "A health institution licensed to provide mental health services, whether independent or attached to other health institutions.",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Mental Health Services",
      description:
        "Preventive, therapeutic, and rehabilitative services for mental health.",
      status: true,
      actions: [
        {
          title: "Edit",
          type: "edit",
          icon: <PenLine className="size-4" stroke="url(#button_linear)" />,
          onClick: () => {},
        },
        {
          title: "Delete",
          type: "delete",
          icon: <Trash2 className="size-4" stroke="url(#button_linear_red)" />,
          onClick: () => {},
        },
      ],
    },
  ] as const;

  return <Table tableHead={tableHead} tableData={tableData} />;
}

function AddGlossaryModal() {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["settings"]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      titleAr: "",
      descriptionAr: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      // try {
      //   console.log(value);
      //   const res = await apiClient
      //     .post(i18n.language + "/pdf-subscribers-submit", {
      //       json: {
      //         email: value.email,
      //       },
      //     })
      //     .json();
      //   console.log(res);
      //   if (res?.pdf_url) {
      //     window.open(res?.pdf_url, "_blank");
      //   }
      //   form.reset();
      //   setOpen(false);
      // } catch (error) {
      //   console.log(error);
      //   toast.error(error?.response?.message || t("error-occurred"));
      // } finally {
      //   setIsSubmitting(false);
      // }
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
            title={t("add-glossary")}
            variant="dark"
            icon={<Plus className="size-5" />}
            className=""
          />
        </DialogTrigger>
        <DialogContent className="lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("add-glossary")}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2  gap-x-8 gap-y-4">
            <form.Field
              name="title"
              children={(field) => (
                <div className="grid gap-1">
                  <Input
                    id="title"
                    name="title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("title-english")}
                    className="h-12 md:text-lg"
                  />
                </div>
              )}
            />
            <form.Field
              name="titleAr"
              children={(field) => (
                <div className="grid gap-1">
                  <Input
                    id="titleAr"
                    name="titleAr"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("title-arabic")}
                    className="h-12 md:text-lg"
                    dir="rtl"
                  />
                </div>
              )}
            />
            <form.Field
              name="description"
              children={(field) => (
                <div className="grid gap-1">
                  <Textarea
                    id="description"
                    name="description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("description-english")}
                  />
                </div>
              )}
            />
            <form.Field
              name="descriptionAr"
              children={(field) => (
                <div className="grid gap-1">
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("description-arabic")}
                    dir="rtl"
                  />
                </div>
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
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
