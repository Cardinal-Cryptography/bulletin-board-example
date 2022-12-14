/* eslint no-promise-executor-return: 0 */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
