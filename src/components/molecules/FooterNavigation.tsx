import { Text } from "../atoms/Text";

type FooterNavigationProps = {
  title: string;
  items: { label: string; href?: string }[]; // href opcional por si algunos no son links
};

export function FooterNavigation({ title, items }: FooterNavigationProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Título */}
      <Text size="base" weight="bold" color="default">
        {title}
      </Text>

      {/* Items */}
      <nav className="flex flex-col gap-1">
        {items.map((item, idx) =>
          item.href ? (
            <a
              key={idx}
              href={item.href}
              className="text-sm text-gray-800 hover:underline"
            >
              {item.label}
            </a>
          ) : (
            <Text key={idx} size="sm" color="default">
              {item.label}
            </Text>
          )
        )}
      </nav>
    </div>
  );
}
