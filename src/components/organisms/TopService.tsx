import React from "react";
import { cntl } from "@/utils/cntl";
import { CartService, CartServiceProps } from "@/components/molecules/CartService";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";

type TopServiceProps = {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  mainService: CartServiceProps["dataService"];
  secondaryServices: [
    CartServiceProps["dataService"],
    CartServiceProps["dataService"]
  ];
  className?: string;
};

type TopServiceData = {
  mainService: CartServiceProps["dataService"];
  secondaryServices: [
    CartServiceProps["dataService"],
    CartServiceProps["dataService"]
  ];
};

function getTopServiceStyles() {
  return cntl`
    w-full max-w-7xl mx-auto px-4
  `;
}

function getHeaderStyles() {
  return cntl`
    flex items-center justify-between mb-6
  `;
}

function getTitleStyles() {
  return cntl`
    text-2xl font-bold text-gray-900
  `;
}

function getGridStyles() {
  return cntl`
    grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-fit
  `;
}

function getMainCardStyles() {
  return cntl`
    flex justify-center lg:justify-start w-full
  `;
}

function getSecondaryCardsStyles() {
  return cntl`
    flex flex-col gap-4 justify-start w-full
  `;
}

function getResponsiveCardStyles() {
  return cntl`
    w-full max-w-full
    [&>div]:w-full [&>div]:max-w-none
    [&>div]:mx-auto lg:[&>div]:mx-0
  `;
}

function TopService({
  title = "Top Services",
  buttonText = "View All",
  onButtonClick,
  mainService,
  secondaryServices,
  className,
}: TopServiceProps) {
  
  const handleButtonClick = () => {
    onButtonClick?.();
  };

  return (
    <section className={cntl`${getTopServiceStyles()} ${className || ""}`}>
      {(title || buttonText) && (
        <div className={getHeaderStyles()}>
          {title && (
            <Text className={getTitleStyles()}>
              {title}
            </Text>
          )}
          
          {buttonText && (
            <Button
              variant="outline"
              size="medium"
              text={buttonText}
              onClick={handleButtonClick}
            />
          )}
        </div>
      )}

      <div className={getGridStyles()}>
        <div className={`${getMainCardStyles()} ${getResponsiveCardStyles()}`}>
          <CartService
            size="large"
            cardWidth={600}
            imageHeight={400}
            dataService={mainService}
          />
        </div>

        <div className={`${getSecondaryCardsStyles()} ${getResponsiveCardStyles()}`}>
          <CartService
            size="medium"
            cardWidth={500}
            imageHeight={160}
            dataService={secondaryServices[0]}
          />
          
          <CartService
            size="medium"
            cardWidth={500}
            imageHeight={160}
            dataService={secondaryServices[1]}
          />
        </div>
      </div>
    </section>
  );
}

export { TopService };
export type { TopServiceProps, TopServiceData };