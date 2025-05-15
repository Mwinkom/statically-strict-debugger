/**
 * @jest-environment jsdom
 */

import General from '../src/general';

describe('General Component', () => {
  let general: General;

  beforeEach(() => {
    general = new General();

    // Mock DOM structure for tests
    document.body.innerHTML = `
      <div class="rooms hall">
        <p>Hall</p>
      </div>
      <div class="rooms guest_room">
        <p>Guest Room</p>
      </div>
      <div class="corridor">
        <button class="light-switch"></button>
      </div>
      <div class="outside_lights">
        <button class="light-switch"></button>
      </div>
      <div class="hall">
        <button class="light-switch"></button>
      </div>
      <div class="notification-container"></div>
    `;
  });

  test('should get a component data correctly', () => {
    const hallComponent = general.getComponent('hall');
    expect(hallComponent.name).toBe('hall');
    expect(hallComponent.numOfLights).toBe(6);
  });

  test('should get wifi connections', () => {
    const wifiList = general.getWifi();
    expect(wifiList.length).toBeGreaterThan(0);
    expect(wifiList[0].wifiName).toBe('Inet service');
  });

  test('should get selected component name from element', () => {
    const element = document.querySelector('.rooms.hall p') as HTMLElement;
    const componentName = general.getSelectedComponentName(element);
    expect(componentName).toBe('hall');
  });

  test('should render HTML content inside container', () => {
    const container = document.querySelector('.notification-container') as HTMLElement;
    general.renderHTML('<div class="test-html">Hello</div>', 'beforeend', container);

    const rendered = container.querySelector('.test-html');
    expect(rendered).not.toBeNull();
    expect(rendered!.textContent).toBe('Hello');
  });

  test('should update text content of element', () => {
    const targetElement = document.createElement('p');
    general.updateMarkupValue(targetElement, 'Updated Text');
    expect(targetElement.textContent).toBe('Updated Text');
  });

  test('should toggle, add, and remove hidden class', () => {
    const element = document.createElement('div');
    general.addHidden(element);
    expect(element.classList.contains('hidden')).toBe(true);

    general.removeHidden(element);
    expect(element.classList.contains('hidden')).toBe(false);

    general.toggleHidden(element);
    expect(element.classList.contains('hidden')).toBe(true);
  });

  test('should handle light intensity filter style', () => {
    const element = document.createElement('div');
    general.handleLightIntensity(element, 0.5);
    expect(element.style.filter).toBe('brightness(0.5)');
  });

  test('should format text to class name', () => {
    const formatted = general.formatTextToClassName('guest room');
    expect(formatted).toBe('guest_room');
  });

  test('should find closest ancestor child element', () => {
    const child = document.querySelector('.rooms.hall p') as HTMLElement;
    const found = general.closestSelector(child, '.rooms', 'p');
    expect(found?.textContent?.toLowerCase()).toBe('hall');
  });

  test('should set component element correctly', () => {
    const roomData: { name: string; element?: HTMLElement } = { name: 'walkway & corridor' };
    general.setComponentElement(roomData);

    expect(roomData.element).not.toBeUndefined();
  });
});
