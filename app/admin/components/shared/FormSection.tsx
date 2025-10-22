
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { ReactNode, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSectionCollapse } from '@/lib/context/AdminPageContext';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  isEnabled?: boolean;
  collapsible?: boolean;
  className?: string;
}

export function FormSection({
  title,
  children,
  isEnabled,
  collapsible,
  className,
}: FormSectionProps) {
  const { isAllOpen, setIsAllOpen } = useSectionCollapse();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (collapsible) {
      setIsOpen(isAllOpen);
    }
  }, [isAllOpen, collapsible]);

  const handleToggle = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Card
      className={`transition-all duration-300 py-3! bg-[var(--v3-mot-form-bg)]`}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between cursor-pointer ${isOpen && 'border-b'}`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <ChevronDown
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
          )}
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {isEnabled !== undefined && (
            <span
              className={`w-3 h-3 rounded-full ${
                isEnabled ? 'bg-v3-green' : 'bg-red-500'
              }`}
            />
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="pt-2">{children}</CardContent>}
    </Card>
  );
}
