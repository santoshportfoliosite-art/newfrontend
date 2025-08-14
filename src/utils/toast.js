import toast from "react-hot-toast";
export const ok = (m) => toast.success(m || "Success");
export const err = (e, fallback = "Something went wrong") => {
  const msg = e?.response?.data?.message || e?.message || fallback;
  toast.error(msg);
};
