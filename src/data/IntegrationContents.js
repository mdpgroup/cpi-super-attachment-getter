import { computed, observable } from "mobx";

export default class IntegrationContents {

    @observable Name = '';
    @observable Type = '';
    @observable LogEnd = '';

    @computed get toString() {
        return this.Name + ' ' + this.Type + ' ' + this.LogEnd + ' ';
    }

}

export const store = new IntegrationContents();