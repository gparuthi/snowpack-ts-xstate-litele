import { customElement, property, LitElement, html, css } from 'lit-element';
import { Machine, interpret, assign, createMachine, Interpreter, StateMachine } from 'xstate';
import { XstateLitElement } from './xstate-lit-element';

interface CounterContext {
  count: number;
}

type CounterEvent = 
  | {type: "INC"}
  | {type: "DEC"}


interface CounterStateSchema {
    states:{
      inc : {},
    }
  }

const isNotMax = (context: CounterContext) => context.count < 10;
const isNotMin = (context: CounterContext) => context.count >= 0;

const countMachine = Machine<CounterContext, CounterStateSchema, CounterEvent>({
  initial: 'inc',
  context: { count: 0 },
  states: {
    inc: {
      entry: 'increment',
      on: {
        INC: { 
          actions: ['increment'],
          cond: isNotMax
        },
        DEC: {
          actions: ['decrement'],
          cond: isNotMax
        },
      }
    }
  }
},{
  actions: {
    increment: assign({ count: context => context.count + 1 }),
    decrement: assign({ count: context => context.count - 1 })
  }
});

// create instance that can be shared across components
@customElement('app-root')
export class AppRoot extends XstateLitElement<CounterContext> {
  @property() message = 'Learn LitElement';

  constructor() {
    super(countMachine)
  }
  static get styles() {
    return css`
      h1 {
        font-size: 4rem;
      }
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: #2196f3;
        background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        font-size: 24px;
      }
      .link {
        color: white;
      }
    `;
  }
  render() {

    return html`
      <div class="wrapper">
        
          hi ${this.context.count} 
            <br />
            <button @click=${this.increment}>increment</button>
            <button @click=${this.decrement}>decrementx</button>        
      </div>
    `;
  }
  private increment() {
    this.service.send('INC')
  }
  private decrement() {
    this.service.send('DEC')
  }
}