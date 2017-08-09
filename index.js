module.exports = robot => {
  robot.on('issues.opened', async context => {
    const config = await context.config('ISSUE_REPLY_TEMPLATE.yml');
    if (config) {
      if (config.ISSUE_REPLY_TEMPLATE) {
        return context.github.issues.createComment(context.issue({body: config.ISSUE_REPLY_TEMPLATE}));
      }
    }
  });
};
