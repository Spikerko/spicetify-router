/**
 * This file is used to create a custom page, with connection of the Route Class.
 * @module
 */

import { Maid } from "@socali/modules/Maid";
import Global from "../Tools/Globals/Global.ts";
import Whentil from "../Tools/Whentil.ts";

/**
 * This function is used to fix the page view for Peek NPV users.
 */
const CSSFixes = (htmlId: string): string => {
  return `
        .Root__main-view:has(#${htmlId}) .main-view-container__scroll-node-child,
        .Root__main-view:has(#${htmlId}) .main-view-container__scroll-node-child-spacer,
        .Root__main-view:has(#${htmlId}) .main-view-container__scroll-node-child,
        .Root__main-view:has(#${htmlId}) .main-view-container__scroll-node-child-spacer {
            display: none !important;
        }
        .Root__main-view:has(#${htmlId}),
        .Root__main-view:has(#${htmlId}) .KL8t9WB65UfUEPuTFAhO,
        .Root__main-view:has(#${htmlId}) .main-content-view,
        .Root__main-view:has(#${htmlId}) .main-view-container,
        .Root__main-view:has(#${htmlId}) .main-view-container__scroll-node,
        .Root__main-view:has(#${htmlId}) .main-view-container .div[data-overlayscrollbars-viewport] {
            height: 100% !important;
        }

        #${htmlId} {
            width: 100%;
            height: 100%;
        }
    `;
};

/**
 * PageOptions - Type
 */
export interface PageOptions {
  content: string;
  htmlId: string;
  // deno-lint-ignore ban-types
  onMount?: Function;
  // deno-lint-ignore ban-types
  onBeforeMount?: Function;
  // deno-lint-ignore ban-types
  onMountFinish?: Function;
  // deno-lint-ignore ban-types
  onDestroy?: Function;
}

/**
 * The Page class, which is used to create a custom page, with connection of the Route Class.
 */
class Page {
  public readonly content: string;
  public readonly htmlId: string;
  private Maid: Maid | null;

  public isMounted: boolean = false;
  public htmlElement: HTMLElement | null = null;
  // deno-lint-ignore ban-types
  public readonly onMount: Function;
  // deno-lint-ignore ban-types
  public readonly onBeforeMount: Function;
  // deno-lint-ignore ban-types
  public readonly onMountFinish: Function;
  // deno-lint-ignore ban-types
  public readonly onDestroy: Function;

  constructor({ content, htmlId, onMount, onBeforeMount, onMountFinish, onDestroy }: PageOptions) {
    this.content = content;
    this.htmlId = htmlId;
    this.Maid = null;
    this.onMount = onMount ?? (() => {});
    this.onBeforeMount = onBeforeMount ?? (() => {});
    this.onMountFinish = onMountFinish ?? (() => {});
    this.onDestroy = onDestroy ?? (() => {});

    // Properly bind methods to preserve 'this' context
    this.Mount = this.Mount.bind(this);
    this.Destroy = this.Destroy.bind(this);
  }

  public Mount() {
    this.onBeforeMount();
    this.Maid = new Maid();
    Whentil.When(
      () => Global.MainView, // Use Global.MainView directly to get fresh reference
      (mainView) => {
        if (!mainView || !this.Maid) return;
        
        const elem = document.createElement("div");
        elem.id = this.htmlId;
        elem.classList.add("Spicetify-Router--page");
        elem.innerHTML = this.content;

        const style = document.createElement("style");
        style.innerHTML = CSSFixes(this.htmlId);
        style.classList.add("Spicetify-Router--page-style");
        document.head.appendChild(style);

        this.Maid.Give(() => style.remove());

        this.htmlElement = elem;
        mainView.appendChild(elem);
        this.isMounted = true;
        this.onMount();

        this.Maid.Give(() => elem.remove());
        this.onMountFinish();
      }
    );
  }

  public Destroy() {
    this.isMounted = false;
    if (!this.Maid) return;
    this.Maid.Destroy();
    this.Maid = null;
    this.onDestroy();
  }
}

export default Page;
