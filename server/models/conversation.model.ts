import * as mongoose from 'mongoose';
import { mongoSetup } from '../_config/config';
import { conversationSchema } from '../schemas/conversation.schema';
import { IConversation } from '../interfaces/conversation.interface';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const ConversationModel: mongoose.Model<IConversation> = mongoose.model<IConversation>(
  'Conversations',
  conversationSchema,
);
