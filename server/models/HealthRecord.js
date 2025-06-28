const mongoose = require('mongoose');

     const healthRecordSchema = new mongoose.Schema({
       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
       title: { type: String, required: true },
       date: { type: Date, required: true },
       doctor: { type: String, required: true },
       type: { type: String, required: true },
       notes: { type: String },
       createdAt: { type: Date, default: Date.now },
       updatedAt: { type: Date, default: Date.now },
     });

     module.exports = mongoose.model('HealthRecord', healthRecordSchema);