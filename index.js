module.exports = function(robot) {
  robot.on('issues.opened', async function(event, context) {
    const github = await robot.integration.asInstallation(event.payload.installation.id);
    const options = context.repo({path: '.github/ISSUE_REPLY_TEMPLATE.md'});
    const data = await github.repos.getContent(options);
    const template = new Buffer(data.content, 'base64').toString();

    return github.issues.createComment(context.issue({body: template}));
  });
}
