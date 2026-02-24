import { Link, useLocation } from "react-router";

export default function SidebarNavItem({
  isOpen,
  isMobile,
  path,
  MainComponenet,
  itemName,
  IconComponent,
  mainProps,
  onClick,
}) {
  const location = useLocation();

  // Check if current route is active
  const isActiveRoute = (path) => location.pathname === path;

  return (
    <MainComponenet
      {...mainProps}
      className={`
        cursor-pointer
        ${isMobile ? "flex flex-col justify-center p-2" : "flex gap-3"}
        items-center rounded-lg transition-colors
        ${
          path && isActiveRoute(path)
            ? "bg-sidebar-active-item-bg text-sider-active-item-text"
            : "hover:bg-sidebar-hover text-sidebar-text"
        }
        ${!isOpen && !isMobile ? "justify-center p-1 my-4" : "p-3"}
     `}
      onClick={onClick}
    >
      <IconComponent
        strokeWidth={isMobile?1:2}
        // fill={`${path && isActiveRoute(path) && isMobile ? "white" : "none"}`}
        className={`
            ${isMobile ? "text-size-4xsm mt-1" : ""}
            ${
              path && isActiveRoute(path)
                ? "text-sider-active-item-text"
                : "text-sidebar-text"
            }`}
      />
      {isOpen && (
        <span
          className={`${
            isMobile ? "text-size-5xsm" : ""
          } text-size-4xsm font-medium`}
        >
          {itemName}
        </span>
      )}
    </MainComponenet>
  );
}
