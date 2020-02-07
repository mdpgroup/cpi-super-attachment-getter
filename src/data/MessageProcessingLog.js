import { observable } from "mobx";

export default class MessageProcessingLog {

    @observable Name = '';
    @observable Type = '';
    @observable LogStart = '';
    @observable LogEnd = '';
    @observable Status = '';
    @observable Guid = '';
}

export const store = new MessageProcessingLog();