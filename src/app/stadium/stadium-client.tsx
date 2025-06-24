'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';

export default function StadiumClient() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <MotionWrapper>
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">
            Stadium View
          </h1>
        </div>
      </MotionWrapper>
      <MotionWrapper delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Construction className="h-6 w-6 text-primary" />
              <span>3D Stadium Render</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="sketchfab-embed-wrapper aspect-[4/3] w-full rounded-lg overflow-hidden border">
              <iframe 
                  title="Cricket stadium" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; fullscreen; xr-spatial-tracking" 
                  src="https://sketchfab.com/models/b4b9964dacc9444e8a265a81fca22afb/embed?autostart=1"
                  className="w-full h-full"
              >
              </iframe>
            </div>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
