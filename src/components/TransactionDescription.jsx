export default function TransactionDescription({
  description,
  setDescription,
}) {
  const maxLength = 255;

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setDescription(text);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2 h-full">
      <div className="flex justify-between m-1">
        <div className="text-onSurfaceVariant text-size-4xsm">Description</div>
        <div className="text-onSurfaceVariant text-size-5xsm">
          {description.length}/{maxLength}
        </div>
      </div>
      <div className="border border-outlineVariant bg-background h-1/2 rounded-xl p-3 focus-within:border-brandAccent transition-colors">
        <textarea
          id="description"
          value={description}
          onChange={handleChange}
          className="w-full h-full text-onBackground bg-transparent outline-none resize-none placeholder:text-onSurfaceVariant/50 text-start align-top"
          placeholder="Write a note..."
          aria-label="Add notes about this transaction"
          autoFocus
        ></textarea>
      </div>
    </div>
  );
}
