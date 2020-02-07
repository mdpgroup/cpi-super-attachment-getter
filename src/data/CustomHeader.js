import { observable } from 'mobx'

export default class CustomHeader {

    @observable Name = '';
    @observable Text = '';
}

export const store = new CustomHeader();