'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface SectionCollapseContextType {
  isAllOpen: boolean;
  setIsAllOpen: Dispatch<SetStateAction<boolean>>;
  toggleAll: () => void;
}

const SectionCollapseContext = createContext<SectionCollapseContextType | undefined>(
  undefined
);

export const useSectionCollapse = () => {
  const context = useContext(SectionCollapseContext);
  if (!context) {
    throw new Error(
      'useSectionCollapse must be used within a SectionCollapseProvider'
    );
  }
  return context;
};

export const SectionCollapseProvider = ({ children }: { children: ReactNode }) => {
  const [isAllOpen, setIsAllOpen] = useState(true);

  const toggleAll = () => {
    setIsAllOpen((prev) => !prev);
  };

  return (
    <SectionCollapseContext.Provider
      value={{ isAllOpen, setIsAllOpen, toggleAll }}
    >
      {children}
    </SectionCollapseContext.Provider>
  );
};
