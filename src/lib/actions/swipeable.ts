/**
 * Svelte action for swipeable card interactions.
 * Tracks pointer drag and fires callbacks for swipe gestures.
 */
export type SwipeDirection = 'left' | 'right';

interface SwipeableOptions {
	threshold?: number;
	onSwipe: (direction: SwipeDirection) => void;
	onDrag?: (offsetX: number) => void;
	onRelease?: () => void;
	onTap?: () => void;
}

export function swipeable(node: HTMLElement, options: SwipeableOptions) {
	let startX = 0;
	let currentX = 0;
	let dragging = false;
	const threshold = options.threshold ?? 100;
	const tapThreshold = 5;

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		startX = e.clientX;
		currentX = 0;
		node.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		currentX = e.clientX - startX;
		options.onDrag?.(currentX);
	}

	function onPointerUp(_e: PointerEvent) {
		if (!dragging) return;
		dragging = false;

		if (Math.abs(currentX) > threshold) {
			options.onSwipe(currentX > 0 ? 'right' : 'left');
		} else if (Math.abs(currentX) < tapThreshold) {
			options.onTap?.();
			options.onRelease?.();
		} else {
			options.onRelease?.();
		}
		currentX = 0;
	}

	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('pointermove', onPointerMove);
	node.addEventListener('pointerup', onPointerUp);
	node.addEventListener('pointercancel', onPointerUp);

	return {
		update(newOptions: SwipeableOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointermove', onPointerMove);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointercancel', onPointerUp);
		}
	};
}
