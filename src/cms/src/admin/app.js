import ckeditor5Dll from "ckeditor5/build/ckeditor5-dll.js";
import ckeditor5MrkdownDll from "@ckeditor/ckeditor5-markdown-gfm/build/markdown-gfm.js";

import MenuLogoProd from './extensions/bcid-icon.png';
import MenuLogoDev from './extensions/dev-icon.png';
import MenuLogoTest from './extensions/test-icon.png';
import MenuLogoLocal from './extensions/local-icon.png';

let envBanner = "Strapi"
let MenuLogo = null

switch (process?.env.STRAPI_ADMIN_ENVIRONMENT) {
  case "local":
    MenuLogo = MenuLogoLocal
    envBanner = "Local environment"
    break
  case "dev":
    MenuLogo = MenuLogoDev
    envBanner = "Dev environment"
    break
  case "alpha-dev":
    MenuLogo = MenuLogoDev
    envBanner = "Alpha dev environment"
    break
  case "test":
    MenuLogo = MenuLogoTest
    envBanner = "Test environment"
    break
  case "alpha-test":
    MenuLogo = MenuLogoTest
    envBanner = "Alpha test environment"
    break
  case "prod":
    MenuLogo = MenuLogoProd
    envBanner = "Production environment"
    break
}

const config = {
  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": envBanner,
      "app.components.LeftMenu.navbrand.workplace": "Dashboard"
    },
  },
  menu: {
    logo: MenuLogo,
  }
};

const bootstrap = (app) => { };

export default {
  config,
  bootstrap,
};