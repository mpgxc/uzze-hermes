export abstract class QueueProvider {
  abstract publishMessage<Message extends object>(body: Message): Promise<void>;
}
