import * as React from "react";
import { X, CheckCircle2, AlertTriangle } from "lucide-react";

type AlertVariant = "success" | "error";

type AlertBannerProps = {
  /** Only message content; keep it simple */
  children: React.ReactNode;
  /** success | error */
  variant?: AlertVariant;
  /** Optional external close handler */
  onClose?: () => void;
  /** Optional extra classes */
  className?: string;
};

export function AlertBanner({
  children,
  variant = "success",
  onClose,
  className = "",
}: AlertBannerProps) {
  const styles =
    variant === "success"
      ? {
          wrap: "bg-emerald-50 text-emerald-900",
          iconWrap: "bg-emerald-100 text-emerald-600",
        }
      : {
          wrap: "bg-red-50 text-red-900 border border-red-200",
          iconWrap: "bg-red-100 text-red-600",
        };

  const Icon = variant === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "relative flex items-start gap-3 rounded-lg px-4 py-3",
        styles.wrap,
        className,
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full",
          styles.iconWrap,
        ].join(" ")}
        aria-hidden="true"
      >
        <Icon className="h-3.5 w-3.5" />
      </span>

      <div className="flex-1 text-sm leading-relaxed">
        <div className="font-medium">{`${variant === "success" ? "Success" : "Error"}`}</div>
        {children}
      </div>

      <button
        type="button"
        onClick={() => {
          // setOpen(false);
          onClose?.();
        }}
        className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-current/60 hover:text-current focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/10"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Sugar components if you prefer explicit variants */
export const SuccessAlert = (p: Omit<AlertBannerProps, "variant">) => (
  <AlertBanner variant="success" {...p} />
);

export const ErrorAlert = (p: Omit<AlertBannerProps, "variant">) => (
  <AlertBanner variant="error" {...p} />
);
