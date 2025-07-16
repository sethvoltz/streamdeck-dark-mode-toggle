import { action, KeyAction, KeyDownEvent, SingletonAction, WillAppearEvent, WillDisappearEvent } from "@elgato/streamdeck";
import darkMode from 'dark-mode';

const UPDATE_INTERVAL = 10 * 1000; // 10 seconds

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.voltzmakes.dark-mode-toggle.toggle" })
export class DarkModeToggle extends SingletonAction<ToggleSettings> {
	private timer: NodeJS.Timeout | undefined;

	/**
	 * The {@link SingletonAction.onWillAppear} event is useful for setting the visual representation of an action when it becomes visible. This could be due to the Stream Deck first
	 * starting up, or the user navigating between pages / folders etc.. There is also an inverse of this event in the form of {@link streamDeck.client.onWillDisappear}. In this example,
	 * we're setting the title to the "count" that is incremented in {@link DarkModeToggle.onKeyDown}.
	 */
	override async onWillAppear(ev: WillAppearEvent<ToggleSettings>): Promise<void> {
		if (!ev.action.isKey()) return;
		this.updateButtonState(ev.action);

		if (!this.timer) {
			this.timer = setInterval(() => {
				for (const action of this.actions) {
					// Verify that the action is a key so we can call setRandomCat.
					if (action.isKey()) {
						this.updateButtonState(action);
					}
				}
			}, UPDATE_INTERVAL);
		}
	}

	/**
	 * Removes the action from the auto-update list (as it is no longer visible) and clears the timer if no more actions are auto-updating.
	 */
	override async onWillDisappear(ev: WillDisappearEvent<ToggleSettings>): Promise<void> {
		if (this.actions.next().done) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	override async onKeyDown(ev: KeyDownEvent<ToggleSettings>): Promise<void> {
		// Update the count from the settings.
		const { settings } = ev.payload;

		// Toggle the dark mode.
		await darkMode.toggle();
		this.updateButtonState(ev.action)

		// Update the current count in the action's settings, and change the title.
		await ev.action.setSettings(settings);
	}

	/**
	 * Gets the current state of dark mode and updates the button's appearance state accordingly.
	 * @param action The action in which to apply te dark mode state.
	 */
	private async updateButtonState(action: KeyAction): Promise<void> {
		const isDarkMode = await darkMode.isEnabled();
		if (isDarkMode) {
			action.setState(1); // Set state to dark mode
		} else {
			action.setState(0); // Set state to light mode
		}
	}
}

/**
 * Settings for {@link DarkModeToggle}.
 */
type ToggleSettings = {
};
