module.exports = robot => {
  robot.on('issues.opened', async context => {
    let template;
    try {
      const options = context.repo({path: '.github/ISSUE_REPLY_TEMPLATE.md'});
      const res = await context.github.repos.getContent(options);
      template = new Buffer(res.data.content, 'base64').toString();
    } catch (err) {
      template = 'We couldn\'t find an `ISSUE_REPLY_TEMPLATE` in your `.github` folder!';
    }
    robot.log(template);
    return context.github.issues.createComment(context.issue({body: template}));
  });
};
