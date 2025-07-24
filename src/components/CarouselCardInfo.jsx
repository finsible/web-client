export default function CarouselCardInfo({ title, description, isActive, ref, ...rest }) {
  return (
    <div className={`absolute max-w-full flex flex-col`} ref={ref} {...rest}>
      <h2
        className={`text-onSurface font-eb-garamond text-size-xs small:text-size-sm mid:text-size-base mid:leading-15 transition-all duration-200 ease-in mt-10 mb-5 small:my-8 mid:mb-10 ml-[4.8%]
        ${
          isActive
            ? "opacity-100 scale-110 pointer-events-auto"
            : "opacity-0 scale-100 pointer-events-none"
        }`}
      >
        {title}
      </h2>
      <p
        className={`text-onSurfaceVariant small:text-size-2xsm transition-all duration-200 ease-in 
        ${
          isActive
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
