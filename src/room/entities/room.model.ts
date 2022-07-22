import { Schema, SchemaTypes } from "mongoose";
import { iMessage } from "src/message/messageInterface";

export const roomSchema = new Schema({
  name: {type: SchemaTypes.String, unique: true},
  owner: {type: SchemaTypes.String, unique: false},
  users: [{type: SchemaTypes.ObjectId, ref: 'User', required: true}],
  messages: [{type: SchemaTypes.Mixed, default: []}],
  image: {type: SchemaTypes.String, default: null},
  createdAt: {type: SchemaTypes.String, default: JSON.stringify(new Date())},
  type: {type: SchemaTypes.String, required: true},
});

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
      delete returnedObject.__v;
  },
});

export interface iRoom {
  _id?: string;
  name?: string;
  owner: string;
  users: string[];
  messages?: iMessage[];
  image?: string;
  createdAt?: string;
  type?: string;
}