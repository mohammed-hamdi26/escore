import toast from "react-hot-toast";

export function showSuccess(message) {
  toast.success(message, { duration: 3000 });
}

export function showError(message) {
  toast.error(message, { duration: 5000 });
}

export function showInfo(message) {
  toast(message, { duration: 3000, icon: "ℹ️" });
}

export function showWarning(message) {
  toast(message, { duration: 4000, icon: "⚠️" });
}
