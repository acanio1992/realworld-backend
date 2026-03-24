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
import prisma from '../../../prisma/prisma-client';
import { Tag } from './tag.model';
const getTags = async (id?: number): Promise<string[]> => {
  if (stryMutAct_9fa48("605")) {
    {}
  } else {
    stryCov_9fa48("605");
    const queries = stryMutAct_9fa48("606") ? ["Stryker was here"] : (stryCov_9fa48("606"), []);
    queries.push(stryMutAct_9fa48("607") ? {} : (stryCov_9fa48("607"), {
      demo: stryMutAct_9fa48("608") ? false : (stryCov_9fa48("608"), true)
    }));
    if (stryMutAct_9fa48("610") ? false : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610"), id)) {
      if (stryMutAct_9fa48("611")) {
        {}
      } else {
        stryCov_9fa48("611");
        queries.push(stryMutAct_9fa48("612") ? {} : (stryCov_9fa48("612"), {
          id: stryMutAct_9fa48("613") ? {} : (stryCov_9fa48("613"), {
            equals: id
          })
        }));
      }
    }
    const tags = await prisma.tag.findMany(stryMutAct_9fa48("614") ? {} : (stryCov_9fa48("614"), {
      where: stryMutAct_9fa48("615") ? {} : (stryCov_9fa48("615"), {
        articles: stryMutAct_9fa48("616") ? {} : (stryCov_9fa48("616"), {
          some: stryMutAct_9fa48("617") ? {} : (stryCov_9fa48("617"), {
            author: stryMutAct_9fa48("618") ? {} : (stryCov_9fa48("618"), {
              OR: queries
            })
          })
        })
      }),
      select: stryMutAct_9fa48("619") ? {} : (stryCov_9fa48("619"), {
        name: stryMutAct_9fa48("620") ? false : (stryCov_9fa48("620"), true)
      }),
      orderBy: stryMutAct_9fa48("621") ? {} : (stryCov_9fa48("621"), {
        articles: stryMutAct_9fa48("622") ? {} : (stryCov_9fa48("622"), {
          _count: stryMutAct_9fa48("623") ? "" : (stryCov_9fa48("623"), 'desc')
        })
      }),
      take: 10
    }));
    return tags.map(stryMutAct_9fa48("624") ? () => undefined : (stryCov_9fa48("624"), (tag: Tag) => tag.name));
  }
};
export default getTags;