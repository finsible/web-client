import { useAuthData } from "../hooks/AuthProvider";
import { toReadableCurrency } from "../utils/currencyFormatter";

// Helper function to normalize decimal input by removing leading zeros
// while preserving the ability to type decimal points
const normalizeDecimalInput = (intPart, fracPart, hasDot) => {
  // Remove leading zeros but keep at least one digit before decimal
  const normalizedInt = intPart.replace(/^0+(?=\d)/, "");
  const safeInt = normalizedInt === "" ? "0" : normalizedInt;

  if (!hasDot) {
    return safeInt;
  }

  // Handle decimal point cases:
  // - "5." -> keep the trailing dot so user can continue typing
  // - "5" with dot but no fracPart -> just the dot
  // - "5.25" -> include dot and fractional part
  const decimalPart =
    fracPart === "" && hasDot ? "." : fracPart === "" ? "" : `.${fracPart}`;

  return `${safeInt}${decimalPart}`;
};

export default function TransactionAmountInput({ amount, setAmount }) {
  const { authData } = useAuthData();
  const currencySymbol = authData?.defaultCurrencySymbol || "";
  return (
    <div className="flex flex-col h-full">
      <input
        id="amount"
        type="text"
        inputMode="decimal"
        min="0"
        placeholder="0.00"
        autoComplete="off"
        value={amount}
        onChange={(e) => {
          const raw = e.target.value;
          // Accept only digits and a single decimal point
          if (!/^\d*\.?\d*$/.test(raw)) return;

          const [intPart = "", fracPart = ""] = raw.split(".");

          // Enforce max lengths: 15 before decimal, 4 after decimal
          if (intPart.length > 15 || fracPart.length > 4) return;

          const hasDot = raw.includes(".");
          const normalized = normalizeDecimalInput(intPart, fracPart, hasDot);

          // Allow empty/zero states while typing so the user can reach values like 0.001
          if (normalized === "" || normalized === "0") {
            setAmount("");
            return;
          }

          if (normalized === "0.") {
            setAmount(normalized);
            return;
          }

          const numericValue = parseFloat(normalized);
          if (Number.isNaN(numericValue)) return;

          // Permit transitional zero (e.g., "0.0", "0.00") so user can keep typing; reject if it stays zero without more digits
          if (numericValue === 0) {
            setAmount(normalized);
            return;
          }

          // Positive values are accepted
          setAmount(normalized);
        }}
        onBlur={() => {
          if (!amount) return;
          const trimmed = amount.endsWith(".") ? amount.slice(0, -1) : amount;
          const num = parseFloat(trimmed);
          if (!isFinite(num) || num <= 0) {
            setAmount("");
            return;
          }
          // Optionally fix precision to max 4 fractional digits without rounding beyond user intent
          const [i, f = ""] = trimmed.split(".");
          setAmount(f ? `${i}.${f.slice(0, 4)}` : i);
        }}
        className="w-full h-30 mt-2 p-4 rounded-xl text-size-sm bg-background text-onBackground text-center focus:outline-none"
        aria-label="Transaction amount"
        autoFocus
      />

      <div className="text-secondaryText text-center m-5 mb-6">
        {amount === "" || amount === 0
          ? "Enter transaction amount"
          : toReadableCurrency(amount, currencySymbol)}
      </div>
    </div>
  );
}
