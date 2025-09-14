import { useState } from "react";
import { useSidebar } from "../hooks/SidebarProvider";
import Sidebar from "./Sidebar";
import { NewTransaction } from "./NewTransaction";

export default function PageLayout({ children }) {
  const { isOpen, isMobile } = useSidebar();
  const [isTransactionPopup, setIsTransactionPopup] = useState(false);

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) {
      return "mb-16"; // No margin on mobile
    }
    return isOpen ? "ml-70" : "ml-18";
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isTransactionPopup={isTransactionPopup}
        setIsTransactionPopup={setIsTransactionPopup}
      />
      {/* {isTransactionPopup && <NewTransaction/>} */}
      <main
        className={`
        transition-all duration-300 ease-in-out
        ${getMainContentMargin()}
        p-4
      `}
      >
        {isTransactionPopup && <NewTransaction />}
        {children}
      </main>
    </div>
  );
}
