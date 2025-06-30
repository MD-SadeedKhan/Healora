import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const FilterDropdown = ({ records, setFilteredRecords }) => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All Types');
  const [dateRange, setDateRange] = useState('All Time');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterRecords(value, type, dateRange);
  };

  const handleTypeChange = (value) => {
    setType(value);
    filterRecords(search, value, dateRange);
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    filterRecords(search, type, value);
  };

  const filterRecords = (search, type, dateRange) => {
    let filtered = records;

    if (search) {
      filtered = filtered.filter(
        (record) =>
          record.title?.toLowerCase()?.includes(search.toLowerCase()) ||
          record.doctor?.toLowerCase()?.includes(search.toLowerCase()) ||
          record.condition?.toLowerCase()?.includes(search.toLowerCase())
      );
    }

    if (type !== 'All Types') {
      filtered = filtered.filter((record) => record.type?.toLowerCase() === type.toLowerCase());
    }

    if (dateRange !== 'All Time') {
      const now = new Date();
      if (dateRange === 'This Month') {
        filtered = filtered.filter(
          (record) =>
            new Date(record.date).getMonth() === now.getMonth() &&
            new Date(record.date).getFullYear() === now.getFullYear()
        );
      }
      // Additional filters can be added
    }

    setFilteredRecords(filtered);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search records, doctors, conditions..."
          value={search}
          onChange={handleSearch}
          className="w-full pl-10 bg-input border-border text-foreground p-2 rounded-lg"
        />
      </div>
      <div className="relative">
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="appearance-none bg-input border-border text-foreground p-2 rounded-lg pr-8 z-10"
        >
          <option>All Types</option>
          <option>Checkup</option>
          <option>Prescription</option>
          <option>Lab Report</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
      <div className="relative">
        <select
          value={dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
          className="appearance-none bg-input border-border text-foreground p-2 rounded-lg pr-8 z-10"
        >
          <option>All Time</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>Last Year</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};

export default FilterDropdown;
