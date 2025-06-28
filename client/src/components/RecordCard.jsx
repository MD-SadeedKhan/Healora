 import React from 'react';
     import { Download, Edit, Trash2 } from 'lucide-react';

     function RecordCard({ record, onEdit, onDelete, onDownload }) {
       return (
         <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
           <h3 className="text-lg font-bold">{record.title}</h3>
           <p className="text-sm text-muted-foreground">
             Date: {new Date(record.date).toLocaleDateString()}
           </p>
           <p className="text-sm">Doctor: {record.doctor}</p>
           <p className="text-sm">Type: {record.type}</p>
           <p className="text-sm">Notes: {record.notes || 'None'}</p>
           <div className="flex gap-2 mt-2">
             <button
               onClick={() => onEdit(record)}
               className="text-blue-500 hover:text-blue-700"
               title="Edit"
             >
               <Edit className="w-5 h-5" />
             </button>
             <button
               onClick={() => onDelete(record._id)}
               className="text-red-500 hover:text-red-700"
               title="Delete"
             >
               <Trash2 className="w-5 h-5" />
             </button>
             <button
               onClick={() => onDownload(record)}
               className="text-green-500 hover:text-green-700"
               title="Download"
             >
               <Download className="w-5 h-5" />
             </button>
           </div>
         </div>
       );
     }

     export default RecordCard;