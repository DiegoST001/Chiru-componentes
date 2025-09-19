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
    bg-white
    flex items-center justify-between
  `;
}

function getLeftSectionStyles() {
  return cntl`
    flex items-center gap-6
  `;
}

function getRightSectionStyles() {
  return cntl`
    flex items-center
  `;
}

function Navbar({ className }: NavbarProps) {
  return (
    <nav className={cntl`${getNavbarStyles()} ${className || ""}`}>
      {/* Sección izquierda: CategoryDropdown + NavLinks */}
      <div className={getLeftSectionStyles()}>
        <CategoryDropdown />
        <NavLinks />
      </div>

      {/* Sección derecha: RightNavLinks */}
      <div className={getRightSectionStyles()}>
        <RightNavLinks />
      </div>
    </nav>
  );
}

export { Navbar };
