import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TransactionDateInput.css";
import { ChevronDown } from "lucide-react";

export default function TransactionDateInput({
  selectedDate,
  setSelectedDate,
  isRecurring,
  setIsRecurring,
  frequency,
  setFrequency,
}) {
  return (
    <div className="flex-1 overflow-auto no-scrollbar">
      <div className="mt-4 transaction-datepicker-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          fixedHeight
        />
      </div>

      <div className="my-3 p-6 flex items-center justify-between bg-background rounded-2xl">
        <span className="text-onBackground text-size-3xsm">Make recurring</span>
        <button
          onClick={() => setIsRecurring(!isRecurring)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            isRecurring ? "bg-brandAccent" : "bg-outlineVariant"
          }`}
          aria-pressed={isRecurring}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isRecurring ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {isRecurring && (
        <div className="mt-2">
          <label className="text-onBackground ml-1 text-size-4xsm block mb-2">
            Frequency
          </label>
          <div className="relative">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 text-size-4xsm bg-background rounded-2xl text-onBackground border-b border-outlineVariant focus:outline-none focus:border-brandAccent appearance-none cursor-pointer"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown size={18} className="text-onBackground" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
