import React from "react";
import { cntl } from "@/utils/cntl";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";
import { Button } from "@/components/atoms/Button";

type FooterSearchProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (value: string) => void;

  searchRowMaxWidth?: number;   
  descriptionMaxWidth?: number; 
  className?: string;
};

function FooterSearch({
  title = "text",
  subtitle = "text",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  placeholder = "abc",
  buttonText = "text",
  onSubmit,
  searchRowMaxWidth = 900,
  descriptionMaxWidth = 700,
  className,
}: FooterSearchProps) {
  const [value, setValue] = React.useState("");
  const submit = () => onSubmit?.(value);

  const wrap = cntl`rounded-xl border bg-white px-6 md:px-10 py-10`;

  return (
    <section className={`${wrap} ${className || ""}`}>
      <div className="text-center space-y-3">
        <Text weight="bold" className="text-3xl">{title}</Text>
        <Text weight="semibold" className="text-base">{subtitle}</Text>
        <Paragraph
          align="center"
          className="mx-auto"
          style={{ maxWidth: descriptionMaxWidth }}
        >
          {description}
        </Paragraph>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-full flex items-center gap-5" style={{ maxWidth: searchRowMaxWidth }}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={placeholder}
            className="flex-1 h-12 rounded-2xl bg-gray-100 px-5 text-base text-gray-700 outline-none"
          />
          <Button variant="danger" size="large" text={buttonText} onClick={submit} />
        </div>
      </div>
    </section>
  );
}

export { FooterSearch };
export type { FooterSearchProps };
