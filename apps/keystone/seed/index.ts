import type { KeystoneContext } from "@keystone-6/core/types";
import { apiUser, homepage, mainNavigation } from "./fixtures";

/**
 * Seeds the test fixtures. Only runs against an empty database, so it can
 * never touch existing (development) data.
 */
export async function seedTestData(context: KeystoneContext) {
  const sudo = context.sudo();

  if ((await sudo.db.User.count()) > 0) {
    console.log("Skipping test data seed: database is not empty");
    return;
  }

  // API user
  await sudo.db.User.createOne({ data: apiUser });

  // Home page
  await sudo.db.Page.createOne({ data: homepage });

  // Navigation
  const items = [];
  for (const item of mainNavigation.items) {
    items.push(await sudo.db.NavigationItem.createOne({ data: item }));
  }
  await sudo.db.Navigation.createOne({
    data: {
      name: mainNavigation.name,
      items: { connect: items.map(({ id }) => ({ id })) },
    },
  });

  console.log("Seeded test data");
}
