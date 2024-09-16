import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, BookOpen } from 'lucide-react'

// This would typically come from an API or database
const companies = [
  { 
    id: 1, 
    name: "TechCorp", 
    industry: "Technology", 
    description: "A leading technology company specializing in innovative software solutions.",
    founded: 2005,
    employees: 500,
    headquarters: "San Francisco, CA",
    website: "https://techcorp.example.com"
  },
  { 
    id: 2, 
    name: "FinanceHub", 
    industry: "Finance", 
    description: "Innovative financial solutions provider for businesses and individuals.",
    founded: 1998,
    employees: 1200,
    headquarters: "New York, NY",
    website: "https://financehub.example.com"
  },
  { 
    id: 3, 
    name: "GreenEnergy", 
    industry: "Renewable Energy", 
    description: "Sustainable energy solutions for a greener future.",
    founded: 2010,
    employees: 300,
    headquarters: "Austin, TX",
    website: "https://greenenergy.example.com"
  },
]

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = companies.find(c => c.id === parseInt(params.id))

  if (!company) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{company.industry}</p>
            <p className="text-lg">{company.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Company Details</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Founded: {company.founded}</li>
                  <li>Employees: {company.employees}</li>
                  <li>Headquarters: {company.headquarters}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <p>Website: <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a></p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button asChild>
                <Link href={`/company/${company.id}/career`} className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Careers
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/company/${company.id}/blog`} className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Blog
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
