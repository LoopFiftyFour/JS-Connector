import sharedRecentPopularEntities from "./sharedRecentPopularEntities";

module.exports = function () {
    sharedRecentPopularEntities("/getPopularEntities", "getPopularEntities");
};
