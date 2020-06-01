/**
 * This is a workaround to get mithril running without any further dependencies.
 * Note that when using webpack or similar, you can probably use mithril without this.
 * 
 * This workaround also requires the the standalone mithril.js or mithril.min.js is
 * loaded somewhere else.
 */
const m : any = (window as any).m || undefined;
export default m;