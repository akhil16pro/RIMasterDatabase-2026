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
import { usePDFPreview } from "@/lib/usePDFPreview";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/local-legislations/view/$slug",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "view",
      path: `/${params.lang}/local-legislations/view/${params.slug}`,
    }),
  },
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
  const { preview: previewEN, isLoading: isLoadingEN } = usePDFPreview(
    data?.lawData?.lm_slug,
    "en",
    "legislation",
  );
  const { preview: previewAR, isLoading: isLoadingAR } = usePDFPreview(
    data?.lawData?.lm_slug,
    "ar",
    "legislation",
  );

  return (
    <DashboardLayout isLoading={isLoading} title={t("view_legislation")}>
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

        <Input
          value={userSession?.user?.userEmirateName || ""}
          label={t("local_government")}
          disabled={true}
          readOnly={true}
        />
        <Select
          key={data?.lawData?.lm_sector_id}
          value={data?.lawData?.lm_sector_id?.toString() || ""}
        >
          <SelectTrigger
            label={t("sector")}
            hasValue={!!data?.lawData?.lm_sector_id}
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

        <Select
          key={data?.lawData?.lm_law_type_id}
          value={data?.lawData?.lm_law_type_id?.toString() || ""}
        >
          <SelectTrigger
            label={t("legislation_type")}
            hasValue={!!data?.lawData?.lm_law_type_id}
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

        {data?.lawData?.lm_has_english_version === 1 && (
          <div className="col-span-2 space-y-2 relative">
            <Label htmlFor="lm_description">
              {t("legislation_details_english")}
            </Label>
            <CKEditorCustom
              value={data?.lawData?.lm_description}
              readOnly={true}
            />
          </div>
        )}

        <div className="col-span-2 space-y-2 relative">
          <Label htmlFor="lm_description_arabic">
            {t("legislation_details_arabic")}
          </Label>
          <CKEditorCustom
            dir="rtl"
            value={data?.lawData?.lm_description_arabic}
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
        <div className="col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10 items-start">
          <Input
            type="date"
            value={data?.lawData?.lm_issue_date}
            label={t("issued_date")}
            readOnly={true}
          />

          <Input
            type="date"
            value={data?.lawData?.lm_effective_date}
            label={t("effective_date")}
            readOnly={true}
          />
        </div>
        {data?.lawData?.lm_has_english_version === 1 && (
          <Input
            type="file"
            accept=".pdf"
            label={t("attachment_english")}
            preview={data?.lawData?.lm_pdf_file}
            readOnly={true}
            onClick={previewEN}
            isLoading={isLoadingEN}
          />
        )}

        <Input
          type="file"
          accept=".pdf"
          label={t("attachment_arabic")}
          preview={data?.lawData?.lm_pdf_file_arabic}
          readOnly={true}
          onClick={previewAR}
          isLoading={isLoadingAR}
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
