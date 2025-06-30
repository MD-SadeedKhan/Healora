import React from 'react';
import { Trash, Edit, Download } from 'lucide-react';

const RecordCard = ({ record, onEdit, onDelete, onDownload }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-2">
        <h2 className="text-lg font-bold">{record?.title || 'Health Record'}</h2>
        <p className="text-sm text-muted-foreground">{record?.date}</p>
      </div>
      <p className="text-sm text-gray-700">{record?.description}</p>
      <div className="mt-4 flex justify-between">
        <button onClick={onEdit} className="text-blue-500 hover:underline flex items-center gap-1">
          <Edit size={16} /> Edit
        </button>
        <button onClick={onDelete} className="text-red-500 hover:underline flex items-center gap-1">
          <Trash size={16} /> Delete
        </button>
        <button onClick={() => onDownload(record)} className="text-green-500 hover:underline flex items-center gap-1">
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
};

export default RecordCard;
