module.exports = {
  routes: [
    {
      method: "POST",
      path: "/queued-tasks/bulk-delete",
      handler: "queued-task.deleteMany",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
