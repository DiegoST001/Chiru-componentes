import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { PencilSimple, Trash } from 'phosphor-react';

type Action = {
  label: string;
  action: 'edit' | 'delete';
};

type ActionDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect: (action: 'edit' | 'delete') => void;
};

const actions: Action[] = [
  { label: 'Editar', action: 'edit' },
  { label: 'Eliminar', action: 'delete' },
];

const iconMap = {
  edit: <PencilSimple size={16} />,
  delete: <Trash size={16} />,
};

export function ActionDropdown({ isOpen, onClose, onActionSelect }: ActionDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-300 z-50"
    >
      <div className="p-2 space-y-1">
        {actions.map(({ label, action }) => (
          <Button
            key={action}
            variant="outline"
            size="small"
            fullWidth
            onClick={() => {
              onActionSelect(action);
              onClose();
            }}
            icon={iconMap[action]}
            text={label}
            className="justify-start border-0 hover:bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}