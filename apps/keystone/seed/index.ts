import fs from "node:fs";
import path from "node:path";
import type { KeystoneContext } from "@keystone-6/core/types";
import {
  apiUser,
  footer,
  heroImage,
  homepage,
  homepageContent,
  mainNavigation,
  metaNavigation,
} from "./fixtures";

type Item = { title: string; path: string; icon: string };

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

  // Keystone creates nested items in parallel, which makes their IDs, and
  // with that their order, random. Create them one by one to keep it stable.
  const createItems = async (items: Item[]) => {
    const ids = [];
    for (const item of items) {
      const { id } = await sudo.db.NavigationItem.createOne({ data: item });
      ids.push({ id });
    }
    return ids;
  };

  // API user
  await sudo.db.User.createOne({ data: apiUser });

  // Home page, with a hero image
  // The image field only accepts GraphQL uploads, so store the file through
  // the storage API and write the image columns directly
  const imagePath = path.resolve(heroImage.file);
  const stored = await sudo
    .images("images")
    .getDataFromStream(fs.createReadStream(imagePath), path.basename(imagePath));
  const image = await sudo.prisma.image.create({
    data: {
      name: heroImage.name,
      altText: heroImage.altText,
      image_id: stored.id,
      image_extension: stored.extension,
      image_filesize: stored.filesize,
      image_width: stored.width,
      image_height: stored.height,
    },
  });
  await sudo.db.Page.createOne({
    data: {
      ...homepage,
      content: homepageContent(image.id),
    },
  });

  // Navigation
  for (const navigation of [mainNavigation, metaNavigation]) {
    await sudo.db.Navigation.createOne({
      data: {
        name: navigation.name,
        items: { connect: await createItems(navigation.items) },
      },
    });
  }

  // Footer
  await sudo.db.Footer.createOne({
    data: {
      content: footer.content,
      links: { connect: await createItems(footer.links) },
    },
  });

  console.log("Seeded test data");
}
