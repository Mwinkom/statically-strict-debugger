'use strict';

// Elements Declarations
const homepageButton = document.querySelector('.entry_point') as HTMLElement;
const homepage = document.querySelector('main') as HTMLElement;
const mainRoomsContainer = document.querySelector('.application_container') as HTMLElement;
const advanceFeaturesContainer = document.querySelector('.advanced_features_container') as HTMLElement;
const nav = document.querySelector('nav') as HTMLElement;
const loader = document.querySelector('.loader-container') as HTMLElement;
// Imports
import Light from './basicSettings.js';
import AdvanceSettings from './advanceSettings.js';

// Object Creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// Global Variables
let selectedComponent: any;
let isWifiActive: boolean = true;

// Event Handlers

// Hide homepage after button is clicked
homepageButton?.addEventListener('click', function (e: Event): void {
    if (!homepage || !loader || !mainRoomsContainer || !nav) return;

    lightController.addHidden(homepage);
    lightController.removeHidden(loader);

    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 1000);
});

// Main container click events
mainRoomsContainer?.addEventListener('click', (e: Event): void => {
    const selectedElement = e.target as HTMLElement;

    // when click occurs on light switch
    if (selectedElement.closest(".light-switch")) {
        const lightSwitch = selectedElement.closest(".basic_settings_buttons")?.firstElementChild as HTMLElement ;
        if (lightSwitch) {
            lightController.toggleLightSwitch(lightSwitch);
        }
        return;
    }

    // when click occurs on advance modal
    if (selectedElement.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal') as HTMLElement ;
        if (advancedSettingsBtn) {
            advancedSettings.modalPopUp(advancedSettingsBtn);
        }
    }
});

// Light intensity slider change
mainRoomsContainer?.addEventListener('change', (e: Event): void => {
    const slider = e.target as HTMLInputElement;
    const value = Number(slider.value);

    if (!isNaN(value)) {
        lightController.handleLightIntensitySlider(slider, value);
    }
});

// Advance Settings modal interactions
advanceFeaturesContainer?.addEventListener('click', (e: Event): void => {
    const selectedElement = e.target as HTMLElement;

    if (selectedElement.closest('.close-btn')) {
        advancedSettings.closeModalPopUp();
    }

    // Display customization markup
    if (selectedElement.closest('.customization-btn')) {
        advancedSettings.displayCustomization(selectedElement);
    }

    // Set light on time customization
    if (selectedElement.matches('.defaultOn-okay')) {
        advancedSettings.customizeAutomaticOnPreset(selectedElement);
    }

    // Set light off time customization
    if (selectedElement.matches('.defaultOff-okay')) {
        advancedSettings.customizeAutomaticOffPreset(selectedElement);
    }

    // Cancel light time customization
    if (selectedElement.textContent?.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        } else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
