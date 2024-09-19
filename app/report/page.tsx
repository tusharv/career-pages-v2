"use client"
import { useState, FormEvent } from 'react';
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MessageSquare, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation'

export default function ReportIssue() {
    const searchParams = useSearchParams()
    const [reportType, setReportType] = useState<string>('issue');
    const [issue, setIssue] = useState<string>('');
    const [siteName, setSiteName] = useState<string>(searchParams.get('sitename')?.toString() || '');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reportType, issue, siteName })
        });

        if (response.ok) {
            setMessage('Report submitted successfully!');
        } else {
            setMessage('Failed to submit report.');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header/>
            <div className="max-w-lg mx-auto px-4">
                <h1 className="text-3xl font-semibold text-center my-6">Submit Report or Feedback</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <div>
                        <label htmlFor="reportType" className="block text-sm font-bold text-primary mb-2">Report Type:</label>
                        <Select onValueChange={(value) => setReportType(value)} defaultValue={reportType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="issue">
                                    <div className="flex items-center text-primary">
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        Issue
                                    </div>
                                </SelectItem>
                                <SelectItem value="feedback">
                                    <div className="flex items-center text-primary">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Feedback
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="siteName" className="block text-sm font-bold text-primary mb-2">Site Name:</label>
                        <Input
                            id="siteName"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="Enter the site name"
                            defaultValue={siteName}
                            className='text-primary'
                        />
                    </div>
                    <div>
                        <label htmlFor="issue" className="block text-sm font-bold text-primary mb-2">Describe the {reportType}:</label>
                        <Textarea
                            id="issue"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            rows={4}
                            placeholder={`Please provide details about your ${reportType}`}
                            className='text-primary'
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" /> Submit
                    </Button>
                </form>
                {message && (
                    <Alert className="mt-4" variant={message.includes('successfully') ? 'default' : 'destructive'}>
                        <AlertTitle>{message.includes('successfully') ? 'Success' : 'Error'}</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
