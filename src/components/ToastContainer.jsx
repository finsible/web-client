import { ToastContainer, Slide } from "react-toastify";

export default function CustomToastContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      transition={Slide}
    />
  );
}
