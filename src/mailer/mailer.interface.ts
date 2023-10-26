export type MailerData = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export abstract class MailerProvider {
  abstract sendMail(props: MailerData): Promise<void>;
}
