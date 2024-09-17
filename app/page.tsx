'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import _ from "lodash"
import Link from 'next/link'
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  Briefcase,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Newspaper,
  Handshake,
  CircleX
} from 'lucide-react'
import AutoSuggest from '@/components/AutoSuggest'
import { useEasterEgg } from '@/hooks/useEasterEgg'

interface Company {
  name: string;
  url: string;
  blog?: string;
  id?: number;
  // Add other known properties here
  [key: string]: string | number | undefined;
}

enum PAGE_STATE {
  LOADING = 'Loading',
  ERROR = 'Error',
  SUCCESS = 'Success',
}

export default function Home() {
  const [allCompanies, setAllCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageState, setPageState] = useState(PAGE_STATE.LOADING);
  const companiesPerPage = 12

  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { triggerEasterEgg, EasterEggComponent } = useEasterEgg()

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const sortedData = data
          .sort((a: Company, b: Company) => a.name.localeCompare(b.name))
          .map((company: Company, index: number) => ({
            ...company,
            id: index + 1
          }));
        setPageState(PAGE_STATE.SUCCESS)
        setAllCompanies(sortedData);
      })
      .catch(error => {
        setPageState(PAGE_STATE.ERROR)
        console.error('Error loading companies:', error)
      })
  }, [])

  const handleClearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company: { name?: string }) => 
      company.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCompanies, searchTerm]);

  const throttledSetSearchTerm = _.throttle(setSearchTerm, 300);

  const handleInputChange = useCallback((value: string) => {
    throttledSetSearchTerm(value);
    setShowSuggestions(true);
  }, [throttledSetSearchTerm]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const indexOfLastCompany = searchTerm.length === 0 ? currentPage * companiesPerPage : allCompanies.length -1;
  const indexOfFirstCompany = searchTerm.length === 0 ? indexOfLastCompany - companiesPerPage : 0;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage)

  const suggestions = useMemo(() => {
    if (searchTerm.length === 0) return []
    return filteredCompanies
      .slice(0, 10)
      .map((company: Company) => company.name)
  }, [filteredCompanies, searchTerm])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Theme Toggle */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-start items-center space-x-4">
          <Image
            width={36}
            height={36}
            src='/career.svg'
            alt='Career'
            priority
          />
          <h1 className="text-2xl font-bold">Career Pages</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Companies</h2>
          <p className="text-xl mb-8">Find your next career opportunity with top companies in various industries.</p>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Input 
  type="text" 
  placeholder="Search companies" 
  className="w-full bg-background text-foreground pr-24"
  value={searchTerm}
  onChange={(e) => handleInputChange(e.target.value)}
  onFocus={() => setShowSuggestions(true)}
  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
  ref={inputRef}
/>
<Button 
  className="absolute right-0 top-0 bottom-0 bg-transparent hover:bg-transparent"
  onClick={searchTerm ? handleClearSearch : undefined}
>
  {searchTerm ? (
    <>
      <CircleX className="w-4 h-4 mr-2" />
      Clear
    </>
  ) : (
    <>
      <Search className="w-4 h-4 mr-2" />
      Search
    </>
  )}
</Button>
              {showSuggestions && suggestions.length > 0 && (
                <AutoSuggest 
                  suggestions={suggestions} 
                  onSuggestionClick={handleSuggestionClick} 
                  onClose={() => setShowSuggestions(false)}
                />
              )}
            </div>
          </div>
          <p className="text-md my-4">Showing results from {allCompanies.length} Companies</p>
        </div>
      </section>

      {pageState === PAGE_STATE.SUCCESS && (
        <>
          {/* Company Listings */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold mb-6">Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCompanies.map((company: Company) => (
            <Card 
              key={company.id} 
              className='shadow-sm transition-shadow duration-300 hover:shadow-md'
              onClick={() => {
                if (company.name.toLowerCase().includes('proximity')) {
                  triggerEasterEgg()
                }
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Avatar className="mr-2 rounded-none" style={{ width: "22px", height: "22px" }}>
                    <AvatarImage
                      src={`/logo-cache/${new URL(company?.url).hostname}.webp`}
                      alt={`${company?.name} logo`}
                    />
                    <AvatarFallback>
                      {company?.name?.split(' ').map(word => word[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {company?.name}
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent>
                <div className="flex flex-col gap-2 ">
                  <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
                    <Link href={`${company.url}`} className="flex items-center text-primary hover:underline" target='_blank'>
                      <Briefcase className="w-4 h-4 mr-1" />
                      Jobs
                    </Link>
                    {company.blog && (
                      <Link href={`${company.blog}`} className="flex items-center text-primary hover:underline"
                      target='_blank'>
                        <BookOpen className="w-4 h-4 mr-1" />
                        Blog
                      </Link>
                    )}
                  </div>
                  <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
                    <Link href={`https://www.google.com/search?q=${company.name}`} className="flex items-center text-primary hover:underline" target='_blank'>
                      <Search className="w-4 h-4 mr-1" />
                      Search
                    </Link>
                    <Link href={`https://news.google.com/search?q=${company.name}`} className="flex items-center text-primary hover:underline" target='_blank'>
                      <Newspaper className="w-4 h-4 mr-1" />
                      News
                    </Link>
                    <Link href={`https://google.com/search?q=site:theorg.com ${company.name}&btnI=I`} className="flex items-center text-primary hover:underline" target='_blank'>
                      <Handshake className="w-4 h-4 mr-1" />
                      People <sup className='hover:no-underline'>[βeta]</sup>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <Button 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            aria-label='First Page'
          >
            <ChevronsLeft className="w-4 h-4 mr-2" />
          </Button>
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label='Previous Page'
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
          </Button>
          {searchTerm.length === 0 &&(
            <Button aria-label='Count' className='pointer-events-none'><strong>{currentPage}</strong>&nbsp;of&nbsp;<strong>{totalPages}</strong></Button>
          )}
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label='Next Page'
          >
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label='Last Page'
          >
            <ChevronsRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
        </>
      )}

      {pageState === PAGE_STATE.ERROR && (
        <div className="container mx-auto px-4 py-8 text-center">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h3>
          <p className="text-lg mb-4">We&apos;re sorry, but there was an error loading the company data.</p>
          <p className="text-md">Please try refreshing the page or check back later.</p>
        </div>
      )}

      {pageState === PAGE_STATE.LOADING && (
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading companies...</p>
        </div>
      )}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span>Built using</span>
              <Link href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-4 w-4 mr-1">
                  <rect width="256" height="256" fill="none"></rect>
                  <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                  <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                </svg>
                shadcn/ui
              </Link>
              <span>&nbsp;</span>
              <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
                <svg aria-label="Vercel logomark" height="16" role="img" viewBox="0 0 74 64" width="18" className="mr-1">
                  <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor"></path>
                </svg>
                Vercel
              </Link>
              <span>and</span>
              <Link href="https://v0.dev/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
                <svg fill="currentColor" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg" className="min-w-[25px] -translate-x-px text-black transition-opacity duration-500 opacity-100"><path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"></path><path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"></path></svg>
              </Link>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
            <Link 
              href="https://github.com/Kaustubh-Natuskar/companies-to-apply" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 font-medium hover:underline"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Data</span>
            </Link>
            </div>
          </div>
        </div>
      </footer>
      <EasterEggComponent />
    </div>
  )
}
