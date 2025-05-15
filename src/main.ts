import Light from './basicSettings';
import AdvanceSettings from './advanceSettings';

export function initializeApp(
    lightController = new Light(),
    advancedSettings = new AdvanceSettings()
) {
    const homepageButton = document.querySelector('.entry_point') as HTMLElement;
    const homepage = document.querySelector('main') as HTMLElement;
    const mainRoomsContainer = document.querySelector('.application_container') as HTMLElement;
    const advanceFeaturesContainer = document.querySelector('.advanced_features_container') as HTMLElement;
    const nav = document.querySelector('nav') as HTMLElement;
    const loader = document.querySelector('.loader-container') as HTMLElement;

    homepageButton?.addEventListener('click', () => {
        if (!homepage || !loader || !mainRoomsContainer || !nav) return;

        lightController.addHidden(homepage);
        lightController.removeHidden(loader);

        setTimeout(() => {
            lightController.removeHidden(mainRoomsContainer);
            lightController.removeHidden(nav);
        }, 1000);
    });

    mainRoomsContainer?.addEventListener('click', (e: Event) => {
        const selectedElement = e.target as HTMLElement;

        if (selectedElement.closest(".light-switch")) {
            const lightSwitch = selectedElement.closest(".basic_settings_buttons")?.firstElementChild as HTMLElement;
            if (lightSwitch) lightController.toggleLightSwitch(lightSwitch);
            return;
        }

        if (selectedElement.closest('.advance-settings_modal')) {
            const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal') as HTMLElement;
            if (advancedSettingsBtn) advancedSettings.modalPopUp(advancedSettingsBtn);
        }
    });

    mainRoomsContainer?.addEventListener('change', (e: Event) => {
        const slider = e.target as HTMLInputElement;
        const value = Number(slider.value);

        if (!isNaN(value)) {
            lightController.handleLightIntensitySlider(slider, value);
        }
    });

    advanceFeaturesContainer?.addEventListener('click', (e: Event) => {
        const selectedElement = e.target as HTMLElement;

        if (selectedElement.closest('.close-btn')) {
            advancedSettings.closeModalPopUp();
        }

        if (selectedElement.closest('.customization-btn')) {
            advancedSettings.displayCustomization(selectedElement);
        }

        if (selectedElement.matches('.defaultOn-okay')) {
            advancedSettings.customizeAutomaticOnPreset(selectedElement);
        }

        if (selectedElement.matches('.defaultOff-okay')) {
            advancedSettings.customizeAutomaticOffPreset(selectedElement);
        }

        if (selectedElement.textContent?.includes("Cancel")) {
            if (selectedElement.matches('.defaultOn-cancel')) {
                advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
            } else if (selectedElement.matches('.defaultOff-cancel')) {
                advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
            }
        }
    });
}
