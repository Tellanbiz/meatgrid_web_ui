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
    <aside className="h-screen w-[260px] bg-[#111226] border-r border-gray-800 shadow-sm flex flex-col overflow-hidden">
      {/* Company Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <img
          src={sidebarData.company.logo}
          alt="logo"
          className="w-10 h-10 rounded-lg bg-cover"
        />
        <div>
          <div className="font-semibold text-base text-white leading-tight">
            {sidebarData.company.name}
          </div>
          <div className="text-xs text-gray-400 leading-tight">Admin Panel</div>
        </div>
      </div>
      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto px-0 pt-2 pb-4 custom-scrollbar">
        {filteredNav.map((section) => (
          <div key={section.title} className="mb-2">
            {section.url === "#" && (
              <div className="px-4 pt-3 pb-2 text-xs font-semibold text-gray-400 tracking-widest uppercase">
                {section.title}
              </div>
            )}
            {/* Section Items */}
            {section.items ? (
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.url);

                  return (
                    <li key={item.title} className="flex flex-row space-x-2">
                      <div
                        className={`${
                          isActive ? "bg-red-500" : ""
                        } w-1 h-[40px] rounded-tr-md py-1`}
                      ></div>
                      <NavLink
                        to={item.url}
                        className={() =>
                          `flex flex-grow items-center gap-3 py-2 pl-2 pr-4 rounded-lg text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "bg-gray-800/100"
                              : "text-gray-300 hover:bg-gray-800/30"
                          }
                          ${isActive ? "pl-0" : ""}`
                        }
                        style={{ marginLeft: 0 }}
                      >
                        <Icon
                          icon={item.icon}
                          width={20}
                          className={isActive ? "text-white" : "text-gray-400"}
                        />
                        <span
                          className={isActive ? "text-white" : "text-gray-300"}
                        >
                          {item.title}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to={section.url}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-2 pl-2 pr-4 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-gray-800/50 border-l-4 border-red-500 text-red-500 pl-0"
                          : "text-gray-300 hover:bg-gray-800/30 pl-4"
                      }`
                    }
                    style={{ marginLeft: 0 }}
                  >
                    <Icon
                      icon={section.icon}
                      width={20}
                      className={
                        location.pathname === section.url
                          ? "text-red-500"
                          : "text-gray-400"
                      }
                    />
                    <span>{section.title}</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        ))}
      </nav>
      {/* User Profile */}
      <div className="mt-auto px-3 py-3 border-t border-gray-800 bg-black/20 flex items-center gap-3">
        {user ? (
          <>
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.full_name || "User"}
                className="w-9 h-9 rounded-full border border-gray-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                <Icon
                  icon="solar:user-linear"
                  width={20}
                  className="text-gray-400"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-white truncate">
                {user.full_name || "User"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {user.email || ""}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <Icon
                icon="solar:user-linear"
                width={20}
                className="text-gray-400"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-white truncate">
                Loading...
              </div>
            </div>
          </>
        )}
        <button
          className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Icon
              icon="solar:spinner-linear"
              width={20}
              className="text-gray-400 animate-spin"
            />
          ) : (
            <Icon
              icon="solar:logout-2-linear"
              width={20}
              className="text-gray-400"
            />
          )}
        </button>
      </div>
      {/* Custom thin scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a3a;
          border-radius: 4px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2a2a3a #111226;
        }
      `}</style>
    </aside>
  );
}
