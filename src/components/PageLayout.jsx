import { useState } from "react";
import { useSidebar } from "../hooks/SidebarProvider";
import Sidebar from "./Sidebar";
import { NewTransaction } from "./NewTransaction";
import { CalendarPlus2 } from "lucide-react";

export default function PageLayout({ children }) {
  const { isOpen, isMobile } = useSidebar();
  const [isTransactionPopup, setIsTransactionPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) {
      return "mb-16"; // No margin on mobile
    }
    return isOpen ? "ml-70" : "ml-18";
  };

  function handleTransactionPopup(shouldOpen) {
    if (shouldOpen) {
      setIsClosing(false);
      setIsTransactionPopup(true);
    } else {
      // Start closing animation
      setIsClosing(true);
      // Wait for animation to complete before unmounting
      setTimeout(() => {
        setIsTransactionPopup(false);
        setIsClosing(false);
      }, 300);
    }
  }

  return (
    <div className="bg-background h-full">
      <Sidebar
        isTransactionPopup={isTransactionPopup}
        handleTransactionPopup={handleTransactionPopup}
      />
      {/* {isTransactionPopup && <NewTransaction/>} */}
      <main
        className={`
        transition-all duration-300 ease-in-out h-full
        ${getMainContentMargin()}
        p-4
      `}
      >
        {isTransactionPopup && (
          <NewTransaction
            handleTransactionPopup={handleTransactionPopup}
            isClosing={isClosing}
          />
        )}
        {children}
        {!isMobile && !isTransactionPopup && (
          <div
            className="cursor-pointer bg-primary rounded-lg fixed p-3 bottom-6 right-6"
            onClick={() => handleTransactionPopup(true)}
          >
            <CalendarPlus2 className="text-background" size={30} />
          </div>
        )}
      </main>
    </div>
  );
}
