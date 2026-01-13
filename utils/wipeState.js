const activeWipes = new Map();

/*
wipeData = {
  level: 1 | 2 | 3,
  guildId: string,
  channelId: string | null,
  userId: string,
  timeout: Timeout
}
*/

function startWipe({ level, guildId, channelId, userId, onExecute }) {
  if (activeWipes.has(guildId)) return false;

  const timeout = setTimeout(() => {
    activeWipes.delete(guildId);
    onExecute();
  }, 30_000);

  activeWipes.set(guildId, {
    level,
    guildId,
    channelId,
    userId,
    timeout
  });

  return true;
}

function cancelWipe(guildId, userId) {
  const wipe = activeWipes.get(guildId);
  if (!wipe) return false;
  if (wipe.userId !== userId) return false;

  clearTimeout(wipe.timeout);
  activeWipes.delete(guildId);
  return true;
}

function getWipe(guildId) {
  return activeWipes.get(guildId) || null;
}

module.exports = {
  startWipe,
  cancelWipe,
  getWipe
};
