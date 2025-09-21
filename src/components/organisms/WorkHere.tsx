import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button"; // Si tienes este átomo
import { CardProduct } from "@/components/molecules/CardProduct"; // Si tienes esta molécula

export function TopService({ title, text, buttonText, mainService, secondaryServices }) {
  return (
    <div className="bg-white rounded-xl p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <Text size="xl" weight="bold">{title}</Text>
        {buttonText && <Button>{buttonText}</Button>}
      </div>
      <Text size="md" className="mb-4">{text}</Text>
      <div className="flex gap-4">
        <div className="flex-1">
          <CardProduct {...mainService} />
        </div>
        <div className="flex flex-col gap-4 w-[340px]">
          {secondaryServices.map((service, idx) => (
            <CardProduct key={idx} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}