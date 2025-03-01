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
    public readonly handler: (Function | Page);
    private readonly Maid = new Maid();

    public isActive: boolean = false;
    public isMounted: boolean = false;

    constructor({
        path,
        handler
    }: {
        path: string,
        // deno-lint-ignore ban-types
        handler: (Function | Page)
    }) {
        this.path = path;
        this.handler = handler;

        Spicetify.Platform.History.listen(Session.RecordNavigation);
        Session.RecordNavigation(Spicetify.Platform.History.location);
    }


    public Mount() {
        this.isMounted = true;
        const routeNavigateListener = Event.listen("router:navigate", (data: Location) => {
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
                if (this.handler instanceof Function) {
                    this.handler({ navigationData: data, isActive: this.isActive });
                } else if (this.handler instanceof Page) {
                    if (this.handler.isMounted) {
                        this.handler.Destroy();
                    }
                }
            }
        });

        // Store a reference to the handler if it's a Page
        if (this.handler instanceof Page) {
            const pageHandler = this.handler;
            this.Maid.Give(() => pageHandler.Destroy());
        }

        this.Maid.Give(() => Event.unListen(routeNavigateListener));
    }
    
    public Destroy() {
        this.isActive = false;
        this.isMounted = false;
        this.Maid.Destroy();
    }
}

export default Route;