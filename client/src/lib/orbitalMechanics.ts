// Orbital mechanics calculations for realistic space object movement

export interface OrbitParams {
  centerX: number;
  centerY: number;
  semiMajorAxis: number;
  semiMinorAxis: number;
  angle: number;
  eccentricity?: number;
}

/**
 * Calculate position on an elliptical orbit
 */
export function calculateEllipticalPosition(
  centerX: number,
  centerY: number,
  semiMajorAxis: number,
  semiMinorAxis: number,
  angle: number
): { x: number; y: number } {
  const x = centerX + semiMajorAxis * Math.cos(angle);
  const y = centerY + semiMinorAxis * Math.sin(angle);
  
  return { x, y };
}

/**
 * Calculate orbital velocity based on distance from center
 */
export function calculateOrbitalVelocity(
  distance: number,
  gravitationalParameter: number = 1000
): number {
  // Simplified orbital velocity: v = sqrt(GM/r)
  return Math.sqrt(gravitationalParameter / distance);
}

/**
 * Update orbital position with time step
 */
export function updateOrbitalPosition(
  currentAngle: number,
  angularVelocity: number,
  deltaTime: number
): number {
  return (currentAngle + angularVelocity * deltaTime) % (2 * Math.PI);
}

/**
 * Calculate eccentric anomaly for elliptical orbits
 */
export function calculateEccentricAnomaly(
  meanAnomaly: number,
  eccentricity: number,
  tolerance: number = 1e-6
): number {
  let E = meanAnomaly; // Initial guess
  let deltaE = 1;
  
  // Newton-Raphson method
  while (Math.abs(deltaE) > tolerance) {
    const f = E - eccentricity * Math.sin(E) - meanAnomaly;
    const fPrime = 1 - eccentricity * Math.cos(E);
    deltaE = f / fPrime;
    E -= deltaE;
  }
  
  return E;
}

/**
 * Generate random orbital parameters for space objects
 */
export function generateRandomOrbit(
  centerX: number,
  centerY: number,
  minRadius: number = 50,
  maxRadius: number = 150
): OrbitParams {
  const semiMajorAxis = minRadius + Math.random() * (maxRadius - minRadius);
  const eccentricity = Math.random() * 0.3; // Keep orbits fairly circular
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
  
  return {
    centerX,
    centerY,
    semiMajorAxis,
    semiMinorAxis,
    angle: Math.random() * 2 * Math.PI,
    eccentricity
  };
}

/**
 * Calculate gravitational attraction between two objects (simplified)
 */
export function calculateGravitationalForce(
  object1: { x: number; y: number; mass: number },
  object2: { x: number; y: number; mass: number },
  gravitationalConstant: number = 0.1
): { fx: number; fy: number } {
  const dx = object2.x - object1.x;
  const dy = object2.y - object1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return { fx: 0, fy: 0 };
  
  const force = (gravitationalConstant * object1.mass * object2.mass) / (distance * distance);
  const fx = force * (dx / distance);
  const fy = force * (dy / distance);
  
  return { fx, fy };
}
