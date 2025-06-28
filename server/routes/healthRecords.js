 const express = require('express');
     const router = express.Router();
     const HealthRecord = require('../models/HealthRecord');
     const authMiddleware = require('../middleware/auth');

     // GET /api/health-records
     router.get('/', authMiddleware, async (req, res) => {
       try {
         console.log('📝 [API] Fetching health records for user:', req.user.id);
         const records = await HealthRecord.find({ userId: req.user.id }).sort({ date: -1 });
         console.log('✅ [API] Health records fetched:', records.length, 'records');
         res.json(records);
       } catch (error) {
         console.error('❌ [API] Health records fetch error:', error.message, error.stack);
         res.status(500).json({ error: 'Failed to fetch health records', details: error.message });
       }
     });

     // POST /api/health-records
     router.post('/', authMiddleware, async (req, res) => {
       try {
         console.log('📝 [API] Adding health record for user:', req.user.id, 'data:', req.body);
         const { title, date, doctor, type, notes } = req.body;
         if (!title || !date || !doctor || !type) {
           console.warn('⚠️ [API] Missing required fields:', { title, date, doctor, type });
           return res.status(400).json({ error: 'Title, date, doctor, and type are required' });
         }
         const parsedDate = new Date(date);
         if (isNaN(parsedDate.getTime())) {
           console.warn('⚠️ [API] Invalid date format:', date);
           return res.status(400).json({ error: 'Invalid date format, use YYYY-MM-DD' });
         }
         const validTypes = ['checkup', 'lab-test', 'prescription', 'imaging', 'surgery', 'emergency'];
         if (!validTypes.includes(type)) {
           console.warn('⚠️ [API] Invalid type:', type);
           return res.status(400).json({ error: 'Invalid type, must be one of: ' + validTypes.join(', ') });
         }
         const record = new HealthRecord({
           userId: req.user.id,
           title,
           date: parsedDate,
           doctor,
           type,
           notes: notes || '',
         });
         await record.save();
         console.log('✅ [API] Health record added:', record._id, record.title);
         res.status(201).json(record);
       } catch (error) {
         console.error('❌ [API] Add health record error:', error.message, error.stack);
         res.status(400).json({ error: 'Failed to add health record', details: error.message });
       }
     });

     // PUT /api/health-records/:id
     router.put('/:id', authMiddleware, async (req, res) => {
       try {
         console.log('📝 [API] Updating health record:', req.params.id, 'data:', req.body);
         const record = await HealthRecord.findOne({ _id: req.params.id, userId: req.user.id });
         if (!record) {
           console.warn('⚠️ [API] Record not found for user:', req.user.id, 'id:', req.params.id);
           return res.status(404).json({ error: 'Record not found' });
         }
         const { title, date, doctor, type, notes } = req.body;
         if (!title || !date || !doctor || !type) {
           console.warn('⚠️ [API] Missing required fields:', { title, date, doctor, type });
           return res.status(400).json({ error: 'Title, date, doctor, and type are required' });
         }
         const parsedDate = new Date(date);
         if (isNaN(parsedDate.getTime())) {
           console.warn('⚠️ [API] Invalid date format:', date);
           return res.status(400).json({ error: 'Invalid date format, use YYYY-MM-DD' });
         }
         const validTypes = ['checkup', 'lab-test', 'prescription', 'imaging', 'surgery', 'emergency'];
         if (!validTypes.includes(type)) {
           console.warn('⚠️ [API] Invalid type:', type);
           return res.status(400).json({ error: 'Invalid type, must be one of: ' + validTypes.join(', ') });
         }
         record.title = title;
         record.date = parsedDate;
         record.doctor = doctor;
         record.type = type;
         record.notes = notes || '';
         record.updatedAt = Date.now();
         await record.save();
         console.log('✅ [API] Health record updated:', record._id, record.title);
         res.json(record);
       } catch (error) {
         console.error('❌ [API] Update health record error:', error.message, error.stack);
         res.status(400).json({ error: 'Failed to update health record', details: error.message });
       }
     });

     // DELETE /api/health-records/:id
     router.delete('/:id', authMiddleware, async (req, res) => {
       try {
         console.log('📝 [API] Deleting health record:', req.params.id);
         const record = await HealthRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
         if (!record) {
           console.warn('⚠️ [API] Record not found for user:', req.user.id, 'id:', req.params.id);
           return res.status(404).json({ error: 'Record not found' });
         }
         console.log('✅ [API] Health record deleted:', req.params.id);
         res.json({ message: 'Health record deleted' });
       } catch (error) {
         console.error('❌ [API] Delete health record error:', error.message, error.stack);
         res.status(500).json({ error: 'Failed to delete health record', details: error.message });
       }
     });

     module.exports = router;