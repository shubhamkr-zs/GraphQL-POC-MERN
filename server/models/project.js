const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    description: {
        type:String
    },
    status: {
        type:String,
        enum:['todo', 'inProgress', 'Completed']
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('Project', ProjectSchema)