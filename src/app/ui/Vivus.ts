/**
 * This is a workaround to get vivus running without any further dependencies.
 * 
 * This workaround also requires the the standalone vivus.js or vivus.min.js is
 * loaded somewhere else.
 */
const Vivus : any = (window as any).Vivus || undefined;
export default Vivus;