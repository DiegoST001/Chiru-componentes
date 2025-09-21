import React from "react";
import { Image, ImageProps } from "../atoms/Image";

type BannerImgProps = {
  images: Array<{
    src: string;
    alt?: string;
    size?: ImageProps["size"];
    radius?: ImageProps["radius"];
    shadow?: boolean;
    bordered?: boolean;
    fit?: ImageProps["fit"];
  }>;
  className?: string;
};

export function BannerImg({
  images,
  className,
}: BannerImgProps) {
  return (
    <div className={`flex flex-row justify-center items-center ${className || ""}`}>
      {images.map((img, i) => (
        <Image
          key={i}
          src={img.src}
          alt={img.alt ?? `Banner image ${i + 1}`}
          size={img.size ?? "medium"}
          radius={img.radius ?? "md"}
          shadow={img.shadow ?? false}
          bordered={img.bordered ?? false}
          fit={img.fit ?? "cover"}
          // No margin, no gap
        />
      ))}
    </div>
  );
}