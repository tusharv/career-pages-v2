"use client"
import { useState, FormEvent } from 'react';
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MessageSquare, Send, SquarePlus, Blocks, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation'

export default function ReportIssue() {
    const searchParams = useSearchParams()
    const [reportType, setReportType] = useState<string>('issue');
    const [issue, setIssue] = useState<string>('');
    const [siteName, setSiteName] = useState<string>(searchParams.get('sitename')?.toString() || '');
    const [contactInfo, setContactInfo] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [issueError, setIssueError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        if (issue.length < 5) {
            setIssueError('Please provide a more detailed description (at least 5 characters).');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    reportType: reportType.replace(/\b\w/g, c => c.toUpperCase()),
                    issue, 
                    siteName, 
                    contactInfo 
                })
            });

            if (response.ok) {
                setMessage('Report submitted successfully!');
            } else {
                setMessage('Failed to submit report.');
            }
        } catch (error) {
            setMessage('An error occurred while submitting the report.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground">
            <Header/>
            <section className="bg-primary text-primary-foreground py-4">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-semibold text-center flex items-center justify-center">
                        Tell us
                    </h1>
                </div>
            </section>
            <div className="flex-grow overflow-auto">
                <div className="max-w-lg mx-auto my-2 px-4">
                    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
                        <div className="space-y-1">
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
                                    <SelectItem value="feature">
                                        <div className="flex items-center text-primary">
                                            <SquarePlus className="mr-2 h-4 w-4" />
                                            Feature Request
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="contribute">
                                        <div className="flex items-center text-primary">
                                            <Blocks className="mr-2 h-4 w-4" />
                                            Contribute 
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
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
                        <div className="space-y-1">
                            <label htmlFor="issue" className="block text-sm font-bold text-primary">
                                {reportType === 'issue' && 'Describe the issue:'}
                                {reportType === 'feedback' && 'Provide your feedback:'}
                                {reportType === 'feature' && 'Describe the feature request:'}
                                {reportType === 'contribute' && 'How would you like to contribute?'}
                            </label>
                            <Textarea
                                id="issue"
                                value={issue}
                                onChange={(e) => {
                                    setIssue(e.target.value);
                                    setIssueError('');
                                }}
                                rows={3}
                                placeholder={`Please provide details about your ${reportType}`}
                                className={`text-primary ${issueError ? 'border-red-500' : ''}`}
                            />
                            {issueError && (
                                <p className="text-red-500 text-sm mt-1">{issueError}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="contactInfo" className="block text-sm font-bold text-primary mb-2">Contact Information (Optional):</label>
                            <Input
                                id="contactInfo"
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                                placeholder="Enter your email or other contact info"
                                className='text-primary'
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                If you provide your email or contact information, we can get back to you once the {reportType} is resolved.
                            </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> Submit
                                </>
                            )}
                        </Button>
                    </form>
                    {message && (
                        <Alert className="mt-2" variant={message.includes('successfully') ? 'default' : 'destructive'}>
                            <AlertTitle>{message.includes('successfully') ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
