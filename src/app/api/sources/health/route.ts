import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const rows = [
    { key: 'launchlibrary2',  name: 'Launch Library 2 (The Space Devs)', categories: ['launches'],          docsUrl: 'https://thespacedevs.com/llapi', requiresCredentials: false, status: 'active' },
    { key: 'celestrak',       name: 'CelesTrak GP',                       categories: ['orbital elements'],  docsUrl: 'https://celestrak.org/',         requiresCredentials: false, status: 'active' },
    { key: 'wheretheiss',     name: 'Where The ISS At?',                  categories: ['iss position'],      docsUrl: 'https://wheretheiss.at/w/developer', requiresCredentials: false, status: 'active' },
    { key: 'spaceflightnews', name: 'Spaceflight News API v4',            categories: ['news'],              docsUrl: 'https://api.spaceflightnewsapi.net/v4/docs/', requiresCredentials: false, status: 'active' },
    { key: 'openstreetmap',   name: 'OpenStreetMap tiles',                categories: ['map'],               docsUrl: 'https://www.openstreetmap.org/', requiresCredentials: false, status: 'active' },
    { key: 'youtube',         name: 'YouTube Data API v3 (optional)',      categories: ['broadcasts'],        docsUrl: 'https://developers.google.com/youtube/v3', requiresCredentials: true,  status: process.env.YOUTUBE_API_KEY ? 'active' : 'no_credentials' },
  ];
  return NextResponse.json({
    data: rows,
    provenance: { source: 'ORBIT OS internal', fetchedAt: new Date().toISOString(), freshness: 'live' },
  });
}