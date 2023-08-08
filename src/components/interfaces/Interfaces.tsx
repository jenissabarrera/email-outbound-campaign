export interface ICampaign {
  id: string;
  name: string;
  division: { id: string };
  contactList: { id: string };
  emailConfig: {
    emailColumns: { columnName: string; emailAddress: string }[];
    contentTemplate: { id: string };
    fromAddress: string;
  };
  version: number;
}

export interface IModalContent {
  title: string;
  message: string;
}

export interface IDefaultEmail {
  subject: string;
  message: string;
}

export interface Email {
  id: string;
  subject: string;
  recipient: string;
  status: string;
  deliveryDate: string;
}
