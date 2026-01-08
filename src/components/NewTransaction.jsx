import { X } from "lucide-react";
import { useSidebar } from "../hooks/SidebarProvider";
import { useState } from "react";
import Button from "./Button";
import TransactionAmountInput from "./TransactionAmountInput";
import TransactionDateInput from "./TransactionDateInput";
import TransactionCategories from "./TransactionCategories";
import { Type } from "../utils/Type";
import TransactionAccounts from "./TransactionAccounts";
import TransactionDescription from "./TransactionDescription";
import { useCreateTransaction } from "../hooks/useFinance";
import { toast } from "react-toastify";

const StepLayout = ({ title, step, totalSteps, children }) => {
  const safeTotal = totalSteps || 1;
  const progress = Math.min(
    100,
    Math.max(0, Math.round((step / safeTotal) * 100))
  );

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <div>
        <div className="text-onBackground text-size-2xsm">{title}</div>
        <div className="text-outlineVariant flex items-center gap-2 mt-1">
          <span>
            Step {step} of {safeTotal}
          </span>
          <div className="w-28 h-1 rounded-full bg-outlineVariant/40 overflow-hidden">
            <div
              className="h-full bg-brandAccent"
              style={{ width: `${progress}%`, transition: "width 280ms ease" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar">{children}</div>
    </div>
  );
};

export function NewTransaction({ handleTransactionPopup, isClosing = false }) {
  const { isMobile } = useSidebar();
  const [stepCount, setStepCount] = useState(1);
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [activeType, setActiveType] = useState(Type.EXPENSE);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [description, setDescription] = useState("");

  // Animation classes based on opening/closing state
  const getAnimationClass = () => {
    if (isMobile) {
      return isClosing
        ? "animate-popup-close-mobile"
        : "animate-popup-open-mobile";
    }
    return isClosing ? "animate-popup-close" : "animate-popup-open";
  };

  const isNextDisabled = () => {
    if (stepCount === 1)
      return !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0;
    if (stepCount === 3) return !selectedCategory;
    if (stepCount === 4) {
      if (activeType === Type.EXPENSE) return !fromAccount;
      if (activeType === Type.INCOME) return !toAccount;
      if (activeType === Type.TRANSFER) return !fromAccount || !toAccount;
    }
    return false;
  };

  const createTransactionMutation = useCreateTransaction();

  const steps = [
    {
      title: "Enter Amount",
      component: TransactionAmountInput,
      props: { amount, setAmount },
    },
    {
      title: "Date & Schedule",
      component: TransactionDateInput,
      props: {
        selectedDate,
        setSelectedDate,
        isRecurring,
        setIsRecurring,
        frequency,
        setFrequency,
      },
    },
    {
      title: "Select Category",
      component: TransactionCategories,
      props: {
        activeType,
        setActiveType,
        selectedCategory,
        setSelectedCategory,
        setFromAccount,
        toAccount,
        setToAccount,
      },
    },
    {
      title: "Select Accounts",
      component: TransactionAccounts,
      props: {
        activeType,
        fromAccount,
        setFromAccount,
        toAccount,
        setToAccount,
      },
    },
    {
      title: "Add Description (Optional)",
      component: TransactionDescription,
      props: { description, setDescription },
    },
  ];

  const totalSteps = steps.length;

  const handleContinue = () => {
    if (stepCount < totalSteps) {
      setStepCount(stepCount + 1);
      return;
    }
    if (
      !(selectedDate instanceof Date) ||
      Number.isNaN(selectedDate.getTime())
    ) {
      toast.error("Please select a valid date before continuing.");
      return;
    }
    const transactionDateMs = selectedDate.getTime();

    const payload = {
      type: activeType,
      totalAmount: amount,
      transactionDate: transactionDateMs,
      categoryId: selectedCategory?.id,
      description: description,
    };

    if (activeType === Type.EXPENSE) {
      payload.fromAccountId = fromAccount?.id;
    } else if (activeType === Type.INCOME) {
      payload.toAccountId = toAccount?.id;
    } else if (activeType === Type.TRANSFER) {
      payload.fromAccountId = fromAccount?.id;
      payload.toAccountId = toAccount?.id;
    }

    createTransactionMutation.mutate(payload, {
      onSuccess: (res) => {
        handleTransactionPopup(false);
        toast.success(res.message);
      },
      onError: (error) => {
        const errorMessage = error?.message || "Failed to create transaction";
        toast.error(errorMessage);
        console.error("Failed to create transaction", error);
      },
    });
  };

  // Compute current step before render
  const currentStepConfig = steps[stepCount - 1];
  const CurrentStepComponent = currentStepConfig?.component;

  const popupContent = (
    <div
      className={`bg-sidebar flex flex-col ${getAnimationClass()} ${
        isMobile
          ? "w-full h-full rounded-t-2xl p-3"
          : "m-2 p-2 right-4 rounded-2xl bottom-4 w-100 z-50 fixed h-4/5"
      }`}
      style={{ transformOrigin: isMobile ? "bottom center" : "bottom right" }}
    >
      <div className="flex items-center justify-center gap-2 m-4 shrink-0">
        <button
          type="button"
          aria-label="Close new transaction dialog"
          onClick={() => handleTransactionPopup(false)}
          className="text-outlineVariant"
        >
          <X size={`${isMobile ? 15 : 18}`} />
        </button>
        <span className="text-onBackground flex-1 text-center">
          New Transaction
        </span>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar">
        {currentStepConfig && CurrentStepComponent && (
          <StepLayout
            title={currentStepConfig.title}
            step={stepCount}
            totalSteps={totalSteps}
          >
            <CurrentStepComponent {...(currentStepConfig.props || {})} />
          </StepLayout>
        )}
      </div>

      {/* buttons */}
      <div className={`my-1 mx-4 flex gap-2 shrink-0`}>
        <Button
          onClick={() => setStepCount(stepCount - 1)}
          isHidden={stepCount === 1}
          className="flex-1/4"
          variant="ghost"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-9/10"
          disabled={isNextDisabled() || createTransactionMutation.isPending}
        >
          {stepCount === totalSteps
            ? createTransactionMutation.isPending
              ? "Saving..."
              : "Confirm"
            : "Continue"}
        </Button>
      </div>
    </div>
  );

  // For mobile, wrap with overflow-hidden container to clip the slide animation
  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-16 top-0 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-5">{popupContent}</div>
      </div>
    );
  }

  return popupContent;
}
