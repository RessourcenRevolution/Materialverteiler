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
  text: component({
    label: "Text",
    schema: {
      size: fields.select({
        label: "Size",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Large", value: "large" },
        ],
        defaultValue: "normal",
      }),
      framed: fields.checkbox({
        label: "Framed",
      }),
      content: fields.child({
        kind: "block",
        placeholder: "Enter text...",
        formatting: {
          inlineMarks: "inherit",
          softBreaks: "inherit",
          headingLevels: "inherit",
        },
        links: "inherit",
      }),
    },
    preview: (props) => {
      const framed = props.fields.framed.value;
      return (
        <p
          style={{
            fontSize: props.fields.size.value === "large" ? "1.25rem" : "1rem",
            padding: framed ? "1rem" : "0",
            background: framed
              ? "linear-gradient(to right, black 3px, transparent 3px) 0 0, linear-gradient(to bottom, black 3px, transparent 3px) 0 0,linear-gradient(to left, black 3px, transparent 3px) 100% 100%, linear-gradient(to top, black 3px, transparent 3px) 100% 100%"
              : "",
            backgroundSize: "1.25rem 1.25rem",
            backgroundRepeat: "no-repeat",
          }}
        >
          {props.fields.content.element}
        </p>
      );
    },
  }),
};
