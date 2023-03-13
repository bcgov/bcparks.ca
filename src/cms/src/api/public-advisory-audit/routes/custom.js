module.exports = {
    routes: [
        {
            method: "GET",
            path: "/public-advisory-audits/history/:advisoryNumber",
            handler: "public-advisory-audit.history",
        }
    ],
};