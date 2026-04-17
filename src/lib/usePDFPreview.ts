import { useQuery } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { apiClient } from "@/api";

export const usePDFPreview = (slug: string, lang: string , type: "legislation" | "modification" | "decision" | "international-treaty") => {

  const query = useQuery({
    queryKey: ["getPDF", lang, slug],
    queryFn: async () => {
      try {
        const response = await apiClient
          .get(`${lang}/${type}/file/${slug}`, {
            headers: { "Content-Type": "application/pdf" },
          })
          .blob(); // Get the raw binary data
        
        return response;
      } catch (error: any) {
        toast.error(error?.message || "Error loading PDF");
        throw error;
      }
    },
    enabled: false, // Don't fetch until we call refetch()
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const handlePreview = async () => {
    const { data, isError } = await query.refetch();

    if (data instanceof Blob) {

      const fileURL = URL.createObjectURL(data);
      

      const newTab = window.open(fileURL, "_blank");
      
      if (newTab) {
        newTab.focus();
      }

      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
    }
  };

  return {
    preview: handlePreview,
    isLoading: query.isFetching,
    error: query.error,
  };
};