import { observable } from 'mobx'

export default class Data {

    @observable username = '';
    @observable password = '';
    @observable URL = '';
    @observable login=false;
    @observable Port="/api";
    @observable integrationContents = [];
}

export const store = new Data();