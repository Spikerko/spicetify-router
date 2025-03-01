/**
 * This module is used as an event manager, to manage events.
 * @module
 */

const eventRegistry = new Map();

let nextId = 1;

/**
 * Event Listener.
 */
// deno-lint-ignore no-explicit-any
const listen = (eventName: string, callback: (...args: any[]) => void) => {
  if (!eventRegistry.has(eventName)) {
    eventRegistry.set(eventName, new Map());
  }

  const id = nextId++;
  eventRegistry.get(eventName).set(id, callback);
  return id;
};

/**
 * Event UnListener.
 */
const unListen = (id: number) => {
  for (const [eventName, listeners] of eventRegistry) {
    if (listeners.has(id)) {
      listeners.delete(id);
      if (listeners.size === 0) {
        eventRegistry.delete(eventName);
      }
      return true; // Listener removed
    }
  }
  return false; // Listener not found
};


/**
 * Event Evoker.
 */
// deno-lint-ignore no-explicit-any
const evoke = (eventName: string, ...args: any[]) => {
  const listeners = eventRegistry.get(eventName);
  if (listeners) {
    for (const callback of listeners.values()) {
      callback(...args);
    }
  }
};


const Event = {
    listen,
    unListen,
    evoke
}

export default Event;