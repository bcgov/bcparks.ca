import type { Schema, Attribute } from "@strapi/strapi";

export interface AdminPermission extends Schema.CollectionType {
  collectionName: "admin_permissions";
  info: {
    name: "Permission";
    description: "";
    singularName: "permission";
    pluralName: "permissions";
    displayName: "Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<"admin::permission", "manyToOne", "admin::role">;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: "admin_users";
  info: {
    name: "User";
    description: "";
    singularName: "user";
    pluralName: "users";
    displayName: "User";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<"admin::user", "manyToMany", "admin::role"> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::user", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"admin::user", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: "admin_roles";
  info: {
    name: "Role";
    description: "";
    singularName: "role";
    pluralName: "roles";
    displayName: "Role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<"admin::role", "manyToMany", "admin::user">;
    permissions: Attribute.Relation<
      "admin::role",
      "oneToMany",
      "admin::permission"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::role", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"admin::role", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: "strapi_api_tokens";
  info: {
    name: "Api Token";
    singularName: "api-token";
    pluralName: "api-tokens";
    displayName: "Api Token";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"">;
    type: Attribute.Enumeration<["read-only", "full-access", "custom"]> &
      Attribute.Required &
      Attribute.DefaultTo<"read-only">;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      "admin::api-token",
      "oneToMany",
      "admin::api-token-permission"
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::api-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::api-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: "strapi_api_token_permissions";
  info: {
    name: "API Token Permission";
    description: "";
    singularName: "api-token-permission";
    pluralName: "api-token-permissions";
    displayName: "API Token Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      "admin::api-token-permission",
      "manyToOne",
      "admin::api-token"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::api-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::api-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: "strapi_transfer_tokens";
  info: {
    name: "Transfer Token";
    singularName: "transfer-token";
    pluralName: "transfer-tokens";
    displayName: "Transfer Token";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"">;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      "admin::transfer-token",
      "oneToMany",
      "admin::transfer-token-permission"
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::transfer-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::transfer-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: "strapi_transfer_token_permissions";
  info: {
    name: "Transfer Token Permission";
    description: "";
    singularName: "transfer-token-permission";
    pluralName: "transfer-token-permissions";
    displayName: "Transfer Token Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      "admin::transfer-token-permission",
      "manyToOne",
      "admin::transfer-token"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::transfer-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::transfer-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: "files";
  info: {
    singularName: "file";
    pluralName: "files";
    displayName: "File";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<"plugin::upload.file", "morphToMany">;
    folder: Attribute.Relation<
      "plugin::upload.file",
      "manyToOne",
      "plugin::upload.folder"
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::upload.file",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::upload.file",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: "upload_folders";
  info: {
    singularName: "folder";
    pluralName: "folders";
    displayName: "Folder";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      "plugin::upload.folder",
      "manyToOne",
      "plugin::upload.folder"
    >;
    children: Attribute.Relation<
      "plugin::upload.folder",
      "oneToMany",
      "plugin::upload.folder"
    >;
    files: Attribute.Relation<
      "plugin::upload.folder",
      "oneToMany",
      "plugin::upload.file"
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::upload.folder",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::upload.folder",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: "up_permissions";
  info: {
    name: "permission";
    description: "";
    singularName: "permission";
    pluralName: "permissions";
    displayName: "Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      "plugin::users-permissions.permission",
      "manyToOne",
      "plugin::users-permissions.role"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::users-permissions.permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::users-permissions.permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: "up_roles";
  info: {
    name: "role";
    description: "";
    singularName: "role";
    pluralName: "roles";
    displayName: "Role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.permission"
    >;
    users: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.user"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: "up_users";
  info: {
    name: "user";
    description: "";
    singularName: "user";
    pluralName: "users";
    displayName: "User";
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      "plugin::users-permissions.user",
      "manyToOne",
      "plugin::users-permissions.role"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::users-permissions.user",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::users-permissions.user",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiAccessStatusAccessStatus extends Schema.CollectionType {
  collectionName: "access_statuses";
  info: {
    singularName: "access-status";
    pluralName: "access-statuses";
    displayName: "Access-status";
    name: "access-status";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    accessStatus: Attribute.String;
    precedence: Attribute.Integer;
    color: Attribute.String;
    groupLabel: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::access-status.access-status",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::access-status.access-status",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiActivityTypeActivityType extends Schema.CollectionType {
  collectionName: "activity_types";
  info: {
    singularName: "activity-type";
    pluralName: "activity-types";
    displayName: "Activity-type";
    name: "activity-type";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    activityNumber: Attribute.Integer;
    activityName: Attribute.String;
    activityCode: Attribute.String;
    icon: Attribute.String;
    iconNA: Attribute.String;
    rank: Attribute.Integer;
    note: Attribute.String;
    isActive: Attribute.Boolean;
    isCamping: Attribute.Boolean;
    defaultDescription: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    appendStandardCalloutText: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::activity-type.activity-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::activity-type.activity-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiAdvisoryStatusAdvisoryStatus extends Schema.CollectionType {
  collectionName: "advisory_statuses";
  info: {
    singularName: "advisory-status";
    pluralName: "advisory-statuses";
    displayName: "Advisory-status";
    name: "advisory-status";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    advisoryStatus: Attribute.String;
    code: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::advisory-status.advisory-status",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::advisory-status.advisory-status",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiAssetTypeAssetType extends Schema.CollectionType {
  collectionName: "asset_types";
  info: {
    singularName: "asset-type";
    pluralName: "asset-types";
    displayName: "Asset-type";
    name: "asset-type";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    assetTypeNumber: Attribute.Integer;
    assetType: Attribute.String;
    assetCategory: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::asset-type.asset-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::asset-type.asset-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiBiogeoclimaticZoneBiogeoclimaticZone
  extends Schema.CollectionType {
  collectionName: "biogeoclimatic_zones";
  info: {
    singularName: "biogeoclimatic-zone";
    pluralName: "biogeoclimatic-zones";
    displayName: "Biogeoclimatic-zone";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    zone: Attribute.String;
    zoneCode: Attribute.String;
    protectedAreas: Attribute.Relation<
      "api::biogeoclimatic-zone.biogeoclimatic-zone",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::biogeoclimatic-zone.biogeoclimatic-zone",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::biogeoclimatic-zone.biogeoclimatic-zone",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiBusinessHourBusinessHour extends Schema.SingleType {
  collectionName: "business_hours";
  info: {
    singularName: "business-hour";
    pluralName: "business-hours";
    displayName: "Business-hour";
    name: "business-hour";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    startTime: Attribute.Time & Attribute.Required;
    endTime: Attribute.Time & Attribute.Required;
    monday: Attribute.Boolean & Attribute.Required;
    tuesday: Attribute.Boolean & Attribute.Required;
    wednesday: Attribute.Boolean & Attribute.Required;
    thursday: Attribute.Boolean & Attribute.Required;
    friday: Attribute.Boolean & Attribute.Required;
    saturday: Attribute.Boolean & Attribute.Required;
    sunday: Attribute.Boolean & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::business-hour.business-hour",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::business-hour.business-hour",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiEventTypeEventType extends Schema.CollectionType {
  collectionName: "event_types";
  info: {
    singularName: "event-type";
    pluralName: "event-types";
    displayName: "Event-type";
    name: "event-type";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    eventType: Attribute.String;
    precedence: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::event-type.event-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::event-type.event-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiFacilityTypeFacilityType extends Schema.CollectionType {
  collectionName: "facility_types";
  info: {
    singularName: "facility-type";
    pluralName: "facility-types";
    displayName: "Facility-type";
    name: "facility-type";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    facilityNumber: Attribute.Integer;
    facilityName: Attribute.String;
    facilityCode: Attribute.String;
    icon: Attribute.String;
    iconNA: Attribute.String;
    rank: Attribute.String;
    note: Attribute.String;
    isActive: Attribute.Boolean;
    isCamping: Attribute.Boolean;
    defaultDescription: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    appendStandardCalloutText: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    parkOperationSubAreas: Attribute.Relation<
      "api::facility-type.facility-type",
      "oneToMany",
      "api::park-operation-sub-area.park-operation-sub-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::facility-type.facility-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::facility-type.facility-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiFireBanProhibitionFireBanProhibition
  extends Schema.CollectionType {
  collectionName: "fire_ban_prohibitions";
  info: {
    singularName: "fire-ban-prohibition";
    pluralName: "fire-ban-prohibitions";
    displayName: "Fire-ban-prohibition";
    name: "fire-ban-prohibition";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    type: Attribute.String;
    prohibitionDescription: Attribute.String;
    effectiveDate: Attribute.DateTime;
    bulletinURL: Attribute.String;
    fireCentre: Attribute.Relation<
      "api::fire-ban-prohibition.fire-ban-prohibition",
      "oneToOne",
      "api::fire-centre.fire-centre"
    >;
    fireZone: Attribute.Relation<
      "api::fire-ban-prohibition.fire-ban-prohibition",
      "oneToOne",
      "api::fire-zone.fire-zone"
    >;
    fireCentreSource: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::fire-ban-prohibition.fire-ban-prohibition",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::fire-ban-prohibition.fire-ban-prohibition",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiFireCentreFireCentre extends Schema.CollectionType {
  collectionName: "fire_centres";
  info: {
    singularName: "fire-centre";
    pluralName: "fire-centres";
    displayName: "Fire-centre";
    name: "fire-centre";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    fireCentreNumber: Attribute.Integer;
    fireCentreName: Attribute.String;
    fireZones: Attribute.Relation<
      "api::fire-centre.fire-centre",
      "oneToMany",
      "api::fire-zone.fire-zone"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::fire-centre.fire-centre",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::fire-centre.fire-centre",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiFireZoneFireZone extends Schema.CollectionType {
  collectionName: "fire_zones";
  info: {
    singularName: "fire-zone";
    pluralName: "fire-zones";
    displayName: "Fire-zone";
    name: "fire-zone";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    fireZoneNumber: Attribute.Integer;
    fireZoneName: Attribute.String;
    headquartersCityName: Attribute.String;
    fireCentre: Attribute.Relation<
      "api::fire-zone.fire-zone",
      "manyToOne",
      "api::fire-centre.fire-centre"
    >;
    protectedAreas: Attribute.Relation<
      "api::fire-zone.fire-zone",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::fire-zone.fire-zone",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::fire-zone.fire-zone",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiLegacyRedirectLegacyRedirect extends Schema.CollectionType {
  collectionName: "legacy_redirects";
  info: {
    singularName: "legacy-redirect";
    pluralName: "legacy-redirects";
    displayName: "Legacy-redirect";
    name: "legacy-redirect";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    fromPath: Attribute.String;
    toPath: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::legacy-redirect.legacy-redirect",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::legacy-redirect.legacy-redirect",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiLinkLink extends Schema.CollectionType {
  collectionName: "links";
  info: {
    singularName: "link";
    pluralName: "links";
    displayName: "Link";
    name: "link";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    url: Attribute.String;
    type: Attribute.Relation<
      "api::link.link",
      "oneToOne",
      "api::link-type.link-type"
    >;
    file: Attribute.Media;
    publicAdvisoryAudit: Attribute.Relation<
      "api::link.link",
      "manyToOne",
      "api::public-advisory-audit.public-advisory-audit"
    >;
    publicAdvisory: Attribute.Relation<
      "api::link.link",
      "manyToOne",
      "api::public-advisory.public-advisory"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::link.link", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"api::link.link", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface ApiLinkTypeLinkType extends Schema.CollectionType {
  collectionName: "link_types";
  info: {
    singularName: "link-type";
    pluralName: "link-types";
    displayName: "Link-type";
    name: "link-type";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    type: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::link-type.link-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::link-type.link-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiManagementAreaManagementArea extends Schema.CollectionType {
  collectionName: "management_areas";
  info: {
    singularName: "management-area";
    pluralName: "management-areas";
    displayName: "Management-area";
    name: "management-area";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    managementAreaNumber: Attribute.Integer &
      Attribute.Required &
      Attribute.Unique;
    managementAreaName: Attribute.String;
    section: Attribute.Relation<
      "api::management-area.management-area",
      "manyToOne",
      "api::section.section"
    >;
    protectedAreas: Attribute.Relation<
      "api::management-area.management-area",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    region: Attribute.Relation<
      "api::management-area.management-area",
      "manyToOne",
      "api::region.region"
    >;
    searchArea: Attribute.Relation<
      "api::management-area.management-area",
      "manyToOne",
      "api::search-area.search-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::management-area.management-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::management-area.management-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiManagementDocumentManagementDocument
  extends Schema.CollectionType {
  collectionName: "management_documents";
  info: {
    singularName: "management-document";
    pluralName: "management-documents";
    displayName: "Management-document";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    url: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    documentDate: Attribute.Date & Attribute.Required;
    documentType: Attribute.Relation<
      "api::management-document.management-document",
      "manyToOne",
      "api::management-document-type.management-document-type"
    > &
      Attribute.Required;
    protectedAreas: Attribute.Relation<
      "api::management-document.management-document",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    sites: Attribute.Relation<
      "api::management-document.management-document",
      "manyToMany",
      "api::site.site"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::management-document.management-document",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::management-document.management-document",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiManagementDocumentTypeManagementDocumentType
  extends Schema.CollectionType {
  collectionName: "management_document_types";
  info: {
    singularName: "management-document-type";
    pluralName: "management-document-types";
    displayName: "Management-document-type";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    documentCode: Attribute.String & Attribute.Required;
    documentType: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    managementDocuments: Attribute.Relation<
      "api::management-document-type.management-document-type",
      "oneToMany",
      "api::management-document.management-document"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::management-document-type.management-document-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::management-document-type.management-document-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiMarineEcosectionMarineEcosection
  extends Schema.CollectionType {
  collectionName: "marine_ecosections";
  info: {
    singularName: "marine-ecosection";
    pluralName: "marine-ecosections";
    displayName: "Marine-ecosection";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    marineEcosectionId: Attribute.Integer;
    marineEcosection: Attribute.String;
    marineEcosectionCode: Attribute.String;
    protectedAreas: Attribute.Relation<
      "api::marine-ecosection.marine-ecosection",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::marine-ecosection.marine-ecosection",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::marine-ecosection.marine-ecosection",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiMenuMenu extends Schema.CollectionType {
  collectionName: "menus";
  info: {
    singularName: "menu";
    pluralName: "menus";
    displayName: "Menu";
    name: "menu";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    url: Attribute.String;
    pageType: Attribute.Enumeration<["Landing", "Unique", "Content", "Form"]>;
    order: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    parent: Attribute.Relation<"api::menu.menu", "manyToOne", "api::menu.menu">;
    children: Attribute.Relation<
      "api::menu.menu",
      "oneToMany",
      "api::menu.menu"
    >;
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::menu.menu", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"api::menu.menu", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: "pages";
  info: {
    singularName: "page";
    pluralName: "pages";
    displayName: "Page";
    name: "page";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    Slug: Attribute.String & Attribute.Required;
    Title: Attribute.String;
    Template: Attribute.Enumeration<["staticLanding1", "staticContent1"]> &
      Attribute.Required;
    Content: Attribute.DynamicZone<
      [
        "parks.html-area",
        "parks.seo",
        "parks.link-card",
        "parks.page-section",
        "parks.page-header",
        "parks.card-set"
      ]
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::page.page", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"api::page.page", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface ApiParkAccessStatusParkAccessStatus
  extends Schema.CollectionType {
  collectionName: "park_access_statuses";
  info: {
    singularName: "park-access-status";
    pluralName: "park-access-statuses";
    displayName: "Park-access-status";
    name: "park-access-status";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    orcs: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-access-status.park-access-status",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-access-status.park-access-status",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkActivityParkActivity extends Schema.CollectionType {
  collectionName: "park_activities";
  info: {
    singularName: "park-activity";
    pluralName: "park-activities";
    displayName: "Park-activity";
    name: "park-activity";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    isActivityOpen: Attribute.Boolean;
    isActive: Attribute.Boolean;
    hideStandardCallout: Attribute.Boolean & Attribute.DefaultTo<false>;
    protectedArea: Attribute.Relation<
      "api::park-activity.park-activity",
      "manyToOne",
      "api::protected-area.protected-area"
    >;
    site: Attribute.Relation<
      "api::park-activity.park-activity",
      "manyToOne",
      "api::site.site"
    >;
    activityType: Attribute.Relation<
      "api::park-activity.park-activity",
      "oneToOne",
      "api::activity-type.activity-type"
    >;
    modifiedBy: Attribute.String;
    modifiedDate: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-activity.park-activity",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-activity.park-activity",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkFacilityParkFacility extends Schema.CollectionType {
  collectionName: "park_facilities";
  info: {
    singularName: "park-facility";
    pluralName: "park-facilities";
    displayName: "Park-facility";
    name: "park-facility";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    isFacilityOpen: Attribute.Boolean;
    isActive: Attribute.Boolean;
    hideStandardCallout: Attribute.Boolean & Attribute.DefaultTo<false>;
    protectedArea: Attribute.Relation<
      "api::park-facility.park-facility",
      "manyToOne",
      "api::protected-area.protected-area"
    >;
    site: Attribute.Relation<
      "api::park-facility.park-facility",
      "manyToOne",
      "api::site.site"
    >;
    facilityType: Attribute.Relation<
      "api::park-facility.park-facility",
      "oneToOne",
      "api::facility-type.facility-type"
    >;
    modifiedBy: Attribute.String;
    modifiedDate: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-facility.park-facility",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-facility.park-facility",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkNameParkName extends Schema.CollectionType {
  collectionName: "park_names";
  info: {
    singularName: "park-name";
    pluralName: "park-names";
    displayName: "Park-name";
    name: "park-name";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    parkName: Attribute.String;
    source: Attribute.String;
    note: Attribute.String;
    parkNameType: Attribute.Relation<
      "api::park-name.park-name",
      "oneToOne",
      "api::park-name-type.park-name-type"
    >;
    protectedArea: Attribute.Relation<
      "api::park-name.park-name",
      "manyToOne",
      "api::protected-area.protected-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-name.park-name",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-name.park-name",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkNameTypeParkNameType extends Schema.CollectionType {
  collectionName: "park_name_types";
  info: {
    singularName: "park-name-type";
    pluralName: "park-name-types";
    displayName: "Park-name-type";
    name: "park-name-type";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    nameTypeId: Attribute.Integer;
    nameType: Attribute.String;
    description: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-name-type.park-name-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-name-type.park-name-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkOperationParkOperation extends Schema.CollectionType {
  collectionName: "park_operations";
  info: {
    singularName: "park-operation";
    pluralName: "park-operations";
    displayName: "Park-operation";
    name: "park-operation";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    orcsSiteNumber: Attribute.String;
    isActive: Attribute.Boolean;
    hasReservations: Attribute.Boolean;
    openDate: Attribute.Date;
    closeDate: Attribute.Date;
    isDateRangeAnnual: Attribute.Boolean;
    hasFirstComeFirstServed: Attribute.Boolean;
    hasBackcountryReservations: Attribute.Boolean;
    hasBackcountryPermits: Attribute.Boolean;
    hasDayUsePass: Attribute.Boolean;
    reservationUrl: Attribute.String;
    backcountryReservationUrl: Attribute.String;
    backcountryPermitUrl: Attribute.String;
    dayUsePassUrl: Attribute.String;
    hasParkGate: Attribute.Boolean;
    offSeasonUse: Attribute.Boolean;
    totalCapacity: Attribute.String;
    frontcountrySites: Attribute.String;
    reservableSites: Attribute.String;
    nonReservableSites: Attribute.String;
    vehicleSites: Attribute.String;
    vehicleSitesReservable: Attribute.String;
    doubleSites: Attribute.String;
    pullThroughSites: Attribute.String;
    rvSites: Attribute.String;
    rvSitesReservable: Attribute.String;
    electrifiedSites: Attribute.String;
    longStaySites: Attribute.String;
    walkInSites: Attribute.String;
    walkInSitesReservable: Attribute.String;
    groupSites: Attribute.String;
    groupSitesReservable: Attribute.String;
    backcountrySites: Attribute.String;
    wildernessSites: Attribute.String;
    boatAccessSites: Attribute.String;
    horseSites: Attribute.String;
    cabins: Attribute.String;
    huts: Attribute.String;
    yurts: Attribute.String;
    shelters: Attribute.String;
    boatLaunches: Attribute.String;
    openNote: Attribute.Text;
    serviceNote: Attribute.Text;
    reservationsNote: Attribute.Text;
    offSeasonNote: Attribute.Text;
    generalNote: Attribute.Text;
    adminNote: Attribute.Text;
    protectedArea: Attribute.Relation<
      "api::park-operation.park-operation",
      "oneToOne",
      "api::protected-area.protected-area"
    >;
    site: Attribute.Relation<
      "api::park-operation.park-operation",
      "oneToOne",
      "api::site.site"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-operation.park-operation",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-operation.park-operation",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkOperationSubAreaParkOperationSubArea
  extends Schema.CollectionType {
  collectionName: "park_operation_sub_areas";
  info: {
    singularName: "park-operation-sub-area";
    pluralName: "park-operation-sub-areas";
    displayName: "Park-operation-sub-area";
    name: "park-operation-sub-area";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    parkSubAreaId: Attribute.Integer;
    parkSubAreaTypeId: Attribute.Integer;
    parkSubArea: Attribute.String;
    parkSubAreaType: Attribute.Relation<
      "api::park-operation-sub-area.park-operation-sub-area",
      "manyToOne",
      "api::park-operation-sub-area-type.park-operation-sub-area-type"
    >;
    protectedArea: Attribute.Relation<
      "api::park-operation-sub-area.park-operation-sub-area",
      "manyToOne",
      "api::protected-area.protected-area"
    >;
    parkOperationSubAreaDates: Attribute.Relation<
      "api::park-operation-sub-area.park-operation-sub-area",
      "oneToMany",
      "api::park-operation-sub-area-date.park-operation-sub-area-date"
    >;
    orcsSiteNumber: Attribute.String;
    isActive: Attribute.Boolean;
    isOpen: Attribute.Boolean;
    hasReservations: Attribute.Boolean;
    hasFirstComeFirstServed: Attribute.Boolean;
    hasBackcountryPermits: Attribute.Boolean;
    hasBackcountryReservations: Attribute.Boolean;
    isCleanAirSite: Attribute.Boolean;
    totalCapacity: Attribute.String;
    frontcountrySites: Attribute.String;
    reservableSites: Attribute.String;
    nonReservableSites: Attribute.String;
    vehicleSites: Attribute.String;
    vehicleSitesReservable: Attribute.String;
    doubleSites: Attribute.String;
    pullThroughSites: Attribute.String;
    rvSites: Attribute.String;
    rvSitesReservable: Attribute.String;
    electrifiedSites: Attribute.String;
    longStaySites: Attribute.String;
    walkInSites: Attribute.String;
    walkInSitesReservable: Attribute.String;
    groupSites: Attribute.String;
    groupSitesReservable: Attribute.String;
    backcountrySites: Attribute.String;
    wildernessSites: Attribute.String;
    boatAccessSites: Attribute.String;
    horseSites: Attribute.String;
    cabins: Attribute.String;
    huts: Attribute.String;
    yurts: Attribute.String;
    shelters: Attribute.String;
    boatLaunches: Attribute.String;
    openNote: Attribute.Text;
    serviceNote: Attribute.Text;
    reservationNote: Attribute.Text;
    offSeasonNote: Attribute.Text;
    adminNote: Attribute.Text;
    parkAccessUnitId: Attribute.Integer;
    facilityType: Attribute.Relation<
      "api::park-operation-sub-area.park-operation-sub-area",
      "manyToOne",
      "api::facility-type.facility-type"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-operation-sub-area.park-operation-sub-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-operation-sub-area.park-operation-sub-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkOperationSubAreaDateParkOperationSubAreaDate
  extends Schema.CollectionType {
  collectionName: "park_operation_sub_area_dates";
  info: {
    singularName: "park-operation-sub-area-date";
    pluralName: "park-operation-sub-area-dates";
    displayName: "Park-operation-sub-area-date";
    name: "park-operation-sub-area-date";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    operatingYear: Attribute.Integer;
    parkOperationSubArea: Attribute.Relation<
      "api::park-operation-sub-area-date.park-operation-sub-area-date",
      "manyToOne",
      "api::park-operation-sub-area.park-operation-sub-area"
    >;
    isActive: Attribute.Boolean;
    openDate: Attribute.Date;
    closeDate: Attribute.Date;
    serviceStartDate: Attribute.Date;
    serviceEndDate: Attribute.Date;
    reservationStartDate: Attribute.Date;
    reservationEndDate: Attribute.Date;
    offSeasonStartDate: Attribute.Date;
    offSeasonEndDate: Attribute.Date;
    adminNote: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-operation-sub-area-date.park-operation-sub-area-date",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-operation-sub-area-date.park-operation-sub-area-date",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkOperationSubAreaTypeParkOperationSubAreaType
  extends Schema.CollectionType {
  collectionName: "park_operation_sub_area_types";
  info: {
    singularName: "park-operation-sub-area-type";
    pluralName: "park-operation-sub-area-types";
    displayName: "Park-operation-sub-area-type";
    name: "park-operation-sub-area-type";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    subAreaType: Attribute.String;
    subAreaTypeCode: Attribute.String;
    iconUrl: Attribute.String;
    isActive: Attribute.Boolean;
    subAreaTypeId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parkOperationSubAreas: Attribute.Relation<
      "api::park-operation-sub-area-type.park-operation-sub-area-type",
      "oneToMany",
      "api::park-operation-sub-area.park-operation-sub-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-operation-sub-area-type.park-operation-sub-area-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-operation-sub-area-type.park-operation-sub-area-type",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkPhotoParkPhoto extends Schema.CollectionType {
  collectionName: "park_photos";
  info: {
    singularName: "park-photo";
    pluralName: "park-photos";
    displayName: "Park-photo";
    name: "park-photo";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    orcs: Attribute.Integer;
    orcsSiteNumber: Attribute.String;
    title: Attribute.String;
    caption: Attribute.String & Attribute.Required;
    subject: Attribute.String;
    dateTaken: Attribute.Date;
    photographer: Attribute.String;
    isActive: Attribute.Boolean;
    imageUrl: Attribute.String;
    isFeatured: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    sortOrder: Attribute.Integer &
      Attribute.Required &
      Attribute.DefaultTo<100>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-photo.park-photo",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-photo.park-photo",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiParkSubPageParkSubPage extends Schema.CollectionType {
  collectionName: "park_sub_pages";
  info: {
    singularName: "park-sub-page";
    pluralName: "park-sub-pages";
    displayName: "Park-sub-page";
    name: "park-sub-page";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    oldUrl: Attribute.String;
    seo: Attribute.Component<"parks.seo">;
    pageHeader: Attribute.Component<"parks.page-header">;
    content: Attribute.DynamicZone<["parks.html-area", "parks.page-section"]>;
    protectedArea: Attribute.Relation<
      "api::park-sub-page.park-sub-page",
      "manyToOne",
      "api::protected-area.protected-area"
    > &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::park-sub-page.park-sub-page",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::park-sub-page.park-sub-page",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiProtectedAreaProtectedArea extends Schema.CollectionType {
  collectionName: "protected_areas";
  info: {
    singularName: "protected-area";
    pluralName: "protected-areas";
    displayName: "Protected-area";
    name: "protected-area";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
    privateAttributes: ["search_text", "search_rank"];
  };
  attributes: {
    orcs: Attribute.Integer & Attribute.Required & Attribute.Unique;
    protectedAreaName: Attribute.String;
    totalArea: Attribute.Decimal;
    uplandArea: Attribute.Decimal;
    marineArea: Attribute.Decimal;
    marineProtectedArea: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 1;
      }>;
    type: Attribute.String;
    class: Attribute.String;
    establishedDate: Attribute.Date;
    repealedDate: Attribute.Date;
    status: Attribute.String;
    url: Attribute.String;
    oldUrl: Attribute.String;
    typeCode: Attribute.Enumeration<["PK", "PA", "RA", "ER", "CS"]>;
    latitude: Attribute.Float;
    longitude: Attribute.Float;
    mapZoom: Attribute.Integer;
    isFogZone: Attribute.Boolean;
    featureId: Attribute.Integer;
    sites: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::site.site"
    >;
    parkActivities: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::park-activity.park-activity"
    >;
    parkFacilities: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::park-facility.park-facility"
    >;
    parkNames: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::park-name.park-name"
    >;
    hasCampfireBan: Attribute.Boolean;
    hasSmokingBan: Attribute.Boolean;
    fireZones: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::fire-zone.fire-zone"
    >;
    managementAreas: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::management-area.management-area"
    >;
    hasCampfireBanOverride: Attribute.Boolean;
    hasSmokingBanOverride: Attribute.Boolean;
    campfireBanEffectiveDate: Attribute.Date;
    campfireBanRescindedDate: Attribute.Date;
    description: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    safetyInfo: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    specialNotes: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    locationNotes: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    parkContact: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    reservations: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    maps: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    managementPlanning: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    natureAndCulture: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    partnerships: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    purpose: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    reconciliationNotes: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    slug: Attribute.String & Attribute.Required;
    isDisplayed: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    parkOperationSubAreas: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::park-operation-sub-area.park-operation-sub-area"
    >;
    parkOperation: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToOne",
      "api::park-operation.park-operation"
    >;
    parkSubPages: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::park-sub-page.park-sub-page"
    >;
    seo: Attribute.Component<"parks.seo">;
    publicAdvisories: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::public-advisory.public-advisory"
    >;
    parkPhotos: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToMany",
      "api::park-photo.park-photo"
    >;
    managementDocuments: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::management-document.management-document"
    >;
    biogeoclimaticZones: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::biogeoclimatic-zone.biogeoclimatic-zone"
    >;
    marineEcosections: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::marine-ecosection.marine-ecosection"
    >;
    terrestrialEcosections: Attribute.Relation<
      "api::protected-area.protected-area",
      "manyToMany",
      "api::terrestrial-ecosection.terrestrial-ecosection"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::protected-area.protected-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiPublicAdvisoryPublicAdvisory extends Schema.CollectionType {
  collectionName: "public_advisories";
  info: {
    singularName: "public-advisory";
    pluralName: "public-advisories";
    displayName: "Public-advisory";
    name: "public-advisory";
    description: "";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
    privateAttributes: [];
  };
  attributes: {
    advisoryNumber: Attribute.Integer;
    revisionNumber: Attribute.Integer;
    title: Attribute.String;
    description: Attribute.Text;
    dcTicketNumber: Attribute.Text;
    isSafetyRelated: Attribute.Boolean;
    listingRank: Attribute.Integer &
      Attribute.Required &
      Attribute.DefaultTo<0>;
    note: Attribute.Text;
    latitude: Attribute.Float;
    longitude: Attribute.Float;
    mapZoom: Attribute.Integer;
    isReservationsAffected: Attribute.Boolean;
    isAdvisoryDateDisplayed: Attribute.Boolean;
    isEffectiveDateDisplayed: Attribute.Boolean;
    isEndDateDisplayed: Attribute.Boolean;
    isUpdatedDateDisplayed: Attribute.Boolean;
    submittedBy: Attribute.String;
    createdDate: Attribute.DateTime;
    advisoryDate: Attribute.DateTime;
    effectiveDate: Attribute.DateTime;
    endDate: Attribute.DateTime;
    expiryDate: Attribute.DateTime;
    removalDate: Attribute.DateTime;
    updatedDate: Attribute.DateTime;
    modifiedDate: Attribute.DateTime;
    modifiedBy: Attribute.String;
    accessStatus: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToOne",
      "api::access-status.access-status"
    >;
    eventType: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToOne",
      "api::event-type.event-type"
    >;
    urgency: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToOne",
      "api::urgency.urgency"
    >;
    advisoryStatus: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToOne",
      "api::advisory-status.advisory-status"
    >;
    links: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::link.link"
    >;
    regions: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::region.region"
    >;
    sections: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::section.section"
    >;
    managementAreas: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::management-area.management-area"
    >;
    fireZones: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::fire-zone.fire-zone"
    >;
    sites: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::site.site"
    >;
    fireCentres: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::fire-centre.fire-centre"
    >;
    standardMessages: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToMany",
      "api::standard-message.standard-message"
    >;
    protectedAreas: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::public-advisory.public-advisory",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiPublicAdvisoryAuditPublicAdvisoryAudit
  extends Schema.CollectionType {
  collectionName: "public_advisory_audits";
  info: {
    singularName: "public-advisory-audit";
    pluralName: "public-advisory-audits";
    displayName: "Public-advisory-audit";
    name: "public-advisory-audit";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    advisoryNumber: Attribute.Integer;
    revisionNumber: Attribute.Integer;
    isLatestRevision: Attribute.Boolean;
    title: Attribute.String;
    description: Attribute.Text;
    dcTicketNumber: Attribute.Text;
    isSafetyRelated: Attribute.Boolean;
    listingRank: Attribute.Integer &
      Attribute.Required &
      Attribute.DefaultTo<0>;
    note: Attribute.Text;
    latitude: Attribute.Float;
    longitude: Attribute.Float;
    mapZoom: Attribute.Integer;
    isReservationsAffected: Attribute.Boolean;
    isAdvisoryDateDisplayed: Attribute.Boolean;
    isEffectiveDateDisplayed: Attribute.Boolean;
    isEndDateDisplayed: Attribute.Boolean;
    isUpdatedDateDisplayed: Attribute.Boolean;
    submittedBy: Attribute.String;
    createdDate: Attribute.DateTime;
    advisoryDate: Attribute.DateTime;
    effectiveDate: Attribute.DateTime;
    endDate: Attribute.DateTime;
    expiryDate: Attribute.DateTime;
    removalDate: Attribute.DateTime;
    updatedDate: Attribute.DateTime;
    modifiedDate: Attribute.DateTime;
    modifiedBy: Attribute.String;
    accessStatus: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToOne",
      "api::access-status.access-status"
    >;
    eventType: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToOne",
      "api::event-type.event-type"
    >;
    urgency: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToOne",
      "api::urgency.urgency"
    >;
    advisoryStatus: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToOne",
      "api::advisory-status.advisory-status"
    >;
    protectedAreas: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::protected-area.protected-area"
    >;
    links: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::link.link"
    >;
    regions: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::region.region"
    >;
    sections: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::section.section"
    >;
    managementAreas: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::management-area.management-area"
    >;
    fireZones: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::fire-zone.fire-zone"
    >;
    sites: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::site.site"
    >;
    fireCentres: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::fire-centre.fire-centre"
    >;
    standardMessages: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToMany",
      "api::standard-message.standard-message"
    >;
    publishedRevisionNumber: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::public-advisory-audit.public-advisory-audit",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiQueuedTaskQueuedTask extends Schema.CollectionType {
  collectionName: "queued_tasks";
  info: {
    singularName: "queued-task";
    pluralName: "queued-tasks";
    displayName: "Queued-task";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    numericData: Attribute.Integer;
    jsonData: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::queued-task.queued-task",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::queued-task.queued-task",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiRegionRegion extends Schema.CollectionType {
  collectionName: "regions";
  info: {
    singularName: "region";
    pluralName: "regions";
    displayName: "Region";
    name: "region";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    regionNumber: Attribute.Integer & Attribute.Required & Attribute.Unique;
    regionName: Attribute.String;
    sections: Attribute.Relation<
      "api::region.region",
      "oneToMany",
      "api::section.section"
    >;
    managementAreas: Attribute.Relation<
      "api::region.region",
      "oneToMany",
      "api::management-area.management-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::region.region",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::region.region",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiSearchAreaSearchArea extends Schema.CollectionType {
  collectionName: "search_areas";
  info: {
    singularName: "search-area";
    pluralName: "search-areas";
    displayName: "Search-area";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    searchAreaName: Attribute.String;
    rank: Attribute.Integer & Attribute.Required & Attribute.Unique;
    managementAreas: Attribute.Relation<
      "api::search-area.search-area",
      "oneToMany",
      "api::management-area.management-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::search-area.search-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::search-area.search-area",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiSectionSection extends Schema.CollectionType {
  collectionName: "sections";
  info: {
    singularName: "section";
    pluralName: "sections";
    displayName: "Section";
    name: "section";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    sectionNumber: Attribute.Integer & Attribute.Required & Attribute.Unique;
    sectionName: Attribute.String;
    region: Attribute.Relation<
      "api::section.section",
      "manyToOne",
      "api::region.region"
    >;
    managementAreas: Attribute.Relation<
      "api::section.section",
      "oneToMany",
      "api::management-area.management-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::section.section",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::section.section",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiSiteSite extends Schema.CollectionType {
  collectionName: "sites";
  info: {
    singularName: "site";
    pluralName: "sites";
    displayName: "Site";
    name: "site";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    slug: Attribute.String;
    siteName: Attribute.String & Attribute.Required;
    siteNumber: Attribute.Integer;
    status: Attribute.String;
    isDisplayed: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    establishedDate: Attribute.Date;
    repealedDate: Attribute.Date;
    url: Attribute.String;
    latitude: Attribute.Float;
    longitude: Attribute.Float;
    mapZoom: Attribute.Integer;
    orcsSiteNumber: Attribute.String & Attribute.Required & Attribute.Unique;
    protectedArea: Attribute.Relation<
      "api::site.site",
      "manyToOne",
      "api::protected-area.protected-area"
    > &
      Attribute.Required;
    parkActivities: Attribute.Relation<
      "api::site.site",
      "oneToMany",
      "api::park-activity.park-activity"
    >;
    parkFacilities: Attribute.Relation<
      "api::site.site",
      "oneToMany",
      "api::park-facility.park-facility"
    >;
    isUnofficialSite: Attribute.Boolean;
    note: Attribute.String;
    description: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    locationNotes: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    reservations: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    parkOperation: Attribute.Relation<
      "api::site.site",
      "oneToOne",
      "api::park-operation.park-operation"
    >;
    managementDocuments: Attribute.Relation<
      "api::site.site",
      "manyToMany",
      "api::management-document.management-document"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::site.site", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"api::site.site", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface ApiStandardMessageStandardMessage
  extends Schema.CollectionType {
  collectionName: "standard_messages";
  info: {
    singularName: "standard-message";
    pluralName: "standard-messages";
    displayName: "Standard-message";
    name: "standard-message";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    eventType: Attribute.Relation<
      "api::standard-message.standard-message",
      "oneToOne",
      "api::event-type.event-type"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::standard-message.standard-message",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::standard-message.standard-message",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiStatutoryHolidayStatutoryHoliday extends Schema.SingleType {
  collectionName: "statutory_holidays";
  info: {
    singularName: "statutory-holiday";
    pluralName: "statutory-holidays";
    displayName: "Statutory-holiday";
    name: "statutory-holiday";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    data: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::statutory-holiday.statutory-holiday",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::statutory-holiday.statutory-holiday",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiTerrestrialEcosectionTerrestrialEcosection
  extends Schema.CollectionType {
  collectionName: "terrestrial_ecosections";
  info: {
    singularName: "terrestrial-ecosection";
    pluralName: "terrestrial-ecosections";
    displayName: "Terrestrial-ecosection";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    terrestrialEcosectionId: Attribute.Integer;
    terrestrialEcosection: Attribute.String;
    terrestrialEcosectionCode: Attribute.String;
    parentEcoregionCode: Attribute.String;
    protectedAreas: Attribute.Relation<
      "api::terrestrial-ecosection.terrestrial-ecosection",
      "manyToMany",
      "api::protected-area.protected-area"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::terrestrial-ecosection.terrestrial-ecosection",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::terrestrial-ecosection.terrestrial-ecosection",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiUrgencyUrgency extends Schema.CollectionType {
  collectionName: "urgencies";
  info: {
    singularName: "urgency";
    pluralName: "urgencies";
    displayName: "Urgency";
    name: "urgency";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    urgency: Attribute.String;
    code: Attribute.String;
    sequence: Attribute.Integer;
    color: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::urgency.urgency",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::urgency.urgency",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiWebsiteWebsite extends Schema.CollectionType {
  collectionName: "websites";
  info: {
    singularName: "website";
    pluralName: "websites";
    displayName: "Website";
    name: "website";
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: true;
  };
  attributes: {
    Name: Attribute.String;
    homepage: Attribute.Relation<
      "api::website.website",
      "oneToOne",
      "api::page.page"
    >;
    Header: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    Navigation: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    Footer: Attribute.RichText &
      Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "toolbar";
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::website.website",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::website.website",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

declare module "@strapi/strapi" {
  export module Shared {
    export interface ContentTypes {
      "admin::permission": AdminPermission;
      "admin::user": AdminUser;
      "admin::role": AdminRole;
      "admin::api-token": AdminApiToken;
      "admin::api-token-permission": AdminApiTokenPermission;
      "admin::transfer-token": AdminTransferToken;
      "admin::transfer-token-permission": AdminTransferTokenPermission;
      "plugin::upload.file": PluginUploadFile;
      "plugin::upload.folder": PluginUploadFolder;
      "plugin::users-permissions.permission": PluginUsersPermissionsPermission;
      "plugin::users-permissions.role": PluginUsersPermissionsRole;
      "plugin::users-permissions.user": PluginUsersPermissionsUser;
      "api::access-status.access-status": ApiAccessStatusAccessStatus;
      "api::activity-type.activity-type": ApiActivityTypeActivityType;
      "api::advisory-status.advisory-status": ApiAdvisoryStatusAdvisoryStatus;
      "api::asset-type.asset-type": ApiAssetTypeAssetType;
      "api::biogeoclimatic-zone.biogeoclimatic-zone": ApiBiogeoclimaticZoneBiogeoclimaticZone;
      "api::business-hour.business-hour": ApiBusinessHourBusinessHour;
      "api::event-type.event-type": ApiEventTypeEventType;
      "api::facility-type.facility-type": ApiFacilityTypeFacilityType;
      "api::fire-ban-prohibition.fire-ban-prohibition": ApiFireBanProhibitionFireBanProhibition;
      "api::fire-centre.fire-centre": ApiFireCentreFireCentre;
      "api::fire-zone.fire-zone": ApiFireZoneFireZone;
      "api::legacy-redirect.legacy-redirect": ApiLegacyRedirectLegacyRedirect;
      "api::link.link": ApiLinkLink;
      "api::link-type.link-type": ApiLinkTypeLinkType;
      "api::management-area.management-area": ApiManagementAreaManagementArea;
      "api::management-document.management-document": ApiManagementDocumentManagementDocument;
      "api::management-document-type.management-document-type": ApiManagementDocumentTypeManagementDocumentType;
      "api::marine-ecosection.marine-ecosection": ApiMarineEcosectionMarineEcosection;
      "api::menu.menu": ApiMenuMenu;
      "api::page.page": ApiPagePage;
      "api::park-access-status.park-access-status": ApiParkAccessStatusParkAccessStatus;
      "api::park-activity.park-activity": ApiParkActivityParkActivity;
      "api::park-facility.park-facility": ApiParkFacilityParkFacility;
      "api::park-name.park-name": ApiParkNameParkName;
      "api::park-name-type.park-name-type": ApiParkNameTypeParkNameType;
      "api::park-operation.park-operation": ApiParkOperationParkOperation;
      "api::park-operation-sub-area.park-operation-sub-area": ApiParkOperationSubAreaParkOperationSubArea;
      "api::park-operation-sub-area-date.park-operation-sub-area-date": ApiParkOperationSubAreaDateParkOperationSubAreaDate;
      "api::park-operation-sub-area-type.park-operation-sub-area-type": ApiParkOperationSubAreaTypeParkOperationSubAreaType;
      "api::park-photo.park-photo": ApiParkPhotoParkPhoto;
      "api::park-sub-page.park-sub-page": ApiParkSubPageParkSubPage;
      "api::protected-area.protected-area": ApiProtectedAreaProtectedArea;
      "api::public-advisory.public-advisory": ApiPublicAdvisoryPublicAdvisory;
      "api::public-advisory-audit.public-advisory-audit": ApiPublicAdvisoryAuditPublicAdvisoryAudit;
      "api::queued-task.queued-task": ApiQueuedTaskQueuedTask;
      "api::region.region": ApiRegionRegion;
      "api::search-area.search-area": ApiSearchAreaSearchArea;
      "api::section.section": ApiSectionSection;
      "api::site.site": ApiSiteSite;
      "api::standard-message.standard-message": ApiStandardMessageStandardMessage;
      "api::statutory-holiday.statutory-holiday": ApiStatutoryHolidayStatutoryHoliday;
      "api::terrestrial-ecosection.terrestrial-ecosection": ApiTerrestrialEcosectionTerrestrialEcosection;
      "api::urgency.urgency": ApiUrgencyUrgency;
      "api::website.website": ApiWebsiteWebsite;
    }
  }
}
