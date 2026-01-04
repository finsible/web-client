import googleLogo from "../assets/google_logo.svg";
import leftArrowLight from "../assets/dark/left_arrow_light.svg";
import leftArrowDark from "../assets/light/left_arrow_dark.svg";
import rightArrowDark from "../assets/light/right_arrow_dark.svg";
import rightArrowLight from "../assets/dark/right_arrow_light.svg";
import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import CarouselIndicators from "../components/Carouselndicators";
import slides from "../data/SlidesData";
import BlurryBlobs from "../components/BlurryBlobs";
import CarouselCardImage from "../components/CarouselCardImage";
import CarouselCardInfo from "../components/CarouselCardInfo";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router";
import { apiRequest } from "../utils/apiRequest";
import { toast } from "react-toastify";
import { useAuthData } from "../hooks/AuthProvider";
import { Loader } from "../components/Loader";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

export default function WelcomePage({ children }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardInfoHeight, setCardInfoHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useAuthData();

  const cardInfoRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const localhost = import.meta.env.VITE_LOCALHOST_URI;

  // custom google login authorisation process redirects and refrehses the page hence need to fetch auth code fro url
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authCode = urlParams.get("code");

    if (authCode !== null) {
      setIsLoading(true);
      handleAuthCodeResponse(authCode);
    }
  }, [location.search]); // Trigger when URL search params change

  // Measure card info height when content changes to align buttons accordingly
  useEffect(() => {
    if (!cardInfoRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Only one element observed, so entries[0] is always the card info
      const height = entries[0].contentRect.height;
      setCardInfoHeight(height);
    });

    // Only observe the element we care about
    resizeObserver.observe(cardInfoRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeCardIndex]);

  // One Tap login (optional)
  useGoogleOneTapLogin({
    onSuccess: handleCredentialResponse,
    onError: () => {
      //show failure on UI
      setIsLoading(false);
      console.log("One Tap Failed");
    },
    use_fedcm_for_prompt: true,
    cancel_on_tap_outside: true,
    scope:
      "openid email profile https://www.googleapis.com/auth/userinfo.profile",
    disabled: activeCardIndex !== 3, // Only show on step 4
    callback: (response) => {
      setIsLoading(true); // ✅ Start loading immediately on click
      console.log("One Tap clicked - loading started");
    },
  });

  // Fallback button login
  const googleLogin = useGoogleLogin({
    onSuccess: (obj) => {},
    onError: () => {
      console.log("Button Login Failed");
      setIsLoading(false);
    },
    ux_mode: "redirect",
    use_fedcm_for_button: true,
    scope:
      "openid email profile https://www.googleapis.com/auth/userinfo.profile",
    redirect_uri: localhost, // should be same here and in backend with redirect auth-code flow
    flow: "auth-code", // this is enabling in-window google email selection in chrome
    onNonOAuthError: (error) => {
      console.error("Non-OAuth Error:", error);
    },
  });

  function onGetStarted() {
    setActiveCardIndex(1);
  }

  function prevSlide() {
    setActiveCardIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  }
  function nextSlide() {
    setActiveCardIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }

  async function handleAuthCodeResponse(authCode) {
    try {
      // sending to backend to authenticate and get JWT
      const body = {
        code: authCode,
        clientId: clientId,
        defaultLanguageCode: "en",
        defaultCurrencyCode: "INR",
      };
      var res = await apiRequest.post(
        API_ENDPOINTS.AUTH.SIGN_IN_GOOGLE_CODE,
        body
      );
      authContext.login(res.data);
      toast.success(res.message);
      navigate("/dashboard");
    } catch (error) {
      authContext.clearAuthStates();
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // for one tap login
  async function handleCredentialResponse(credentialResponse) {
    try {
      setIsLoading(true);
      const body = {
        clientId: clientId,
        token: credentialResponse.credential,
        defaultLanguageCode: "en",
        defaultCurrencyCode: "INR",
      };
      var res = await apiRequest.post(API_ENDPOINTS.AUTH.SIGN_IN_GOOGLE, body);
      authContext.login(res.data);
      toast.success(res.message);
      navigate("/dashboard");
    } catch (error) {
      authContext.clearAuthStates();
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // for custom google button
  const onGoogleSignInButtonClick = () => {
    setIsLoading(true);
    googleLogin();
  };

  return (
    <div
      className={`absolute inset-0 p-4 mid:p-8 overflow-hidden ${
        isLoading ? "opacity-90" : ""
      }`}
    >
      <BlurryBlobs />
      <Loader isLoading={isLoading} />
      <div className="h-full w-full p-1 mid:p-2 grid grid-cols-1 mid:grid-cols-2 grid-rows-[1fr_3.5fr_4fr] mid:grid-rows-[2fr_5fr_3fr] gap-1">
        {/* Name of the app - need to ass logo as well */}
        <div className="mid:col-span-2 font-eb-garamond text-size-lg small:text-size-sm text-onBackground">
          Finsible
        </div>

        {/* Step, title, description according to image with buttons for navigation */}
        <div className="row-start-3 mid:row-start-2 mid:col-span-1 flex flex-col justify-center h-full">
          <div className="text-size-4xsm small:text-size-3xsm font-outfit font-extralight text-outline hidden mid:block">
            Step {activeCardIndex + 1} of 4
          </div>

          {/* Card info with ref to measure height */}
          <div
            className="relative flex justify-center items-start transition-all"
            style={{ height: `${cardInfoHeight + 40}px` }}
          >
            {slides.map((slide, index) => (
              <CarouselCardInfo
                ref={index === activeCardIndex ? cardInfoRef : null}
                key={index}
                title={slide.title}
                description={slide.description}
                isActive={activeCardIndex === index}
              />
            ))}
          </div>

          {/* Buttons positioned dynamically based on measured height */}
          <div className="flex items-center gap-2 small:gap-4 mid:mt-2">
            <Button
              onClick={onGetStarted}
              isHidden={activeCardIndex > 0}
              lightImage={rightArrowLight}
              darkImage={rightArrowDark}
              endIcon={true}
              className="flex-1/2 small:flex-initial"
              name="Get Started"
              loading={isLoading}
            />

            <Button
              onClick={prevSlide}
              isHidden={activeCardIndex === 0}
              variant="secondary"
              startIcon={true}
              lightImage={leftArrowDark}
              darkImage={leftArrowLight}
              className="flex-1/2 small:flex-initial"
              name="Back"
              loading={isLoading}
            />

            <Button
              onClick={nextSlide}
              isHidden={activeCardIndex === 0 || activeCardIndex === 3}
              endIcon={true}
              lightImage={rightArrowLight}
              darkImage={rightArrowDark}
              className="flex-1/2 small:flex-initial"
              name="Next"
              loading={isLoading}
            />

            <Button
              name="Sign in with Google"
              startIcon={true}
              lightImage={googleLogo}
              darkImage={googleLogo}
              isHidden={activeCardIndex !== 3}
              id="googleSignIn"
              className="flex-9/10 small:flex-initial"
              onClick={onGoogleSignInButtonClick}
              loading={isLoading}
            />
          </div>
        </div>

        {/* Image carousel with indicators */}
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
              />
            ))}
          </div>
          <CarouselIndicators activeCardIndex={activeCardIndex} />
        </div>
      </div>
    </div>
  );
}
