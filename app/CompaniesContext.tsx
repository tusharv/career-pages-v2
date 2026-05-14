"use client"
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { CompanyListItem } from '@/lib/types/company';

export type Company = CompanyListItem;

interface CompaniesState {
  companies: Company[];
  total: number;
  indexTotal: number;
  loading: boolean;
  error: string | null;
}

type CompaniesAction =
  | { type: 'FETCH_START' }
  | {
      type: 'FETCH_SUCCESS';
      payload: { companies: Company[]; total: number; indexTotal: number };
    }
  | { type: 'FETCH_ERROR'; payload: string };

const initialState: CompaniesState = {
  companies: [],
  total: 0,
  indexTotal: 0,
  loading: true,
  error: null,
};

function companiesReducer(
  state: CompaniesState,
  action: CompaniesAction
): CompaniesState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        companies: action.payload.companies,
        total: action.payload.total,
        indexTotal: action.payload.indexTotal,
        error: null,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const CompaniesContext = createContext<{
  state: CompaniesState;
  dispatch: React.Dispatch<CompaniesAction>;
} | undefined>(undefined);

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
