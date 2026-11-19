import { defineConfig, devices } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  BROWSER_SERVER_PORT,
  keystoneEnv,
  KEYSTONE_URL,
  MAILPIT_PORT,
  MAILPIT_SMTP_PORT,
  MAILPIT_URL,
  pocketbaseEnv,
  POCKETBASE_PORT,
  POCKETBASE_URL,
  WEB_URL,
  webEnv,
} from "./testing/env";

// Visual tests run the browser in a Docker container, so screenshots render the
// same on every OS. Only the browser runs there; the test stack runs on the host.
// Screenshot tests are tagged with @visual.
const VISUAL = process.env.VISUAL === "true";

// The container image must match the installed Playwright version exactly
const PLAYWRIGHT_VERSION = JSON.parse(
  readFileSync("./node_modules/@playwright/test/package.json", "utf8"),
).version;

const visualUse = {
  connectOptions: {
    wsEndpoint: `ws://127.0.0.1:${BROWSER_SERVER_PORT}/`,
    // Route the container browser's requests to localhost through the host
    exposeNetwork: "<loopback>",
  },
};

export default defineConfig({
  testDir: "./apps",
  testMatch: "**/*.e2e.ts",
  testIgnore: "**/node_modules/**",
  // Stored in the root screenshots folder, also shown in the README
  snapshotPathTemplate:
    "{testDir}/../screenshots/{arg}-{projectName}{ext}",

  // Tests share one seeded database
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Locally, the HTML report (with traces and screenshot diffs) opens when tests fail
  reporter: [
    ["list"],
    ["html", { open: process.env.CI ? "never" : "on-failure" }],
  ],

  use: {
    baseURL: WEB_URL,
    locale: "en-US",
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
  },

  expect: {
    toHaveScreenshot: { animations: "disabled", caret: "hide" },
  },

  projects: [
    {
      name: "e2e",
      grepInvert: /@visual/,
      use: { ...devices["Desktop Chrome"] },
    },
    ...(VISUAL
      ? [
          {
            name: "visual-desktop",
            grep: /@visual/,
            use: { ...devices["Desktop Chrome"], ...visualUse },
          },
          {
            name: "visual-mobile",
            grep: /@visual/,
            use: { ...devices["Pixel 7"], ...visualUse },
          },
        ]
      : []),
  ],

  webServer: [
    {
      name: "keystone",
      command: "npm run test:server",
      cwd: "./apps/keystone",
      url: `${KEYSTONE_URL}/api/graphql?query=%7B__typename%7D`,
      env: keystoneEnv,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      name: "mailpit",
      command: `./bin/mailpit --smtp 127.0.0.1:${MAILPIT_SMTP_PORT} --listen 127.0.0.1:${MAILPIT_PORT}`,
      url: `${MAILPIT_URL}/readyz`,
      reuseExistingServer: !process.env.CI,
    },
    {
      name: "pocketbase",
      // Everything in pb_data/test is removed on each start of the test server
      command: `rm -rf pb_data/test && go run . serve --dir pb_data/test --http 127.0.0.1:${POCKETBASE_PORT}`,
      cwd: "./apps/api",
      url: `${POCKETBASE_URL}/api/health`,
      env: pocketbaseEnv,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      name: "web",
      command: "npm run test:server",
      cwd: "./apps/web",
      url: WEB_URL,
      env: webEnv,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    ...(VISUAL
      ? [
          {
            name: "browser",
            command: [
              "docker run --rm --init --name materialverteiler-playwright",
              `-p ${BROWSER_SERVER_PORT}:${BROWSER_SERVER_PORT}`,
              `mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble`,
              `npx -y playwright@${PLAYWRIGHT_VERSION} run-server --port ${BROWSER_SERVER_PORT} --host 0.0.0.0`,
            ].join(" "),
            // Docker publishes the port before the server listens, so check over HTTP
            url: `http://127.0.0.1:${BROWSER_SERVER_PORT}/`,
            // SIGTERM is forwarded to the container, which then stops and is removed
            gracefulShutdown: { signal: "SIGTERM" as const, timeout: 10_000 },
            reuseExistingServer: !process.env.CI,
            timeout: 300_000,
          },
        ]
      : []),
  ],
});
