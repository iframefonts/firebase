
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NotesProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onUpdateNotes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes);

  const handleSave = () => {
    onUpdateNotes(tempNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempNotes(notes);
    setIsEditing(false);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-3 text-left">Notes</h3>
      
      {isEditing ? (
        <>
          <Textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            className="min-h-[100px] focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200 text-left"
            placeholder="Add notes about your logo..."
          />
          <div className="flex justify-start space-x-2 mt-2">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
          </div>
        </>
      ) : (
        <div 
          className="min-h-[100px] p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200 text-left"
          onClick={() => setIsEditing(true)}
        >
          {notes ? (
            <p className="text-sm whitespace-pre-wrap text-left">{notes}</p>
          ) : (
            <p className="text-sm text-gray-500 italic text-left">Click to add notes about your logo...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
