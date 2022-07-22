export interface iMessage{
    _id?: string,
    sender: string,
    recipients: string[],
    content: string,
    createdAt?: string,
    updatedAt?: string,
    seen?: boolean,
    seenBy: string[]
  }