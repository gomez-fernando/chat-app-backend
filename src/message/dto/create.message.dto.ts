export class CreateMessageDto{
  sender: string;
  recipients: string[];
  content: string;
  seenBy: string[]
}