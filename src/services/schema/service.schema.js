const { Schema } = require("mongoose")


const serviceSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "admin" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    internet: { type: String },
    localM: { type: String },
    groupM: { type: String },
    noSms: { type: String },
    ofSms: { type: String },
    validity: { type: Number },
    status: {
        type: String,
        enum: ["valid", "expired", "pending"],
        required: true
    },
    category: {
        type: String,
        enum: ["bPostpaid", "dPostpaid", "dPrepaid", "bulkSmsB", "businessAdd",
            "roamingAdd", "fiberNet", "iServices", "advVoiceServices", "localConnect", "advancedConnect",
            "smartEdge", "iotSolutions", "hosting", "networkSecurity", "businessContSolutions", "fVoice"
        ],
        required: true
    }

}, { timestamps: true })


module.exports = serviceSchema