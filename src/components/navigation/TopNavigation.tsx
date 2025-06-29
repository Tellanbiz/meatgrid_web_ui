import { useState, ChangeEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

type NavItem = {
  title: string;
  url: string;
  icon?: string;
};

type FlatNavItem = NavItem & { section?: string };

type Props = {
  items: {
    title: string;
    url: string;
    icon?: string;
    items?: NavItem[];
  }[];
};

export function TopNavigation({ items }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Flatten the navigation items for searching
  const allNavItems: FlatNavItem[] = items.flatMap(section => 
    section.items 
      ? [
          { title: section.title, url: section.url, icon: section.icon },
          ...section.items.map(item => ({ 
            ...item, 
            section: section.title 
          }))
        ]
      : [{ title: section.title, url: section.url, icon: section.icon }]
  );

  // Filter items based on search query
  const filteredItems = searchQuery.length > 1
    ? allNavItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.section && item.section.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  // Group items by section
  const groupedItems = filteredItems.reduce((acc, item) => {
    const section = item.section || "General";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, FlatNavItem[]>);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 1);
  };

  const handleItemClick = (url: string) => {
    navigate(url);
    setSearchQuery("");
    setShowResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[50px] w-full bg-white border-b border-gray-200 z-[100] px-4 flex items-center justify-between sticky top-0 left-0">
      <div className="relative w-[300px]" ref={searchRef}>
        <div className="relative">
          <Icon 
            icon="solar:magnifer-linear" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            width="18" 
            height="18" 
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-9 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {showResults && (
          <div className="absolute top-full left-0 mt-2 w-[350px] bg-white shadow-lg rounded-md overflow-hidden z-[101] border border-gray-200">
            {Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(([section, items]) => (
                <div key={section} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500">
                    {section}
                  </div>
                  <div className="max-h-[250px] overflow-y-auto">
                    {items.map((item, index) => (
                      <div 
                        key={`${item.title}-${index}`}
                        className="px-4 py-2.5 hover:bg-primary hover:text-white cursor-pointer flex items-center"
                        onClick={() => handleItemClick(item.url)}
                      >
                        {item.icon && (
                          <div className="mr-3 text-current">
                            <Icon icon={item.icon} width="16" height="16" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found for "{searchQuery}"
              </div>
            )}
            
            {Object.keys(groupedItems).length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                Press Enter to see all results
              </div>
            )}
          </div>
        )}
      </div>

     
    </div>
  );
} 