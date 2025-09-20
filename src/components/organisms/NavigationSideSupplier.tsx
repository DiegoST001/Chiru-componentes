import {
  Buildings,
  House,
  Plus,
  ToteSimple,
  User,
  Question,
} from "phosphor-react";

import { Button } from "@/components/atoms/Button";
import { Heading } from "../atoms/Heading";
import { Image } from "../atoms/Image";

export type NavItem = {
  text: string;
  /** Nombre del ícono (por ejemplo "House", "User") */
  icon?: "Buildings" | "House" | "Plus" | "ToteSimple" | "User";
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "dangerInverse"
    | "ofBackgroundRed";
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  positionIcon?: "left" | "right";
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

type NavigationSideSupplierProps = {
  className?: string;
  responsive?: boolean;
  logoSrc?: string;
  sections: NavSection[];
  bottomAction?: NavItem;
};

// Mapa de íconos disponibles (puedes agregar más si los importas arriba)
const ICONS = {
  Buildings,
  House,
  Plus,
  ToteSimple,
  User,
};

function getIcon(iconName?: NavItem["icon"]) {
  if (!iconName) return null;
  const IconComponent = ICONS[iconName] || Question; // Si no existe, usa un ícono genérico
  return <IconComponent weight="fill" size={30} />;
}

function NavigationSideSupplier({
  className,
  responsive,
  logoSrc = "/chiru_logo_full.svg",
  sections,
  bottomAction,
}: NavigationSideSupplierProps) {
  return (
    <aside
      className={`flex flex-col justify-between h-full p-4 border border-gray-300 rounded-tr-4xl rounded-br-4xl shadow-md ${
        responsive ? "w-20 md:w-64" : "w-64"
      } ${className || ""}`}
    >
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image size="small" src={logoSrc} alt="Logo" fit="contain" />
        </div>

        {/* Secciones dinámicas */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <Heading level={4} className="text-lg font-light uppercase">
              {section.title}
            </Heading>
            <div className="flex flex-col gap-2">
              {section.items.map((item, i) => {
                const content = (
                  <Button
                    key={i}
                    className={`justify-start ${item.className || ""}`}
                    variant={item.variant || "outline"}
                    size={item.size || "large"}
                    fullWidth={item.fullWidth ?? true}
                    disabled={item.disabled}
                    positionIcon={item.positionIcon}
                    text={item.text}
                    icon={getIcon(item.icon)}
                    onClick={item.href ? undefined : item.onClick}
                  />
                );

                return item.href ? (
                  <a key={i} href={item.href} className="block">
                    {content}
                  </a>
                ) : (
                  content
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Acción inferior */}
      {bottomAction && (
        <div className="mt-6">
          {bottomAction.href ? (
            <a href={bottomAction.href} className="block">
              <Button
                fullWidth={bottomAction.fullWidth ?? true}
                variant={bottomAction.variant || "danger"}
                size={bottomAction.size || "large"}
                className={`justify-start ${bottomAction.className || ""}`}
                text={bottomAction.text}
                icon={getIcon(bottomAction.icon)}
              />
            </a>
          ) : (
            <Button
              fullWidth={bottomAction.fullWidth ?? true}
              variant={bottomAction.variant || "danger"}
              size={bottomAction.size || "large"}
              className={`justify-start ${bottomAction.className || ""}`}
              onClick={bottomAction.onClick}
              text={bottomAction.text}
              icon={getIcon(bottomAction.icon)}
            />
          )}
        </div>
      )}
    </aside>
  );
}

export { NavigationSideSupplier };
