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
import profileMapper from './profile.utils';
import HttpException from '../../models/http-exception.model';
export const getProfile = async (usernamePayload: string, id?: number) => {
  if (stryMutAct_9fa48("572")) {
    {}
  } else {
    stryCov_9fa48("572");
    const profile = await prisma.user.findUnique(stryMutAct_9fa48("573") ? {} : (stryCov_9fa48("573"), {
      where: stryMutAct_9fa48("574") ? {} : (stryCov_9fa48("574"), {
        username: usernamePayload
      }),
      include: stryMutAct_9fa48("575") ? {} : (stryCov_9fa48("575"), {
        followedBy: stryMutAct_9fa48("576") ? false : (stryCov_9fa48("576"), true)
      })
    }));
    if (stryMutAct_9fa48("579") ? false : stryMutAct_9fa48("578") ? true : stryMutAct_9fa48("577") ? profile : (stryCov_9fa48("577", "578", "579"), !profile)) {
      if (stryMutAct_9fa48("580")) {
        {}
      } else {
        stryCov_9fa48("580");
        throw new HttpException(404, {});
      }
    }
    return profileMapper(profile, id);
  }
};
export const followUser = async (usernamePayload: string, id: number) => {
  if (stryMutAct_9fa48("581")) {
    {}
  } else {
    stryCov_9fa48("581");
    const profile = await prisma.user.update(stryMutAct_9fa48("582") ? {} : (stryCov_9fa48("582"), {
      where: stryMutAct_9fa48("583") ? {} : (stryCov_9fa48("583"), {
        username: usernamePayload
      }),
      data: stryMutAct_9fa48("584") ? {} : (stryCov_9fa48("584"), {
        followedBy: stryMutAct_9fa48("585") ? {} : (stryCov_9fa48("585"), {
          connect: stryMutAct_9fa48("586") ? {} : (stryCov_9fa48("586"), {
            id
          })
        })
      }),
      include: stryMutAct_9fa48("587") ? {} : (stryCov_9fa48("587"), {
        followedBy: stryMutAct_9fa48("588") ? false : (stryCov_9fa48("588"), true)
      })
    }));
    return profileMapper(profile, id);
  }
};
export const unfollowUser = async (usernamePayload: string, id: number) => {
  if (stryMutAct_9fa48("589")) {
    {}
  } else {
    stryCov_9fa48("589");
    const profile = await prisma.user.update(stryMutAct_9fa48("590") ? {} : (stryCov_9fa48("590"), {
      where: stryMutAct_9fa48("591") ? {} : (stryCov_9fa48("591"), {
        username: usernamePayload
      }),
      data: stryMutAct_9fa48("592") ? {} : (stryCov_9fa48("592"), {
        followedBy: stryMutAct_9fa48("593") ? {} : (stryCov_9fa48("593"), {
          disconnect: stryMutAct_9fa48("594") ? {} : (stryCov_9fa48("594"), {
            id
          })
        })
      }),
      include: stryMutAct_9fa48("595") ? {} : (stryCov_9fa48("595"), {
        followedBy: stryMutAct_9fa48("596") ? false : (stryCov_9fa48("596"), true)
      })
    }));
    return profileMapper(profile, id);
  }
};