import { Icon } from "@iconify/react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

type FlatNavItem = {
  title: string;
  url: string;
  icon?: string;
  section?: string;
};

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  groupedItems: Record<string, FlatNavItem[]>;
  handleSelect: (item: FlatNavItem) => void;
}

export function CommandPalette({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery,
  groupedItems,
  handleSelect,
}: CommandPaletteProps) {
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <Icon icon="solar:magnifer-linear" className="h-5 w-5" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-3 hidden h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-hidden p-0">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput
              placeholder="Search all pages and resources..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {Object.entries(groupedItems).map(([section, items]) => (
                <CommandGroup key={section} heading={section}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.url}
                      onSelect={() => {
                        handleSelect(item);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm"
                    >
                      {item.icon && <Icon icon={item.icon} className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
} 