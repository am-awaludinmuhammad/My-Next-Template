import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingBackdropProps {
  isLoading?: boolean;
  className?: string;
}

export function LoadingBackdrop({ isLoading = true, className }: LoadingBackdropProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}