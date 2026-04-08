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
  "/$lang/_lang/_auth/federal-legislations/modifications/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/federal-legislations/modifications/view/${params.slug}`,
    }),
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "federalLegislationModificationViewFormData",
      slug,
      i18n.language,
    ],
    enabled: true,
    staleTime: 0,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + `/modifications/edit/${slug}`)
          .json<any>();
        console.log("federal_modification_view_form_data", res?.data);

        return res?.data;
      } catch (error) {
        console.log("federal_modification_view_form_data_error", error);
        return null;
      }
    },
  });

  return (
    <DashboardLayout
      isLoading={isLoading}
      title={
        t("view_modification") + `<small>${data?.parentLaw?.label}</small>`
      }
    >
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
        <div className="inline-flex gap-5 text-black  text-[1.2rem] col-span-2">
          <Label className="text-black/70">{t("has_english")}</Label>
          <RadioGroup
            className="flex gap-4"
            value={data?.lawData?.lm_has_english_version.toString()}
            defaultValue={data?.lawData?.lm_has_english_version.toString()}
            disabled={true}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="yes" />
              <Label
                normalLabel={true}
                htmlFor="yes"
                className="cursor-pointer"
              >
                {t("yes")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="no" />
              <Label normalLabel={true} htmlFor="no" className="cursor-pointer">
                {t("no")}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data?.lawData?.lm_has_english_version === 1 && (
          <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
            <Input
              type="text"
              value={data?.lawData?.lm_title}
              label={t("legislation_title_english")}
              readOnly={true}
            />
            <Input
              type="text"
              value={data?.lawData?.lm_short_title}
              label={t("legislation_short_title_english")}
              readOnly={true}
            />
          </div>
        )}
        <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <Input
            type="text"
            value={data?.lawData?.lm_title_arabic}
            label={t("legislation_title_arabic")}
            dir="rtl"
            readOnly={true}
          />
          <Input
            type="text"
            value={data?.lawData?.lm_short_title_arabic}
            label={t("legislation_short_title_arabic")}
            dir="rtl"
            readOnly={true}
          />
        </div>

        <Select
          key={data?.lawData?.lm_year}
          value={data?.lawData?.lm_year?.toString()}
        >
          <SelectTrigger
            label={t("legislation_year")}
            hasValue={!!data?.lawData?.lm_year}
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
        <Input
          type="date"
          value={data?.lawData?.lm_issue_date}
          label={t("issued_date")}
          readOnly={true}
        />

        {data?.lawData?.lm_has_english_version === 1 && (
          <>
            <Input
              type="text"
              value={data?.lawData?.lm_gazette_number}
              label={t("gazette_number")}
              readOnly={true}
            />

            <Input
              type="text"
              value={data?.lawData?.lm_gazette_title}
              label={t("gazette_title_english")}
              readOnly={true}
            />
          </>
        )}

        <Input
          type="text"
          value={data?.lawData?.lm_gazette_number_arabic}
          label={t("gazette_number_arabic")}
          readOnly={true}
          dir="rtl"
        />

        <Input
          type="text"
          value={data?.lawData?.lm_gazette_title_arabic}
          label={t("gazette_title_arabic")}
          readOnly={true}
          dir="rtl"
        />
        <Input
          type="date"
          value={data?.lawData?.lm_official_gazette_issue_date}
          label={t("gazette_issue_date")}
          readOnly={true}
        />
        <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          {data?.lawData?.lm_has_english_version === 1 && (
            <Input
              type="file"
              accept=".pdf"
              label={t("attachment_english")}
              preview={data?.lawData?.lm_pdf_file}
              readOnly={true}
            />
          )}

          <Input
            type="file"
            accept=".pdf"
            label={t("attachment_arabic")}
            preview={data?.lawData?.lm_pdf_file_arabic}
            readOnly={true}
          />
        </div>

        <Input
          type="text"
          value={data?.lawData?.user_info?.name}
          label={t("submitted_by")}
          readOnly={true}
        />
      </div>
    </DashboardLayout>
  );
}
