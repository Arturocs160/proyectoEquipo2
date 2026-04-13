import { Express } from "express";
import routerAuth from "./auth";
import routerUsers from "./users";
import routerAppointments from "./appointments";
import routerBranches from "./branches";
import routerBusinessInfo from "./businessInfo";
import routerBusinessHours from "./businessHours";
import routerDisabledDates from "./disabledDates";
import routerClients from "./clients";
import routerEmployees from "./employees";
import routerServices from "./services";

export default function routes(app: Express) {
    app.use("/auth", routerAuth);
    app.use("/users", routerUsers);
    app.use("/appointments", routerAppointments);
    app.use("/branches", routerBranches);
    app.use("/business-info", routerBusinessInfo);
    app.use("/business-hours", routerBusinessHours);
    app.use("/disabled-dates", routerDisabledDates);
    app.use("/clients", routerClients);
    app.use("/employees", routerEmployees);
    app.use("/services", routerServices);
}