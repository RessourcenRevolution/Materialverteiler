// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { componentBlocks } from "./component-blocks";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  image,
  select,
} from "@keystone-6/core/fields";

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document";
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import { type Lists } from ".keystone/types";

if (!process.env.WEB_APP_BASE_URL) {
  throw new Error("WEB_APP_BASE_URL environment variable is not set");
}

const isAuthenticated = ({ session }: { session?: any }) => !!session?.data?.id;

const queryOnly = {
  operation: {
    query: allowAll,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
};

const authOnly = {
  operation: {
    query: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
};

export const lists = {
  User: list({
    access: authOnly,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),
    },
  }),

  Image: list({
    access: authOnly,
    fields: {
      name: text({
        validation: {
          isRequired: true,
        },
      }),
      altText: text(),
      image: image({ storage: "images" }),
    },
  }),

  Page: list({
    access: authOnly,
    ui: {
      labelField: "title",
    },
    fields: {
      title: text({
        validation: { isRequired: true },
      }),

      slug: text({
        ui: {
          itemView: { fieldPosition: "sidebar" },
        },
      }),

      parent: relationship({
        ref: "Page",
        ui: {
          itemView: { fieldPosition: "sidebar" },
        },
      }),

      path: text({
        isIndexed: "unique",
        ui: {
          itemView: {
            fieldMode: "read",
            fieldPosition: "sidebar",
          },
        },
      }),

      access: select({
        options: [{ value: "public", label: "Public" }, { value: "authenticated", label: "Authenticated" }],
        validation: { isRequired: true },
        defaultValue: "public"
      }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [[1], [1, 1]],
        ui: {
          views: "./component-blocks",
        },
        componentBlocks,
      }),
    },
    hooks: {
      resolveInput: async ({ context, item, inputData, resolvedData }) => {
        const slug = inputData?.slug || item?.slug || "";
        const parentId =
          inputData?.parent?.connect?.id || item?.parentId || undefined;

        // No parent, return just the slug
        if (!parentId) {
          return {
            ...resolvedData,
            path: "/" + slug,
          };
        }

        // There is a parent, combine the parent path with the page slug
        const page = await context.prisma.page.findFirst({
          where: { id: parentId },
        });
        if (!page) {
          throw Error("Parent page not found");
        }
        if (page.path === "/") {
          throw Error("Page can't have the homepage as parent page");
        }
        return {
          ...resolvedData,
          path: page.path + "/" + slug,
        };
      },
    },
  }),

  NavigationItem: list({
    access: authOnly,
    ui: {
      isHidden: true,
      labelField: "title",
    },
    fields: {
      icon: select({
        options: [
          { label: 'None', value: '' },
          { label: 'Profile Circle', value: 'profile-circle' },
          { label: 'Help Circle', value: 'help-circle' },
          { label: 'Info Circle', value: 'info-circle' },
          { label: 'Message', value: 'message' },
          { label: 'Cart', value: 'cart' },
          { label: 'List', value: 'list' },
        ],
        validation: { isRequired: false }
      }),
      title: text({ validation: { isRequired: true } }),
      path: text({ label: "Link", validation: { isRequired: true } }),
    },
    hooks: {
      resolveInput: async ({ inputData, resolvedData }) => {
        let path = inputData?.path || ''
        // Remove web app url, if path is prefixed with it
        if (process.env.WEB_APP_BASE_URL && path.startsWith(process.env.WEB_APP_BASE_URL)) {
          path = path.replace(process.env.WEB_APP_BASE_URL, '');
        }
        return {
          ...resolvedData,
          path,
        }
      },
    },
  }),

  Navigation: list({
    access: authOnly,
    fields: {
      name: select({
        options: [
          { value: "main", label: "Main Navigation" },
          { value: "meta", label: "Meta Navigation" },
        ],
        isIndexed: "unique",
        validation: { isRequired: true },
      }),
      items: relationship({
        ref: "NavigationItem",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["icon", "title", "path"],
          inlineCreate: { fields: ["icon", "title", "path"] },
          inlineEdit: { fields: ["icon", "title", "path"] },
        },
      }),
    },
  }),

  Footer: list({
    access: authOnly,
    isSingleton: true,
    fields: {
      content: document({
        formatting: true,
        links: true,
        dividers: undefined,
        layouts: undefined,
      }),
      links: relationship({
        ref: "NavigationItem",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["title", "path"],
          inlineCreate: { fields: ["title", "path"] },
          inlineEdit: { fields: ["title", "path"] },
        },
      }),
    },
  }),

  Person: list({
    access: authOnly,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text({ validation: { isRequired: true } }),
      photo: image({ storage: "images" }),
    },
  }),

  GalleryItem: list({
    access: authOnly,
    ui: {
      isHidden: true,
      labelField: "title",
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      link: text({ label: "Link" }),
      image: image({ storage: "images" }),
    },
  }),

  Gallery: list({
    access: authOnly,
    fields: {
      name: text({ validation: { isRequired: true } }),
      title: text({}),
      items: relationship({
        ref: "GalleryItem",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["title", "image", "link"],
          inlineCreate: { fields: ["title", "image", "link"] },
          inlineEdit: { fields: ["title", "image", "link"] },
        },
      }),
    },
  }),
} satisfies Lists;
