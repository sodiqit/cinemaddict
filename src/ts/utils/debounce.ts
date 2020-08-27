// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
export type FunctionType = (...args: any[]) => void;

export function debounce<F extends FunctionType>(func: F, delay: number)
  : (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let isCooldown = false;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    if (isCooldown) return;

    func.apply(this, args);

    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
    }, delay);
  };
}
