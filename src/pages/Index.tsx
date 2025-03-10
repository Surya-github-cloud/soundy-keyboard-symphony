
import { useState, useEffect } from 'react';
import Keyboard from '@/components/Keyboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyboardMusic } from 'lucide-react';

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side rendering for audio context
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <KeyboardMusic size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Soundy Keyboard Symphony</h1>
          <p className="text-lg text-muted-foreground">
            Create beautiful music with this virtual keyboard
          </p>
        </div>

        <Card className="border-2 border-secondary">
          <CardHeader className="text-center">
            <CardTitle>Virtual Keyboard</CardTitle>
            <CardDescription>
              Click the keys or use your computer keyboard to play sounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted && <Keyboard />}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Key mapping: A-S-D-F-G-H-J-K-L corresponds to white keys</p>
          <p>W-E-T-Y-U-O-P corresponds to black keys</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
