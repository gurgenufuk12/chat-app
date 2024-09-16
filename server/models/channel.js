class Channel {
  constructor(owner, channelName, rooms = [], messages = [], users = []) {
    this.owner = owner;
    this.channelName = channelName;
    this.rooms = rooms;
    this.messages = messages;
    this.users = users;
  }
}
