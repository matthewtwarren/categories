import type { Toast } from "../lib/types";

type ToastBannerProps = {
  toast: Toast;
};

export function ToastBanner({ toast }: ToastBannerProps) {
  const typeStyles = {
    info: "bg-neutral-800 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
  };

  return (
    <div
      className={`${typeStyles[toast.type]} px-4 py-2 rounded-lg text-sm font-medium text-center animate-pulse`}
    >
      {toast.message}
    </div>
  );
}
