'use strict';
// Elements Declarations
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');
// Imports
import Light from './basicSettings.js';
import AdvanceSettings from './advanceSettings.js';
// Object Creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();
// Global Variables
let selectedComponent;
let isWifiActive = true;
// Event Handlers
// Hide homepage after button is clicked
homepageButton === null || homepageButton === void 0 ? void 0 : homepageButton.addEventListener('click', function (e) {
    if (!homepage || !loader || !mainRoomsContainer || !nav)
        return;
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 1000);
});
// Main container click events
mainRoomsContainer === null || mainRoomsContainer === void 0 ? void 0 : mainRoomsContainer.addEventListener('click', (e) => {
    var _a;
    const selectedElement = e.target;
    // when click occurs on light switch
    if (selectedElement.closest(".light-switch")) {
        const lightSwitch = (_a = selectedElement.closest(".basic_settings_buttons")) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        if (lightSwitch) {
            lightController.toggleLightSwitch(lightSwitch);
        }
        return;
    }
    // when click occurs on advance modal
    if (selectedElement.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
        if (advancedSettingsBtn) {
            advancedSettings.modalPopUp(advancedSettingsBtn);
        }
    }
});
// Light intensity slider change
mainRoomsContainer === null || mainRoomsContainer === void 0 ? void 0 : mainRoomsContainer.addEventListener('change', (e) => {
    const slider = e.target;
    const value = Number(slider.value);
    if (!isNaN(value)) {
        lightController.handleLightIntensitySlider(slider, value);
    }
});
// Advance Settings modal interactions
advanceFeaturesContainer === null || advanceFeaturesContainer === void 0 ? void 0 : advanceFeaturesContainer.addEventListener('click', (e) => {
    var _a;
    const selectedElement = e.target;
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
    if ((_a = selectedElement.textContent) === null || _a === void 0 ? void 0 : _a.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        }
        else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
