import mongoose from 'mongoose';
import { mongooseErrorPlugin } from '../Middleware/errors.middleware';
import { checkPassword, encryptPassword, getByEmail, getById, removeByID, update, validator } from './admin.extended';
import { EStatus, IAdmin, IAdminMethods, IAdminModel } from './admin.type';

export const adminSchema = new mongoose.Schema<IAdmin, IAdminModel, IAdminMethods>({

    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String },
    phone_number: { type: String },
    status: {
        type: String,
        enum: Object.values(EStatus),
        default: 'active'
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret['password'];
            return ret;
        }
    },
    statics: {
        validator,
        getByEmail,
        getById,
        removeByID,
        update,
    },
    methods: {
        encryptPassword,
        checkPassword,
    },
    query: {
        withActiveStatus: function () {
            return this.where({ status: EStatus.active });
        }
    }
});

adminSchema.plugin<any>(mongooseErrorPlugin);

const AdminModel = mongoose.model<IAdmin, IAdminModel>('admin', adminSchema);

export default AdminModel;
