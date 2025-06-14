import googleLogo from "../assets/google_logo.svg";
import { useState, useEffect } from "react";
import Button from "./Button";
import CarouselIndicators from "./Carouselndicators";
import slides from "../data/SlidesData";
import BlurryBlobs from "./BlurryBlobs";

export default function WelcomePage() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(false);

  function onGetStarted() {
    setIsOnboarding(true);
    // Start with the first slide when getting started
    setActiveCardIndex(1);
  }

  function prevSlide() {
    setActiveCardIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
    if (activeCardIndex == 1) {
      // active card index does not get updated instantly
      setIsOnboarding(false);
    }
  }
  function nextSlide() {
    setActiveCardIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }

  return (
    <div className="absolute inset-0 p-1 mid:p-2 overflow-hidden">
      <BlurryBlobs />
      <div className="h-full w-full p-1 mid:p-2 grid grid-cols-1 mid:grid-cols-2 grid-rows-[1fr_3fr_4fr] mid:grid-rows-[2fr_5fr_3fr] gap-1">
        <div className="mid:col-span-2 font-eb-garamond text-size-sm text-onBackground">
          Finsible
        </div>

        <div className="row-start-3 mid:row-start-2 mid:col-span-1 flex flex-col gap-1 justify-center h-full">
          <div className="text-size-2xsm font-outfit text-outline">
            Step {activeCardIndex + 1} of 4
          </div>
          <div className="relative min-h-[40px] mid:min-h-[65px] flex justify-center items-start h-auto">
            {slides.map((slide, index) => (
              <CarouselCardInfo
                key={index}
                title={slide.title}
                description={slide.description}
                isActive={activeCardIndex == index}
              ></CarouselCardInfo>
            ))}
          </div>
          <div className="relative flex items-center gap-1">
            <Button
              handleClick={onGetStarted}
              name="Get Started"
              isHidden={isOnboarding}
              weight={1}
              arrowIcon="right"
            />
            <Button
              handleClick={prevSlide}
              name="Back"
              isHidden={!isOnboarding}
              isSecondary={true}
              weight={activeCardIndex == 3 ? 0 : 1}
              arrowIcon="left"
            />
            <Button
              handleClick={nextSlide}
              name="Next"
              isHidden={!isOnboarding || activeCardIndex === 3}
              weight={1}
              arrowIcon="right"
            />
            <Button
              name="Sign in with Google"
              lightIcon={googleLogo}
              darkIcon={googleLogo}
              isHidden={!isOnboarding || activeCardIndex !== 3}
              weight={1}
            />
          </div>
        </div>

        {/* </div> */}

        <div className="row-start-2 mid:col-start-2 mid:row-start-2 flex mid:flex-row flex-col items-center">
          <div className="relative h-full w-full flex flex-col overflow-hidden flex-1 items-star justify-center">
            {slides.map((slide, index) => (
              <CarouselCardImage
                key={index}
                darkModeImage={slide.imageDark}
                lightModeImage={slide.imageLight}
                title={slide.title}
                isActive={index === activeCardIndex}
                prevIndex={
                  (activeCardIndex - 1 + slides.length) % slides.length ===
                  index
                }
                nextIndex={(activeCardIndex + 1) % slides.length === index}
              ></CarouselCardImage>
            ))}
          </div>
          <CarouselIndicators
            activeCardIndex={activeCardIndex}
          ></CarouselIndicators>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

function CarouselCardImage({
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
      // style={{
      //   transition:
      //     "all 500ms linear, opcaity 100ms cubic-bezier(0.16, 1, 0.3, 1)",
      // }}
    >
      <img
        className="block dark:hidden w-full max-w-20 h-full"
        src={lightModeImage}
        alt={title}
      />
      <img
        className="hidden dark:block w-full max-w-20 h-full"
        src={darkModeImage}
        alt={`${title} (dark mode)`}
      />
    </div>
  );
}
function CarouselCardInfo({ title, description, isActive }) {
  return (
    <div className={`absolute max-w-full flex flex-col`}>
      <h2
        className={`text-onSurface font-eb-garamond text-size-sm mid:text-size-base mid:leading-3.5 transition-all duration-200 ease-in my-1 mid:my-2 ml-[4.8%]
        ${
          isActive
            ? "opacity-100 scale-110 pointer-events-auto"
            : "opacity-0 scale-100 pointer-events-none"
        }`}
      >
        {title}
      </h2>
      <p
        className={`text-onSurfaceVariant text-size-2xsm transition-all duration-200 ease-in 
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
