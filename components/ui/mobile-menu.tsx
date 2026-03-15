"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Toggle, useToggle } from "@/hooks/use-toggle";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import React, { Activity } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

type MobileMenuProps = {
  children?: React.ReactNode;
};

const MenuContext = React.createContext<{ toggle: Toggle } | undefined>(
  undefined,
);
const useMobileMenu = () => {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within a MobileSideMenu");
  }
  return context;
};

export const MobileMenuBackdrop = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { toggle } = useMobileMenu();
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onDragCapture,
    onDragStartCapture,
    onDragEndCapture,
    ...safeProps
  } = props as any;

  return (
    <AnimatePresence>
      {toggle.value && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggle}
          className={cn(
            "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden",
            className,
          )}
          {...safeProps}
        />
      )}
    </AnimatePresence>
  );
});
MobileMenuBackdrop.displayName = "MobileMenuBackdrop";

export const MobileMenu: React.FC<MobileMenuProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const toggle = useToggle();
  return (
    <Activity mode={isMobile ? "visible" : "hidden"}>
      <MenuContext.Provider value={{ toggle }}>{children}</MenuContext.Provider>
    </Activity>
  );
};

export const MobileMenuTrigger: React.FC<
  React.ComponentPropsWithoutRef<typeof Button>
> = ({ children, asChild = true, className, ...props }) => {
  const { toggle } = useMobileMenu();
  const isOpen = toggle.value;

  const iconVariants = {
    closed: { rotate: 0, scale: 1 },
    open: { rotate: 180, scale: 1 },
  };

  const menuIconVariants = {
    closed: { opacity: 1, rotate: 0 },
    open: { opacity: 0, rotate: -90 },
  };

  const xIconVariants = {
    closed: { opacity: 0, rotate: 90 },
    open: { opacity: 1, rotate: 0 },
  };

  return (
    <Button
      asChild={asChild}
      onClick={toggle}
      variant="ghost"
      size="icon"
      className="relative h-10 w-10"
      aria-label={toggle.value ? "Close menu" : "Open menu"}
    >
      {children || (
        <div className="relative h-6 w-6">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="menu"
                initial="closed"
                animate="closed"
                exit="open"
                variants={menuIconVariants}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                initial="closed"
                animate="open"
                exit="closed"
                variants={xIconVariants}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Button>
  );
};

export const MobileMenuContent: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { toggle } = useMobileMenu();
  const isOpen = toggle.value;

  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      {createPortal(<MobileMenuBackdrop />, document.body)}
      <div className="absolute top-full left-0 right-0 md:hidden bg-background border-t shadow-lg animate-in slide-in-from-top-5 z-50">
        <div className="px-4 py-3 space-y-3">{children}</div>
      </div>
    </Activity>
  );
};

const MenuGroupContext = React.createContext<true | false>(false);

export const MobileMenuGroup: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MenuGroupContext.Provider value={true}>
      <div className="pt-3 border-t">
        <ul className="space-y-3">{children}</ul>
      </div>
    </MenuGroupContext.Provider>
  );
};

export const MobileMenuItem: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  const { toggle } = useMobileMenu();
  const isInGroup = React.useContext(MenuGroupContext);
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    toggle();
  };
  const Container = isInGroup ? "li" : "div";
  return <Container onClick={handleClick}>{children}</Container>;
};
