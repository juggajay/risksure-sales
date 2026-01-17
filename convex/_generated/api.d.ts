/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as abTests from "../abTests.js";
import type * as emailEvents from "../emailEvents.js";
import type * as leads from "../leads.js";
import type * as metrics from "../metrics.js";
import type * as unsubscribe from "../unsubscribe.js";
import type * as warming from "../warming.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  abTests: typeof abTests;
  emailEvents: typeof emailEvents;
  leads: typeof leads;
  metrics: typeof metrics;
  unsubscribe: typeof unsubscribe;
  warming: typeof warming;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
