/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
type ApiEvent =
  | 'API:BAD_REQUEST'
  | 'API:UNAUTHORIZED'
  | 'API:FORBIDDEN'
  | 'API:NOT_FOUND'

type EventName = ApiEvent

class EventEmitter {
  private listeners: Record<EventName, Set<Function>> = {
    'API:BAD_REQUEST': new Set(),
    'API:UNAUTHORIZED': new Set(),
    'API:FORBIDDEN': new Set(),
    'API:NOT_FOUND': new Set(),
  }

  on(eventName: EventName, listener: Function) {
    this.listeners[eventName].add(listener)
    return () => this.off(eventName, listener)
  }

  emit(eventName: EventName, ...args: any[]) {
    this.listeners[eventName].forEach((listener) => listener(...args))
  }

  emitAsync(eventName: EventName, ...args: any[]) {
    const promises: Promise<any>[] = []

    this.listeners[eventName].forEach((listener) => {
      const result = listener(...args)
      promises.push(Promise.resolve(result))
    })

    return Promise.all(promises)
  }

  off(eventName: EventName, listener: Function) {
    this.listeners[eventName].delete(listener)
  }

  clear(eventName?: EventName) {
    if (eventName) this.listeners[eventName].clear()
    else Object.values(this.listeners).forEach((set) => set.clear())
  }
}

const emitter = new EventEmitter()

export default emitter
