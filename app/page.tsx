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
  CircleX,
  Share2,
  Bug,
  BookmarkPlus,
  BookmarkCheck
} from 'lucide-react'
import AutoSuggest from '@/components/AutoSuggest'
import { useEasterEgg } from '@/hooks/useEasterEgg'
import { useCompanies } from './CompaniesContext'

interface Company {
  name: string;
  url: string;
  blog?: string;
  id?: number;
  // Add other known properties here
  [key: string]: string | number | undefined;
}

import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

const SAVED_JOBS_KEY = 'careerPages.savedJobs';

function getSavedJobs(): string[] {
  const savedJobsJSON = localStorage.getItem(SAVED_JOBS_KEY);
  return savedJobsJSON ? JSON.parse(savedJobsJSON) : [];
}

function setSavedJobs(savedJobs: string[]): void {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
}

function saveJob(jobId: string): void {
  const savedJobs = getSavedJobs();
  if (!savedJobs.includes(jobId)) {
    savedJobs.push(jobId);
    setSavedJobs(savedJobs);
  }
}

function removeJob(jobId: string): void {
  let savedJobs = getSavedJobs();
  savedJobs = savedJobs.filter(id => id !== jobId);
  setSavedJobs(savedJobs);
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state: { companies, loading, error }, dispatch } = useCompanies()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const companiesPerPage = 12
  const { toast } = useToast()

  const EASTER_EGG_COMPANIES = useMemo(() => 
    process.env.NEXT_PUBLIC_EASTER_EGG_COMPANIES?.split(",") ?? []
  , []);

  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { triggerEasterEgg, EasterEggComponent } = useEasterEgg()
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    setSavedJobs(getSavedJobs());
    dispatch({ type: 'FETCH_START' })
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const sortedData = data
          .sort((a: Company, b: Company) => a.name.localeCompare(b.name))
          .map((company: Company, index: number) => ({
            ...company,
            id: index + 1
          }));
        dispatch({ type: 'FETCH_SUCCESS', payload: sortedData })
      })
      .catch(error => {
        dispatch({ type: 'FETCH_ERROR', payload: error.message })
        console.error('Error loading companies:', error)
      })
  }, [dispatch])

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    router.push('/', { scroll: false });
    inputRef.current?.focus();
  }, [router]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company: { name?: string }) => 
      company.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const throttledSetSearchTerm = _.throttle(setSearchTerm, 300);

  const handleInputChange = useCallback((value: string) => {
    throttledSetSearchTerm(value);
    setShowSuggestions(true);
    router.push(value ? `/?search=${encodeURIComponent(value)}` : '/', { scroll: false });
    
  }, [throttledSetSearchTerm, router]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    router.push(suggestion ? `/?search=${encodeURIComponent(suggestion)}` : '/', { scroll: false });
    inputRef.current?.focus();
  }, [router]);

  const indexOfLastCompany = searchTerm.length === 0 ? currentPage * companiesPerPage : companies.length -1;
  const indexOfFirstCompany = searchTerm.length === 0 ? indexOfLastCompany - companiesPerPage : 0;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage)

  const suggestions = useMemo(() => {
    if (searchTerm.length === 0) return []
    return filteredCompanies
      .slice(0, 10)
      .map((company: Company) => company.name)
  }, [filteredCompanies, searchTerm])

  const isEasterEggCompany = useMemo(() => {
    return (company: Company) => EASTER_EGG_COMPANIES.some(name => 
      company.name.toLowerCase().includes(name.toLowerCase())
    );
  }, [EASTER_EGG_COMPANIES]);

  const handleSaveToggle = (companyId: number) => {
    const companyIdStr = String(companyId);
    const isSaved = savedJobs.includes(companyIdStr);

    if (isSaved) {
      removeJob(companyIdStr);
    } else {
      saveJob(companyIdStr);
    }
    setSavedJobs(getSavedJobs());
  };

  const savedCompanies = useMemo(() => {
    return companies.filter(company => savedJobs.includes(String(company.id)));
  }, [companies, savedJobs]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header/>

      <main className="flex-grow">
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
            <p className="text-md my-4">Showing results from {companies.length} Companies</p>
          </div>
        </section>

        {loading && (
          <div className="container mx-auto px-4 py-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-xl">Loading companies...</p>
          </div>
        )}

        {error && (
          <div className="container mx-auto px-4 py-8 text-center">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h3>
            <p className="text-lg mb-4">{error}</p>
            <p className="text-md">Please try refreshing the page or check back later.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Company Listings */}
            <div className="container mx-auto px-4 py-8">
            {/* View Mode Toggle and Title */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold">Companies</h3>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'all' ? 'saved' : 'all')}
              >
                {viewMode === 'all' ? 'View Saved' : 'View All Companies'}
              </Button>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(viewMode === 'all' ? currentCompanies : savedCompanies).map((company: Company) => {

                  const isSaved = savedJobs.includes(String(company.id));
                  let buttonIcon;
                  let buttonText;
                  if(isSaved){
                    buttonIcon = <BookmarkCheck className="w-4 h-4 mr-1" />;
                    buttonText = 'Saved';
                  }
                  else{
                    buttonIcon = <BookmarkPlus className="w-4 h-4 mr-1" />;
                    buttonText = 'Save';
                  }

                  return (
                    <Card 
                    key={company.id} 
                    className='shadow-sm transition-shadow duration-300 hover:shadow-md'
                    onClick={() => {
                      if (isEasterEggCompany(company)) {
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
                        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
                          <Button
                            onClick={() => {
                              const shareUrl = `${window.location.protocol || 'http:'}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}?search=${encodeURIComponent(company.name)}`;
                              navigator.clipboard.writeText(shareUrl).then(() => {
                                toast({
                                  title: "Link copied! 🎉",
                                  description: `The share link 🔗 ${shareUrl} has been copied to your clipboard.`,
                                  style: {
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                  },
                                });
                              });
                            }}
                            variant="link"
                            className="flex items-center text-primary hover:underline p-0 h-auto sm:justify-start justify-start"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            variant="link"
                            onClick={(e) => {
                              e.stopPropagation(); // This stops the whole card from being clicked
                              if (company.id) handleSaveToggle(company.id);
                            }}
                            className="flex items-center text-primary hover:underline p-0 h-auto">
                            {buttonIcon}
                            {buttonText}
                          </Button>
                          <Link href={`/report?sitename=${encodeURIComponent(company.name)}`} className="flex items-center text-primary hover:underline" target='_blank'>
                            <Bug className="w-4 h-4 mr-1" />
                            Report Issue
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })}
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
      </main>

      <Footer />
      <EasterEggComponent />
    </div>
  )
}