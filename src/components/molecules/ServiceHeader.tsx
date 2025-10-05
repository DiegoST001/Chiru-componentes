import React from "react";

type ServiceHeaderProps = {
  title1?: string;
  dropdownOptions?: { value: string; label: string }[];
  selectedValue?: string;
  title2?: string;
  buttonText?: string;
  onDropdownChange?: (value: string) => void;
  onCalendarClick?: () => void;
  onButtonClick?: () => void;
};

export function ServiceHeader({
  title1 = "Text-Title",
  dropdownOptions = [
    { value: "Text-Title", label: "Text-Title" },
    { value: "Servicios", label: "Servicios" },
    { value: "Todos", label: "Todos" }
  ],
  selectedValue = "Text-Title",
  title2 = "Text-Title",
  buttonText = "done",
  onDropdownChange,
  onCalendarClick,
  onButtonClick
}: ServiceHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-200">
      {/* Tres Text-Title a la izquierda */}
      <div className="flex items-center gap-6">
        <div className="relative inline-block">
          <span className="text-base font-medium text-gray-700">Text-Title</span>
          {/* Línea diagonal que tacha el texto */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform rotate-45 origin-center -translate-y-0.5"></div>
        </div>
        <span className="text-base font-medium text-gray-700">Text-Title</span>
        <span className="text-base font-medium text-gray-700">Text-Title</span>
      </div>
      
      {/* Controles a la derecha */}
      <div className="flex items-center gap-3">
        {/* Dropdown */}
        <select 
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedValue}
          onChange={(e) => onDropdownChange?.(e.target.value)}
        >
          {dropdownOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Botón calendario */}
        <button 
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onClick={onCalendarClick}
          type="button"
          aria-label="Calendario"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        {/* Botón azul */}
        <button 
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          onClick={onButtonClick}
          type="button"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}