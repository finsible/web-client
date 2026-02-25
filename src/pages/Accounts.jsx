import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Wallet,
  Landmark,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { useAccounts, useAccountGroups } from "../hooks/useFinance";
import {
  toCommaSeparatedCurrency,
  toReadableCurrency,
} from "../utils/currencyFormatter";
import Button from "../components/Button";
import { Loader } from "../components/Loader";
import { CREDIT_CARD_ACCOUNT_TYPE, LOAN_ACCOUNT_TYPE } from "../../AppContants";
import { useSidebar } from "../hooks/SidebarProvider";
import { toast } from "react-toastify";

// Icon mapping for account groups
const accountGroupIcons = {
  cash: Wallet,
  bank: Landmark,
  credit_card: CreditCard,
  savings: PiggyBank,
  investment: TrendingUp,
  default: Banknote,
};

// Get icon for account group
const getAccountGroupIcon = (groupType) => {
  const type = groupType?.toLowerCase().replace(/\s+/g, "_") || "default";
  return accountGroupIcons[type] || accountGroupIcons.default;
};

export default function Accounts() {
  const {
    data: accounts,
    isLoading: accountsLoading,
    isError: isError1,
    error,
  } = useAccounts();
  const {
    data: accountGroups,
    isLoading: groupsLoading,
    isError: isError2,
  } = useAccountGroups();
  const { isMobile } = useSidebar();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const isLoading = accountsLoading || groupsLoading;

  const handleCardCycle = () => {
    setActiveCardIndex((prev) => (prev + 1) % 3);
  };

  const errorMessage =
    error?.message || "Not able to fetch the data. Please try again.";
  const isError = isError1 || isError2;

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    if (!accounts)
      return {
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        topAssets: [],
        othersAssets: 0,
        topLiabilities: [],
        othersLiabilities: 0,
      };

    let totalAssets = 0;
    let totalLiabilities = 0;
    const assetAccounts = [];
    const liabilityAccounts = [];

    accounts.forEach((account) => {
      const balance = parseFloat(account.balance) || 0;

      if (account.accountGroupId === CREDIT_CARD_ACCOUNT_TYPE) {
        // Credit card liability = credit limit - current balance (available credit used)
        const limit = parseFloat(account.creditLimit) || 0;
        const liability = Math.abs(limit - balance);
        totalLiabilities += liability;
        if (liability > 0) {
          liabilityAccounts.push({ name: account.name, balance: liability });
        }
      } else if (account.accountGroupId === LOAN_ACCOUNT_TYPE) {
        const principalAmount = parseFloat(account.principalAmount) || 0;
        const emiAmount = parseFloat(account.emiAmount) || 0;
        const startDate = account.startDate
          ? new Date(account.startDate)
          : null;

        let remainingLiability = 0;
        if (startDate && emiAmount > 0) {
          // Calculate months elapsed since loan start
          const now = new Date();
          const monthsElapsed = Math.max(
            0,
            (now.getFullYear() - startDate.getFullYear()) * 12 +
              (now.getMonth() - startDate.getMonth()),
          );

          // Remaining liability = Principal - (EMIs paid * EMI amount)
          const totalPaid = monthsElapsed * emiAmount;
          remainingLiability = Math.max(0, principalAmount - totalPaid);
        } else {
          // If no start date or EMI, use full principal as liability
          remainingLiability = principalAmount;
        }
        totalLiabilities += remainingLiability;
        if (remainingLiability > 0) {
          liabilityAccounts.push({
            name: account.name,
            balance: remainingLiability,
          });
        }
      } else {
        totalAssets += balance;
        if (balance > 0) {
          assetAccounts.push({ name: account.name, balance });
        }
      }
    });

    // Sort assets by balance and get top 2
    const sortedAssets = assetAccounts.sort((a, b) => b.balance - a.balance);
    const topAssets = sortedAssets.slice(0, 2);
    const othersAssets = sortedAssets
      .slice(2)
      .reduce((sum, a) => sum + a.balance, 0);

    // Sort liabilities by balance and get top 2
    const sortedLiabilities = liabilityAccounts.sort(
      (a, b) => b.balance - a.balance,
    );
    const topLiabilities = sortedLiabilities.slice(0, 2);
    const othersLiabilities = sortedLiabilities
      .slice(2)
      .reduce((sum, l) => sum + l.balance, 0);

    return {
      netWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities,
      topAssets,
      othersAssets,
      topLiabilities,
      othersLiabilities,
    };
  }, [accounts]);

  // Group accounts by their account group
  const groupedAccounts = useMemo(() => {
    if (!accounts || !accountGroups) return [];

    const groups = accountGroups.map((group) => ({
      ...group,
      accounts: accounts.filter(
        (account) => account.accountGroupId === group.id,
      ),
    }));

    // Filter out empty groups
    return groups.filter((group) => group.accounts.length > 0);
  }, [accounts, accountGroups]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`p-2 md:p-4 space-y-4 h-full flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className={`text-onBackground ${
            isMobile ? "text-size-2xsm" : "text-size-xs"
          } font-semibold`}
        >
          My Accounts
        </h1>
        <Button
          variant="sidebar"
          isLucidIcon={true}
          IconComponent={Plus}
          onClick={() => {
            /* TODO: Add account modal */
          }}
        >
          Add Account
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(!isMobile || activeCardIndex === 0) && (
          <SummaryCard
            title="Net Worth"
            value={financialSummary.netWorth}
            variant="primary"
            items={[
              { name: "Assets", balance: financialSummary.totalAssets },
              {
                name: "Liabilities",
                balance: financialSummary.totalLiabilities,
              },
            ]}
            emptyMessage=""
            isMobile={isMobile}
            onClick={handleCardCycle}
            className={isMobile ? "animate-slide-up-fade" : ""}
          />
        )}
        {(!isMobile || activeCardIndex === 1) && (
          <SummaryCard
            title="Total Assets"
            value={financialSummary.totalAssets}
            variant="assets"
            items={[
              ...financialSummary.topAssets,
              ...(financialSummary.othersAssets > 0
                ? [{ name: "Others", balance: financialSummary.othersAssets }]
                : []),
            ]}
            emptyMessage="No assets yet"
            isMobile={isMobile}
            onClick={handleCardCycle}
            className={isMobile ? "animate-slide-up-fade" : ""}
          />
        )}
        {(!isMobile || activeCardIndex === 2) && (
          <SummaryCard
            title="Total Liabilities"
            value={financialSummary.totalLiabilities}
            variant="liabilities"
            items={[
              ...financialSummary.topLiabilities,
              ...(financialSummary.othersLiabilities > 0
                ? [
                    {
                      name: "Others",
                      balance: financialSummary.othersLiabilities,
                    },
                  ]
                : []),
            ]}
            emptyMessage="No liabilities"
            isMobile={isMobile}
            onClick={handleCardCycle}
            className={isMobile ? "animate-slide-up-fade" : ""}
          />
        )}
      </div>

      {/* Accounts Section */}
      <div className="space-y-4 overflow-auto no-scrollbar flex-1">
        {groupedAccounts.length === 0 ? (
          <div
            className={`text-center py-12 ${
              isError ? "text-error" : "text-onSurfaceVariant"
            }`}
          >
            <Wallet size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-size-4xsm">
              {isError
                ? errorMessage
                : "No accounts yet. Add your first account to get started!"}
            </p>
          </div>
        ) : (
          groupedAccounts.map((group) => {
            const IconComponent = getAccountGroupIcon(group.type || group.name);
            return (
              <div key={group.id} className="space-y-3">
                <h3 className="text-onSurfaceVariant text-size-4xsm font-medium">
                  {group.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.accounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      IconComponent={IconComponent}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Account Card Component
function AccountCard({ account, IconComponent, isMobile }) {
  return (
    <div className="bg-sidebar hover:bg-containerHigh transition-colors rounded-xl p-4 cursor-pointer group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-background">
          <IconComponent
            size={isMobile ? 15 : 18}
            className="text-onSurfaceVariant"
          />
        </div>
        <span className="text-onBackground text-size-4xsm font-medium truncate">
          {account.name}
        </span>
      </div>
      <div
        className={`${
          isMobile ? "" : "text-size-2xsm"
        } font-bold text-onBackground`}
      >
        {toCommaSeparatedCurrency(
          Math.abs(parseFloat(account.balance) || 0),
          "₹",
        )}
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  variant = "default",
  items = [],
  emptyMessage = "",
  isMobile,
  onClick,
  className = "",
}) {
  const gradientClasses = {
    primary:
      "bg-gradient-to-r from-netWorthGradientStart to-netWorthGradientEnd",
    assets: "bg-gradient-to-r from-assetsGradientStart to-assetsGradientEnd",
    liabilities:
      "bg-gradient-to-r from-liabilitiesGradientStart to-liabilitiesGradientEnd",
    default: "",
  };

  const filteredItems = items.filter((item) => item.balance > 0);

  return (
    <div
      className={`${gradientClasses[variant]} ${className} min-w-fit rounded-2xl p-5 text-white overflow-hidden relative flex flex-col`}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-size-4xsm opacity-90">{title}</span>
          {isMobile && (
            <button
              onClick={onClick}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Next summary card"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
        <div className="text-size-lg font-bold mb-4 whitespace-nowrap">
          {toCommaSeparatedCurrency(value, "₹")}
        </div>
      </div>
      <div className="border-t border-white/20 pt-3">
        <div className="flex gap-6 text-size-5xsm">
          {filteredItems.map((item, index) => (
            <div key={item.name+item.balance} className="flex flex-col">
              <span className="opacity-70 truncate max-w-[100px]">
                {item.name}
              </span>
              <span className="font-semibold text-size-3xsm">
                {toReadableCurrency(item.balance, "₹")}
              </span>
            </div>
          ))}
          {filteredItems.length === 0 && emptyMessage && (
            <span className="opacity-70">{emptyMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
}
