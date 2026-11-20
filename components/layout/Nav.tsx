import { navLinks, navMenus, navOrder } from "@/lib/content/nav";
import NavBar from "./NavBar";

/**
 * Server wrapper: builds the menu data (stories, latest post, competitors) on the server
 * and hands the client bar plain props, so that content stays out of the client bundle.
 */
export default function Nav() {
  return <NavBar links={navLinks} menus={navMenus} order={navOrder} />;
}
