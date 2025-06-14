import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Button({
  handleClick,
  name,
  lightIcon,
  darkIcon,
  isHidden,
  weight,
  isSecondary,
  arrowIcon,
}) {
  return (
    <button
      className={`cursor-pointer text-size-buttonText py-0.5 px-1 rounded-xs mt-1  ${
        isSecondary
          ? "bg/100 border-secondaryButtonBorder border-[0.5px] text-secondaryButtonText hover:bg-background/20"
          : "bg-onBackground border-onBackground border-[0.5px] text-primaryButtonText hover:bg-onBackground/90"
      } hover:transition-colors ease-in-out ${isHidden ? "hidden" : ""}`}
      onClick={handleClick}
    >
      {darkIcon && (
        <img src={darkIcon} className="hidden w-1 dark:inline scale-110 -translate-y-[0.5px] text-center"></img>
      )}
      {lightIcon && (
        <img
          src={lightIcon}
          className="inline w-1 dark:hidden text-center scale-110 -translate-y-[0.5px]"
        ></img>
      )}
      {arrowIcon === "left" ? (
        <ArrowLeft size={4} className="inline"></ArrowLeft>
      ) : (
        ""
      )}
      <span className="text-center text-size-buttonText"> {name} </span>
      {arrowIcon === "right" ? (
        <ArrowRight size={4} className="inline"></ArrowRight>
      ) : (
        ""
      )}
    </button>
  );
}
