import { useState, useEffect, useCallback } from 'react';
     import axios from 'axios';
     import { toast } from 'react-hot-toast';
     import RecordCard from '../components/RecordCard';
     import AddRecordModal from '../components/AddRecordModal';
     import FilterDropdown from '../components/FilterDropdown';
     import { Plus, Download } from 'lucide-react';
     import { useAuth } from '../context/useAuth';

     const HealthRecords = () => {
       const { user, loading: authLoading } = useAuth();
       const [records, setRecords] = useState([]);
       const [filteredRecords, setFilteredRecords] = useState([]);
       const [loading, setLoading] = useState(false);
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editRecord, setEditRecord] = useState(null);

       const getStatusColor = () => 'bg-gray-100 text-gray-800'; // Simplified, no status field

       const handleDownload = (record) => {
         console.log('📝 [HealthRecords] Downloading record:', record._id);
         const dataStr = JSON.stringify(record, null, 2);
         const blob = new Blob([dataStr], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = `health_record_${record._id}.json`;
         link.click();
         URL.revokeObjectURL(url);
         console.log('✅ [HealthRecords] Record downloaded:', record._id);
         toast.success('Record downloaded!');
       };

       const fetchRecords = useCallback(async () => {
         if (!user || authLoading) {
           console.log('⚠️ [HealthRecords] Skipping fetch: No user or auth loading', { user, authLoading });
           return;
         }
         try {
           setLoading(true);
           console.log('📡 [HealthRecords] Fetching records for user:', user.id);
           const token = localStorage.getItem('token');
           if (!token) {
             console.warn('⚠️ [HealthRecords] No token found in localStorage');
             toast.error('Please log in to view records');
             setLoading(false);
             return;
           }
           console.log('🔑 [HealthRecords] Using token:', token.substring(0, 10) + '...');
           const response = await axios.get('http://localhost:5000/api/health-records', {
             headers: { Authorization: `Bearer ${token}` },
           });
           console.log('✅ [HealthRecords] Records fetched:', response.data.length, 'records');
           setRecords(response.data);
           setFilteredRecords(response.data);
         } catch (error) {
           console.error('❌ [HealthRecords] Error fetching records:', error.response?.data || error.message);
           toast.error('Failed to fetch records: ' + (error.response?.data?.error || error.message));
         } finally {
           setLoading(false);
         }
       }, [user, authLoading]);

       useEffect(() => {
         fetchRecords();
       }, [fetchRecords]);

       const handleAddRecord = async (recordData) => {
         try {
           const token = localStorage.getItem('token');
           if (!token) {
             console.warn('⚠️ [HealthRecords] No token found in localStorage');
             toast.error('Please log in to add records');
             return;
           }
           console.log('📝 [HealthRecords] Adding record:', recordData);
           console.log('🔑 [HealthRecords] Using token:', token.substring(0, 10) + '...');
           const response = await axios.post('http://localhost:5000/api/health-records', recordData, {
             headers: { Authorization: `Bearer ${token}` },
           });
           console.log('✅ [HealthRecords] Record added:', response.data);
           toast.success('Health record added successfully!');
           await fetchRecords();
         } catch (error) {
           console.error('❌ [HealthRecords] Error adding record:', error.response?.data || error.message);
           toast.error('Failed to add record: ' + (error.response?.data?.error || error.message));
         }
       };

       const handleEditRecord = async (recordData) => {
         try {
           const token = localStorage.getItem('token');
           if (!token) {
             console.warn('⚠️ [HealthRecords] No token found in localStorage');
             toast.error('Please log in to edit records');
             return;
           }
           console.log('📝 [HealthRecords] Editing record:', recordData._id, recordData);
           console.log('🔑 [HealthRecords] Using token:', token.substring(0, 10) + '...');
           const response = await axios.put(`http://localhost:5000/api/health-records/${recordData._id}`, recordData, {
             headers: { Authorization: `Bearer ${token}` },
           });
           console.log('✅ [HealthRecords] Record updated:', response.data);
           toast.success('Health record updated successfully!');
           await fetchRecords();
         } catch (error) {
           console.error('❌ [HealthRecords] Error editing record:', error.response?.data || error.message);
           toast.error('Failed to edit record: ' + (error.response?.data?.error || error.message));
         }
       };

       const handleDeleteRecord = async (id) => {
         try {
           const token = localStorage.getItem('token');
           if (!token) {
             console.warn('⚠️ [HealthRecords] No token found in localStorage');
             toast.error('Please log in to delete records');
             return;
           }
           console.log('📝 [HealthRecords] Deleting record:', id);
           console.log('🔑 [HealthRecords] Using token:', token.substring(0, 10) + '...');
           await axios.delete(`http://localhost:5000/api/health-records/${id}`, {
             headers: { Authorization: `Bearer ${token}` },
           });
           console.log('✅ [HealthRecords] Record deleted:', id);
           toast.success('Health record deleted successfully!');
           await fetchRecords();
         } catch (error) {
           console.error('❌ [HealthRecords] Error deleting record:', error.response?.data || error.message);
           toast.error('Failed to delete record: ' + (error.response?.data?.error || error.message));
         }
       };

       const handleExportAll = () => {
         console.log('📝 [HealthRecords] Exporting all records');
         const dataStr = JSON.stringify(records, null, 2);
         const blob = new Blob([dataStr], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = 'health_records_all.json';
         link.click();
         URL.revokeObjectURL(url);
         console.log('✅ [HealthRecords] All records exported');
         toast.success('All records exported!');
       };

       const totalRecords = records.length;
       const thisMonthRecords = records.filter(
         (record) =>
           new Date(record.date).getMonth() === new Date().getMonth() &&
           new Date(record.date).getFullYear() === new Date().getFullYear()
       ).length;
       const doctors = [...new Set(records.map((record) => record.doctor).filter(Boolean))].length;
       const facilities = [...new Set(records.map((record) => record.hospital).filter(Boolean))].length;

       if (authLoading) {
         return (
           <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
             <p className="text-foreground">Loading...</p>
           </div>
         );
       }

       return (
         <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white text-foreground p-4">
           <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-center mb-4">
               <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
               <button
                 onClick={handleExportAll}
                 className="bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-4 rounded-lg flex items-center gap-2"
               >
                 <Download className="w-5 h-5" /> Export All
               </button>
             </div>
             <p className="text-muted-foreground mb-6">Manage your medical history securely</p>
             <FilterDropdown records={records} setFilteredRecords={setFilteredRecords} />
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 z-0">
               <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
                 <h3 className="text-sm font-medium text-muted-foreground">Total Records</h3>
                 <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
               </div>
               <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
                 <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
                 <p className="text-2xl font-bold text-foreground">{thisMonthRecords}</p>
               </div>
               <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
                 <h3 className="text-sm font-medium text-muted-foreground">Doctors</h3>
                 <p className="text-2xl font-bold text-foreground">{doctors}</p>
               </div>
               <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
                 <h3 className="text-sm font-medium text-muted-foreground">Facilities</h3>
                 <p className="text-2xl font-bold text-foreground">{facilities}</p>
               </div>
             </div>
             <button
               onClick={() => { setIsModalOpen(true); setEditRecord(null); }}
               className="mb-6 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg flex items-center gap-2"
             >
               <Plus className="w-5 h-5" /> Add Record
             </button>
             {loading ? (
               <p className="text-foreground">Loading...</p>
             ) : filteredRecords.length ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {filteredRecords.map((record) => (
                   <RecordCard
                     key={record._id}
                     record={record}
                     onEdit={() => setEditRecord(record)}
                     onDelete={() => handleDeleteRecord(record._id)}
                     onDownload={handleDownload}
                     getStatusColor={getStatusColor}
                   />
                 ))}
               </div>
             ) : (
               <div className="text-center text-muted-foreground">
                 <p>No records found</p>
                 <p className="mt-2">Get started by adding your first health record</p>
               </div>
             )}
             <AddRecordModal
               isOpen={isModalOpen}
               onClose={() => { setIsModalOpen(false); setEditRecord(null); }}
               onAdd={editRecord ? handleEditRecord : handleAddRecord}
               initialData={editRecord}
             />
           </div>
         </div>
       );
     };

     export default HealthRecords;