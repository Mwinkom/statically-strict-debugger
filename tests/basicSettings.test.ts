/**
 * @jest-environment jsdom
 */

import Light from '../src/basicSettings';

describe('Light Component (basicSettings.ts)', () => {
    let light: Light;

    beforeEach(() => {
        light = new Light();

        document.body.innerHTML = `
            <div class="rooms hall">
                <img class="background" />
                <div class="basic_settings_buttons">
                    <button class="light-switch">
                        <img data-lightOn="./assets/svgs/light_bulb_off.svg" src="./assets/svgs/light_bulb_off.svg">
                    </button>
                </div>
                <input type="range" id="light_intensity" value="0" min="0" max="10">
                <p>Hall</p>
            </div>
        `;
    });

    test('notification() should return correct HTML string', () => {
        const message = 'Light turned on';
        const html = light.notification(message);
        expect(html).toContain('<p>Light turned on</p>');
    });

    test('displayNotification() should render notification to container', () => {
        const container = document.createElement('div');
        light.displayNotification('Test Notification', 'beforeend', container);

        expect(container.innerHTML).toContain('Test Notification');
    });

    test('removeNotification() should remove element after timeout', () => {
        jest.useFakeTimers();

        const element = document.createElement('div');
        document.body.appendChild(element);

        light.removeNotification(element);
        expect(document.body.contains(element)).toBe(true);

        jest.advanceTimersByTime(5000);
        expect(document.body.contains(element)).toBe(false);

        jest.useRealTimers();
    });

    test('lightSwitchOn() should update light button attributes correctly', () => {
        const img = document.createElement('img');
        light.lightSwitchOn(img);

        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');
        expect(img.getAttribute('data-lightOn')).toBe('./assets/svgs/light_bulb_off.svg');
    });

    test('lightSwitchOff() should update light button attributes correctly', () => {
        const img = document.createElement('img');
        light.lightSwitchOff(img);

        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb_off.svg');
        expect(img.getAttribute('data-lightOn')).toBe('./assets/svgs/light_bulb.svg');
    });

    test('toggleLightSwitch() should turn light on and update slider', () => {
        const lightSwitchBtn = document.querySelector('.light-switch') as HTMLElement;
        const img = lightSwitchBtn.querySelector('img') as HTMLElement;

        light.toggleLightSwitch(lightSwitchBtn);

        const slider = document.getElementById('light_intensity') as HTMLInputElement;
        expect(slider.value).toBe('5');
        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');

        // Toggle off
        light.toggleLightSwitch(lightSwitchBtn);
        expect(slider.value).toBe('0');
        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb_off.svg');
    });

    test('handleLightIntensitySlider() should update light intensity and toggle light switch', () => {
        const slider = document.getElementById('light_intensity') as HTMLInputElement;
        slider.value = '7';

        light.handleLightIntensitySlider(slider, 7);

        const img = document.querySelector('.light-switch img') as HTMLElement;
        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');
    });

    test('sliderLight() should handle light on/off rendering correctly', () => {
        const lightSwitchBtn = document.querySelector('.light-switch') as HTMLElement;
        const img = lightSwitchBtn.querySelector('img') as HTMLElement;

        // Light ON
        light.sliderLight(true, lightSwitchBtn);
        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');

        // Light OFF
        light.sliderLight(false, lightSwitchBtn);
        expect(img.getAttribute('src')).toBe('./assets/svgs/light_bulb_off.svg');
    });
});
