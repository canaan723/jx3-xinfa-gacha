import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 安全地执行视图过渡动画 (View Transition API)
 * 如果浏览器不支持，则直接执行回调
 */
/**
 * 安全地执行视图过渡动画 (View Transition API)
 * 支持传入点击事件以实现从点击位置扩散的圆形效果
 */
export function safeViewTransition(callback: () => void, event?: React.MouseEvent | MouseEvent) {
  if (typeof document === 'undefined' || !(document as any).startViewTransition) {
    callback();
    return;
  }

  const transition = (document as any).startViewTransition(callback);

  if (event) {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 1200,
          easing: 'cubic-bezier(0.85, 0, 0.15, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }
}
