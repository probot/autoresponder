module.exports = function(robot) {
  robot.on('issues.opened', async function(event, context) {
    // Get template from the repository
    const data = await context.github.repos.getContent(context.repo({
      path: '.github/ISSUE_REPLY_TEMPLATE.md'
    }));
    const template = new Buffer(data.content, 'base64').toString();

    // Reply with the contents of the template
    return context.github.issues.createComment(context.issue({body: template}));
  });
}
