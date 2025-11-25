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
  BookmarkCheck,
  Megaphone,
  ExternalLink,
  X
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

// LocalStorage helpers (URL-based keys)
function getSavedKeys(): string[] {
  const savedJSON = localStorage.getItem(SAVED_JOBS_KEY);
  return savedJSON ? JSON.parse(savedJSON) : [];
}

function setSavedKeys(keys: string[]): void {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(keys));
}

function addSavedKey(key: string): void {
  const keys = getSavedKeys();
  if (!keys.includes(key)) {
    keys.push(key);
    setSavedKeys(keys);
  }
}

function removeSavedKey(key: string): void {
  const keys = getSavedKeys().filter(k => k !== key);
  setSavedKeys(keys);
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
  const [showMoveBanner, setShowMoveBanner] = useState(true);
  const [isMac, setIsMac] = useState(false);
  const [isOnNewDomain, setIsOnNewDomain] = useState(false);
  const reminderTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize saved from storage
    setSavedJobs(getSavedKeys());
    setIsMac(typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform));
    if (typeof window !== 'undefined') {
      setIsOnNewDomain(/careerpages\.co\.in$/i.test(window.location.hostname));
    }
    const dismissed = localStorage.getItem('careerpages.moveBanner.dismissed') === 'true';
    if (dismissed) {
      // Briefly show as a reminder for 5 seconds, then hide again
      setShowMoveBanner(true);
      reminderTimeoutRef.current = window.setTimeout(() => {
        setShowMoveBanner(false);
      }, 5000);
    }
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
    return () => {
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current)
      }
    }
  }, [dispatch])

  // One-time migration: legacy numeric IDs -> stable URL keys
  useEffect(() => {
    if (!companies || companies.length === 0) return;
    const stored = getSavedKeys();
    // Legacy entries are non-URL (no http prefix)
    const hasLegacy = stored.some(v => typeof v === 'string' && !v.startsWith('http'));
    if (!hasLegacy) return;

    const idToUrl = new Map<string, string>();
    companies.forEach((c: Company) => {
      if (c.id != null && c.url) {
        idToUrl.set(String(c.id), c.url);
      }
    });

    const migratedSet = new Set<string>();
    stored.forEach((v: string) => {
      if (v && v.startsWith('http')) {
        migratedSet.add(v);
      } else {
        const mapped = idToUrl.get(String(v));
        if (mapped) migratedSet.add(mapped);
      }
    });

    const migrated = Array.from(migratedSet);
    setSavedKeys(migrated);
    setSavedJobs(migrated);
  }, [companies]);

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

  const savedCompanies = useMemo(() => {
    const savedSet = new Set(savedJobs);
    return companies.filter((company: Company) => 
      savedSet.has(company.url) || savedSet.has(String(company.id)) // include legacy IDs just in case
    );
  }, [companies, savedJobs]);

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

  const totalPages = useMemo(() => {
    if (viewMode === 'saved') {
      return Math.ceil(savedCompanies.length / companiesPerPage);
    }
    return Math.ceil(filteredCompanies.length / companiesPerPage);
  }, [viewMode, savedCompanies, filteredCompanies, companiesPerPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);
  
  const currentDisplayedCompanies = useMemo(() => {
    const listToPaginate = viewMode === 'saved' ? savedCompanies : filteredCompanies;
    const indexOfLast = currentPage * companiesPerPage;
    const indexOfFirst = indexOfLast - companiesPerPage;
    return listToPaginate.slice(indexOfFirst, indexOfLast);
  }, [viewMode, savedCompanies, filteredCompanies, currentPage, companiesPerPage]);

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

  const handleSaveToggle = (company: Company) => {
    const keyUrl = company.url;
    const legacyId = company.id != null ? String(company.id) : null;
    const current = getSavedKeys();
    const hasNew = current.includes(keyUrl);
    const hasLegacy = legacyId ? current.includes(legacyId) : false;

    if (hasNew) {
      removeSavedKey(keyUrl);
    } else {
      addSavedKey(keyUrl);
      if (hasLegacy && legacyId) removeSavedKey(legacyId);
    }
    setSavedJobs(getSavedKeys());
  };
  const dismissMoveBanner = (persist: boolean) => {
    setShowMoveBanner(false);
    if (persist) {
      localStorage.setItem('careerpages.moveBanner.dismissed', 'true');
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header/>

      <main className="flex-grow">
        {/* Site Move Notice - improved UI/UX */}
        {showMoveBanner && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50">
            <div className="ml-auto max-w-md rounded-xl border border-amber-300 shadow-lg bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
              <div className="flex items-start gap-3 px-4 py-3 sm:px-4">
                <Megaphone className="h-5 w-5 mt-0.5 text-amber-600 dark:text-amber-300" />
                <div className="flex-1">
                  {!isOnNewDomain ? (
                    <>
                      <p className="font-semibold leading-5">
                        We’re moving to new url{" "}
                        <Link
                          href="https://www.careerpages.co.in/"
                          target="_blank"
                          className="underline underline-offset-4"
                        >
                          CareerPages.co.in
                        </Link>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link href="https://www.careerpages.co.in/" target="_blank">
                          <Button size="sm" className="gap-1">
                            Visit new site
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => {
                            navigator.clipboard.writeText('https://www.careerpages.co.in/');
                            toast({
                              title: "Copied",
                              description: "New site URL copied to clipboard.",
                              style: {
                                background: "var(--background)",
                                color: "var(--foreground)",
                              },
                            });
                          }}
                        >
                          Copy URL
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold leading-5">Welcome to CareerPages.co.in 🎉</p>
                      <p className="text-sm opacity-90">Please update your bookmarks. Tip: Press {isMac ? '⌘' : 'Ctrl'} +D to bookmark.</p>
                    </>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Dismiss notice"
                  onClick={() => dismissMoveBanner(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

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
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold">Companies</h3>
              <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'all' ? 'saved' : 'all')}
              className="flex items-center" 
            >
              {viewMode === 'all' ? 'View Bookmarks' : 'View All Companies'}
              {/* Bookmarks Count */}
              {viewMode === 'all' && savedCompanies.length > 0 && (
                <span className="ml-2 bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                  {savedCompanies.length}
                </span>
              )}
            </Button>
            </div>
            {viewMode === 'saved' && savedCompanies.length === 0 ? (
              <div className="text-center py-10">
                <h4 className="text-xl font-semibold">No Saved Companies Yet</h4>
                <p className="text-muted-foreground mt-2">Click the bookmark icon on a company to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Updated: Mapping over currentDisplayedCompanies */}
                  {currentDisplayedCompanies.map((company: Company) => {
                    const isSaved = savedJobs.includes(company.url) || savedJobs.includes(String(company.id));
                    let buttonIcon;
                    let buttonText;
                    if(isSaved){
                      buttonIcon = <BookmarkCheck className="w-4 h-4 mr-1" />;
                      buttonText = 'Bookmarked';
                    }
                    else{
                      buttonIcon = <BookmarkPlus className="w-4 h-4 mr-1" />;
                      buttonText = 'Bookmark';
                    }
                    return (
                      <Card 
                      key={company.url} 
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
                                handleSaveToggle(company);
                              }}
                              className="flex items-center text-primary hover:underline p-0 h-auto">
                              {buttonIcon}
                              {buttonText}
                            </Button>
                            <Link href={`https://github.com/tusharv/career-pages-v2/issues/new?template=bug_report.yml&&title=bug:${encodeURIComponent(company.name)}`} className="flex items-center text-primary hover:underline" target='_blank'>
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
                )}
                {totalPages > 1 && (
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
                          <Button aria-label='Count' className='pointer-events-none'>
                            <strong>{currentPage}</strong>&nbsp;of&nbsp;<strong>{totalPages}</strong>
                          </Button>
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
                )}
          </div>
        )}
      </main>

      <Footer />
      <EasterEggComponent />
    </div>
  )
}
