import { sheetTabs } from '@/lib/faculty-sheets';
import { UI_CONSTANTS } from '@/lib/constants';
import { type FacultyCardProps } from '@/types/faculty';

const FacultyCard = ({ name, status, lastUpdated }: FacultyCardProps) => {
  const filledTabs = Object.values(status).filter(Boolean).length;
  const totalTabs = Object.keys(status).length;
  
  // Determine card color based on completion
  const getCardColor = (): string => {
    if (filledTabs === totalTabs) return UI_CONSTANTS.COLORS.GREEN;
    if (filledTabs > 0) return UI_CONSTANTS.COLORS.YELLOW;
    return UI_CONSTANTS.COLORS.RED;
  };

  const getStatusIcon = (filled: boolean): string => {
    return filled ? UI_CONSTANTS.ICONS.COMPLETED : UI_CONSTANTS.ICONS.NOT_COMPLETED;
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getCardColor()} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="text-sm text-gray-600">
          {filledTabs}/{totalTabs} completed
        </div>
      </div>
      
      <div className="space-y-2">
        {sheetTabs.map((tab) => (
          <div key={tab} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{tab}</span>
            <span className="text-lg">{getStatusIcon(status[tab])}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {lastUpdated || new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default FacultyCard;
