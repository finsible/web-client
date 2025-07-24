import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function Button({
  // Content
  children,
  name,
  startIcon,
  endIcon,
  lightImage,
  darkImage,

  // Behavior
  onClick,
  isHidden = false,
  disabled = false,
  loading = false,
  type = "button",

  // Styling
  variant = "primary",
  fullWidth = false,
  className = "",

  // Accessibility
  ariaLabel,

  // React 19 ref support
  ref,

  ...rest
}) {
  // Variant styles
  const variants = {
    primary:
      "bg-onBackground text-primaryButtonText border-onBackground border-1 hover:bg-onBackground/90",
    secondary:
      "bg/100 text-secondaryButtonText border-secondaryButtonBorder border-1.5 hover:bg-background/20",
    outline:
      "bg-transparent text-onBackground border-outline hover:bg-background/10",
    ghost:
      "bg-transparent text-onBackground border-transparent hover:bg-background/10 focus:ring-onBackground/10",
    destructive:
      "bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500/20",
    success:
      "bg-green-600 text-white border-green-600 hover:bg-green-700 focus:ring-green-500/20",
  };

  // Build final className
  const finalClassName = `
    px-4 text-size-3xsm small:text-size-buttonText gap-2 small:gap-4 rounded-xs
    inline-flex items-center justify-center py-2 cursor-pointer
    border border-solid transition-all duration-200 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${variants[variant]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  // Handle loading state
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      onClick={()=>onClick()}
      disabled={isDisabled}
      className={isHidden ? "hidden" : finalClassName}
      aria-label={ariaLabel}
      {...rest}
    >
      {/* start icon */}
      {startIcon && lightImage && (
        <img src={lightImage} className="w-4 small:w-6 block dark:hidden"></img>
      )}
      {startIcon && darkImage && (
        <img src={darkImage} className="w-4 small:w-6 hidden dark:block"></img>
      )}

      {/* Button Content */}
      {name && <span className={loading ? "opacity-70" : "text-size-4xsm small:text-size-buttonText"}>{name}</span>}
      {children && (
        <span className={loading ? "opacity-70" : ""}>{children}</span>
      )}

      {/* End Icon */}
      {endIcon && lightImage && (
        <img src={lightImage} className="w-4 small:w-6 dark:hidden"></img>
      )}
      {endIcon && darkImage && (
        <img src={darkImage} className="w-4 small:w-6 hidden dark:block"></img>
      )}
    </button>
  );
}
