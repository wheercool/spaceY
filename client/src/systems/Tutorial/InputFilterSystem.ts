import { System } from '../System';
import { EntityRegistry } from '../../entities/EntityRegistry';
import { Key } from '../../services/key';
import { InputComponent } from '../../components/InputComponent';

export class InputFilterSystem implements System {
  constructor(private allowedKeys: Key[]) {

  }

  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    registry.findEntitiesByComponents(['input'])
      .forEach(inputEntity => {
        const pressed = pressedKeys(inputEntity.input);
        const filtered = pressed.filter(key => this.allowedKeys.includes(key));
        inputEntity.input = keysToInput(filtered);
      })
  }
}

function pressedKeys(input: InputComponent): Key[] {
  const result: Key[] = []
  if (input.left) {
    result.push(Key.ARROW_LEFT);
  }
  if (input.right) {
    result.push(Key.ARROW_RIGHT)
  }
  if (input.top) {
    result.push(Key.ARROW_UP)
  }
  if (input.bottom) {
    result.push(Key.ARROW_DOWN)
  }
  if (input.q) {
    result.push(Key.Q)
  }
  if (input.w) {
    result.push(Key.W)
  }
  if (input.e) {
    result.push(Key.E)
  }
  if (input.r) {
    result.push(Key.R)
  }
  if (input.t) {
    result.push(Key.T);
  }
  return result;
}

function keysToInput(keys: Key[]): InputComponent {
  return {
    left: keys.includes(Key.ARROW_LEFT),
    right: keys.includes(Key.ARROW_RIGHT),
    top: keys.includes(Key.ARROW_UP),
    bottom: keys.includes(Key.ARROW_DOWN),
    q: keys.includes(Key.Q),
    w: keys.includes(Key.W),
    e: keys.includes(Key.E),
    r: keys.includes(Key.R),
    t: keys.includes(Key.R),
  }
}