export const MapKey =
    typeof globalThis !== "undefined" && "process" in globalThis
        ? (
              globalThis as {
                  process?: {
                      env?: Record<string, string | undefined>;
                  };
              }
          ).process?.env?.REACT_APP_MAPKEY
        : undefined;

export const MapBoxAccessKey =
    typeof globalThis !== "undefined" && "process" in globalThis
        ? (
              globalThis as {
                  process?: {
                      env?: Record<string, string | undefined>;
                  };
              }
          ).process?.env?.REACT_APP_MAPBOX_ACCESS_TOKEN
        : undefined;
