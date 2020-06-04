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
      growing : {},
      shrinking : {}
    }
  }
const D = 0.01, MAX_R = Math.PI, _TSTEP = 20

const isNotMax = (context: CounterContext) => context.count < MAX_R;
const isNotMin = (context: CounterContext) => context.count > 0;

const countMachine = Machine<CounterContext, CounterStateSchema, CounterEvent>({
  initial: 'growing',
  context: { count: 0 },
  states: {
    growing: {
      after: {
        20: [
          {target: 'growing', cond: isNotMax },
          {target: 'shrinking'}
        ]
      },
      entry: 'increment'
    },
    shrinking: {
      after: {
        20: [
          { target: 'shrinking', cond: isNotMin },
          { target: 'growing' }
        ]
      },
      entry: 'decrement'
    }
  }
},{
  actions: {
    increment: assign({ count: context => context.count + D }),
    decrement: assign({ count: context => context.count - D })
  }
});
var sun = new Image();

function convertRange(value: number, r1: Array<number>, r2: Array<number>) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame 

// create instance that can be shared across components
@customElement('app-root')
export class AppRoot extends XstateLitElement<CounterContext> {
  @property() message = 'Learn LitElement';

  async performUpdate() {
    await new Promise((resolve) => setTimeout(resolve));
    super.performUpdate();
  }

  constructor() {
    super(countMachine)
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    
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
        background-color: #000000;
        // background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        font-size: 24px;
      }
      .link {
        color: white;
      }
    `;
  }
  render() {
    window.requestAnimationFrame(this.draw.bind(this))
    return html`
      <div class="wrapper">
        
          <canvas id="draw" width="500" height="300"></canvas>
      </div>
    `;
  }
  
 firstUpdated(){
  
  // console.log(this.context.count)
  //  this.draw()

  }

  draw() {
    if (this.shadowRoot!.getElementById('draw')){
      var cnv = <HTMLCanvasElement>this.shadowRoot!.getElementById('draw')

      var ctx = <CanvasRenderingContext2D>cnv.getContext('2d');
      var radius = convertRange(Math.cos(this.context.count), [0, 1], [50, 100])

      // ctx.globalCompositeOperation = 'destination-over';
      ctx.clearRect(0, 0, 500, 500); // clear canvas

      ctx.fillStyle = "#000000";
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.save();
      ctx.translate(150, 150);

      ctx.restore();

      ctx.beginPath();
      ctx.arc(150, 150, 50+radius, 0, Math.PI * 2, false); // Earth orbit
      ctx.stroke();
    }
    
  }

  private increment() {
    this.service.send('INC')
  }
  private decrement() {
    this.service.send('DEC')
  }
}