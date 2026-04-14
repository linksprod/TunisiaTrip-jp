
import { useToast as useToastOriginal, toast } from "@/hooks/use-toast";

// Re-export the hook and toast function properly
export const useToast = useToastOriginal;
export { toast };
