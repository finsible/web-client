import { APP_NAME } from "../../AppContants";
import app_logo_dark from "../assets/dark/app_logo_dark.png";
import app_logo_light from "../assets/light/app_logo_light.svg";
import { useAuthData } from "../hooks/AuthProvider";
import { useSidebar } from "../hooks/SidebarProvider";
import { useTheme } from "../hooks/ThemeProvider";
import {
  Home,
  LogOut,
  Sun,
  Moon,
  Settings,
  Bell,
  User,
  ArrowLeftRight,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  CalendarPlus2,
  PiggyBank,
  Plus,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { useState } from "react";
import { Link } from "react-router";

export default function Sidebar({
  isTransactionPopup,
  handleTransactionPopup,
}) {
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const { isOpen, isMobile, toggle } = useSidebar();
  const authContext = useAuthData();
  const userData = authContext?.authData;
  const themeState = useTheme();

  function showEmail() {
    setIsEmailVisible(!isEmailVisible);
  }

  // Full sidebar (mobile opened or desktop)
  return (
    <>
      {/* Full Sidebar */}
      <div
        className={`
        bg-sidebar fixed z-50
        ${
          isMobile
            ? "bottom-0 left-0 right-0 h-16 w-full"
            : `p-3 top-0 left-0 bottom-0 flex flex-col ${
                isOpen ? "w-70" : "w-18"
              }`
        }
        transition-all duration-300 ease-in-out
        shadow-lg border-1 border-sidebarBorder
      `}
      >
        {/* Header */}
        {!isMobile && (
          <div className={`shrink-0 ${isOpen ? "p-2" : ""}`}>
            <div
              className={`flex items-center ${
                !isOpen ? "justify-center" : "justify-between"
              }`}
            >
              {/* App name and logo */}
              <div
                className={`flex gap-3 items-center ${
                  !isOpen ? "justify-center" : ""
                }`}
              >
                <span className="dark:hidden">
                  <img
                    className={`w-11 h-11 my-2`}
                    src={app_logo_dark}
                    alt="App logo"
                  />
                </span>
                <span className="hidden dark:inline">
                  <img
                    className={`shrink-0 ${
                      isOpen ? "w-11 h-11" : "w-14 h-14 mb-2"
                    }`}
                    src={app_logo_light}
                    alt="App logo"
                  />
                </span>
                {isOpen && (
                  <h2 className="text-sidebar-text text-size-xs font-semibold">
                    {APP_NAME}
                  </h2>
                )}
              </div>
            </div>

            <div className="border-b-1 border-container mb-2"></div>

            {/* User Profile */}
            <div
              className={`flex flex-col rounded-lg ${
                !isOpen ? "justify-center" : "p-3 my-4 bg-user-profile-bg"
              }`}
            >
              <div
                className={`
            flex gap-3 items-center ${!isOpen ? "justify-center" : ""}
          `}
              >
                <img
                  className={`shrink-0 rounded-full border-2 border-container ${
                    isOpen ? "w-12 h-12" : "w-11 h-11"
                  }`}
                  src={userData?.picture}
                  alt={User}
                  onError={() => console.log("not able to load user profile")}
                />
                {isOpen && (
                  <div className="flex flex-col justify-center items-start min-w-0 flex-1">
                    <p className="text-sidebar-text text-size-3xsm font-medium truncate w-full">
                      {userData?.name}
                    </p>
                    <p className="text-sidebar-text text-size-4xsm opacity-70 truncate w-full">
                      Premium account
                    </p>
                  </div>
                )}

                {isOpen && (
                  <button className={``} onClick={showEmail}>
                    <ChevronUp
                      size={16}
                      className={`${
                        isEmailVisible ? "" : "hidden"
                      } text-onBackground`}
                    />
                    <ChevronDown
                      size={16}
                      className={`${
                        isEmailVisible ? "hidden" : ""
                      } text-onBackground`}
                    />
                  </button>
                )}
              </div>
              {isEmailVisible && isOpen && (
                <div className="">
                  <hr className="text-container my-2"></hr>
                  <div className="text-size-4xsm text-sidebar-text opacity-90">
                    {userData?.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* sidebar toggle */}
        {!isMobile && (
          <button
            className={`absolute p-0.5 border-1 border-background ${
              isOpen ? "left-66" : "left-15"
            } bg-onBackground rounded-2xl z-100 top-1/2 text-center transition-all duration-300 ease-in-out`}
            onClick={toggle}
          >
            <ChevronRight
              size={15}
              className={`${isOpen ? "hidden" : ""} text-background`}
            />
            <ChevronLeft
              size={15}
              className={`${isOpen ? "" : "hidden"} text-background`}
            />
          </button>
        )}

        {/* Navigation */}
        <div
          className={`z-100 ${
            isMobile
              ? "flex items-center justify-around h-full"
              : "flex flex-col flex-1 space-y-2"
          }`}
        >
          <SidebarNavItem
            isOpen={isOpen}
            isMobile={isMobile}
            path="/dashboard"
            mainProps={{ to: "/dashboard" }}
            MainComponenet={Link}
            itemName="Dashboard"
            IconComponent={Home}
          />
          <SidebarNavItem
            isOpen={isOpen}
            isMobile={isMobile}
            path="/accounts"
            mainProps={{ to: "/accounts" }}
            MainComponenet={Link}
            itemName="Accounts"
            IconComponent={PiggyBank}
          />
          {isMobile && (
            <div
              className="h-12 w-12 rounded-4xl bg-onBackground flex justify-center items-center shrink-0"
              onClick={() => handleTransactionPopup(true)}
            >
              <Plus className="text-sidebar" />
            </div>
          )}
          <SidebarNavItem
            isMobile={isMobile}
            isOpen={isOpen}
            path="/transactions"
            mainProps={{ to: "/transactions" }}
            MainComponenet={Link}
            IconComponent={ArrowLeftRight}
            itemName={"Transactions"}
          />
          <SidebarNavItem
            isOpen={isOpen}
            isMobile={isMobile}
            path="/settings"
            mainProps={{ to: "/settings" }}
            MainComponenet={Link}
            itemName="Settings"
            IconComponent={Settings}
          />

          {/* {isMobile && (
            <div className="flex flex-col items-center justify-center p-2">
              <img
                className="w-7 h-7 rounded-full border border-container"
                src={userData?.picture}
                alt="Profile"
              />
              <span
                className={`${
                  isMobile ? "text-size-5xsm" : ""
                } text-sidebar-text text-size-4xsm font-medium`}
              >
                Profile
              </span>
            </div>
          )} */}
        </div>

        {/* theme and Logout Button */}
        {!isMobile && (
          <div>
            <hr className="text-container my-4"></hr>
            <div
              className={`flex flex-col gap-5 shrink-0 ${
                isOpen ? "p-2" : ""
              }`}
            >
              <div
                className={`cursor-pointer ${
                  !isOpen ? "flex justify-center" : ""
                }`}
                onClick={themeState.toggleTheme}
              >
                {isOpen ? (
                  <div className="flex gap-3">
                    {themeState.theme === "light" ? (
                      <Moon className="text-sidebar-text" />
                    ) : (
                      <Sun className="text-sidebar-text" />
                    )}
                    <span className="text-sidebar-text">Theme</span>
                  </div>
                ) : themeState.theme === "light" ? (
                  <Moon className="text-sidebar-text" />
                ) : (
                  <Sun className="text-sidebar-text" />
                )}
              </div>
              <div
                className={`cursor-pointer ${
                  !isOpen ? "flex justify-center" : ""
                }`}
                onClick={authContext.logout}
              >
                {isOpen ? (
                  <div className="flex gap-3">
                    <LogOut className="text-red-700" />
                    <span className="text-red-700">Logout</span>
                  </div>
                ) : (
                  <LogOut className="text-red-700" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
