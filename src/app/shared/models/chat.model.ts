export interface IChatPreview {
  id: number;
  name: string;
  assistant: boolean;
  lastMessage: string;
  lastView: string;
}

export interface IChat {
  clientName: string;
  clientId: string;
  assistant: boolean;
  conversation: IConversation[];
}

export interface IConversation {
  idClient: number;
  name: string;
  message: string;
  type: string;
}
