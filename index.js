module.exports = function(robot) {
  robot.on('issues.opened', async context => {
    const options = context.repo({path: '.github/ISSUE_REPLY_TEMPLATE.md'});
    const data = await context.github.repos.getContent(options);
    const template = new Buffer(data.content, 'base64').toString();

    return context.github.issues.createComment(context.issue({body: template}));
  });
}
