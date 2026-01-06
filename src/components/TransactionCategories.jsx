import { useMemo, useEffect } from "react";
import { useCategories } from "../hooks/useFinance";
import { Type } from "../utils/Type";
import { ArrowDown, ArrowRightLeft, ArrowUp } from "lucide-react";
import { toast } from "react-toastify";

export default function TransactionCategories({
  activeType,
  setActiveType,
  selectedCategory,
  setSelectedCategory,
  setFromAccount,
  toAccount,
  setToAccount,
}) {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useCategories(activeType);

  // as per current flow this will execute everytime since we are unmounting it while moving to other steps and mouting it again when its step 3 hence while its mounted for the first time, useMemo is always executed
  const activeCategories = useMemo(() => {
    if (!categories) return [];

    const map = {};
    const roots = [];

    // Create map of all categories
    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    // Build hierarchy
    categories.forEach((cat) => {
      if (cat.parentCategoryId) {
        if (map[cat.parentCategoryId]) {
          map[cat.parentCategoryId].children.push(map[cat.id]);
        }
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  }, [categories]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  function handleCategoryTypeClick(type) {
    setActiveType(type);
    setSelectedCategory(null);
    setFromAccount(null);
    setToAccount(null);
  }

  const errorMessage =
    error?.message || "Not able to fetch the categories. Please try again.";

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const categoriesList = (
    <div className="flex-1 overflow-auto no-scrollbar">
      <div className="flex flex-col gap-4">
        {activeCategories.map((parent) => (
          <div
            key={parent.id}
            className="flex flex-col gap-2 bg-background rounded-xl"
          >
            <div
              onClick={() => handleCategoryClick(parent)}
              className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between ${
                selectedCategory?.id === parent.id
                  ? activeType === Type.EXPENSE
                    ? "bg-surfaceContainerHigh border border-red-400 text-red-400"
                    : "bg-surfaceContainerHigh border border-green-400 text-green-400"
                  : "bg-surfaceContainerLow text-onSurfaceVariant hover:bg-surfaceContainer"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    selectedCategory?.id === parent.id
                      ? activeType === Type.EXPENSE
                        ? "bg-red-400/10 text-red-400"
                        : "bg-green-400/10 text-green-400"
                      : "bg-surfaceContainerHighest text-onSurface"
                  }`}
                >
                  {parent.name.charAt(0)}
                </div>
                <span className="font-medium">{parent.name}</span>
              </div>
            </div>

            {parent.children.length > 0 &&
              (selectedCategory?.id === parent.id ||
                selectedCategory?.parentCategoryId === parent.id) && (
                <div className="flex flex-wrap gap-2 px-4 py-2">
                  {parent.children.map((child) => (
                    <ChildElement
                      key={child.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(child);
                      }}
                      isActive={selectedCategory?.id === child.id}
                      name={child.name}
                      type={activeType}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}

        {activeCategories.length === 0 && (
          <div className="text-center text-onSurfaceVariant mt-4">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-1 justify-evenly">
        <div
          onClick={() => handleCategoryTypeClick(Type.INCOME)}
          className={`px-4 py-2 flex justify-center items-center gap-1 flex-1 bg-background text-onBackground text-size-4xsm rounded-xl cursor-pointer ${
            activeType === Type.INCOME ? "border border-outlineVariant" : ""
          }`}
        >
          {activeType === Type.INCOME && (
            <ArrowDown size={18} className="text-green-400"></ArrowDown>
          )}
          <span>Income</span>
        </div>
        <div
          onClick={() => handleCategoryTypeClick(Type.EXPENSE)}
          className={`px-4 py-2 flex justify-center items-center gap-1 flex-1 bg-background text-onBackground text-size-4xsm rounded-xl cursor-pointer ${
            activeType === Type.EXPENSE ? "border border-outlineVariant" : ""
          }`}
        >
          {activeType === Type.EXPENSE && (
            <ArrowUp size={18} className="text-red-400"></ArrowUp>
          )}
          <span>Expense</span>
        </div>
        <div
          onClick={() => handleCategoryTypeClick(Type.TRANSFER)}
          className={`px-4 py-2 flex justify-center items-center gap-1 flex-1 bg-background text-onBackground text-size-4xsm rounded-xl cursor-pointer ${
            activeType === Type.TRANSFER ? "border border-outlineVariant" : ""
          }`}
        >
          {activeType === Type.TRANSFER && (
            <ArrowRightLeft
              size={18}
              className="text-green-400"
            ></ArrowRightLeft>
          )}
          <span>Transfer</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-onBackground mt-8">
          Loading categories...
        </div>
      ) : isError ? (
        <div className="text-center text-size-4xsm text-red-400 mt-8">
          {errorMessage}
        </div>
      ) : (
        categoriesList
      )}
    </div>
  );
}

export function ChildElement({ type, isActive, name, ...rest }) {
  const isExpense = type === Type.EXPENSE;
  const activeClass = isExpense
    ? "border-red-400 text-red-400 bg-surfaceContainerHigh"
    : "border-green-400 text-green-400 bg-surfaceContainerHigh";

  const inactiveClass =
    "border-outlineVariant bg-surfaceContainerLow text-onSurfaceVariant";

  const placeholderClass = isActive
    ? isExpense
      ? "bg-red-400/10 text-red-400"
      : "bg-green-400/10 text-green-400"
    : "bg-surfaceContainerHighest text-onSurface";

  return (
    <div
      {...rest}
      className={`flex justify-between items-center gap-2 rounded-xl border p-2 cursor-pointer transition-all ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${placeholderClass}`}
        >
          {name.charAt(0)}
        </div>
        <span className="text-sm whitespace-nowrap">{name}</span>
      </div>
    </div>
  );
}
