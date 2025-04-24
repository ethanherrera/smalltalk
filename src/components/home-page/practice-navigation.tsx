import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const PracticeNavigation: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/practice');
  };

  return (
    <div className="fixed bottom-20 right-4 z-10">
      <Button
        onClick={handleNavigation}
        className="rounded-full h-14 w-14 p-0 bg-black hover:bg-gray-800"
      >
        <BookOpen className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default PracticeNavigation;