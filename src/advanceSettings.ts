'use strict';

import General from "./general.js";
import Light from './basicSettings.js';

declare var Chart: any;

class AdvanceSettings extends Light {
    constructor() {
        super();
    }

    #markup(component: any): string {
        const { name, numOfLights, autoOn, autoOff } = component;
        return `
        <div class="advanced_features">
            <h3>Advanced features</h3>
            <section class="component_summary">
                <div>
                    <p class="component_name">${this.capFirstLetter(name)}</p>
                    <p class="number_of_lights">${numOfLights}</p>
                </div>
                <div>
                    <p class="auto_on">
                        <span>Automatic turn on:</span>
                        <span>${autoOn}</span>
                    </p>
                    <p class="auto_off">
                        <span>Automatic turn off:</span>
                        <span>${autoOff}</span>
                    </p>
                </div>
            </section>
            <section class="customization">
                <div class="edit">
                    <p>Customize</p>
                    <button class="customization-btn">
                        <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
                    </button>
                </div>
                <section class="customization-details hidden">
                    <div>
                        <h4>Automatic on/off settings</h4>
                        <div class="defaultOn">
                            <label for="">Turn on</label>
                            <input type="time" name="autoOnTime" id="autoOnTime">
                            <div>
                                <button class="defaultOn-okay">Okay</button>
                                <button class="defaultOn-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="defaultOff">
                            <label for="">Go off</label>
                            <input type="time" name="autoOffTime" id="autoOffTime">
                            <div>
                                <button class="defaultOff-okay">Okay</button>
                                <button class="defaultOff-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="summary">
                    <h3>Summary</h3>
                    <div class="chart-container">
                        <canvas id="myChart"></canvas>
                    </div>
                </section>
                <button class="close-btn">
                    <img src="./assets/svgs/close.svg" alt="close button svg icon">
                </button>
            </section>
            <button class="close-btn">
                <img src="./assets/svgs/close.svg" alt="close button svg icon">
            </button>
        </div>
        `;
    }

    #analyticsUsage(data: number[]): void {
        const ctx = this.selector('#myChart') as HTMLCanvasElement | null;
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Hours of usage',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    modalPopUp(element: HTMLElement): void {
        console.log('modalPopUp called with:', element);

        const selectedRoom = this.getSelectedComponentName(element);
        console.log('selectedRoom:', selectedRoom);

        const componentData = this.getComponent(selectedRoom);
        console.log('componentData:', componentData);
        const parentElement = this.selector('.advanced_features_container') as HTMLElement | null;
        if (!parentElement) return;

        if (!componentData) {
            console.error('No component data found for:', selectedRoom);
            return;
        }

        this.removeHidden(parentElement);

        // display modal view
        this.renderHTML(this.#markup(componentData), 'afterbegin', parentElement);

        // graph display
        this.#analyticsUsage(componentData['usage']);
    }

    displayCustomization(selectedElement: HTMLElement): void {
        const element = this.closestSelector(selectedElement, '.customization', '.customization-details') as HTMLElement | null;
        if (element) this.toggleHidden(element);
    }

    closeModalPopUp(): void {
        const parentElement = this.selector('.advanced_features_container') as HTMLElement | null;
        const childElement = this.selector('.advanced_features') as HTMLElement | null;

        if (childElement) {
            childElement.remove();
        }

        if (parentElement) {
            this.addHidden(parentElement);
        }
    }

    customizationCancelled(selectedElement: HTMLElement, parentSelectorIdentifier: string): void {
        const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input') as HTMLInputElement | null;
        if (element) element.value = '';
    }

    customizeAutomaticOnPreset(selectedElement: HTMLElement): void {
        const element = this.closestSelector(selectedElement, '.defaultOn', 'input') as HTMLInputElement | null;
        if (!element || !element.value) return;

        const component = this.getComponentData(element, '.advanced_features', '.component_name');
        component.autoOn = element.value;
        element.value = '';

        const spanElement = this.selector('.auto_on > span:last-child') as HTMLElement | null;
        if (spanElement) this.updateMarkupValue(spanElement, component.autoOn);

        this.setComponentElement(component);
        this.automateLight(component['autoOn'], component);
    }

    customizeAutomaticOffPreset(selectedElement: HTMLElement): void {
        const element = this.closestSelector(selectedElement, '.defaultOff', 'input') as HTMLInputElement | null;
        if (!element || !element.value) return;

        const component = this.getComponentData(element, '.advanced_features', '.component_name');
        component.autoOff = element.value;
        element.value = '';

        const spanElement = this.selector('.auto_off > span:last-child') as HTMLElement | null;
        if (spanElement) this.updateMarkupValue(spanElement, component.autoOff);

        this.setComponentElement(component);
        this.automateLight(component['autoOff'], component);
    }

    getSelectedComponent(componentName: string): any {
        if (!componentName) return this.componentsData;
        const component = this.componentsData[componentName.toLowerCase()];
        return component;
    }

    getSelectedSettings(componentName: string): string {
        return this.#markup(this.getSelectedComponent(componentName));
    }

    setNewData(component: string, key: string, data: any): any {
        const selectedComponent = this.componentsData[component.toLowerCase()];
        return selectedComponent[key] = data; 
    }

    capFirstLetter(word: string): string {
        const firstChar = word.at(0);
        return firstChar ? word.replace(firstChar, firstChar.toUpperCase()) : word;
    }

    getObjectDetails(): this {
        return this;
    }

    formatTime(time: string): Date {
        const [hour, min] = time.split(':');
        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(Number(hour));
        dailyAlarmTime.setMinutes(Number(min));
        dailyAlarmTime.setSeconds(0);
        return dailyAlarmTime;
    }

    timeDifference(selectedTime: string): number {
        const now = new Date();
        const setTime = this.formatTime(selectedTime).getTime() - now.getTime();
        console.log(setTime, now);
        return setTime;
    }

    async timer(time: Date, message: boolean, component: any): Promise<void> {
        return new Promise((resolve) => {
            const checkAndTriggerAlarm = () => {
                const now = new Date();

                if (
                    now.getHours() === time.getHours() &&
                    now.getMinutes() === time.getMinutes() &&
                    now.getSeconds() === time.getSeconds()
                ) {
                    resolve(this.toggleLightSwitch(component['element']));
                    clearInterval(intervalId);
                }
            };

            const intervalId = setInterval(checkAndTriggerAlarm, 1000);
        });
    }

    async automateLight(time: string, component: any): Promise<void> {
        const formattedTime = this.formatTime(time);
        await this.timer(formattedTime, true, component);
    }
}

export default AdvanceSettings;
