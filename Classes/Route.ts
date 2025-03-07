/**
 * The Route file, which is used to create a global routes.
 * @module
 */

import { Maid } from "@socali/modules/Maid";
import Event from "../Tools/EventManager.ts";
import type { Location } from "../Tools/Session.ts";
import Session from "../Tools/Session.ts";
import Page from "./Page.ts";

/**
 * The Route class, which is used to create a global route.
 */
class Route {
  public readonly path: string;
  // deno-lint-ignore ban-types
  public readonly handler: Function | Page;
  // deno-lint-ignore ban-types
  public readonly onMount: Function;
  // deno-lint-ignore ban-types
  public readonly onBeforeMount: Function;
  // deno-lint-ignore ban-types
  public readonly onMountFinish: Function;
  // deno-lint-ignore ban-types
  public readonly onDestroy: Function;
  private readonly Maid = new Maid();

  public isActive: boolean = false;
  public isMounted: boolean = false;

  constructor({
    path,
    handler,
    onMount,
    onBeforeMount,
    onMountFinish,
    onDestroy,
  }: {
    path: string;
    // deno-lint-ignore ban-types
    handler: Function | Page;
    // deno-lint-ignore ban-types
    onMount?: Function;
    // deno-lint-ignore ban-types
    onBeforeMount?: Function;
    // deno-lint-ignore ban-types
    onMountFinish?: Function;
    // deno-lint-ignore ban-types
    onDestroy?: Function;
  }) {
    this.path = path;
    this.handler = handler;
    this.onMount = onMount ?? (() => {});
    this.onBeforeMount = onBeforeMount ?? (() => {});
    this.onMountFinish = onMountFinish ?? (() => {});
    this.onDestroy = onDestroy ?? (() => {});

    // Bind the method to preserve 'this' context
    this.onRouterNavigate = this.onRouterNavigate.bind(this);

    Spicetify.Platform.History.listen(Session.RecordNavigation);
    Session.RecordNavigation(Spicetify.Platform.History.location);
  }

  private onRouterNavigate(data: Location) {
    if (data.pathname === this.path) {
      this.isActive = true;
      if (this.handler instanceof Function) {
        this.handler({ navigationData: data, isActive: this.isActive });
      } else if (this.handler instanceof Page) {
        if (!this.handler.isMounted) {
          this.handler.Mount();
        }
      }
    } else {
      this.isActive = false;
      if (this.handler instanceof Page) {
        if (this.handler.isMounted) {
          this.handler.Destroy();
        }
      }
    }
  }

  public Mount() {
    this.onBeforeMount();
    this.isMounted = true;
    const routeNavigateListener = Event.listen(
      "router:navigate",
      this.onRouterNavigate
    );

    // Check current location immediately after mounting
    this.onRouterNavigate(Spicetify.Platform.History.location);
    this.onMount();

    // Store a reference to the handler if it's a Page
    if (this.handler instanceof Page) {
      const pageHandler = this.handler;
      this.Maid.Give(() => pageHandler.Destroy());
    }

    this.Maid.Give(() => Event.unListen(routeNavigateListener));
    this.onMountFinish();
  }

  public Destroy() {
    this.isActive = false;
    this.isMounted = false;
    this.Maid.Destroy();
    this.onDestroy();
  }
}

export default Route;
