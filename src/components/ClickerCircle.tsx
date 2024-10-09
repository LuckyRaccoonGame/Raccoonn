import React from 'react';
import { MousePointer } from 'lucide-react';

interface ClickerCircleProps {
  onClick: () => void;
}

const ClickerCircle: React.FC<ClickerCircleProps> = ({ onClick }) => {
  return (
    <div
      className="w-48 h-48 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer rotate-on-click"
      onClick={onClick}
    >
      <MousePointer size={48} className="text-white" />
    </div>
  );
};

export default ClickerCircle;