export const getElement = (node: HTMLElement, className: string): HTMLElement => {
  if (node.classList.contains(className)) {
    return node;
  }

  if (node.parentElement === null) {
    throw new Error('not parent element');
  }

  return getElement(node.parentElement, className);
};
