import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MedicineCard from '../components/MedicineCard';
import medicineData from '../data/medicineData.json'; // ✅ local data

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      try {
        setIsLoading(true);
        setError(null);
        const filtered = medicineData.filter((med) => {
          const term = searchTerm.toLowerCase();
          return (
            med.name.toLowerCase().includes(term) ||
            med.usage.toLowerCase().includes(term) ||
            med.tags.some(tag => tag.toLowerCase().includes(term)) ||
            med.category.toLowerCase().includes(term)
          );
        });
        setMedicines(searchTerm ? filtered : medicineData);
        if (searchTerm && filtered.length === 0) {
          setError(`No medicines found for "${searchTerm}"`);
        }
      } catch {
        setError('Error loading medicines.');
      } finally {
        setIsLoading(false);
      }
    }, 400); // debounce

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f7faff]">
      {/* Top navbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5AC8FA]/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#5AC8FA]" />
              </div>
              <Link to="/" className="text-2xl font-bold text-[#4682B4] font-['Poppins']">
                Healora
              </Link>
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-[#5AC8FA] transition-colors">
                Home
              </Link>
              <Link to="/medicines" className="text-[#5AC8FA] font-semibold">
                Medicines
              </Link>
              <Button variant="outline" size="sm">Profile</Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Search section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Medicine Search
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for medicines by name, usage, or symptoms. Find detailed information about dosage, side effects, and alternatives.
          </p>
        </div>

        {/* Input box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search medicines by name, usage, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-[#5AC8FA] focus:ring-[#5AC8FA]/20 rounded-xl bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Header + status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Medicines'}
            </h2>
            <div className="text-sm text-gray-500">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </div>
              ) : error ? (
                <span className="text-red-500">Error: {error}</span>
              ) : (
                `${medicines.length} ${medicines.length === 1 ? 'medicine' : 'medicines'} found`
              )}
            </div>
          </div>
          {error && !isLoading && (
            <div className="text-red-500 text-center mb-4">
              <AlertCircle className="w-6 h-6 inline-block mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Loader */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#5AC8FA] mx-auto mb-4" />
              <p className="text-gray-600">Searching medicines...</p>
            </div>
          </div>
        )}

        {/* No results */}
        {!isLoading && medicines.length === 0 && !error && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
            <p className="text-gray-500 mb-4">
              Try searching with different keywords or check your spelling.
            </p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
              className="border-[#5AC8FA] text-[#5AC8FA] hover:bg-[#5AC8FA] hover:text-white"
            >
              View All Medicines
            </Button>
          </div>
        )}

        {/* Result grid */}
        {!isLoading && medicines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine, index) => (
              <MedicineCard key={medicine.id || index} medicine={medicine} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2024 Healora. Your Intelligent Health Companion.</p>
            <p className="text-sm mt-2">
              <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult with a healthcare professional before taking any medication.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicineSearch;
