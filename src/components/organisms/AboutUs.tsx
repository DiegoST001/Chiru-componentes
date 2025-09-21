import React from "react";
import { cntl } from "@/utils/cntl";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";
import { Heading } from "@/components/atoms/Heading";

type AboutUsProps = {
  title?: string;
  columns: [
    AboutUsColumnData,
    AboutUsColumnData, 
    AboutUsColumnData
  ];
  className?: string;
};

type AboutUsColumnData = {
  title: string;
  paragraphs: string[];
};

function getAboutUsStyles() {
  return cntl`
    w-full max-w-7xl mx-auto px-4
  `;
}

function getTitleStyles() {
  return cntl`
    text-center mb-8
  `;
}

function getGridStyles() {
  return cntl`
    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8
  `;
}

function getColumnStyles() {
  return cntl`
    flex flex-col space-y-4
  `;
}

function getColumnTitleStyles() {
  return cntl`
    text-lg font-semibold text-gray-900 mb-3
  `;
}

function getParagraphStyles() {
  return cntl`
    mb-4 last:mb-0
  `;
}

function AboutUs({
  title = "About Us",
  columns,
  className,
}: AboutUsProps) {

  return (
    <section className={cntl`${getAboutUsStyles()} ${className || ""}`}>
      {/* Título principal opcional */}
      {title && (
        <div className={getTitleStyles()}>
          <Heading
            as="h2"
            level={2}
            color="default"
          >
            {title}
          </Heading>
        </div>
      )}

      {/* Grid de 3 columnas */}
      <div className={getGridStyles()}>
        {columns.map((column, index) => (
          <div key={index} className={getColumnStyles()}>
            <div>
              {column.paragraphs.map((paragraphText, paragraphIndex) => (
                <Paragraph
                  key={paragraphIndex}
                  variant="default"
                  size="medium"
                  leading="relaxed"
                  className={getParagraphStyles()}
                  text={paragraphText}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { AboutUs };
export type { AboutUsProps, AboutUsColumnData };