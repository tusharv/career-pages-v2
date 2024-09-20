import { NextRequest, NextResponse } from 'next/server';
import { ServerClient } from 'postmark';

const apiKey = process.env.POSTMARK_API_KEY || "";
const client = new ServerClient(apiKey);

export async function POST(req: NextRequest) {
    const { reportType, issue, siteName, contactInfo } = await req.json();

    try {
        await client.sendEmailWithTemplate({
            "From": "tushar@theworkingprototype.com",
            "To": "tushar@theworkingprototype.com",
            "TemplateId": 37360481,
            "TemplateModel": {
                "reportType": reportType,
                "siteName": siteName,
                "issue": issue,
                "contactInfo": contactInfo
            }
        });
        return NextResponse.json({ message: 'Issue reported successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Unable to send via postmark: ' + (error as Error).message);
        return NextResponse.json({ message: 'Failed to report issue.' }, { status: 500 });
    }
}
