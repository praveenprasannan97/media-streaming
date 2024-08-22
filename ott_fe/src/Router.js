import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/login";
import Signup from "./components/signup";
import MovieList from "./components/movielist";
import Forgotpass from "./components/forgotpass";
import Resetpass from "./components/resetpass";
import Changepass from "./components/changepass";
import History from "./components/history";
import Watchlater from "./components/watchlater";
import Subplans from "./components/subplans";
import Myplan from "./components/myplan";
import Viewmovie from "./components/viewmovie";
import Playmovie from "./components/playmovie";

const router = createBrowserRouter([
    { path: '', element: <App/> },   //
    { path: 'login', element: <Login/> },    //
    { path: 'signup', element: <Signup/> },     //
    { path: 'movielist', element: <MovieList/> },   //
    { path: 'forgotpass', element: <Forgotpass/> },     //
    { path: 'resetpass/:token', element: <Resetpass/> },    //
    { path: 'changepass', element: <Changepass/> },
    { path: 'history', element: <History/> },
    { path: 'watchlater', element: <Watchlater/> },
    { path: 'subplans', element: <Subplans/> },
    { path: 'myplan', element: <Myplan/> },
    { path: 'viewmovie/:moviepk', element: <Viewmovie/> },   //
    { path: 'playmovie/:moviepk', element: <Playmovie/> },    //
]);

export default router;