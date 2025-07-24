export default function CarouselIndicators({ activeCardIndex }) {
  return (
    <div className="flex flex-row mid:flex-col">
      <Indicator activeCardIndex={activeCardIndex} index={0}></Indicator>
      <Indicator activeCardIndex={activeCardIndex} index={1}></Indicator>
      <Indicator activeCardIndex={activeCardIndex} index={2}></Indicator>
      <Indicator activeCardIndex={activeCardIndex} index={3}></Indicator>
    </div>
  );
}

function Indicator({activeCardIndex, index}) {
  return (
    <hr
      className={`h-1 mid:w-[5px] rounded-xs ml-2 mt-2 mid:mb-2 mid:mt-0 transition-all duration-500 ease-in-out ${
        activeCardIndex == index
          ? "text-outline bg-outline w-15 mid:h-15"
          : "text-outlineVariant bg-outlineVariant w-7 mid:h-7"
      }`}
    ></hr>
  );
}
