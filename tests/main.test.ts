/**
 * @jest-environment jsdom
 */

import { initializeApp } from '../src/main';
import Light from '../src/basicSettings';
import AdvanceSettings from '../src/advanceSettings';

jest.mock('../src/basicSettings');
jest.mock('../src/advanceSettings');

describe('Main.ts App UI Interactions', () => {
    let lightControllerMock: jest.Mocked<Light>;
    let advancedSettingsMock: jest.Mocked<AdvanceSettings>;

    beforeEach(() => {
        // Mock DOM structure
        document.body.innerHTML = `
            <main></main>
            <button class="entry_point">Start</button>
            <nav class="hidden"></nav>
            <section class="application_container hidden">
                <div class="rooms hall">
                    <div class="basic_settings_buttons">
                        <button class="light-switch">
                            <img src="./assets/svgs/light_bulb_off.svg">
                        </button>
                        <button class="advance-settings_modal">Advanced</button>
                    </div>
                    <input type="range" id="light_intensity" value="0">
                    <p>hall</p>
                </div>
            </section>
            <section class="advanced_features_container hidden">
                <button class="close-btn"></button>
                <button class="customization-btn"></button>
                <button class="defaultOn-okay"></button>
                <button class="defaultOff-okay"></button>
                <button class="defaultOn-cancel">Cancel</button>
            </section>
            <div class="loader-container hidden"></div>
        `;

        lightControllerMock = new Light() as jest.Mocked<Light>;
        advancedSettingsMock = new AdvanceSettings() as jest.Mocked<AdvanceSettings>;

        initializeApp(lightControllerMock, advancedSettingsMock);
    });

    test('should hide homepage and show loader/nav/main container on entry click', () => {
        const homepageBtn = document.querySelector('.entry_point')!;
        const homepage = document.querySelector('main')!;
        const loader = document.querySelector('.loader-container')!;
        const mainContainer = document.querySelector('.application_container')!;
        const nav = document.querySelector('nav')!;

        jest.useFakeTimers();

        homepageBtn.dispatchEvent(new Event('click', { bubbles: true }));

        expect(lightControllerMock.addHidden).toHaveBeenCalledWith(homepage);
        expect(lightControllerMock.removeHidden).toHaveBeenCalledWith(loader);

        jest.advanceTimersByTime(1000);

        expect(lightControllerMock.removeHidden).toHaveBeenCalledWith(mainContainer);
        expect(lightControllerMock.removeHidden).toHaveBeenCalledWith(nav);

        jest.useRealTimers();
    });

    test('should toggle light switch when clicked', () => {
        const lightSwitch = document.querySelector('.light-switch')!;
        lightSwitch.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(lightControllerMock.toggleLightSwitch).toHaveBeenCalledWith(lightSwitch);
    });


    test('should open advance settings modal when button clicked', () => {
        const advanceModalBtn = document.querySelector('.advance-settings_modal')!;
        advanceModalBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(advancedSettingsMock.modalPopUp).toHaveBeenCalledWith(advanceModalBtn);
    });

    test('should update light intensity when slider changes', () => {
        const slider = document.getElementById('light_intensity') as HTMLInputElement;
        slider.value = '7';
        slider.dispatchEvent(new Event('change', { bubbles: true }));

        expect(lightControllerMock.handleLightIntensitySlider).toHaveBeenCalledWith(slider, 7);
    });

    test('should handle advance settings modal buttons correctly', () => {
        const closeBtn = document.querySelector('.close-btn')!;
        closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(advancedSettingsMock.closeModalPopUp).toHaveBeenCalled();

        const customizeBtn = document.querySelector('.customization-btn')!;
        customizeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(advancedSettingsMock.displayCustomization).toHaveBeenCalledWith(customizeBtn);

        const onOkayBtn = document.querySelector('.defaultOn-okay')!;
        onOkayBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(advancedSettingsMock.customizeAutomaticOnPreset).toHaveBeenCalledWith(onOkayBtn);

        const offOkayBtn = document.querySelector('.defaultOff-okay')!;
        offOkayBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(advancedSettingsMock.customizeAutomaticOffPreset).toHaveBeenCalledWith(offOkayBtn);

        const cancelBtn = document.querySelector('.defaultOn-cancel')!;
        cancelBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(advancedSettingsMock.customizationCancelled).toHaveBeenCalledWith(cancelBtn, '.defaultOn');
    });
});
