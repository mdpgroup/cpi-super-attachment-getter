import { observable } from 'mobx'

export default class RunStep {

    @observable ChildCount = '';
    @observable StepStop = '';
    @observable Activity = '';
    @observable Error='';
    @observable Status="";

}

export const store = new RunStep();