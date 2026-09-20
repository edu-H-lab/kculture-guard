const path = require("path");
const data = require(path.join(require("./programDir"), "assets/js/thinking-friend-activities.js"));

function getPack(activityId) {
  if (!data || typeof data.get !== "function") return null;
  return data.get(activityId);
}

module.exports = {
  getPack,
  packs: data.packs || {}
};
