import Login from "@pages/page";
const router = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "*",
        element: <Login />,
    },
];

export default router;