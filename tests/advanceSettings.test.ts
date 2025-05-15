import AdvanceSettings from '../src/advanceSettings';

// Mock global Chart to prevent ReferenceError
(global as any).Chart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn()
}));

describe('AdvanceSettings Component', () => {
    let advanceSettings: AdvanceSettings;

    beforeEach(() => {
        advanceSettings = new AdvanceSettings();

        document.body.innerHTML = `
            <div class="advanced_features_container hidden"></div>
            <div class="rooms hall">
                <p class="component_name">hall</p>
                <p class="auto_on">
                    <span>Automatic turn on:</span>
                    <span>--:--</span>
                </p>
                <p class="auto_off">
                    <span>Automatic turn off:</span>
                    <span>--:--</span>
                </p>
            </div>
            <div class="customization">
                <section class="customization-details hidden"></section>
            </div>
            <div class="defaultOn">
                <input type="time" value="08:15">
                <button class="defaultOn-okay">Okay</button>
            </div>
            <div class="defaultOff">
                <input type="time" value="22:00">
                <button class="defaultOff-okay">Okay</button>
            </div>
        `;
    });

    test('capitalizes first letter', () => {
        const result = advanceSettings.capFirstLetter('hall');
        expect(result).toBe('Hall');
    });

    test('formats time string into Date object', () => {
        const date = advanceSettings.formatTime('14:30');
        expect(date.getHours()).toBe(14);
        expect(date.getMinutes()).toBe(30);
        expect(date.getSeconds()).toBe(0);
    });

    test('gets selected component', () => {
        const component = advanceSettings.getSelectedComponent('hall');
        expect(component.name).toBe('hall');
    });

    test('gets markup for selected component', () => {
        const markup = advanceSettings.getSelectedSettings('hall');
        expect(markup).toContain('Advanced features');
        expect(markup).toContain('Hall');
    });

    test('should return object details instance', () => {
        const result = advanceSettings.getObjectDetails();
        expect(result).toBe(advanceSettings);
    });

    test('should update component data with setNewData', () => {
        const updated = advanceSettings.setNewData('hall', 'autoOn', '07:00');
        expect(updated).toBe('07:00');
        expect(advanceSettings.componentsData.hall.autoOn).toBe('07:00');
    });

    test('displays modal popup with correct markup', () => {
        const roomElement = document.querySelector('.rooms.hall') as HTMLElement;
        advanceSettings.modalPopUp(roomElement);

        const modal = document.querySelector('.advanced_features');
        expect(modal).not.toBeNull();

        const componentName = modal?.querySelector('.component_name')?.textContent;
        expect(componentName).toBe('Hall');
    });

    test('toggles customization section visibility', () => {
        const customizeBtn = document.querySelector('.customization') as HTMLElement;
        advanceSettings.displayCustomization(customizeBtn);

        const detailsSection = document.querySelector('.customization-details') as HTMLElement;
        expect(detailsSection.classList.contains('hidden')).toBe(false);
    });

    test('closes modal popup and hides container', () => {
        advanceSettings.closeModalPopUp();

        const container = document.querySelector('.advanced_features_container') as HTMLElement;
        expect(container.classList.contains('hidden')).toBe(true);
    });

    test('automateLight calls timer with formatted time', async () => {
        const timerSpy = jest.spyOn(advanceSettings, 'timer').mockImplementation(async () => {});
        const time = '12:30';
        const component = { element: document.createElement('button') };

        await advanceSettings.automateLight(time, component);

        expect(timerSpy).toHaveBeenCalled();

        timerSpy.mockRestore();
    });

    test('timer triggers toggleLightSwitch when time matches', async () => {
        jest.useFakeTimers();
        const future = new Date();
        future.setSeconds(future.getSeconds() + 1);

        const component = { element: document.createElement('button') };
        const toggleSpy = jest.spyOn(advanceSettings, 'toggleLightSwitch').mockImplementation(() => {});

        const timerPromise = advanceSettings.timer(future, true, component);

        jest.advanceTimersByTime(1000);
        await timerPromise;

        expect(toggleSpy).toHaveBeenCalledWith(component.element);

        toggleSpy.mockRestore();
        jest.useRealTimers();
    });
});
