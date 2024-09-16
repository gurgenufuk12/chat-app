class Channel {
  constructor(channelName, messages = [], users = []) {
    this.channelName = channelName;
    this.messages = messages;
    this.users = users;
  }
}
