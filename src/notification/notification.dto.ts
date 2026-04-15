import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotificationPayload {
  @IsEmail()
  to: string;

  @IsEmail()
  from: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  html?: string;
}

export class PublishNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
