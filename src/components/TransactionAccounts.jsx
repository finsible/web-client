import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAccounts } from "../hooks/useFinance";
import { Type } from "../utils/Type";
import { ChildElement } from "./TransactionCategories";

export default function TransactionAccounts({
  activeType,
  fromAccount,
  setFromAccount,
  toAccount,
  setToAccount,
}) {
  const { data: accounts, isLoading, isError, error } = useAccounts();

  const showFrom = activeType === Type.EXPENSE || activeType === Type.TRANSFER;
  const showTo = activeType === Type.INCOME || activeType === Type.TRANSFER;

  const errorMessage =
    error?.message || "Not able to fetch the accounts. Please try again.";

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  // Helper function to filter out linked accounts to prevent invalid transfers
  const filterExcludingLinkedAccounts = (account, excludedAccount) => {
    if (!excludedAccount) return true;
    return (
      account.id !== excludedAccount.id &&
      account.linkedBankAccountId !== excludedAccount.id &&
      account.id !== excludedAccount.linkedBankAccountId
    );
  };

  const accountsListElement = (
    <>
      {showFrom && (
        <div className="flex flex-col gap-2 bg-background rounded-xl p-3">
          <div className="text-onSurfaceVariant text-size-3xsm font-medium">
            {activeType === Type.TRANSFER ? "From Account" : "Pay From"}
          </div>
          <div className="flex flex-wrap gap-2">
            {accounts
              ?.filter((account) =>
                filterExcludingLinkedAccounts(account, toAccount)
              )
              .map((account) => (
                <ChildElement
                  key={account.id}
                  name={account.name}
                  isActive={fromAccount?.id === account.id}
                  onClick={() => setFromAccount(account)}
                  type={activeType}
                />
              ))}
          </div>
        </div>
      )}

      {showTo && (
        <div className="flex flex-col gap-2 bg-background rounded-xl p-3">
          <div className="text-onSurfaceVariant text-size-3xsm font-medium">
            {activeType === Type.TRANSFER ? "To Account" : "Deposit To"}
          </div>
          <div className="flex flex-wrap gap-2">
            {accounts
              ?.filter((account) =>
                filterExcludingLinkedAccounts(account, fromAccount)
              )
              .map((account) => (
                <ChildElement
                  key={account.id}
                  name={account.name}
                  isActive={toAccount?.id === account.id}
                  onClick={() => setToAccount(account)}
                  type={activeType}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="flex-1 overflow-auto no-scrollbar flex flex-col gap-6">
      {isLoading ? (
        <div className="text-center text-onBackground mt-8">
          Loading accounts...
        </div>
      ) : isError ? (
        <div className="text-center text-size-4xsm text-red-400 mt-8">
          {errorMessage}
        </div>
      ) : (
        accountsListElement
      )}
    </div>
  );
}
