'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import _ from "lodash"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
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
    fetch('/data-minify.json')
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
      <Header/>

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
      <Footer />
      <EasterEggComponent />
    </div>
  )
}
