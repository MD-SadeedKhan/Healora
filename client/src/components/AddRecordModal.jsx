import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function AddRecordModal({ isOpen, onClose, onAdd, initialData }) {
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    date: "",
    doctor: "",
    type: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || "",
        title: initialData.title || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : "",
        doctor: initialData.doctor || "",
        type: initialData.type || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 [AddRecordModal] Input changed: ${name} = ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 [AddRecordModal] Form submitted:", formData);

    if (
      !formData.title ||
      !formData.date ||
      !formData.doctor ||
      !formData.type
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (typeof onAdd === "function") {
      onAdd(formData);
      console.log("📝 [AddRecordModal] Sending record to onAdd:", formData);
      toast.success(initialData ? "Record updated!" : "Record submitted!");
    } else {
      console.warn("⚠️ [AddRecordModal] onAdd is not a function");
      toast.error("Failed to submit record. Please try again later.");
      return;
    }

    setFormData({
      _id: "",
      title: "",
      date: "",
      doctor: "",
      type: "",
      notes: "",
    });

    console.log("✅ [AddRecordModal] Form cleared");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full sm:p-6 sm:max-w-md">
        <h2 className="text-lg font-bold text-foreground mb-4 sm:text-xl font-['Manrope',sans-serif]">
          {initialData ? "Edit Health Record" : "Add Health Record"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter title"
              required
              aria-label="Record title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Date
            </label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              required
              aria-label="Record date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Doctor
            </label>
            <input
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter doctor name"
              required
              aria-label="Doctor name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              required
              aria-label="Record type"
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
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter notes (optional)"
              rows="4"
              aria-label="Record notes"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200 sm:px-4"
              aria-label={
                initialData ? "Update health record" : "Add health record"
              }
            >
              {initialData ? "Update Record" : "Add Record"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-3 rounded-lg transition-all duration-200 sm:px-4"
              aria-label="Cancel"
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
