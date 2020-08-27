interface NodeOptions {
  classNames?: string[],
  styles?: {
    [key: string]: string
  }
}

export const createNode = (tagName: string, options: NodeOptions = {}): HTMLElement => {
  const node = document.createElement(tagName);

  if (options.classNames instanceof Array) {
    options.classNames.forEach((className) => {
      node.classList.add(className);
    });
  }

  if (options.styles) {
    Object.entries(options.styles).forEach((elem) => {
      const [key, value] = elem;

      node.style[key] = value;
    });
  }

  return node;
};
