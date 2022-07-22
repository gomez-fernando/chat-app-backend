import { Schema, SchemaTypes, Types } from 'mongoose';

const isEmail = (email: string) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'Provided email is not valid.'],
    unique: true,
  },
  password: { type: SchemaTypes.String, minlength: 6, required: true },
  name: { type: SchemaTypes.String, required: true },
  surname: { type: SchemaTypes.String, required: true },
  nickname: { type: SchemaTypes.String, required: true, unique: true },
  avatar: { type: SchemaTypes.String, default: 'https://firebasestorage.googleapis.com/v0/b/chat-app-9ab62.appspot.com/o/files%2Fuser-default.png?alt=media&token=613b19e5-4647-46c3-b342-afe19e9f3a78' },
  createdAt: { type: SchemaTypes.Date, default: new Date()},
  updatedAt: { type: SchemaTypes.Date, default: null },
  online: { type: SchemaTypes.Boolean, default: false },
  onConversation: { type: SchemaTypes.String, default: null }, // TODO chnage for room id
  rooms: [{type: SchemaTypes.ObjectId, ref: 'Room', default: []}],

});
// TOSO set date of update when update user

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
      delete returnedObject.password;
      delete returnedObject.__v;
  },
});

export interface iUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  surname: string;
  nickname: string;
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date; 
  online?: boolean;
  onConversation?: string; // TODO chnage for room id
  rooms: Types.ObjectId[];
}
