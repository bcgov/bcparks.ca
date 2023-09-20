import type { Schema, Attribute } from "@strapi/strapi";

export interface ParksCardSet extends Schema.Component {
  collectionName: "components_parks_card_sets";
  info: {
    icon: "th-large";
    displayName: "CardSet";
  };
  attributes: {
    cards: Attribute.Component<"parks.link-card", true>;
  };
}

export interface ParksFancyLink extends Schema.Component {
  collectionName: "components_parks_fancy_links";
  info: {
    icon: "link";
    displayName: "FancyLink";
  };
  attributes: {
    TextToLink: Attribute.String;
    URL: Attribute.String;
  };
}

export interface ParksHtmlArea extends Schema.Component {
  collectionName: "components_parks_html_areas";
  info: {
    icon: "align-justify";
    description: "";
    displayName: "HTML Area";
  };
  attributes: {
    HTML: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
  };
}

export interface ParksImage extends Schema.Component {
  collectionName: "components_parks_images";
  info: {
    icon: "address-book";
    displayName: "Image";
  };
  attributes: {
    Media: Attribute.Media;
  };
}

export interface ParksLinkCard extends Schema.Component {
  collectionName: "components_parks_link_cards";
  info: {
    icon: "window-maximize";
    description: "";
    displayName: "LinkCard";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    imageUrl: Attribute.String;
    imageAltText: Attribute.String;
    subTitle: Attribute.String;
    buttonText: Attribute.String & Attribute.DefaultTo<"Learn more">;
    variation: Attribute.Enumeration<
      ["LandingPage", "Footer", "Home33Width", "Home66Width", "HomeFullWidth"]
    >;
    access_status: Attribute.Relation<
      "parks.link-card",
      "oneToOne",
      "api::access-status.access-status"
    >;
    test: Attribute.Boolean;
  };
}

export interface ParksPageHeader extends Schema.Component {
  collectionName: "components_parks_page_headers";
  info: {
    icon: "archway";
    description: "";
    displayName: "PageHeader";
  };
  attributes: {
    pageTitle: Attribute.String;
    imageUrl: Attribute.String;
    introHtml: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
  };
}

export interface ParksPageSection extends Schema.Component {
  collectionName: "components_parks_page_sections";
  info: {
    icon: "book-open";
    description: "";
    displayName: "PageSection";
  };
  attributes: {
    sectionTitle: Attribute.String & Attribute.Required;
    sectionHTML: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
  };
}

export interface ParksSeo extends Schema.Component {
  collectionName: "components_parks_seos";
  info: {
    icon: "atlas";
    description: "";
    displayName: "Seo";
  };
  attributes: {
    metaTitle: Attribute.Text;
    metaDescription: Attribute.Text;
    metaKeywords: Attribute.Text;
  };
}

declare module "@strapi/strapi" {
  export module Shared {
    export interface Components {
      "parks.card-set": ParksCardSet;
      "parks.fancy-link": ParksFancyLink;
      "parks.html-area": ParksHtmlArea;
      "parks.image": ParksImage;
      "parks.link-card": ParksLinkCard;
      "parks.page-header": ParksPageHeader;
      "parks.page-section": ParksPageSection;
      "parks.seo": ParksSeo;
    }
  }
}
