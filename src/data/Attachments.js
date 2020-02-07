import { observable } from 'mobx'

export default class Attachment {

    @observable Name = '';
    @observable Size = '';
    @observable ContentType = '';
    @observable Attachment_id='';
}

export const store = new Attachment();