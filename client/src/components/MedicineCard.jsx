import { useState, useEffect } from 'react';
import { Heart, Save, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const MedicineCard = ({ medicine }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const savedMedicines = JSON.parse(localStorage.getItem('savedMedicines') || '[]');
    if (!medicine || !medicine.id) {
      console.error('Invalid medicine data for saving:', medicine);
      return;
    }
    if (!isSaved) {
      savedMedicines.push(medicine);
      localStorage.setItem('savedMedicines', JSON.stringify(savedMedicines));
      setIsSaved(true);
      console.log('Medicine saved:', medicine.name);
    } else {
      const filtered = savedMedicines.filter((med) => med.id !== medicine.id);
      localStorage.setItem('savedMedicines', JSON.stringify(filtered));
      setIsSaved(false);
      console.log('Medicine removed from saved:', medicine.name);
    }
  };

  useEffect(() => {
    const savedMedicines = JSON.parse(localStorage.getItem('savedMedicines') || '[]');
    const isAlreadySaved = savedMedicines.some((med) => med.id === medicine?.id);
    setIsSaved(isAlreadySaved);
  }, [medicine?.id]);

  if (!medicine) {
    return <div className="text-red-500 text-center">Error: Medicine data unavailable</div>;
  }

  console.log('Rendering medicine:', medicine);

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-[#1e40af] mb-2">
              {medicine.name || 'Unnamed Medicine'}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs bg-[#5AC8FA]/10 text-[#5AC8FA] border-[#5AC8FA]/20"
            >
              {medicine.category || 'Unknown'}
            </Badge>
          </div>
          <Button
            onClick={handleSave}
            variant="ghost"
            size="sm"
            className={`
              ${isSaved
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                : 'text-gray-400 hover:text-[#5AC8FA] hover:bg-[#5AC8FA]/5'
              } transition-colors
            `}
          >
            {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Usage</h4>
          <p className="text-gray-600 text-sm">{medicine.usage || 'N/A'}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Dosage</h4>
          <p className="text-gray-600 text-sm font-mono bg-gray-50 px-2 py-1 rounded">
            {medicine.dosage || 'N/A'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Side Effects</h4>
          <p className="text-gray-600 text-sm">{medicine.sideEffects || 'N/A'}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Alternatives</h4>
          <div className="flex flex-wrap gap-1">
            {(medicine.alternatives || []).map((alt, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-[#A1E3D8]/20 text-[#0d9488] hover:bg-[#A1E3D8]/30"
              >
                {alt}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {(medicine.tags || []).map((tag, index) => (
              <Badge
                key={index}
                className="text-xs bg-[#5AC8FA]/10 text-[#5AC8FA] hover:bg-[#5AC8FA]/20"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;