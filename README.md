# @spicetify/router

A simple page router for Spicetify Extensions

Hi, I'm Spikerko. I'm a web developer and a Spicetify extension developer.
I was always looking for a simple page router, and custom pages.

*Did you know that Custom Pages for Spicetify Extensions, don't exist. They only do for Custom Apps, which are WAY more difficult to install.*
So we fixed that.

Here's a simple page router and custom page creator for Spicetify Extensions.
*Also works for Peek NPV users*

## Installation

```bash
deno add jsr:@spicetify/router
// --- or ---
npx jsr add @spicetify/router
```

## Usage

### Function:
```ts
import Route from "@spicetify/router/Classes/Route";

const MyRoute = new Route({
    path: "/",
    handler: (data) => {
        console.log(data.navigationData, data.isActive);
    },
    onBeforeMount: () => {
        console.log("Route Before Mounted!");
    },
    onMount: () => {
        console.log("Route Mounted!");
    },
    onMountFinish: () => {
        console.log("Route Finish Mounted!");
    },
    onDestroy: () => {
        console.log("Route Destroyed!");
    }
});

MyRoute.Mount(); // Mounts the route
MyRoute.Destroy(); // Destroys the route
MyRoute.isActive; // Whether the route is active
MyRoute.isMounted; // Whether the route is mounted
```

### Custom Page:
```ts
import Route from "@spicetify/router/Classes/Route";
import Page from "@spicetify/router/Classes/Page";

import html from "@spicetify/router/Tools/html"; // Optional

const MyRoute = new Route({
    path: "/",
    handler: new Page({
        content: html`
            <h1>Hello World</h1>
        `,
        htmlId: "MyPage",
        onBeforeMount: () => {
            console.log("Page Before Mounted!");
        },
        onMount: () => {
            console.log("Page Mounted!");
        },
        onMountFinish: () => {
            console.log("Page Finish Mounted!");
        },
        onBeforeUnmount: () => {
            console.log("Page Before Unmounted!");
        },
        onUnmount: () => {
            console.log("Page Unmounted!");
        },
        onUnmountFinish: () => {
            console.log("Page Finish Unmounted!");
        },
        onDestroy: () => {
            console.log("Page Destroyed!");
        }
    }),
    onBeforeMount: () => {
        console.log("Route Before Mounted!");
    },
    onMount: () => {
        console.log("Route Mounted!");
    },
    onMountFinish: () => {
        console.log("Route Finish Mounted!");
    },
    onDestroy: () => {
        console.log("Route Destroyed!");
    }
});

// Route
MyRoute.Mount(); // Mounts the route
MyRoute.Destroy(); // Destroys the route
MyRoute.isActive; // Whether the route is active
MyRoute.isMounted; // Whether the route is mounted

// Page
MyRoute.handler.isMounted; // Whether the page is mounted
MyRoute.handler.htmlElement; // The HTMLElement of the page
```