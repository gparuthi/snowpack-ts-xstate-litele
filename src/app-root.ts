import { customElement, property, LitElement, html, css } from 'lit-element';
import { observable, action } from 'mobx';
import { MobxLitElement } from '@adobe/lit-mobx';


// create a mobx observable
class Counter {
  @observable
  public count = 0;

  @action
  public increment() {
    this.count++;
  }
}

const counter = new Counter();

// create instance that can be shared across components
@customElement('app-root')
export class AppRoot extends MobxLitElement {
  private counter = counter

  render() {
    return html`
      <div class="wrapper">
        
          Counter is ${this.counter.count}

            <br />
            <button @click=${this.incrementCount}>Add</button>
        
      </div>
    `;
  }
  public firstUpdated() {
    // you can update in first updated
    this.counter.increment(); // value is now 1
    console.log("here ", this.counter.count)
  }
  private incrementCount() {
    this.counter.increment();
    console.log("here2 ", this.counter.count)
    
  }
}
