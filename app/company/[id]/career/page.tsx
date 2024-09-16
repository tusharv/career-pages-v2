'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

// This would typically come from an API or database
const companies = [
  { id: 1, name: "TechCorp", careersUrl: "https://www.linkedin.com/jobs" },
  { id: 2, name: "FinanceHub", careersUrl: "https://www.indeed.com/jobs" },
  { id: 3, name: "GreenEnergy", careersUrl: "https://www.glassdoor.com/Job" },
]

export default function CompanyCareers() {
  const params = useParams()
  const [company, setCompany] = useState<typeof companies[0] | null>(null)

  useEffect(() => {
    const companyId = parseInt(params.id as string)
    const foundCompany = companies.find(c => c.id === companyId)
    setCompany(foundCompany || null)
  }, [params.id])

  if (!company) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl">{company.name} Careers</CardTitle>
          <Link
            href={company.careersUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            Visit Careers <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <iframe
            src={company.careersUrl || `http://google.com`}
            className="w-full h-[calc(100vh-200px)] border-none"
            title={`${company.name} Careers`}
          />
        </CardContent>
      </Card>
    </div>
  )
}
