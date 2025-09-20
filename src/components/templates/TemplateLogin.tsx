import React from "react";
import { Image } from "../atoms/Image";
import { LoginForm } from "../organisms/LoginForm";

export type TemplateLoginProps = {
  imageUrl: string;
  imageAlt?: string;
  formProps?: React.ComponentProps<typeof LoginForm>;
};

export function TemplateLogin({ imageUrl, imageAlt = "Login image", formProps }: TemplateLoginProps) {
  return (
    <div className="min-h-screen w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex-1 h-full flex items-center justify-center p-0">
          <Image src={imageUrl} alt={imageAlt} size="large" radius="none" fit="cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 h-full flex items-center justify-center p-8">
          <LoginForm {...formProps} />
        </div>
      </div>
    </div>
  );
}
