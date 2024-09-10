import React from 'react';
import { createRootRoute, createRoute, createRouter, RouterProvider, Link, Outlet } from '@tanstack/react-router';
import HomePage from '../pages/HomePage';
// TODO: Import other page components here as you create them
// import AboutPage from '../pages/AboutPage';
// import ContactPage from '../pages/ContactPage';

// Define the root route with layout and navigation
const RootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">Home</Link>
        {/* TODO: Add more navigation links here as you create new routes */}
        {/* Example:
        <Link to="/about" className="[&.active]:font-bold">About</Link>
        <Link to="/contact" className="[&.active]:font-bold">Contact</Link>
        */}
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

// Define the home route
const HomeRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: HomePage,
});

// TODO: Define other routes here
// Example:
// const AboutRoute = createRoute({
//   getParentRoute: () => RootRoute,
//   path: '/about',
//   component: AboutPage,
// });
//
// const ContactRoute = createRoute({
//   getParentRoute: () => RootRoute,
//   path: '/contact',
//   component: ContactPage,
// });

// Create the route tree using your route definitions
const routeTree = RootRoute.addChildren([
  HomeRoute,
  // TODO: Add other routes to the routeTree as you create them
  // AboutRoute,
  // ContactRoute,
]);

// Create the router using the route tree
const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

// TODO: Steps to add a new route:
// 1. Create a new page component in the '../pages/' directory (e.g., NewPage.tsx)
// 2. Import the new page component at the top of this file
// 3. Define a new route for the page using createRoute()
// 4. Add the new route to the routeTree in RootRoute.addChildren([...])
// 5. Add a new Link in the navigation section of RootRoute if needed

// Example of adding a new route:
// 1. Create '../pages/NewPage.tsx'
// 2. Import: import NewPage from '../pages/NewPage';
// 3. Define route: 
//    const NewRoute = createRoute({
//      getParentRoute: () => RootRoute,
//      path: '/new',
//      component: NewPage,
//    });
// 4. Add to routeTree: RootRoute.addChildren([HomeRoute, NewRoute, ...])
// 5. Add Link: <Link to="/new" className="[&.active]:font-bold">New Page</Link>