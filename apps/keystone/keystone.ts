// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";
import { seedTestData } from "./seed";

export default withAuth(
  config({
    server: {
      port: Number(process.env.PORT) || 3002,
    },
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./data/keystone.db",
      onConnect: async (context) => {
        if (process.env.SEED_TEST_DATA === "true") {
          await seedTestData(context);
        }
      },
    },
    lists,
    session,
    storage: {
      images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) =>
          `${
            process.env.KEYSTONE_BASE_URL || "http://localhost:3002"
          }/_images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/_images",
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null,
        storagePath: process.env.IMAGES_PATH || "assets/_images",
      },
    },
  })
);
