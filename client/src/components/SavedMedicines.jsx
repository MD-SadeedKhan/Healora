import { useState, useEffect } from 'react';
import { Trash2, Heart, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const SavedMedicines = () => {
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedMedicines') || '[]');
      if (!Array.isArray(saved)) throw new Error('Invalid saved medicines data');
      setSavedMedicines(saved);
    } catch (err) {
      console.error('Error loading saved medicines:', err.message);
      setError('Failed to load saved medicines. Resetting storage.');
      localStorage.removeItem('savedMedicines');
      setSavedMedicines([]);
    }
  }, []);

  const removeMedicine = (medicineId) => {
    const filtered = savedMedicines.filter((med) => med?.id !== medicineId);
    setSavedMedicines(filtered);
    localStorage.setItem('savedMedicines', JSON.stringify(filtered));
    console.log(`Removed medicine with id: ${medicineId}`);
  };

  const resetStorage = () => {
    localStorage.clear();
    setError(null);
    setSavedMedicines([]);
    console.log('Storage reset');
  };

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Error</h3>
        <p>{error}</p>
        <Button
          onClick={resetStorage}
          variant="outline"
          className="mt-4 text-[#5AC8FA] border-[#5AC8FA]"
        >
          Reset Storage
        </Button>
      </div>
    );
  }

  if (savedMedicines.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved medicines</h3>
        <p className="text-gray-500">
          Start saving medicines from the search page to access them quickly later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Saved Medicines ({savedMedicines.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedMedicines.map((medicine) => (
          <Card
            key={medicine?.id}
            className="hover:shadow-lg transition-shadow bg-white border-0 shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-[#1e40af] mb-2">
                    {medicine?.name || 'Unnamed Medicine'}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-xs bg-[#5AC8FA]/10 text-[#5AC8FA] border-[#5AC8FA]/20"
                  >
                    {medicine?.category || 'Unknown'}
                  </Badge>
                </div>
                <Button
                  onClick={() => removeMedicine(medicine?.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Usage</h4>
                <p className="text-gray-600 text-sm">{medicine?.usage || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Dosage</h4>
                <p className="text-gray-600 text-xs font-mono bg-gray-50 px-2 py-1 rounded">
                  {medicine?.dosage || 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {(medicine?.tags || []).slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      className="text-xs bg-[#5AC8FA]/10 text-[#5AC8FA]"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {(medicine?.tags?.length || 0) > 3 && (
                    <Badge className="text-xs bg-gray-100 text-gray-600">
                      +{(medicine?.tags?.length || 0) - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedMedicines;