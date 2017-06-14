module.exports = function(robot) {
  robot.on('issues.opened', async (event,  context) => {
    const options = context.repo({path: '.github/ISSUE_REPLY_TEMPLATE.md'});
    const res = await context.github.repos.getContent(options);
    const template = new Buffer(res.data.content, 'base64').toString();

    return context.github.issues.createComment(context.issue({body: template}));
  });
}
