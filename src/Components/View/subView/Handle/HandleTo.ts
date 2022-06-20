import { SubViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';
import { handleTarget, handleTypes } from '../../../../Types/SubViewEvents/HandleTypes';

class HandleTo extends SubViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement

  componentNode!: HTMLElement

  target: handleTarget = 'handle'

  type: handleTypes = 'to'

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }

  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jqsHandle');
    this.sliderNode.appendChild(element);
    this.componentNode = element;
    this.isMounted = true;
    this.setListeners();
  }

  destroyComponent() {
    this.removeListeners();
    this.componentNode.remove();
    this.isMounted = false;
  }

  removeListeners() {
    this.componentNode.removeEventListener('pointerdown', this.onClick);
  }

  setListeners() {
    this.onClick = this.onClick.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.componentNode.addEventListener('pointerdown', this.onClick);
  }

  update(state: viewSliderState) {
    const {
      horizontal, to, isRange, invert, handleSplit,
    } = state;
    const currentStartPosition = horizontal ? 'left' : 'top';
    const oppositeStartPosition = horizontal ? 'top' : 'left';
    const valueWithInvert = invert ? 100 - to.percent : to.percent;

    if (this.MemoState('range', [isRange])) {
      if (!isRange && this.isMounted) { this.destroyComponent(); }
      if (isRange && !this.isMounted) { this.createComponent(); }
    }

    if (this.MemoState('move', [to, horizontal, isRange, invert, handleSplit])) {
      this.componentNode.style[currentStartPosition] = `${valueWithInvert}%`;
      this.componentNode.style[oppositeStartPosition] = '';
    }

    if (this.MemoState('classModifiers', [to.pressedLast, to.movingNow, horizontal, isRange])) {
      this.componentNode.classList.toggle('jqsHandle--pressedLast', to.pressedLast);
      this.componentNode.classList.toggle('jqsHandle--handled', to.movingNow);
      this.componentNode.classList.toggle('jqsHandle--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsHandle--vertical', !horizontal);
    }
  }

  onClick(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      action: 'click',
      value: {
        x: event.clientX,
        y: event.clientY,
        total: false,
      },
    });
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerup', this.onDrop);
  }

  onMove(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      action: 'move',
      value: {
        x: event.clientX,
        y: event.clientY,
        total: false,
      },
    });
  }

  onDrop(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      action: 'drop',
      value: {
        x: event.clientX,
        y: event.clientY,
        total: false,
      },
    });
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onDrop);
  }
}

export { HandleTo };
