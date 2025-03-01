/**
 * Session Data.
 * @module
 */
import Event from "./EventManager.ts";

export interface Location {
    pathname: string;
    search?: string;
    hash?: string;
    // deno-lint-ignore no-explicit-any
    state?: Record<string, any>;
};

let sessionHistory: Location[] = [];

/**
 * This is the Session object, which is used to manage the session history (mostly Navigation).
 */
const Session = {
    Navigate: (data: Location): void => {
        Spicetify.Platform.History.push(data);
    },
    GoBack: (): void => {
        if (sessionHistory.length > 1) {
            Session.Navigate(sessionHistory[sessionHistory.length - 2]);
        } else {
            Session.Navigate({ pathname: "/" })
        }
    },
    GetPreviousLocation: (): Location | null => {
        if (sessionHistory.length > 1) {
            return sessionHistory[sessionHistory.length - 2];
        }
        return null;
    },
    RecordNavigation: (data: Location): void => {
        Session.PushToHistory(data);
        Event.evoke("router:navigate", data as Location);
    },
    FilterOutTheSameLocation: (data: Location): void => {
        const filtered = sessionHistory.filter(location => location.pathname !== data.pathname && location.search !== data?.search && location.hash !== data?.hash);
        sessionHistory = filtered;
    },
    PushToHistory: (data: Location): void => {
        sessionHistory.push(data);
    },
}

export default Session;