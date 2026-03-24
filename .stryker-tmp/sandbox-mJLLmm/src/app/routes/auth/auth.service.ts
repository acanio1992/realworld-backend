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
import * as bcrypt from 'bcryptjs';
import { RegisterInput } from './register-input.model';
import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';
import { RegisteredUser } from './registered-user.model';
import generateToken from './token.utils';
import { User } from './user.model';
const checkUserUniqueness = async (email: string, username: string) => {
  if (stryMutAct_9fa48("437")) {
    {}
  } else {
    stryCov_9fa48("437");
    const existingUserByEmail = await prisma.user.findUnique(stryMutAct_9fa48("438") ? {} : (stryCov_9fa48("438"), {
      where: stryMutAct_9fa48("439") ? {} : (stryCov_9fa48("439"), {
        email
      }),
      select: stryMutAct_9fa48("440") ? {} : (stryCov_9fa48("440"), {
        id: stryMutAct_9fa48("441") ? false : (stryCov_9fa48("441"), true)
      })
    }));
    const existingUserByUsername = await prisma.user.findUnique(stryMutAct_9fa48("442") ? {} : (stryCov_9fa48("442"), {
      where: stryMutAct_9fa48("443") ? {} : (stryCov_9fa48("443"), {
        username
      }),
      select: stryMutAct_9fa48("444") ? {} : (stryCov_9fa48("444"), {
        id: stryMutAct_9fa48("445") ? false : (stryCov_9fa48("445"), true)
      })
    }));
    if (stryMutAct_9fa48("448") ? existingUserByEmail && existingUserByUsername : stryMutAct_9fa48("447") ? false : stryMutAct_9fa48("446") ? true : (stryCov_9fa48("446", "447", "448"), existingUserByEmail || existingUserByUsername)) {
      if (stryMutAct_9fa48("449")) {
        {}
      } else {
        stryCov_9fa48("449");
        throw new HttpException(422, stryMutAct_9fa48("450") ? {} : (stryCov_9fa48("450"), {
          errors: stryMutAct_9fa48("451") ? {} : (stryCov_9fa48("451"), {
            ...(existingUserByEmail ? stryMutAct_9fa48("452") ? {} : (stryCov_9fa48("452"), {
              email: stryMutAct_9fa48("453") ? [] : (stryCov_9fa48("453"), [stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), 'has already been taken')])
            }) : {}),
            ...(existingUserByUsername ? stryMutAct_9fa48("455") ? {} : (stryCov_9fa48("455"), {
              username: stryMutAct_9fa48("456") ? [] : (stryCov_9fa48("456"), [stryMutAct_9fa48("457") ? "" : (stryCov_9fa48("457"), 'has already been taken')])
            }) : {})
          })
        }));
      }
    }
  }
};
export const createUser = async (input: RegisterInput): Promise<RegisteredUser> => {
  if (stryMutAct_9fa48("458")) {
    {}
  } else {
    stryCov_9fa48("458");
    const email = stryMutAct_9fa48("460") ? input.email.trim() : stryMutAct_9fa48("459") ? input.email : (stryCov_9fa48("459", "460"), input.email?.trim());
    const username = stryMutAct_9fa48("462") ? input.username.trim() : stryMutAct_9fa48("461") ? input.username : (stryCov_9fa48("461", "462"), input.username?.trim());
    const password = stryMutAct_9fa48("464") ? input.password.trim() : stryMutAct_9fa48("463") ? input.password : (stryCov_9fa48("463", "464"), input.password?.trim());
    const {
      image,
      bio,
      demo
    } = input;
    if (stryMutAct_9fa48("467") ? false : stryMutAct_9fa48("466") ? true : stryMutAct_9fa48("465") ? email : (stryCov_9fa48("465", "466", "467"), !email)) {
      if (stryMutAct_9fa48("468")) {
        {}
      } else {
        stryCov_9fa48("468");
        throw new HttpException(422, stryMutAct_9fa48("469") ? {} : (stryCov_9fa48("469"), {
          errors: stryMutAct_9fa48("470") ? {} : (stryCov_9fa48("470"), {
            email: stryMutAct_9fa48("471") ? [] : (stryCov_9fa48("471"), [stryMutAct_9fa48("472") ? "" : (stryCov_9fa48("472"), "can't be blank")])
          })
        }));
      }
    }
    if (stryMutAct_9fa48("475") ? false : stryMutAct_9fa48("474") ? true : stryMutAct_9fa48("473") ? username : (stryCov_9fa48("473", "474", "475"), !username)) {
      if (stryMutAct_9fa48("476")) {
        {}
      } else {
        stryCov_9fa48("476");
        throw new HttpException(422, stryMutAct_9fa48("477") ? {} : (stryCov_9fa48("477"), {
          errors: stryMutAct_9fa48("478") ? {} : (stryCov_9fa48("478"), {
            username: stryMutAct_9fa48("479") ? [] : (stryCov_9fa48("479"), [stryMutAct_9fa48("480") ? "" : (stryCov_9fa48("480"), "can't be blank")])
          })
        }));
      }
    }
    if (stryMutAct_9fa48("483") ? false : stryMutAct_9fa48("482") ? true : stryMutAct_9fa48("481") ? password : (stryCov_9fa48("481", "482", "483"), !password)) {
      if (stryMutAct_9fa48("484")) {
        {}
      } else {
        stryCov_9fa48("484");
        throw new HttpException(422, stryMutAct_9fa48("485") ? {} : (stryCov_9fa48("485"), {
          errors: stryMutAct_9fa48("486") ? {} : (stryCov_9fa48("486"), {
            password: stryMutAct_9fa48("487") ? [] : (stryCov_9fa48("487"), [stryMutAct_9fa48("488") ? "" : (stryCov_9fa48("488"), "can't be blank")])
          })
        }));
      }
    }
    await checkUserUniqueness(email, username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create(stryMutAct_9fa48("489") ? {} : (stryCov_9fa48("489"), {
      data: stryMutAct_9fa48("490") ? {} : (stryCov_9fa48("490"), {
        username,
        email,
        password: hashedPassword,
        ...(image ? stryMutAct_9fa48("491") ? {} : (stryCov_9fa48("491"), {
          image
        }) : {}),
        ...(bio ? stryMutAct_9fa48("492") ? {} : (stryCov_9fa48("492"), {
          bio
        }) : {}),
        ...(demo ? stryMutAct_9fa48("493") ? {} : (stryCov_9fa48("493"), {
          demo
        }) : {})
      }),
      select: stryMutAct_9fa48("494") ? {} : (stryCov_9fa48("494"), {
        id: stryMutAct_9fa48("495") ? false : (stryCov_9fa48("495"), true),
        email: stryMutAct_9fa48("496") ? false : (stryCov_9fa48("496"), true),
        username: stryMutAct_9fa48("497") ? false : (stryCov_9fa48("497"), true),
        bio: stryMutAct_9fa48("498") ? false : (stryCov_9fa48("498"), true),
        image: stryMutAct_9fa48("499") ? false : (stryCov_9fa48("499"), true)
      })
    }));
    return stryMutAct_9fa48("500") ? {} : (stryCov_9fa48("500"), {
      ...user,
      token: generateToken(user.id)
    });
  }
};
export const login = async (userPayload: any) => {
  if (stryMutAct_9fa48("501")) {
    {}
  } else {
    stryCov_9fa48("501");
    const email = stryMutAct_9fa48("503") ? userPayload.email.trim() : stryMutAct_9fa48("502") ? userPayload.email : (stryCov_9fa48("502", "503"), userPayload.email?.trim());
    const password = stryMutAct_9fa48("505") ? userPayload.password.trim() : stryMutAct_9fa48("504") ? userPayload.password : (stryCov_9fa48("504", "505"), userPayload.password?.trim());
    if (stryMutAct_9fa48("508") ? false : stryMutAct_9fa48("507") ? true : stryMutAct_9fa48("506") ? email : (stryCov_9fa48("506", "507", "508"), !email)) {
      if (stryMutAct_9fa48("509")) {
        {}
      } else {
        stryCov_9fa48("509");
        throw new HttpException(422, stryMutAct_9fa48("510") ? {} : (stryCov_9fa48("510"), {
          errors: stryMutAct_9fa48("511") ? {} : (stryCov_9fa48("511"), {
            email: stryMutAct_9fa48("512") ? [] : (stryCov_9fa48("512"), [stryMutAct_9fa48("513") ? "" : (stryCov_9fa48("513"), "can't be blank")])
          })
        }));
      }
    }
    if (stryMutAct_9fa48("516") ? false : stryMutAct_9fa48("515") ? true : stryMutAct_9fa48("514") ? password : (stryCov_9fa48("514", "515", "516"), !password)) {
      if (stryMutAct_9fa48("517")) {
        {}
      } else {
        stryCov_9fa48("517");
        throw new HttpException(422, stryMutAct_9fa48("518") ? {} : (stryCov_9fa48("518"), {
          errors: stryMutAct_9fa48("519") ? {} : (stryCov_9fa48("519"), {
            password: stryMutAct_9fa48("520") ? [] : (stryCov_9fa48("520"), [stryMutAct_9fa48("521") ? "" : (stryCov_9fa48("521"), "can't be blank")])
          })
        }));
      }
    }
    const user = await prisma.user.findUnique(stryMutAct_9fa48("522") ? {} : (stryCov_9fa48("522"), {
      where: stryMutAct_9fa48("523") ? {} : (stryCov_9fa48("523"), {
        email
      }),
      select: stryMutAct_9fa48("524") ? {} : (stryCov_9fa48("524"), {
        id: stryMutAct_9fa48("525") ? false : (stryCov_9fa48("525"), true),
        email: stryMutAct_9fa48("526") ? false : (stryCov_9fa48("526"), true),
        username: stryMutAct_9fa48("527") ? false : (stryCov_9fa48("527"), true),
        password: stryMutAct_9fa48("528") ? false : (stryCov_9fa48("528"), true),
        bio: stryMutAct_9fa48("529") ? false : (stryCov_9fa48("529"), true),
        image: stryMutAct_9fa48("530") ? false : (stryCov_9fa48("530"), true)
      })
    }));
    if (stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532"), user)) {
      if (stryMutAct_9fa48("533")) {
        {}
      } else {
        stryCov_9fa48("533");
        const match = await bcrypt.compare(password, user.password);
        if (stryMutAct_9fa48("535") ? false : stryMutAct_9fa48("534") ? true : (stryCov_9fa48("534", "535"), match)) {
          if (stryMutAct_9fa48("536")) {
            {}
          } else {
            stryCov_9fa48("536");
            return stryMutAct_9fa48("537") ? {} : (stryCov_9fa48("537"), {
              email: user.email,
              username: user.username,
              bio: user.bio,
              image: user.image,
              token: generateToken(user.id)
            });
          }
        }
      }
    }
    throw new HttpException(403, stryMutAct_9fa48("538") ? {} : (stryCov_9fa48("538"), {
      errors: stryMutAct_9fa48("539") ? {} : (stryCov_9fa48("539"), {
        'email or password': stryMutAct_9fa48("540") ? [] : (stryCov_9fa48("540"), [stryMutAct_9fa48("541") ? "" : (stryCov_9fa48("541"), 'is invalid')])
      })
    }));
  }
};
export const getCurrentUser = async (id: number) => {
  if (stryMutAct_9fa48("542")) {
    {}
  } else {
    stryCov_9fa48("542");
    const user = (await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true
      }
    })) as User;
    return stryMutAct_9fa48("543") ? {} : (stryCov_9fa48("543"), {
      ...user,
      token: generateToken(user.id)
    });
  }
};
export const updateUser = async (userPayload: any, id: number) => {
  if (stryMutAct_9fa48("544")) {
    {}
  } else {
    stryCov_9fa48("544");
    const {
      email,
      username,
      password,
      image,
      bio
    } = userPayload;
    let hashedPassword;
    if (stryMutAct_9fa48("546") ? false : stryMutAct_9fa48("545") ? true : (stryCov_9fa48("545", "546"), password)) {
      if (stryMutAct_9fa48("547")) {
        {}
      } else {
        stryCov_9fa48("547");
        hashedPassword = await bcrypt.hash(password, 10);
      }
    }
    const user = await prisma.user.update(stryMutAct_9fa48("548") ? {} : (stryCov_9fa48("548"), {
      where: stryMutAct_9fa48("549") ? {} : (stryCov_9fa48("549"), {
        id: id
      }),
      data: stryMutAct_9fa48("550") ? {} : (stryCov_9fa48("550"), {
        ...(email ? stryMutAct_9fa48("551") ? {} : (stryCov_9fa48("551"), {
          email
        }) : {}),
        ...(username ? stryMutAct_9fa48("552") ? {} : (stryCov_9fa48("552"), {
          username
        }) : {}),
        ...(password ? stryMutAct_9fa48("553") ? {} : (stryCov_9fa48("553"), {
          password: hashedPassword
        }) : {}),
        ...(image ? stryMutAct_9fa48("554") ? {} : (stryCov_9fa48("554"), {
          image
        }) : {}),
        ...(bio ? stryMutAct_9fa48("555") ? {} : (stryCov_9fa48("555"), {
          bio
        }) : {})
      }),
      select: stryMutAct_9fa48("556") ? {} : (stryCov_9fa48("556"), {
        id: stryMutAct_9fa48("557") ? false : (stryCov_9fa48("557"), true),
        email: stryMutAct_9fa48("558") ? false : (stryCov_9fa48("558"), true),
        username: stryMutAct_9fa48("559") ? false : (stryCov_9fa48("559"), true),
        bio: stryMutAct_9fa48("560") ? false : (stryCov_9fa48("560"), true),
        image: stryMutAct_9fa48("561") ? false : (stryCov_9fa48("561"), true)
      })
    }));
    return stryMutAct_9fa48("562") ? {} : (stryCov_9fa48("562"), {
      ...user,
      token: generateToken(user.id)
    });
  }
};