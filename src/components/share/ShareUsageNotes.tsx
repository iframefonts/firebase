
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShareUsageNotesProps {
  notes: string;
}

export const ShareUsageNotes: React.FC<ShareUsageNotesProps> = ({ notes }) => {
  if (!notes || notes.trim() === '') {
    return null;
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Usage Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700 whitespace-pre-wrap">
          {notes}
        </div>
      </CardContent>
    </Card>
  );
};
