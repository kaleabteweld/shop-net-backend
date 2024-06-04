import mongoose from 'mongoose';
import { mongooseErrorPlugin } from '../Middleware/errors.middleware';
import { EStatus, IUser, IUserMethods, UserModel } from './user.type';
import { checkPassword, encryptPassword, getUserByEmail, getUserById, removeByID, setStatus, update, validator } from './user.extended';

export const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    phone_number: { type: String },
    status: {
        type: String,
        enum: Object.values(EStatus),
        default: 'active'
    },

    postedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    notifications: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },

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
        getUserByEmail,
        getUserById,
        removeByID,
        update,
        setStatus,
    },
    methods: {
        encryptPassword,
        checkPassword,
    }
});

userSchema.virtual('full_name').get(function () {
    return `${this.first_name || ''} ${this.last_name || ''}`;
});

userSchema.plugin<any>(mongooseErrorPlugin);

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
