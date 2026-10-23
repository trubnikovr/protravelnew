import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { currentAdminQueryOptions } from "@/features/auth/api/auth.api";
import { authSession } from "@/features/auth/model/auth-session";
import { LoginScreen } from "@/screens/auth/ui/LoginScreen";
import { DashboardScreen } from "@/screens/dashboard/ui/DashboardScreen";
import { ToursScreen } from "@/screens/tours/ui/ToursScreen";
import { CustomersScreen } from "@/screens/customers/ui/CustomersScreen";
import { CustomerDetailScreen } from "@/screens/customers/ui/CustomerDetailScreen";
import { CustomerDocumentsScreen } from "@/screens/customers/ui/CustomerDocumentsScreen";
import { TourBookingsScreen } from "@/screens/tour-bookings/ui/TourBookingsScreen";
import { TourBookingDetailScreen } from "@/screens/tour-bookings/ui/TourBookingDetailScreen";
import { NewsScreen } from "@/screens/news/ui/NewsScreen";
import { SystemMessagesScreen } from "@/screens/system-messages/ui/SystemMessagesScreen";
import { FeaturedFlightLocationsScreen } from "@/screens/featured-flight-locations/ui/FeaturedFlightLocationsScreen";
import { AppShell } from "@/widgets/app-shell/AppShell";

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (authSession.isAuthenticated()) throw redirect({ to: "/" });
  },
  component: LoginScreen,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: async ({ context }) => {
    if (!authSession.isAuthenticated()) throw redirect({ to: "/login" });

    try {
      await context.queryClient.ensureQueryData(currentAdminQueryOptions());
    } catch {
      authSession.clear();
      context.queryClient.clear();
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: DashboardScreen,
});

const toursRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/tours",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) > 0 ? Number(search.page) : 1,
    search: typeof search.search === "string" ? search.search : undefined,
    status: ["draft", "published", "archived"].includes(String(search.status))
      ? (search.status as "draft" | "published" | "archived")
      : undefined,
    sortBy: [
      "createdAt",
      "updatedAt",
      "sortOrder",
      "price",
      "durationDays",
    ].includes(String(search.sortBy))
      ? (search.sortBy as
          | "createdAt"
          | "updatedAt"
          | "sortOrder"
          | "price"
          | "durationDays")
      : "createdAt",
  }),
  component: ToursScreen,
});

const customersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/customers",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) > 0 ? Number(search.page) : 1,
    search: typeof search.search === "string" ? search.search : undefined,
    status: ["active", "blocked"].includes(String(search.status))
      ? (search.status as "active" | "blocked")
      : undefined,
    sortBy: ["createdAt", "updatedAt", "email", "firstName"].includes(
      String(search.sortBy)
    )
      ? (search.sortBy as "createdAt" | "updatedAt" | "email" | "firstName")
      : "createdAt",
  }),
  component: CustomersScreen,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/customers/$customerId",
  component: CustomerDetailScreen,
});

const customerDocumentsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/customers/documents",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) > 0 ? Number(search.page) : 1,
    search: typeof search.search === "string" ? search.search : undefined,
  }),
  component: CustomerDocumentsScreen,
});

const tourBookingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/tour-bookings",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) > 0 ? Number(search.page) : 1,
    search: typeof search.search === "string" ? search.search : undefined,
    status: [
      "pending",
      "confirmed",
      "awaiting_payment",
      "paid",
      "completed",
      "cancelled",
    ].includes(String(search.status))
      ? (search.status as
          | "pending"
          | "confirmed"
          | "awaiting_payment"
          | "paid"
          | "completed"
          | "cancelled")
      : undefined,
  }),
  component: TourBookingsScreen,
});

const tourBookingDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/tour-bookings/$bookingId",
  component: TourBookingDetailScreen,
});

const newsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/news",
  beforeLoad: async ({ context }) => {
    const admin = await context.queryClient.ensureQueryData(
      currentAdminQueryOptions()
    );
    if (!admin.permissions.includes("content.read"))
      throw redirect({ to: "/" });
  },
  component: NewsScreen,
});

const systemMessagesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/system-messages",
  beforeLoad: async ({ context }) => {
    const admin = await context.queryClient.ensureQueryData(
      currentAdminQueryOptions()
    );
    if (!admin.permissions.includes("content.read"))
      throw redirect({ to: "/" });
  },
  component: SystemMessagesScreen,
});

const featuredFlightLocationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/featured-flight-locations",
  component: FeaturedFlightLocationsScreen,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    toursRoute,
    tourBookingsRoute,
    tourBookingDetailRoute,
    customersRoute,
    customerDocumentsRoute,
    customerDetailRoute,
    newsRoute,
    systemMessagesRoute,
    featuredFlightLocationsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: { queryClient: undefined! },
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
