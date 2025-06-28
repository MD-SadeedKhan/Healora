import React, { useState, useEffect } from 'react';
     import toast from 'react-hot-toast';

     function AddRecordModal({ isOpen, onClose, onAdd, initialData }) {
       const [formData, setFormData] = useState({
         _id: '',
         title: '',
         date: '',
         doctor: '',
         type: '',
         notes: '',
       });

       useEffect(() => {
         if (initialData) {
           setFormData({
             _id: initialData._id || '',
             title: initialData.title || '',
             date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
             doctor: initialData.doctor || '',
             type: initialData.type || '',
             notes: initialData.notes || '',
           });
         }
       }, [initialData]);

       const handleChange = (e) => {
         const { name, value } = e.target;
         console.log(`📝 [AddRecordModal] Input changed: ${name} ${value}`);
         setFormData({ ...formData, [name]: value });
       };

       const handleSubmit = (e) => {
         e.preventDefault();
         console.log('📝 [AddRecordModal] Form submitted:', formData);
         onAdd(formData);
         console.log('📝 [AddRecordModal] Sending record to onAdd:', formData);
         setFormData({
           _id: '',
           title: '',
           date: '',
           doctor: '',
           type: '',
           notes: '',
         });
         console.log('✅ [AddRecordModal] Form cleared');
         toast.success(initialData ? 'Record updated!' : 'Record submitted!');
         onClose();
       };

       if (!isOpen) return null;

       return (
         <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
           <div className="bg-white p-6 rounded-lg max-w-md w-full">
             <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Health Record' : 'Add Health Record'}</h2>
             <form onSubmit={handleSubmit}>
               <div className="mb-4">
                 <label className="block text-sm font-medium">Title</label>
                 <input
                   name="title"
                   value={formData.title}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   placeholder="Title"
                   required
                 />
               </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium">Date</label>
                 <input
                   name="date"
                   type="date"
                   value={formData.date}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   required
                 />
               </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium">Doctor</label>
                 <input
                   name="doctor"
                   value={formData.doctor}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   placeholder="Doctor"
                   required
                 />
               </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium">Type</label>
                 <select
                   name="type"
                   value={formData.type}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   required
                 >
                   <option value="">Select Type</option>
                   <option value="checkup">Checkup</option>
                   <option value="lab-test">Lab Test</option>
                   <option value="prescription">Prescription</option>
                   <option value="imaging">Imaging</option>
                   <option value="surgery">Surgery</option>
                   <option value="emergency">Emergency</option>
                 </select>
               </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium">Notes</label>
                 <textarea
                   name="notes"
                   value={formData.notes}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   placeholder="Notes"
                 />
               </div>
               <div className="flex justify-end gap-2">
                 <button
                   type="submit"
                   className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded"
                 >
                   {initialData ? 'Update Record' : 'Add Record'}
                 </button>
                 <button
                   type="button"
                   onClick={onClose}
                   className="bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-4 rounded"
                 >
                   Cancel
                 </button>
               </div>
             </form>
           </div>
         </div>
       );
     }

     export default AddRecordModal;