const expect = require('expect');
const {createRobot} = require('probot');
const plugin = require('..');
const event = require('./fixtures/issues.opened');

describe('autoresponder', () => {
  let robot;
  let github;

  beforeEach(() => {
    robot = createRobot();

    // Load the plugin
    plugin(robot);

    // Mock out the GitHub API
    github = {
      repos: {
        // Response for getting content from '.github/ISSUE_REPLY_TEMPLATE.md'
        getContent: expect.createSpy().andReturn(Promise.resolve({
          data: {
            content: Buffer.from(`Hello World!`).toString('base64')
          }
        }))
      },

      issues: {
        createComment: expect.createSpy()
      }
    };

    // Mock out GitHub client
    robot.auth = () => Promise.resolve(github);
  });

  it('posts a comment', async () => {
    await robot.receive(event);

    expect(github.repos.getContent).toHaveBeenCalledWith({
      owner: 'robotland',
      repo: 'test',
      path: '.github/ISSUE_REPLY_TEMPLATE.md'
    });

    expect(github.issues.createComment).toHaveBeenCalledWith({
      owner: 'robotland',
      repo: 'test',
      number: 97,
      body: 'Hello World!'
    });
  });
});
