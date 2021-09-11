import { Route, Switch } from "react-router-dom";
import { Role, User } from "./models/User";
import { UserSettingsPage } from "./pages/UserSettingsPage";
import { DownloadPage } from "./pages/DownloadPage";
import { GuidePage } from "./pages/GuidePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ServerInfoPage } from "./pages/ServerInfoPage";
import { StoryPage } from "./pages/StoryPage";
import { RootStore } from "./stores/RootStore";
import { ServerPage } from "./pages/ServerPage";
import { ItemBuilderPage } from "./pages/ItemBuilderPage";
import { RolePage } from "./pages/RolePage";

interface IMainRoute {
    to: string;
    label: string;
    visible?: (user?: User) => boolean;
    PageCmp?: (props?: any) => JSX.Element;
    render?: (rootStore: RootStore) => false;
}

export const mainRoutes: IMainRoute[] = [
    {
        to: '/',
        label: 'Home',
        PageCmp: HomePage,
    },
    {
        to: '/info',
        label: 'Server Info',
        PageCmp: ServerInfoPage,
    },
    {
        to: '/story',
        label: 'Story',
        PageCmp: StoryPage,
    },
    {
        to: '/downloads',
        label: 'Download',
        PageCmp: DownloadPage,
    },
    {
        to: '/guide',
        label: 'Guide',
        PageCmp: GuidePage,
    },

    {
        to: '/user-settings',
        label: 'User Settings',
        visible: (user?: User) => Boolean(user && user.role === Role.Admin),
        PageCmp: UserSettingsPage
    },
    {
        to: '/server-settings',
        label: 'Server',
        visible: (user?: User) => Boolean(user && user.role === Role.Admin),
        PageCmp: ServerPage
    },
    {
        to: '/item-builder',
        label: 'Item Builder',
        visible: (user?: User) => Boolean(user && user.role === Role.Admin),
        PageCmp: ItemBuilderPage
    },    
    {
        to: '/role/:id',
        label: 'Role',
        visible: (user?: User) => Boolean(user && user.role === Role.Admin),
        PageCmp: RolePage
    },
    {
        to: '/shop',
        label: 'Web Shop',
        visible: (user?: User) => Boolean(user),
        PageCmp: RolePage
    },
    {
        to: '/logout',
        label: 'Logout',
        visible: (user?: User) => Boolean(user),
        render: (rootStore: RootStore) => {
            rootStore.authStore.logout();
            rootStore.redirect('/');
            return false;
        }
    },
    {
        to: '/login',
        label: 'Login',
        visible: (user?: User) => !user,
        PageCmp: LoginPage,
    },
    {
        to: '/register',
        label: 'Registration',
        visible: (user?: User) => !user,
        PageCmp: RegisterPage,
    },
];

export const PageRoots = ({ rootStore }: { rootStore: RootStore }) => (
    <Switch>
        {mainRoutes.filter(x => x.render || x.PageCmp).map((x, k) => {
            const render = x.render ? () => (x.render!(rootStore) || <span />) : undefined;
            return (
            <Route 
                key={k} 
                path={x.to} 
                component={x.PageCmp} 
                render={render}
                exact 
            />
            );
        })}
    </Switch>
);