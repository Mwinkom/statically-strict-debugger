
# 🐞 BUG_FIX.md

## 🐞 Bug Fix #1: Light Intensity Slider Not Working Responsively

### ✅ Bug Description:
- The slider to increase/decrease room light intensity did not visually update the bulb brightness as expected.

- Even though the slider value changed, the light bulb image and brightness filter did not reflect the slider's movement.


### 🔍 How the Bug Was Discovered:
- Moving the slider had no effect on light intensity or bulb icon.
- Console debugging was used:
  - `console.log` inside `handleLightIntensitySlider` showed `componentData` as undefined.
  - `console.log(room)` inside `lightComponentSelectors` returned only the first character of the room name.
- Wrong room identifier was being passed to fetch data.

### 🛠️ Root Causes Identified:
1. **Wrong Room Name Selection:**
```ts
const room = this.getSelectedComponentName(lightButtonElement);
const componentData = this.getComponent(room[0]);  // Bug: only first character used
```
- This passed 'h' instead of 'hall' causing undefined data.


### 🩺 Debugging Techniques Used:
- Added console logs in `lightComponentSelectors` and `getComponent` to trace values.
- Verified DOM selectors and slider event listeners in browser dev tools.

### ✅ Final Fixes Applied:
#### Corrected Component Selection:
```ts
const room = this.getSelectedComponentName(lightButtonElement);
const componentData = this.getComponent(room);  // ✅ Correct fix
```

#### Fixed Light Switch Update Logic:
```ts
handleLightIntensitySlider(element: HTMLElement, intensity: number): void {
    const { componentData } = this.lightComponentSelectors(element);

    if (typeof intensity !== 'number' || isNaN(intensity)) return;

    componentData.lightIntensity = intensity;

    const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch') as HTMLElement | null;
    if (!lightSwitch) return;

    componentData.isLightOn = intensity > 0;
    this.sliderLight(componentData.isLightOn, lightSwitch);
}
```

## 🐞 Bug Fix #2: Light Switch For Each Room not responding when clicked
### ✅ Bug Description:
The light bulb remained off or did not respond when clicked for the respective rooms.

### 🛠️ Root Causes Identified:
 **Incorrect Light Switch State Update:**
- `componentData.isLightOn = false;` was forcing lights off even when slider was above 0.



### ✅ Final Fixes Applied:
#### Before:
```ts
componentData.isLightOn = false;
```

#### Fixed Light Switch Update Logic:
```ts
if (intensity === 0) {
            componentData.isLightOn = false;
        } else {
            componentData.isLightOn = true;
        }
```

