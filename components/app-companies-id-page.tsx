'use client'

import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Briefcase, BookOpen } from 'lucide-react'

// This would typically come from an API or database
const companies = [
  { id: 1, name: "TechCorp", industry: "Technology", description: "A leading technology company." },
  { id: 2, name: "FinanceHub", industry: "Finance", description: "Innovative financial solutions provider." },
  { id: 3, name: "GreenEnergy", industry: "Renewable Energy", description: "Sustainable energy solutions for a greener future." },
]

export function Page({ params }: { params: { id: string } }) {
  const company = companies.find(c => c.id === parseInt(params.id))

  if (!company) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{company.industry}</p>
          <p className="mb-6">{company.description}</p>
          
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">
                <Building2 className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="blog">
                <BookOpen className="w-4 h-4 mr-2" />
                Blog
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <h2 className="text-xl font-semibold mb-2">Company Details</h2>
              <p>More detailed information about {company.name} would go here.</p>
            </TabsContent>
            <TabsContent value="jobs">
              <h2 className="text-xl font-semibold mb-2">Job Listings</h2>
              <p>Job listings for {company.name} would be displayed here.</p>
            </TabsContent>
            <TabsContent value="blog">
              <h2 className="text-xl font-semibold mb-2">Company Blog</h2>
              <p>Blog posts from {company.name} would be shown here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}