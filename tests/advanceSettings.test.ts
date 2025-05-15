import AdvanceSettings from '../src/advanceSettings';

(global as any).Chart = jest.fn().mockImplementation((ctx, config) => {
    return { ctx, config };
});

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
            </div>
            <div class="customization">
                <section class="customization-details hidden"></section>
            </div>
            <div class="defaultOn">
                <input type="time" value="08:15">
                <button class="defaultOn-okay">Okay</button>
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

//     test('updates automatic On preset value', () => {
//     // Setup necessary DOM for getComponentData to work
//     document.body.innerHTML = `
//         <div class="advanced_features_container hidden"></div>
//         <div class="advanced_features">
//             <p class="component_name">hall</p>
//             <p class="auto_on">
//                 <span>Automatic turn on:</span>
//                 <span>--:--</span>
//             </p>
//         </div>
//         <div class="defaultOn">
//             <input type="time" value="08:15">
//             <button class="defaultOn-okay">Okay</button>
//         </div>
//     `;

//         const defaultOnButton = document.querySelector('.defaultOn-okay') as HTMLElement;
//         advanceSettings.customizeAutomaticOnPreset(defaultOnButton);

//         const updatedSpan = document.querySelector('.auto_on > span:last-child')?.textContent;
//         expect(updatedSpan).toBe('08:15');
//     });

});
