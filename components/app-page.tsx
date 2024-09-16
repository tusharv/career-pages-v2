'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, Briefcase, BookOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react'
// import { ThemeToggle } from '@/components/theme-toggle'

// This would typically come from an API or database
const allCompanies = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Company ${i + 1}`,
  industry: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'][Math.floor(Math.random() * 5)],
}))

export function Page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const companiesPerPage = 9

  const filteredCompanies = allCompanies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCompany = currentPage * companiesPerPage
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany)

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Theme Toggle */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Company Directory</h1>
          {/* <ThemeToggle /> */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Companies</h2>
          <p className="text-xl mb-8">Find your next career opportunity with top companies in various industries.</p>
          <div className="flex justify-center">
            <Input 
              type="text" 
              placeholder="Search companies or industries..." 
              className="w-full max-w-md bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="ml-2">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Company Listings */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold mb-6">Featured Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCompanies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{company.industry}</p>
                <div className="flex space-x-2">
                  <Link href={`/companies/${company.id}`} className="flex items-center text-primary hover:underline">
                    <Building2 className="w-4 h-4 mr-1" />
                    Details
                  </Link>
                  <Link href={`/companies/${company.id}/jobs`} className="flex items-center text-primary hover:underline">
                    <Briefcase className="w-4 h-4 mr-1" />
                    Jobs
                  </Link>
                  <Link href={`/companies/${company.id}/blog`} className="flex items-center text-primary hover:underline">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Blog
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
