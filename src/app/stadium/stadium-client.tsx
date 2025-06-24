'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function StadiumClient() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">
          Stadium View
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-primary" />
            <span>3D Stadium Render</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96 bg-muted">
            <p className="text-muted-foreground">
              3D Stadium rendering is coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
