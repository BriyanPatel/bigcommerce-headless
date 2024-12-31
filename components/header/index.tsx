import { ShoppingCart, User } from 'lucide-react';
import { ReactNode, Suspense } from 'react';
import { getSessionCustomerId } from '~/auth';
import { FragmentOf, graphql } from '~/client/graphql';
import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuCollapsed,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuToggle,
} from '~/components/ui/navigation-menu';
import { QuickSearch } from '../quick-search';
import { StoreLogo, StoreLogoFragment } from '../store-logo';
import { logout } from './_actions/logout';
import { CartLink, Cart } from './cart';
import { HeaderNav, HeaderNavFragment } from './header-nav';
import TopHeader from './topheader';
import SearchBox from './SearchBox';
import CustomScript from './js/customScript.js';
import CartDrawer from './CartDrawer'; 
export const HeaderFragment = graphql(
  `
    fragment HeaderFragment on Site {
      settings {
        ...StoreLogoFragment
      }
      ...HeaderNavFragment
    }
  `,
  [StoreLogoFragment, HeaderNavFragment],
);

interface Props {
  cart: ReactNode;
  data: FragmentOf<typeof HeaderFragment>;

}

export const Header = async ({ cart, data}: Props) => {
  const customerId = await getSessionCustomerId();
  return (
    <>
    <header id="stick-header" className="header">
      <CustomScript />
      <div className="top-header">
        <div className="container">
          <div className="top-header-inner">
            <TopHeader />

          <div className="h-right">
            <div className="flex">
              <NavigationMenu>
                <NavigationMenuList className="h-full">
                  {data.settings && (
                    <NavigationMenuItem className="sm:inline-flex navUser-item--search">
                      <QuickSearch>
                        <Link className="flex" href="/">
                          <StoreLogo data={data.settings} />
                        </Link>
                      </QuickSearch>
                    </NavigationMenuItem>
                  )}

                  <NavigationMenuItem className="navUser-item--cart">
                    <div id="header-cart">
                      <Suspense
                        fallback={
                          <CartLink >
                            <ShoppingCart aria-label="cart" />
                          </CartLink>
                        }
                      >
                        {cart}
                      </Suspense>
                    </div>                    
                  </NavigationMenuItem>

                  <NavigationMenuItem className={`hidden xl:flex navUser-item--account ${customerId ? 'self-stretch' : ''}`}>
                    {customerId ? (
                      <div className="flex items-center cursor-pointer group/account">
                        <Link
                          aria-label="Account"
                          className="p-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                          href="/account"
                        >
                          <User aria-hidden="true" />
                        </Link>
                        <span className="account_lst">
                        <span className='account_lst_wrapper'>                        
                        
                            <Link
                              className="font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                              href="/account"
                            >
                              My account
                            </Link>
                          
                         
                            <Link
                              className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                              href="/account/orders"
                            >
                              Orders
                            </Link>
                          
                          
                            <Link
                              className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                              href="/account/messages"
                            >
                              Messages
                            </Link>
                        
                        
                            <Link
                              className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                              href="/account/addresses"
                            >
                              Addresses
                            </Link>
                         
                            <Link
                              className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                              href="/account/wishlists"
                            >
                              Wish lists
                            </Link>
                         
                            <Link
                              className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                              href="/account/recently-viewed"
                            >
                              Recently viewed
                            </Link>
                          
                            <Link
                              className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                              href="/account/settings"
                            >
                              Account Settings
                            </Link>
                        
                            <form action={logout}>
                              <Button
                                className="justify-start p-0 font-normal text-black hover:bg-transparent hover:text-black"
                                type="submit"
                                variant="subtle"
                              >
                                Log out
                              </Button>
                            </form>
                         
                        </span>
                        </span>
                      </div>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link aria-label="Login" href="/login">
                          <User />
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>



                  {/* <NavigationMenuItem>
                    <NavigationMenuToggle className="xl:hidden" />
                  </NavigationMenuItem> */}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="call-no">
              <Link className="navUser-action" href="tel:+1586-999-5820">
                <svg
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 384 384"
                  style={{ enableBackground: "new 0 0 384 384" }}
                >
                  <g>
                    <g>
                      <path
                        className="st0"
                        d="M0,282.9l0,70.3c0,17,13.8,30.8,30.8,30.8C225.6,384,384,225.6,384,30.8c0-17-13.8-30.8-30.8-30.8l-70.5,0
                  c-17,0-30.8,13.8-30.8,30.8c0,23.5-3.6,46.6-10.9,68.6c-3.6,11.2-0.6,23.2,7.6,31.4l31.6,42.1c-26.4,49.7-57.2,80.6-107.3,107.3
                  l-43.2-32.6c-6.5-6.7-19.7-10.1-30.4-6.4c-21.9,7.2-45,10.9-68.5,10.9C13.8,252.1,0,265.9,0,282.9z"
                      ></path>
                    </g>
                  </g>
                </svg>
                586-999-5820
              </Link>
            </div>

            </div>
          </div>
        </div>
      </div>
      
     <div className="container">     
      <NavigationMenu>
      <div className='header_wrap'>
       <NavigationMenuToggle className="xl:hidden" />
     
        {data.settings && (
          <NavigationMenuLink
            asChild
            className="flex-1 px-0 overflow-hidden text-ellipsis xl:flex-none"
          >
            <div className="header_logo-lft">              
            <Link className='header_logo' href="/">
              <StoreLogo data={data.settings} />
            </Link>
            </div>
           
          </NavigationMenuLink>
        )}
        </div>
        <div className="hsearh-ad">
        <SearchBox />
          <HeaderNav className="flex " data={data.categoryTree} />
        </div>

        <NavigationMenuCollapsed>
          <HeaderNav data={data.categoryTree} inCollapsedNav />
        </NavigationMenuCollapsed>
        
      </NavigationMenu>
    </div>
    
    </header>
      <CartDrawer/>
    </>
  );
};
