const mongoose = require('mongoose');

const EntrySchema = mongoose.Schema({
    activity: {type: String,
               default: null},
    date: {type: Date,
           required: true},
    active_time: {type: Number,
                  required: true},
    break_time: {type: Number,
                 required: true}
});

const HistorySchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true     
    },
    entries: {
        type: [EntrySchema]
    }
});

module.exports = mongoose.model('History', HistorySchema);