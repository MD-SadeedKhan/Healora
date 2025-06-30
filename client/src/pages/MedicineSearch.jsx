import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MedicineCard from '../components/MedicineCard';
import medicineData from '../data/medicineData.json';
import { Helmet } from 'react-helmet-async'; // For SEO
import { useDebounce } from 'use-debounce'; // For cleaner debouncing

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400); // Debounce search term
  const [isLoading, setIsLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Search logic with debounced search term
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      const filtered = medicineData.filter((med) => {
        const term = debouncedSearchTerm.toLowerCase();
        return (
          med.name.toLowerCase().includes(term) ||
          med.usage.toLowerCase().includes(term) ||
          med.tags.some(tag => tag.toLowerCase().includes(term)) ||
          med.category.toLowerCase().includes(term)
        );
      });
      setMedicines(debouncedSearchTerm ? filtered : medicineData);
      if (debouncedSearchTerm && filtered.length === 0) {
        setError(`No medicines found for "${debouncedSearchTerm}"`);
      }
    } catch {
      setError('Error loading medicines.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-[#f7faff] flex flex-col">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Search Medicines | Healora</title>
        <meta name="description" content="Search for medicines by name, usage, or symptoms. Find detailed information about dosage, side effects, and alternatives." />
      </Helmet>

      {/* Top navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5AC8FA]/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#5AC8FA]" />
              </div>
              <Link to="/" className="text-xl sm:text-2xl font-bold text-[#4682B4] font-['Poppins']">
                Healora
              </Link>
            </div>
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link to="/" className="text-gray-600 hover:text-[#5AC8FA] transition-colors text-sm sm:text-base">
                Home
              </Link>
              <Link to="/medicines" className="text-[#5AC8FA] font-semibold text-sm sm:text-base">
                Medicines
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="text-sm sm:text-base">
                  Profile
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Medicine Search
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Search for medicines by name, usage, or symptoms. Find detailed information about dosage, side effects, and alternatives.
          </p>
        </header>

        {/* Input box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search medicines by name, usage, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base sm:text-lg border-2 border-gray-200 focus:border-[#5AC8FA] focus:ring-[#5AC8FA]/20 rounded-xl bg-white shadow-sm"
              aria-label="Search medicines"
            />
          </div>
        </div>

        {/* Header + status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {debouncedSearchTerm ? `Search Results for "${debouncedSearchTerm}"` : 'All Medicines'}
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
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              Try searching with different keywords or check your spelling.
            </p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
              className="border-[#5AC8FA] text-[#5AC8FA] hover:bg-[#5AC8FA] hover:text-white text-sm sm:text-base"
            >
              View All Medicines
            </Button>
          </div>
        )}

        {/* Result grid */}
        {!isLoading && medicines.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {medicines.map((medicine, index) => (
              <MedicineCard key={medicine.id || index} medicine={medicine} />
            ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm sm:text-base">
            <p>© 2025 Healora. Your Intelligent Health Companion.</p>
            <p className="mt-2">
              <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult with a healthcare professional before taking any medication.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicineSearch;