/**
 * type DeviceType = {
    readonly laptop: "1TB";
    readonly pad: "512G";
    readonly mobile: "128G";
}
 */
const DEVICE = {
  laptop: "1TB",
  pad: "512G",
  mobile: "128G",
  watch: "1G",
} as const;

type DeviceType = typeof DEVICE;

/**
 * type DeviceKeys = "laptop" | "pad" | "mobile"
 */

type DeviceKeys = keyof DeviceType;

/**
 * type DeviceValues = "1TB" | "512G" | "128G"
 */

type DeviceValues = DeviceType[DeviceKeys];
type Storages = typeof DEVICE[keyof typeof DEVICE];

declare function isDevice(device: DeviceKeys): boolean;

/**
 * type UseDevice = {
    isLaptop: boolean;
    isPad: boolean;
    isMobile: boolean;
}
 */
type UseDevice = {
  [K in `is${Capitalize<DeviceKeys>}`]: ReturnType<typeof isDevice>;
};

const useDevice = (): UseDevice => {
  const isLaptop = isDevice("laptop");
  const isPad = isDevice("pad");
  const isMobile = isDevice("mobile");
  const isWatch = isDevice("watch");

  return { isLaptop, isPad, isMobile, isWatch };
};

declare function useDeviceStorage(): Storages;

const storage = useDeviceStorage();
const foo: typeof storage = "128G";
