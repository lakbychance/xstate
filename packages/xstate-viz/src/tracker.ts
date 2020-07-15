import { Rect } from './Rect';

export interface TrackerData {
  rect: null | Rect;
  element: null | Element;
  listeners: Set<TrackerListener>;
}

type TrackerListener = (data: TrackerData) => void;

export class Tracker {
  public data: Record<string, TrackerData> = {};

  constructor(private parentElement: Element = document.body) {}

  private getParent(el: Element) {
    return el.closest('[data-xviz="machine-container"]') || this.parentElement;
  }

  public update(id: string, el: Element) {
    const clientRect = relative(el.getBoundingClientRect(), this.getParent(el));

    if (!this.data[id]) {
      this.register(id);
    }

    const currentData = this.data[id];

    currentData.element = el;
    currentData.rect = new Rect(clientRect);
    currentData.listeners.forEach((listener) => {
      listener(currentData);
    });
  }

  public updateAll() {
    Object.entries(this.data).forEach(([, value]) => {
      if (value.element) {
        value.rect = new Rect(
          relative(
            value.element.getBoundingClientRect(),
            this.getParent(value.element)
          )
        ); // todo: RelativeRect ?
        value.listeners.forEach((listener) => listener(value));
      }
    });
  }

  public register(id: string) {
    this.data[id] = {
      rect: null,
      element: null,
      listeners: new Set()
    };
  }

  public listen(id: string, listener: TrackerListener) {
    if (!this.data[id]) {
      this.register(id);
    }

    this.data[id].listeners.add(listener);

    listener(this.data[id]);
  }

  public unlisten(id: string, listener: TrackerListener) {
    this.data[id].listeners.delete(listener);
  }
}

export function relative(
  childRect: ClientRect,
  parentElement: Element | ClientRect
): Rect {
  const parentRect =
    'getBoundingClientRect' in parentElement
      ? parentElement.getBoundingClientRect()
      : parentElement;

  return new Rect({
    top: childRect.top - parentRect.top,
    right: childRect.right - parentRect.left,
    bottom: childRect.bottom - parentRect.top,
    left: childRect.left - parentRect.left,
    width: childRect.width,
    height: childRect.height
  });
}
