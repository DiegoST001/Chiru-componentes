import React from "react";
import { CategoryDropdown } from "@/components/molecules/CategoryDropdown";
import { NavLinks } from "@/components/molecules/NavLinks";
import { RightNavLinks } from "@/components/molecules/RightNavLinks";
import { cntl } from "@/utils/cntl";

type NavbarProps = {
  className?: string;
};

function getNavbarStyles() {
  return cntl`
    w-full px-6 py-4
    bg-gray-100
    flex items-center justify-between
    max-md:justify-between
    
  `;
}

function getLeftSectionStyles() {
  return cntl`
    flex items-center gap-6
  `;
}

function getRightSectionStyles() {
  return cntl`
    flex items-center max-md:items-end
  `;
}

function Navbar({ className }: NavbarProps) {
  return (
    <nav className={cntl`${getNavbarStyles()} ${className || ""}`}>
      <div className={getLeftSectionStyles()}>
        <CategoryDropdown />
        <NavLinks />
      </div>

      <div className={getRightSectionStyles()}>
        <RightNavLinks />
      </div>
    </nav>
  );
}

export { Navbar };
