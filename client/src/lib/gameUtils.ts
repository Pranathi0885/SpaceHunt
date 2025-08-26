// Utility functions for game mechanics

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check collision between two rectangular objects
 */
export function checkAABBCollision(bounds1: Bounds, bounds2: Bounds): boolean {
  return bounds1.x < bounds2.x + bounds2.width &&
         bounds1.x + bounds1.width > bounds2.x &&
         bounds1.y < bounds2.y + bounds2.height &&
         bounds1.y + bounds1.height > bounds2.y;
}

/**
 * Check collision between two circular objects
 */
export function checkCircularCollision(
  center1: Point, 
  radius1: number, 
  center2: Point, 
  radius2: number
): boolean {
  const dx = center1.x - center2.x;
  const dy = center1.y - center2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius1 + radius2;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalize a vector
 */
export function normalizeVector(vector: Point): Point {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude
  };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Generate a random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Generate a random point within bounds
 */
export function randomPointInBounds(bounds: Bounds): Point {
  return {
    x: bounds.x + Math.random() * bounds.width,
    y: bounds.y + Math.random() * bounds.height
  };
}

/**
 * Check if a point is within bounds
 */
export function pointInBounds(point: Point, bounds: Bounds): boolean {
  return point.x >= bounds.x &&
         point.x <= bounds.x + bounds.width &&
         point.y >= bounds.y &&
         point.y <= bounds.y + bounds.height;
}

/**
 * Calculate angle between two points in radians
 */
export function calculateAngle(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Generate debris scoring based on size
 */
export function calculateDebrisScore(width: number, height: number): number {
  const area = width * height;
  if (area < 100) return 5;
  if (area < 200) return 10;
  if (area < 400) return 15;
  return 20;
}

/**
 * Generate random debris properties
 */
export function generateDebrisProperties() {
  const types = ['nut', 'screw', 'bolt', 'switch', 'glass', 'metal'];
  const size = 8 + Math.random() * 12;
  
  return {
    type: types[Math.floor(Math.random() * types.length)],
    width: size + Math.random() * 8,
    height: size + Math.random() * 8,
    rotationSpeed: (Math.random() - 0.5) * 0.1
  };
}
