export default function CarouselCardImage({
  darkModeImage,
  lightModeImage,
  title,
  isActive,
  prevIndex,
  nextIndex,
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-row mid:flex-col items-center justify-center transition-all duration-500 linear
        ${
          isActive
            ? "opacity-100 translate-x-0 translate-y-0 pointer-events-auto"
            : prevIndex
            ? "opacity-0 -translate-x-[100px] mid:translate-x-0 mid:-translate-y-[100px] pointer-events-none"
            : nextIndex
            ? "opacity-0 translate-x-[100px] mid:-translate-x-0 mid:translate-y-[100px] pointer-events-none"
            : "opacity-0 translate-x-0 translate-y-0 pointer-events-none"
        }`}
    >
      <img
        className="block dark:hidden w-full max-w-65 small:max-w-75 mid:max-w-90 h-full"
        src={lightModeImage}
        alt={title}
      />
      <img
        className="hidden dark:block w-full max-w-65 small:max-w-75 mid:max-w-90 h-full"
        src={darkModeImage}
        alt={`${title} (dark mode)`}
      />
    </div>
  );
}
