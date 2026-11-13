/** The download stopped because the device is offline; retry when back online. */
export class OfflineDownloadPaused extends Error {}

export type Progress = (fraction: number) => void;
