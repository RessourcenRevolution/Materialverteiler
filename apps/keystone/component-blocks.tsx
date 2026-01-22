import React from "react";
import {
  component,
  fields,
  NotEditable,
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
            fontSize: props.fields.size.value === "large" ? "18px" : "16px",
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
  button: component({
    label: "Button",
    schema: {
      link: fields.url({
        label: "Link",
      }),
      size: fields.select({
        label: "Size",
        options: [
          { label: "Small", value: "small" },
          { label: "Normal", value: "normal" },
          { label: "Large", value: "large" },
        ],
        defaultValue: "normal",
      }),
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
        defaultValue: "secondary",
      }),
      content: fields.child({
        kind: "inline",
        placeholder: "Enter text...",
      }),
    },
    preview: (props) => {
      return (
        <p>
          <span
            style={{
              padding: "0.5rem 1rem",
              border: "3px solid black",
              fontSize: props.fields.size.value === "large" ? "18px" : "16px",
              fontWeight: "bold",
              backgroundColor:
                props.fields.variant.value === "primary"
                  ? "oklch(97.53% 0.147 108.85)"
                  : "transparent",
            }}
          >
            {props.fields.content.element}
          </span>
        </p>
      );
    },
  }),
  listings: component({
    label: "Listings",
    schema: {
      type: fields.select({
        label: "Type",
        options: [{ label: "Recently completed", value: "recent" }],
        defaultValue: "recent",
      }),
      title: fields.text({ label: "Title" }),
      link: fields.url({
        label: "Link",
      }),
      linkText: fields.text({
        label: "Link Text",
      }),
    },
    preview: (props) => {
      const title = props.fields.title.value;
      const link = props.fields.link.value;
      const linkText = props.fields.linkText.value;
      return (
        <NotEditable style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title && <h2>{title}</h2>}
            {link && linkText && <a href="#">{linkText}</a>}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  backgroundColor: "#eee",
                }}
              ></div>
              <p>Listing 1...</p>
            </div>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  backgroundColor: "#eee",
                }}
              ></div>
              <p>Listing 2...</p>
            </div>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  backgroundColor: "#eee",
                }}
              ></div>
              <p>Listing 3...</p>
            </div>
          </div>
        </NotEditable>
      );
    },
  }),
};
