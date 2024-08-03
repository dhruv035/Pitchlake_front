import { toast, TypeOptions } from "react-toastify";

const displayToast =
  (type: TypeOptions) => (content: string, autoClose?: number | false) => {
    const id = toast(content, {
      type: type,
      position: "top-left",
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: 1 / 3,
    });
    return id;
  };

export const displayToastSuccess = displayToast("success");
export const displayToastError = displayToast("error");
export const displayToastWarning = displayToast("warning");
export const displayToastInfo = displayToast("info");
