import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { NavigationMenu } from "./components/NavigationMenu";
import { ThemeProvider } from "./contexts/ThemeContext";
import Start from "./pages/Start";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import NewTransformation from "./pages/NewTransformation";
import TransformationProcess from "./pages/TransformationProcess";
import History from "./pages/History";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";
import AccessDenied from "./pages/AccessDenied";
import Login from "./pages/Login";
import Tutorial from "./pages/Tutorial";

function Router() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Zum Hauptinhalt springen
      </a>
      <NavigationMenu />
      <main id="main-content">
      <Switch>
      <Route path={"/"} component={Start} />
      <Route path={"/login"} component={Login} />
      <Route path={"/welcome"} component={Welcome} />
      <Route path={"/home"} component={Home} />
      <Route path={"/intro"} component={Intro} />
      <Route path={"/tutorial"} component={Tutorial} />
      <Route path={"/new"} component={NewTransformation} />
      <Route path={"/process/:id"} component={TransformationProcess} />
      <Route path={"/history"} component={History} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/access-denied"} component={AccessDenied} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
      </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

