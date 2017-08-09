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
            content: Buffer.from(`ISSUE_REPLY_TEMPLATE: >\n  Hello World!`).toString('base64')
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
  describe('it succeds', () => {
    it('posts a comment when there is a config file', async () => {
      await robot.receive(event);

      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'robotland',
        repo: 'test',
        path: '.github/ISSUE_REPLY_TEMPLATE.yml'
      });

      expect(github.issues.createComment).toHaveBeenCalled();
    });
  });

  describe('it fails', () => {
    beforeEach(() => {
      github.repos.getContent = expect.createSpy().andReturn(Promise.resolve({
        data: {
          content: Buffer.from(``).toString('base64')
        }
      }));
    });

    it('does not posts a comment when there is not a config file', async () => {
      await robot.receive(event);

      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'robotland',
        repo: 'test',
        path: '.github/ISSUE_REPLY_TEMPLATE.yml'
      });

      expect(github.issues.createComment).toNotHaveBeenCalled();
    });
  });
});
