"use client"
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Company {
  name: string;
  url: string;
  blog?: string;
  id?: number;
  [key: string]: string | number | undefined;
}

interface CompaniesState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

type CompaniesAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Company[] }
  | { type: 'FETCH_ERROR'; payload: string };

const initialState: CompaniesState = {
  companies: [],
  loading: true,
  error: null,
};

const CompaniesContext = createContext<{
  state: CompaniesState;
  dispatch: React.Dispatch<CompaniesAction>;
} | undefined>(undefined);

function companiesReducer(state: CompaniesState, action: CompaniesAction): CompaniesState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, companies: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(companiesReducer, initialState);

  return (
    <CompaniesContext.Provider value={{ state, dispatch }}>
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompaniesContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompaniesProvider');
  }
  return context;
}
