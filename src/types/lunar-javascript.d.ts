/** lunar-javascript ships no bundled types — declare the surface we use. */
declare module "lunar-javascript" {
  export interface LunarDate {
    toString(): string;
  }
  export const Solar: {
    fromYmd(year: number, month: number, day: number): {
      getLunar(): LunarDate;
    };
  };
  export const Lunar: unknown;
}
