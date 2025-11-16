import React from "react";
import {
  component,
  fields,
} from "@keystone-6/fields-document/component-blocks";

// naming the export componentBlocks is important because the Admin UI
// expects to find the components like on the componentBlocks export
export const componentBlocks = {
  image: component({
    label: "Image",
    schema: {
      image: fields.relationship({
        label: "Image",
        listKey: "Image",
        selection: "id name altText image { url width height }",
        many: false,
      }),
    },
    preview: (props) => {
      return (
        props.fields.image.value && (
          <img
            src={props.fields.image.value?.data?.image?.url}
            style={{ maxWidth: "100%" }}
          />
        )
      );
    },
  }),
};
