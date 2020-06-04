import { LitElement, property } from "lit-element"
import { StateMachine, Interpreter, interpret } from "xstate"

export class XstateLitElement<T> extends LitElement {
    @property() machine: StateMachine<any, any, any>
    @property() service: Interpreter<any>
    @property() context: T
    @property() state: any

    constructor(machine: StateMachine<any, any, any>) {
        super()

        this.machine = machine
        this.context = machine.context as T
        this.service = interpret(machine).onTransition(state => {
            this.requestUpdate()
            this.state = state
            this.context = state.context
        });
        this.service.start()
    }
}