/*global _node*/

const defaultUser = async () => await _node.defaultUser();

const loadSession = async () => await _node.loadSession();

const closeSession = async setSession => {
  await _node.closeSession();
  setSession(await defaultUser());
};

const logSession = async () => await _node.logSession();

export { defaultUser, loadSession, closeSession, logSession };
