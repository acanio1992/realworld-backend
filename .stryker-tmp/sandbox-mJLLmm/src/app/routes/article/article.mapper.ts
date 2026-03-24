// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import authorMapper from './author.mapper';
const articleMapper = stryMutAct_9fa48("0") ? () => undefined : (stryCov_9fa48("0"), (() => {
  const articleMapper = (article: any, id?: number) => stryMutAct_9fa48("1") ? {} : (stryCov_9fa48("1"), {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList.map(stryMutAct_9fa48("2") ? () => undefined : (stryCov_9fa48("2"), (tag: any) => tag.name)),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: stryMutAct_9fa48("3") ? article.favoritedBy.every((item: any) => item.id === id) : (stryCov_9fa48("3"), article.favoritedBy.some(stryMutAct_9fa48("4") ? () => undefined : (stryCov_9fa48("4"), (item: any) => stryMutAct_9fa48("7") ? item.id !== id : stryMutAct_9fa48("6") ? false : stryMutAct_9fa48("5") ? true : (stryCov_9fa48("5", "6", "7"), item.id === id)))),
    favoritesCount: article.favoritedBy.length,
    author: authorMapper(article.author, id)
  });
  return articleMapper;
})());
export default articleMapper;