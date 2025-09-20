import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { 
  User, 
  Envelope, 
  ClipboardText, 
  Package,
  House,
  MagnifyingGlass,
  Heart,
  ShoppingCart,
  Bell,
  Gear,
  ChatCircle,
  ChartBar,
  Users,
  Folder,
  Calendar,
  ChartLine,
  PlusCircle,
  UserCircle
} from "phosphor-react";
import { cntl } from "@/utils/cntl";

type NavIconProps = {
  icon: React.ReactNode | string;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

type NavIconsProps = {
  items?: NavIconProps[];
  orientation?: "horizontal" | "vertical";
  spacing?: "small" | "medium" | "large";
  showLabels?: boolean;
};

function getIconFromString(iconName: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    user: <User />,
    envelope: <Envelope />,
    "clipboard-text": <ClipboardText />,
    package: <Package />,
    house: <House />,
    "magnifying-glass": <MagnifyingGlass />,
    heart: <Heart />,
    "shopping-cart": <ShoppingCart />,
    bell: <Bell />,
    gear: <Gear />,
    "chat-circle": <ChatCircle />,
    "chart-bar": <ChartBar />,
    users: <Users />,
    folder: <Folder />,
    calendar: <Calendar />,
    "chart-line": <ChartLine />,
    "plus-circle": <PlusCircle />,
    "user-circle": <UserCircle />,
  };

  return iconMap[iconName] || <Package />; 
}

function getNavIconsStyles(orientation: NavIconsProps["orientation"]) {
  const baseStyles = "flex items-center";
  
  const orientations = {
    horizontal: "flex-row gap-4",
    vertical: "flex-col gap-2",
  };

  return cntl`
    ${baseStyles}
    ${orientations[orientation || "horizontal"]}
  `;
}

function getNavIconStyles(active?: boolean) {
  const baseStyles = "flex flex-col items-center cursor-pointer transition-colors p-2 rounded-md";
  
  const activeStyles = active 
    ? "bg-gray-100 text-indigo-600" 
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50";

  return cntl`
    ${baseStyles}
    ${activeStyles}
  `;
}

function NavIcon({ icon, label, onClick, active }: NavIconProps) {
  const iconElement = typeof icon === 'string' ? getIconFromString(icon) : icon;

  return (
    <div className={getNavIconStyles(active)} onClick={onClick}>
      <div className="relative">
        <Icon variant={active ? "primary" : "default"} tamano="medium">
          {iconElement}
        </Icon>
      </div>
      {label && (
        <Text size="xs" color={active ? "primary" : "muted"} weight="medium">
          {label}
        </Text>
      )}
    </div>
  );
}

function NavIcons({
  items = [],
  orientation = "horizontal",
  spacing = "medium",
  showLabels = true,
}: NavIconsProps) {
  // Items por defecto si no se proporcionan
  const defaultItems: NavIconProps[] = [
    {
      icon: <User />,
      label: "Perfil",
      onClick: () => console.log("Perfil clicked"),
    },
    {
      icon: <Envelope />,
      label: "Mensajes",
      onClick: () => console.log("Mensajes clicked"),
    },
    {
      icon: <ClipboardText />,
      label: "Tareas",
      onClick: () => console.log("Tareas clicked"),
    },
    {
      icon: <Package />,
      label: "Productos",
      onClick: () => console.log("Productos clicked"),
    },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  return (
    <div className={getNavIconsStyles(orientation)}>
      {navItems.map((item, index) => (
        <NavIcon
          key={index}
          icon={item.icon}
          label={showLabels ? item.label : ""}
          onClick={item.onClick}
          active={item.active}
        />
      ))}
    </div>
  );
}

export { NavIcons };