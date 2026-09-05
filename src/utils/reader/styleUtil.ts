import { getIframeDoc } from "./docUtil";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { applyThemeColor, removeThemeColor } from "./themeUtil";
import { StyleHelper } from "../../assets/lib/kookit.min";
import FontUtil from "../file/fontUtil";
import { pickReadableCounterColor } from "../common";

class styleUtil {
  // add default css for iframe
  static addDefaultCss(bookKey: string) {
    let doc = getIframeDoc("ANY")[0];
    if (!doc) return;
    if (!doc.head) {
      return;
    }
    //get style with id of default-style
    let styleElement = doc.getElementById("default-style");
    if (styleElement) {
      styleElement.textContent = this.getDefaultCss(bookKey);
    } else {
      let css = this.getDefaultCss(bookKey);
      let style = doc.createElement("style");
      style.id = "default-style";
      style.textContent = css;
      doc.head.appendChild(style);
    }
    // force a legible text color for the app's own reading theme - see
    // getLegibilityCss for why this can't just be left to the engine's own
    // default-style rule
    let legibilityElement = doc.getElementById("legibility-style");
    const legibilityCss = this.getLegibilityCss();
    if (legibilityElement) {
      legibilityElement.textContent = legibilityCss;
    } else {
      let legibilityStyle = doc.createElement("style");
      legibilityStyle.id = "legibility-style";
      legibilityStyle.textContent = legibilityCss;
      doc.head.appendChild(legibilityStyle);
    }
    // inject custom book CSS if enabled
    let customCssElement = doc.getElementById("custom-book-style");
    const isCustomBookCSS =
      ConfigService.getReaderConfig("isCustomBookCSS") === "yes";
    const customBookCSS = ConfigService.getReaderConfig("customBookCSS") || "";
    if (isCustomBookCSS && customBookCSS) {
      if (customCssElement) {
        customCssElement.textContent = customBookCSS;
      } else {
        let customStyle = doc.createElement("style");
        customStyle.id = "custom-book-style";
        customStyle.textContent = customBookCSS;
        doc.head.appendChild(customStyle);
      }
    } else if (customCssElement) {
      customCssElement.textContent = "";
    }
  }
  // get default css for iframe
  static getDefaultCss(bookKey: string) {
    return StyleHelper.getDefaultCss(ConfigService, bookKey);
  }

  // StyleHelper.getDefaultCss (kookit.min.js, unreadable/unrebuildable build
  // artifact - see CLAUDE.md) only adds `!important` to its forced text-color
  // rule for one hardcoded dark preset, isOverwriteText being on, or an OS/
  // "night" appSkin - so a book's own CSS is free to win (and leave illegible
  // text) against any other active theme or custom background color. This
  // generalizes that same forced-color rule to every active theme, and
  // separately guarantees legible text inside "background"-style highlights,
  // which are always pale pastels (kookit-extra-browser.min's
  // HighlightPresetColors) regardless of the page's own theme.
  static getLegibilityCss(): string {
    const backgroundColor = ConfigService.getReaderConfig("backgroundColor");
    const textColor = ConfigService.getReaderConfig("textColor");
    const appSkin = ConfigService.getReaderConfig("appSkin");
    const isOSNight = ConfigService.getReaderConfig("isOSNight");
    const isNightSkin =
      appSkin === "night" || (appSkin === "system" && isOSNight === "yes");
    const themeActive = !!backgroundColor || !!textColor || isNightSkin;

    const rules: string[] = [];
    if (themeActive) {
      let forcedTextColor = textColor;
      if (!forcedTextColor) {
        if (backgroundColor === "rgba(44,47,49,1)" || isNightSkin) {
          forcedTextColor = "white";
        } else if (backgroundColor) {
          forcedTextColor = pickReadableCounterColor(backgroundColor);
        }
      }
      if (forcedTextColor) {
        // Exclude <a> so an explicit "overwrite link color" preference (or a
        // book's own link styling, when that preference is off) isn't
        // clobbered by this broader override.
        rules.push(`body, body *:not(a) { color: ${forcedTextColor} !important; }`);
      }
    }
    // Only the solid-fill "background" highlight style needs this (its
    // inline style contains a plain "background:" declaration) - underline/
    // wavy have no fill, and strikethrough's inline style also matches
    // "background:" but only as a thin, mostly-transparent gradient line, so
    // it's excluded via the "linear-gradient" check.
    rules.push(
      '.kookit-highlight-text[style*="background:"]:not([style*="linear-gradient"]) { color: #1a1a1a !important; }'
    );
    return rules.join("\n");
  }

  static async applyReaderFonts(rendition: any): Promise<void> {
    if (!rendition?.displayFontUrl) return;

    const fontName = ConfigService.getReaderConfig("fontFamily");
    const subFontName = ConfigService.getReaderConfig("subFontFamily");

    if (fontName && FontUtil.isCustomFont(fontName)) {
      const url = await FontUtil.getFontUrl(fontName);
      if (url) await rendition.displayFontUrl(fontName, url);
    }

    if (subFontName && FontUtil.isCustomFont(subFontName)) {
      const url = await FontUtil.getFontUrl(subFontName);
      if (url) await rendition.displayFontUrl(subFontName, url);
    }
  }

  static applyTheme() {
    const themeColor = ConfigService.getReaderConfig("themeColor");
    if (themeColor && themeColor !== "default") {
      applyThemeColor(themeColor);
    } else {
      removeThemeColor();
    }
  }
}

export default styleUtil;
