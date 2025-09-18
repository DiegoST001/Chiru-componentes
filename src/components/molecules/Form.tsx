import React from "react";
import { Text } from "../atoms/Text";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { Textarea } from "../atoms/Textarea";
import { HelperText } from "../atoms/HelperText";

type Field =
  | {
      id: string;
      label: string;
      helper: string;
      type: "input";
      inputType?: "text" | "email" | "number" | "password" | "date";
      placeholder?: string;
    }
  | {
      id: string;
      label: string;
      helper: string;
      type: "select";
      options: { value: string; label: string }[];
      placeholder?: string;
    }
  | {
      id: string;
      label: string;
      helper: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
    }
  | {
      id: string;
      label: string;
      helper: string;
      type: "combo";
      selectOptions: { value: string; label: string }[];
      inputPlaceholder?: string;
      selectPlaceholder?: string;
    };

type FormProps = {
  fields: Field[];
};

export function Form({ fields }: FormProps) {
  return (
    <form className="rounded-lg w-full p-4" style={{ background: "#ececef" }}>
      <div className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      ">
        {fields.map((field) => {
          let fieldContent = null;
          if (field.type === "input") {
            fieldContent = (
              <Input
                id={field.id}
                type={field.inputType || "text"}
                placeholder={field.placeholder}
                variant="outline"
                fullWidth
              />
            );
          } else if (field.type === "select") {
            fieldContent = (
              <Select
                id={field.id}
                options={field.options}
                placeholder={field.placeholder}
                variant="outline"
                fullWidth
              />
            );
          } else if (field.type === "textarea") {
            fieldContent = (
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                variant="outline"
                fullWidth
                rows={field.rows || 3}
              />
            );
          } else if (field.type === "combo") {
            fieldContent = (
              <div className="flex gap-2">
                <Select
                  id={field.id + "-select"}
                  options={field.selectOptions}
                  placeholder={field.selectPlaceholder}
                  variant="outline"
                  fullWidth
                />
                <Input
                  id={field.id + "-input"}
                  type="number"
                  placeholder={field.inputPlaceholder}
                  variant="outline"
                  fullWidth
                />
              </div>
            );
          }
          return (
            <div
              key={field.id}
              className={`flex flex-col gap-2 justify-between`}
              style={{ minHeight: "120px" }}
            >
              <Text size="sm" weight="semibold" className="mb-1">{field.label}</Text>
              {fieldContent}
              <HelperText>{field.helper}</HelperText>
            </div>
          );
        })}
      </div>
    </form>
  );
}