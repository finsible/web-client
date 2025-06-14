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
      className={`w-1.5 mid:w-[1px] rounded-xs ml-0.5 mt-2 mid:mb-0.5 mid:mt-0 mid:ml-1 transition-all duration-500 ease-in-out ${
        activeCardIndex == index
          ? "text-outline bg-outline w-3 mid:h-3"
          : "text-outlineVariant bg-outlineVariant w-1.5 mid:h-1.5"
      }`}
    ></hr>
  );
}
