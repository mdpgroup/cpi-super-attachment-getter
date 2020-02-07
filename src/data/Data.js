import { observable } from 'mobx'

export default class Data {

    @observable username = '';
    @observable password = '';
    @observable URL = '';
    @observable login=false;
    @observable Port="http://localhost:3000";
    @observable integrationContents = [];
}

export const store = new Data();