import { Icon } from "@iconify/react";
import { sidebarData } from "./data";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectAuthUser,
  selectIsFetchingAdminAccount,
  selectIsLoggingOut,
  selectLogoutSuccess,
  selectAuthStatus,
} from "@/store/features/auth/authSelectors";
import {
  fetchAdminAccount,
  logoutUser,
} from "@/store/features/auth/authThunks";

export function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isFetchingAdminAccount = useAppSelector(selectIsFetchingAdminAccount);
  const isLoggingOut = useAppSelector(selectIsLoggingOut);
  const logoutSuccess = useAppSelector(selectLogoutSuccess);
  const status = useAppSelector(selectAuthStatus);

  const filteredNav = sidebarData.navMain;

  React.useEffect(() => {
    if (!user && !isFetchingAdminAccount) {
      if (status === "failed") {
        navigate("/login");
      } else {
        dispatch(fetchAdminAccount());
      }
    }
  }, [dispatch, isFetchingAdminAccount, user, status, navigate]);

  React.useEffect(() => {
    if (logoutSuccess) {
      navigate("/login");
    }
  }, [logoutSuccess, navigate]);

  const handleLogoutClick = () => {
    dispatch(logoutUser());
  };

  return (
    <aside className="h-screen w-56 bg-[#1A1A1D] border-r border-gray-700 flex flex-col font-inter">
      {/* Logo Section - Simplified */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <img
            src={sidebarData.company.logo}
            alt="logo"
            className="w-8 h-8"
          />
        </div>
        <div>
          <div className="font-semibold text-white text-sm">
            {sidebarData.company.name}
          </div>
          <div className="text-xs text-gray-400">
            Admin
          </div>
        </div>
      </div>

      {/* Navigation - Compact */}
      <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {filteredNav.map((section) => (
          <div key={section.title} className="mb-1">
            {/* Section Header */}
            {section.url === "#" && (
              <div className="px-4 py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {section.title}
                </div>
              </div>
            )}
            
            {/* Section Items */}
            {section.items ? (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.url);

                  return (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors relative group
                        ${
                          isActive
                            ? "bg-[#ff5a5f]/10 text-[#ff5a5f] font-medium"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff5a5f]"></div>
                      )}
                      
                      <Icon
                        icon={item.icon}
                        width={16}
                        className={`${
                          isActive ? "text-[#ff5a5f]" : "text-gray-400 group-hover:text-gray-300"
                        } flex-shrink-0`}
                      />
                      <span className="truncate  font-medium">
                        {item.title}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            ) : (
              <NavLink
                to={section.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 text-sm transition-colors relative group
                  ${
                    isActive
                      ? "bg-[#ff5a5f]/10 text-[#ff5a5f]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {/* Active indicator */}
                {location.pathname === section.url && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff5a5f]"></div>
                )}
                
                <Icon
                  icon={section.icon}
                  width={16}
                  className={`${
                    location.pathname === section.url
                      ? "text-[#ff5a5f]"
                      : "text-gray-400 group-hover:text-gray-300"
                  } flex-shrink-0`}
                />
                <span className="truncate">
                  {section.title}
                </span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile - Compact */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.full_name || "User"}
                  className="w-8 h-8 rounded-full border border-gray-600 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600 flex-shrink-0">
                  <Icon
                    icon="solar:user-linear"
                    width={16}
                    className="text-gray-400"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  {user.full_name || "User"}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {user.email || ""}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600 flex-shrink-0">
                <Icon
                  icon="solar:user-linear"
                  width={16}
                  className="text-gray-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  Loading...
                </div>
              </div>
            </>
          )}
          
          <button
            className="p-1.5 hover:bg-white/5 rounded-md transition-colors flex-shrink-0 group"
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            title="Logout"
          >
            {isLoggingOut ? (
              <Icon
                icon="solar:spinner-linear"
                width={16}
                className="text-gray-400 animate-spin"
              />
            ) : (
              <Icon
                icon="solar:logout-2-linear"
                width={16}
                className="text-gray-400 group-hover:text-gray-300 transition-colors"
              />
            )}
          </button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 transparent;
        }
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </aside>
  );
}