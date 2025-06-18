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
    <aside className="h-screen w-[260px] bg-[#18192a] shadow-lg flex flex-col overflow-hidden font-lato transition-all duration-300">
      {/* Company Header */}
      <div className="flex items-center gap-3 px-6 py-6 bg-[#20223a] shadow-sm">
        <img
          src={sidebarData.company.logo}
          alt="logo"
          className="w-11 h-11 rounded-xl bg-cover shadow-md"
        />
        <div>
          <div className="font-bold text-lg text-white leading-tight tracking-wide">
            {sidebarData.company.name}
          </div>
          <div className="text-xs text-gray-400 leading-tight font-medium">
            Admin Panel
          </div>
        </div>
      </div>
      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto px-0 pt-4 pb-6 custom-scrollbar">
        {filteredNav.map((section) => (
          <div key={section.title} className="mb-4">
            {section.url === "#" && (
              <div className="px-6 pt-2 pb-1 text-[11px] font-bold text-gray-500 tracking-widest uppercase letter-spacing-wider">
                {section.title}
              </div>
            )}
            {/* Section Items */}
            {section.items ? (
              <ul className="space-y-1 mt-1">
                {section.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.url);

                  return (
                    <li key={item.title} className="flex flex-row space-x-2">
                      <div
                        className={`${
                          isActive ? "bg-accent" : ""
                        } w-1 h-[32px] rounded-tr-md py-1 transition-all`}
                      ></div>
                      <NavLink
                        to={item.url}
                        className={() =>
                          `flex flex-grow items-center gap-3 py-2 pl-3 pr-4 rounded-lg text-[15px] font-semibold transition-all duration-200
                          ${
                            isActive
                              ? "bg-[#23243a] text-accent shadow-md"
                              : "text-gray-300 hover:bg-[#23243a]/60 hover:text-white"
                          }
                          ${isActive ? "pl-0" : ""}`
                        }
                        style={{ marginLeft: 0 }}
                      >
                        <Icon
                          icon={item.icon}
                          width={22}
                          className={isActive ? "text-accent" : "text-gray-400"}
                        />
                        <span
                          className={isActive ? "text-accent" : "text-gray-200"}
                        >
                          {item.title}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="space-y-1 mt-1">
                <li>
                  <NavLink
                    to={section.url}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-2 pl-3 pr-4 rounded-lg text-[15px] font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#23243a] border-l-4 border-accent text-accent shadow-md pl-0"
                          : "text-gray-300 hover:bg-[#23243a]/60 hover:text-white pl-4"
                      }`
                    }
                    style={{ marginLeft: 0 }}
                  >
                    <Icon
                      icon={section.icon}
                      width={22}
                      className={
                        location.pathname === section.url
                          ? "text-accent"
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
      <div className="mt-auto px-5 py-4 bg-[#20223a] flex items-center gap-3 rounded-t-xl shadow-inner">
        {user ? (
          <>
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.full_name || "User"}
                className="w-10 h-10 rounded-full border border-gray-700 shadow"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shadow">
                <Icon
                  icon="solar:user-linear"
                  width={22}
                  className="text-gray-400"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-white truncate">
                {user.full_name || "User"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {user.email || ""}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shadow">
              <Icon
                icon="solar:user-linear"
                width={22}
                className="text-gray-400"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-white truncate">
                Loading...
              </div>
            </div>
          </>
        )}
        <button
          className="p-2 hover:bg-[#23243a] rounded-full transition-colors"
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Icon
              icon="solar:spinner-linear"
              width={22}
              className="text-gray-400 animate-spin"
            />
          ) : (
            <Icon
              icon="solar:logout-2-linear"
              width={22}
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
          background: #23243a;
          border-radius: 4px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #23243a #18192a;
        }
        .font-lato, .font-lato * {
          font-family: 'Lato', sans-serif !important;
        }
        .letter-spacing-wider {
          letter-spacing: 0.12em;
        }
        .text-accent {
          color: #ff5a5f !important;
        }
        .bg-accent {
          background: #ff5a5f !important;
        }
        .border-accent {
          border-color: #ff5a5f !important;
        }
      `}</style>
    </aside>
  );
}
