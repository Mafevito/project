const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    //info publicacion + info empresa
    emailOrder: {
        type: String,
        default: ''
    },
    tittleOrder: {
        type: String,
        default: ''
    },
    descriptionOrder: {
        type: String,
        default: ''
    },
    nameCompany: {
        type: String,
        default: ''
    },
    webCompany: {
        type: String,
        default: ''
    },
    socialCompany: {
        type: String,
        default: ''
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;