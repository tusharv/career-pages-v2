'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'

// This would typically come from an API or database
const companies = [
  { id: 1, name: "TechCorp", blogUrl: "https://google.com" },
  { id: 2, name: "FinanceHub", blogUrl: "https://www.forbes.com/money" },
  { id: 3, name: "GreenEnergy", blogUrl: "https://www.greentechmedia.com" },
]

export default function CompanyBlog() {
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
          <CardTitle className="text-3xl">{company.name} Blog</CardTitle>
          <a
            href={company.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            Visit Blog <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </CardHeader>
        <CardContent>
          <iframe
            src={company.blogUrl}
            className="w-full h-[calc(100vh-200px)] border-none"
            title={`${company.name} Blog`}
          />
        </CardContent>
      </Card>
    </div>
  )
}
