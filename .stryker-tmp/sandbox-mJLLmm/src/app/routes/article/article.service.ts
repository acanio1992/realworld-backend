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
import slugify from 'slugify';
import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';
import profileMapper from '../profile/profile.utils';
import articleMapper from './article.mapper';
import { Tag } from '../tag/tag.model';
const buildFindAllQuery = (query: any, id: number | undefined) => {
  if (stryMutAct_9fa48("8")) {
    {}
  } else {
    stryCov_9fa48("8");
    const queries: any = stryMutAct_9fa48("9") ? ["Stryker was here"] : (stryCov_9fa48("9"), []);
    const orAuthorQuery = stryMutAct_9fa48("10") ? ["Stryker was here"] : (stryCov_9fa48("10"), []);
    const andAuthorQuery = stryMutAct_9fa48("11") ? ["Stryker was here"] : (stryCov_9fa48("11"), []);
    orAuthorQuery.push(stryMutAct_9fa48("12") ? {} : (stryCov_9fa48("12"), {
      demo: stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
        equals: stryMutAct_9fa48("14") ? false : (stryCov_9fa48("14"), true)
      })
    }));
    if (stryMutAct_9fa48("16") ? false : stryMutAct_9fa48("15") ? true : (stryCov_9fa48("15", "16"), id)) {
      if (stryMutAct_9fa48("17")) {
        {}
      } else {
        stryCov_9fa48("17");
        orAuthorQuery.push(stryMutAct_9fa48("18") ? {} : (stryCov_9fa48("18"), {
          id: stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
            equals: id
          })
        }));
      }
    }
    if (stryMutAct_9fa48("21") ? false : stryMutAct_9fa48("20") ? true : (stryCov_9fa48("20", "21"), (stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'author')) in query)) {
      if (stryMutAct_9fa48("23")) {
        {}
      } else {
        stryCov_9fa48("23");
        andAuthorQuery.push(stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
          username: stryMutAct_9fa48("25") ? {} : (stryCov_9fa48("25"), {
            equals: query.author
          })
        }));
      }
    }
    const authorQuery = stryMutAct_9fa48("26") ? {} : (stryCov_9fa48("26"), {
      author: stryMutAct_9fa48("27") ? {} : (stryCov_9fa48("27"), {
        OR: orAuthorQuery,
        AND: andAuthorQuery
      })
    });
    queries.push(authorQuery);
    if (stryMutAct_9fa48("29") ? false : stryMutAct_9fa48("28") ? true : (stryCov_9fa48("28", "29"), (stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), 'tag')) in query)) {
      if (stryMutAct_9fa48("31")) {
        {}
      } else {
        stryCov_9fa48("31");
        queries.push(stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
          tagList: stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
            some: stryMutAct_9fa48("34") ? {} : (stryCov_9fa48("34"), {
              name: query.tag
            })
          })
        }));
      }
    }
    if (stryMutAct_9fa48("36") ? false : stryMutAct_9fa48("35") ? true : (stryCov_9fa48("35", "36"), (stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), 'favorited')) in query)) {
      if (stryMutAct_9fa48("38")) {
        {}
      } else {
        stryCov_9fa48("38");
        queries.push(stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
          favoritedBy: stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
            some: stryMutAct_9fa48("41") ? {} : (stryCov_9fa48("41"), {
              username: stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
                equals: query.favorited
              })
            })
          })
        }));
      }
    }
    return queries;
  }
};
export const getArticles = async (query: any, id?: number) => {
  if (stryMutAct_9fa48("43")) {
    {}
  } else {
    stryCov_9fa48("43");
    const andQueries = buildFindAllQuery(query, id);
    const articlesCount = await prisma.article.count(stryMutAct_9fa48("44") ? {} : (stryCov_9fa48("44"), {
      where: stryMutAct_9fa48("45") ? {} : (stryCov_9fa48("45"), {
        AND: andQueries
      })
    }));
    const articles = await prisma.article.findMany(stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
      where: stryMutAct_9fa48("47") ? {} : (stryCov_9fa48("47"), {
        AND: andQueries
      }),
      orderBy: stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
        createdAt: stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), 'desc')
      }),
      skip: stryMutAct_9fa48("52") ? Number(query.offset) && 0 : stryMutAct_9fa48("51") ? false : stryMutAct_9fa48("50") ? true : (stryCov_9fa48("50", "51", "52"), Number(query.offset) || 0),
      take: stryMutAct_9fa48("55") ? Number(query.limit) && 10 : stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : (stryCov_9fa48("53", "54", "55"), Number(query.limit) || 10),
      include: stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
        tagList: stryMutAct_9fa48("57") ? {} : (stryCov_9fa48("57"), {
          select: stryMutAct_9fa48("58") ? {} : (stryCov_9fa48("58"), {
            name: stryMutAct_9fa48("59") ? false : (stryCov_9fa48("59"), true)
          })
        }),
        author: stryMutAct_9fa48("60") ? {} : (stryCov_9fa48("60"), {
          select: stryMutAct_9fa48("61") ? {} : (stryCov_9fa48("61"), {
            username: stryMutAct_9fa48("62") ? false : (stryCov_9fa48("62"), true),
            bio: stryMutAct_9fa48("63") ? false : (stryCov_9fa48("63"), true),
            image: stryMutAct_9fa48("64") ? false : (stryCov_9fa48("64"), true),
            followedBy: stryMutAct_9fa48("65") ? false : (stryCov_9fa48("65"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("66") ? false : (stryCov_9fa48("66"), true),
        _count: stryMutAct_9fa48("67") ? {} : (stryCov_9fa48("67"), {
          select: stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
            favoritedBy: stryMutAct_9fa48("69") ? false : (stryCov_9fa48("69"), true)
          })
        })
      })
    }));
    return stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
      articles: articles.map(stryMutAct_9fa48("71") ? () => undefined : (stryCov_9fa48("71"), (article: any) => articleMapper(article, id))),
      articlesCount
    });
  }
};
export const getFeed = async (offset: number, limit: number, id: number) => {
  if (stryMutAct_9fa48("72")) {
    {}
  } else {
    stryCov_9fa48("72");
    const articlesCount = await prisma.article.count(stryMutAct_9fa48("73") ? {} : (stryCov_9fa48("73"), {
      where: stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
        author: stryMutAct_9fa48("75") ? {} : (stryCov_9fa48("75"), {
          followedBy: stryMutAct_9fa48("76") ? {} : (stryCov_9fa48("76"), {
            some: stryMutAct_9fa48("77") ? {} : (stryCov_9fa48("77"), {
              id: id
            })
          })
        })
      })
    }));
    const articles = await prisma.article.findMany(stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
      where: stryMutAct_9fa48("79") ? {} : (stryCov_9fa48("79"), {
        author: stryMutAct_9fa48("80") ? {} : (stryCov_9fa48("80"), {
          followedBy: stryMutAct_9fa48("81") ? {} : (stryCov_9fa48("81"), {
            some: stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
              id: id
            })
          })
        })
      }),
      orderBy: stryMutAct_9fa48("83") ? {} : (stryCov_9fa48("83"), {
        createdAt: stryMutAct_9fa48("84") ? "" : (stryCov_9fa48("84"), 'desc')
      }),
      skip: stryMutAct_9fa48("87") ? offset && 0 : stryMutAct_9fa48("86") ? false : stryMutAct_9fa48("85") ? true : (stryCov_9fa48("85", "86", "87"), offset || 0),
      take: stryMutAct_9fa48("90") ? limit && 10 : stryMutAct_9fa48("89") ? false : stryMutAct_9fa48("88") ? true : (stryCov_9fa48("88", "89", "90"), limit || 10),
      include: stryMutAct_9fa48("91") ? {} : (stryCov_9fa48("91"), {
        tagList: stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
          select: stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
            name: stryMutAct_9fa48("94") ? false : (stryCov_9fa48("94"), true)
          })
        }),
        author: stryMutAct_9fa48("95") ? {} : (stryCov_9fa48("95"), {
          select: stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
            username: stryMutAct_9fa48("97") ? false : (stryCov_9fa48("97"), true),
            bio: stryMutAct_9fa48("98") ? false : (stryCov_9fa48("98"), true),
            image: stryMutAct_9fa48("99") ? false : (stryCov_9fa48("99"), true),
            followedBy: stryMutAct_9fa48("100") ? false : (stryCov_9fa48("100"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("101") ? false : (stryCov_9fa48("101"), true),
        _count: stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
          select: stryMutAct_9fa48("103") ? {} : (stryCov_9fa48("103"), {
            favoritedBy: stryMutAct_9fa48("104") ? false : (stryCov_9fa48("104"), true)
          })
        })
      })
    }));
    return stryMutAct_9fa48("105") ? {} : (stryCov_9fa48("105"), {
      articles: articles.map(stryMutAct_9fa48("106") ? () => undefined : (stryCov_9fa48("106"), (article: any) => articleMapper(article, id))),
      articlesCount
    });
  }
};
export const createArticle = async (article: any, id: number) => {
  if (stryMutAct_9fa48("107")) {
    {}
  } else {
    stryCov_9fa48("107");
    const {
      title,
      description,
      body,
      tagList
    } = article;
    const tags = Array.isArray(tagList) ? tagList : stryMutAct_9fa48("108") ? ["Stryker was here"] : (stryCov_9fa48("108"), []);
    if (stryMutAct_9fa48("111") ? false : stryMutAct_9fa48("110") ? true : stryMutAct_9fa48("109") ? title : (stryCov_9fa48("109", "110", "111"), !title)) {
      if (stryMutAct_9fa48("112")) {
        {}
      } else {
        stryCov_9fa48("112");
        throw new HttpException(422, stryMutAct_9fa48("113") ? {} : (stryCov_9fa48("113"), {
          errors: stryMutAct_9fa48("114") ? {} : (stryCov_9fa48("114"), {
            title: stryMutAct_9fa48("115") ? [] : (stryCov_9fa48("115"), [stryMutAct_9fa48("116") ? "" : (stryCov_9fa48("116"), "can't be blank")])
          })
        }));
      }
    }
    if (stryMutAct_9fa48("119") ? false : stryMutAct_9fa48("118") ? true : stryMutAct_9fa48("117") ? description : (stryCov_9fa48("117", "118", "119"), !description)) {
      if (stryMutAct_9fa48("120")) {
        {}
      } else {
        stryCov_9fa48("120");
        throw new HttpException(422, stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
          errors: stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
            description: stryMutAct_9fa48("123") ? [] : (stryCov_9fa48("123"), [stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), "can't be blank")])
          })
        }));
      }
    }
    if (stryMutAct_9fa48("127") ? false : stryMutAct_9fa48("126") ? true : stryMutAct_9fa48("125") ? body : (stryCov_9fa48("125", "126", "127"), !body)) {
      if (stryMutAct_9fa48("128")) {
        {}
      } else {
        stryCov_9fa48("128");
        throw new HttpException(422, stryMutAct_9fa48("129") ? {} : (stryCov_9fa48("129"), {
          errors: stryMutAct_9fa48("130") ? {} : (stryCov_9fa48("130"), {
            body: stryMutAct_9fa48("131") ? [] : (stryCov_9fa48("131"), [stryMutAct_9fa48("132") ? "" : (stryCov_9fa48("132"), "can't be blank")])
          })
        }));
      }
    }
    const slug = stryMutAct_9fa48("133") ? `` : (stryCov_9fa48("133"), `${slugify(title)}-${id}`);
    const existingTitle = await prisma.article.findUnique(stryMutAct_9fa48("134") ? {} : (stryCov_9fa48("134"), {
      where: stryMutAct_9fa48("135") ? {} : (stryCov_9fa48("135"), {
        slug
      }),
      select: stryMutAct_9fa48("136") ? {} : (stryCov_9fa48("136"), {
        slug: stryMutAct_9fa48("137") ? false : (stryCov_9fa48("137"), true)
      })
    }));
    if (stryMutAct_9fa48("139") ? false : stryMutAct_9fa48("138") ? true : (stryCov_9fa48("138", "139"), existingTitle)) {
      if (stryMutAct_9fa48("140")) {
        {}
      } else {
        stryCov_9fa48("140");
        throw new HttpException(422, stryMutAct_9fa48("141") ? {} : (stryCov_9fa48("141"), {
          errors: stryMutAct_9fa48("142") ? {} : (stryCov_9fa48("142"), {
            title: stryMutAct_9fa48("143") ? [] : (stryCov_9fa48("143"), [stryMutAct_9fa48("144") ? "" : (stryCov_9fa48("144"), 'must be unique')])
          })
        }));
      }
    }
    const {
      authorId,
      id: articleId,
      ...createdArticle
    } = await prisma.article.create(stryMutAct_9fa48("145") ? {} : (stryCov_9fa48("145"), {
      data: stryMutAct_9fa48("146") ? {} : (stryCov_9fa48("146"), {
        title,
        description,
        body,
        slug,
        tagList: stryMutAct_9fa48("147") ? {} : (stryCov_9fa48("147"), {
          connectOrCreate: tags.map(stryMutAct_9fa48("148") ? () => undefined : (stryCov_9fa48("148"), (tag: string) => stryMutAct_9fa48("149") ? {} : (stryCov_9fa48("149"), {
            create: stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
              name: tag
            }),
            where: stryMutAct_9fa48("151") ? {} : (stryCov_9fa48("151"), {
              name: tag
            })
          })))
        }),
        author: stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
          connect: stryMutAct_9fa48("153") ? {} : (stryCov_9fa48("153"), {
            id: id
          })
        })
      }),
      include: stryMutAct_9fa48("154") ? {} : (stryCov_9fa48("154"), {
        tagList: stryMutAct_9fa48("155") ? {} : (stryCov_9fa48("155"), {
          select: stryMutAct_9fa48("156") ? {} : (stryCov_9fa48("156"), {
            name: stryMutAct_9fa48("157") ? false : (stryCov_9fa48("157"), true)
          })
        }),
        author: stryMutAct_9fa48("158") ? {} : (stryCov_9fa48("158"), {
          select: stryMutAct_9fa48("159") ? {} : (stryCov_9fa48("159"), {
            username: stryMutAct_9fa48("160") ? false : (stryCov_9fa48("160"), true),
            bio: stryMutAct_9fa48("161") ? false : (stryCov_9fa48("161"), true),
            image: stryMutAct_9fa48("162") ? false : (stryCov_9fa48("162"), true),
            followedBy: stryMutAct_9fa48("163") ? false : (stryCov_9fa48("163"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("164") ? false : (stryCov_9fa48("164"), true),
        _count: stryMutAct_9fa48("165") ? {} : (stryCov_9fa48("165"), {
          select: stryMutAct_9fa48("166") ? {} : (stryCov_9fa48("166"), {
            favoritedBy: stryMutAct_9fa48("167") ? false : (stryCov_9fa48("167"), true)
          })
        })
      })
    }));
    return articleMapper(createdArticle, id);
  }
};
export const getArticle = async (slug: string, id?: number) => {
  if (stryMutAct_9fa48("168")) {
    {}
  } else {
    stryCov_9fa48("168");
    const article = await prisma.article.findUnique(stryMutAct_9fa48("169") ? {} : (stryCov_9fa48("169"), {
      where: stryMutAct_9fa48("170") ? {} : (stryCov_9fa48("170"), {
        slug
      }),
      include: stryMutAct_9fa48("171") ? {} : (stryCov_9fa48("171"), {
        tagList: stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
          select: stryMutAct_9fa48("173") ? {} : (stryCov_9fa48("173"), {
            name: stryMutAct_9fa48("174") ? false : (stryCov_9fa48("174"), true)
          })
        }),
        author: stryMutAct_9fa48("175") ? {} : (stryCov_9fa48("175"), {
          select: stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
            username: stryMutAct_9fa48("177") ? false : (stryCov_9fa48("177"), true),
            bio: stryMutAct_9fa48("178") ? false : (stryCov_9fa48("178"), true),
            image: stryMutAct_9fa48("179") ? false : (stryCov_9fa48("179"), true),
            followedBy: stryMutAct_9fa48("180") ? false : (stryCov_9fa48("180"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("181") ? false : (stryCov_9fa48("181"), true),
        _count: stryMutAct_9fa48("182") ? {} : (stryCov_9fa48("182"), {
          select: stryMutAct_9fa48("183") ? {} : (stryCov_9fa48("183"), {
            favoritedBy: stryMutAct_9fa48("184") ? false : (stryCov_9fa48("184"), true)
          })
        })
      })
    }));
    if (stryMutAct_9fa48("187") ? false : stryMutAct_9fa48("186") ? true : stryMutAct_9fa48("185") ? article : (stryCov_9fa48("185", "186", "187"), !article)) {
      if (stryMutAct_9fa48("188")) {
        {}
      } else {
        stryCov_9fa48("188");
        throw new HttpException(404, stryMutAct_9fa48("189") ? {} : (stryCov_9fa48("189"), {
          errors: stryMutAct_9fa48("190") ? {} : (stryCov_9fa48("190"), {
            article: stryMutAct_9fa48("191") ? [] : (stryCov_9fa48("191"), [stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), 'not found')])
          })
        }));
      }
    }
    return articleMapper(article, id);
  }
};
const disconnectArticlesTags = async (slug: string) => {
  if (stryMutAct_9fa48("193")) {
    {}
  } else {
    stryCov_9fa48("193");
    await prisma.article.update(stryMutAct_9fa48("194") ? {} : (stryCov_9fa48("194"), {
      where: stryMutAct_9fa48("195") ? {} : (stryCov_9fa48("195"), {
        slug
      }),
      data: stryMutAct_9fa48("196") ? {} : (stryCov_9fa48("196"), {
        tagList: stryMutAct_9fa48("197") ? {} : (stryCov_9fa48("197"), {
          set: stryMutAct_9fa48("198") ? ["Stryker was here"] : (stryCov_9fa48("198"), [])
        })
      })
    }));
  }
};
export const updateArticle = async (article: any, slug: string, id: number) => {
  if (stryMutAct_9fa48("199")) {
    {}
  } else {
    stryCov_9fa48("199");
    let newSlug = null;
    const existingArticle = await await prisma.article.findFirst(stryMutAct_9fa48("200") ? {} : (stryCov_9fa48("200"), {
      where: stryMutAct_9fa48("201") ? {} : (stryCov_9fa48("201"), {
        slug
      }),
      select: stryMutAct_9fa48("202") ? {} : (stryCov_9fa48("202"), {
        author: stryMutAct_9fa48("203") ? {} : (stryCov_9fa48("203"), {
          select: stryMutAct_9fa48("204") ? {} : (stryCov_9fa48("204"), {
            id: stryMutAct_9fa48("205") ? false : (stryCov_9fa48("205"), true),
            username: stryMutAct_9fa48("206") ? false : (stryCov_9fa48("206"), true)
          })
        })
      })
    }));
    if (stryMutAct_9fa48("209") ? false : stryMutAct_9fa48("208") ? true : stryMutAct_9fa48("207") ? existingArticle : (stryCov_9fa48("207", "208", "209"), !existingArticle)) {
      if (stryMutAct_9fa48("210")) {
        {}
      } else {
        stryCov_9fa48("210");
        throw new HttpException(404, {});
      }
    }
    if (stryMutAct_9fa48("213") ? existingArticle.author.id === id : stryMutAct_9fa48("212") ? false : stryMutAct_9fa48("211") ? true : (stryCov_9fa48("211", "212", "213"), existingArticle.author.id !== id)) {
      if (stryMutAct_9fa48("214")) {
        {}
      } else {
        stryCov_9fa48("214");
        throw new HttpException(403, stryMutAct_9fa48("215") ? {} : (stryCov_9fa48("215"), {
          message: stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), 'You are not authorized to update this article')
        }));
      }
    }
    if (stryMutAct_9fa48("218") ? false : stryMutAct_9fa48("217") ? true : (stryCov_9fa48("217", "218"), article.title)) {
      if (stryMutAct_9fa48("219")) {
        {}
      } else {
        stryCov_9fa48("219");
        newSlug = stryMutAct_9fa48("220") ? `` : (stryCov_9fa48("220"), `${slugify(article.title)}-${id}`);
        if (stryMutAct_9fa48("223") ? newSlug === slug : stryMutAct_9fa48("222") ? false : stryMutAct_9fa48("221") ? true : (stryCov_9fa48("221", "222", "223"), newSlug !== slug)) {
          if (stryMutAct_9fa48("224")) {
            {}
          } else {
            stryCov_9fa48("224");
            const existingTitle = await prisma.article.findFirst(stryMutAct_9fa48("225") ? {} : (stryCov_9fa48("225"), {
              where: stryMutAct_9fa48("226") ? {} : (stryCov_9fa48("226"), {
                slug: newSlug
              }),
              select: stryMutAct_9fa48("227") ? {} : (stryCov_9fa48("227"), {
                slug: stryMutAct_9fa48("228") ? false : (stryCov_9fa48("228"), true)
              })
            }));
            if (stryMutAct_9fa48("230") ? false : stryMutAct_9fa48("229") ? true : (stryCov_9fa48("229", "230"), existingTitle)) {
              if (stryMutAct_9fa48("231")) {
                {}
              } else {
                stryCov_9fa48("231");
                throw new HttpException(422, stryMutAct_9fa48("232") ? {} : (stryCov_9fa48("232"), {
                  errors: stryMutAct_9fa48("233") ? {} : (stryCov_9fa48("233"), {
                    title: stryMutAct_9fa48("234") ? [] : (stryCov_9fa48("234"), [stryMutAct_9fa48("235") ? "" : (stryCov_9fa48("235"), 'must be unique')])
                  })
                }));
              }
            }
          }
        }
      }
    }
    const tagList = (stryMutAct_9fa48("238") ? Array.isArray(article.tagList) || article.tagList.length : stryMutAct_9fa48("237") ? false : stryMutAct_9fa48("236") ? true : (stryCov_9fa48("236", "237", "238"), Array.isArray(article.tagList) && article.tagList.length)) ? article.tagList.map(stryMutAct_9fa48("239") ? () => undefined : (stryCov_9fa48("239"), (tag: string) => stryMutAct_9fa48("240") ? {} : (stryCov_9fa48("240"), {
      create: stryMutAct_9fa48("241") ? {} : (stryCov_9fa48("241"), {
        name: tag
      }),
      where: stryMutAct_9fa48("242") ? {} : (stryCov_9fa48("242"), {
        name: tag
      })
    }))) : stryMutAct_9fa48("243") ? ["Stryker was here"] : (stryCov_9fa48("243"), []);
    await disconnectArticlesTags(slug);
    const updatedArticle = await prisma.article.update(stryMutAct_9fa48("244") ? {} : (stryCov_9fa48("244"), {
      where: stryMutAct_9fa48("245") ? {} : (stryCov_9fa48("245"), {
        slug
      }),
      data: stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
        ...(article.title ? stryMutAct_9fa48("247") ? {} : (stryCov_9fa48("247"), {
          title: article.title
        }) : {}),
        ...(article.body ? stryMutAct_9fa48("248") ? {} : (stryCov_9fa48("248"), {
          body: article.body
        }) : {}),
        ...(article.description ? stryMutAct_9fa48("249") ? {} : (stryCov_9fa48("249"), {
          description: article.description
        }) : {}),
        ...(newSlug ? stryMutAct_9fa48("250") ? {} : (stryCov_9fa48("250"), {
          slug: newSlug
        }) : {}),
        updatedAt: new Date(),
        tagList: stryMutAct_9fa48("251") ? {} : (stryCov_9fa48("251"), {
          connectOrCreate: tagList
        })
      }),
      include: stryMutAct_9fa48("252") ? {} : (stryCov_9fa48("252"), {
        tagList: stryMutAct_9fa48("253") ? {} : (stryCov_9fa48("253"), {
          select: stryMutAct_9fa48("254") ? {} : (stryCov_9fa48("254"), {
            name: stryMutAct_9fa48("255") ? false : (stryCov_9fa48("255"), true)
          })
        }),
        author: stryMutAct_9fa48("256") ? {} : (stryCov_9fa48("256"), {
          select: stryMutAct_9fa48("257") ? {} : (stryCov_9fa48("257"), {
            username: stryMutAct_9fa48("258") ? false : (stryCov_9fa48("258"), true),
            bio: stryMutAct_9fa48("259") ? false : (stryCov_9fa48("259"), true),
            image: stryMutAct_9fa48("260") ? false : (stryCov_9fa48("260"), true),
            followedBy: stryMutAct_9fa48("261") ? false : (stryCov_9fa48("261"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("262") ? false : (stryCov_9fa48("262"), true),
        _count: stryMutAct_9fa48("263") ? {} : (stryCov_9fa48("263"), {
          select: stryMutAct_9fa48("264") ? {} : (stryCov_9fa48("264"), {
            favoritedBy: stryMutAct_9fa48("265") ? false : (stryCov_9fa48("265"), true)
          })
        })
      })
    }));
    return articleMapper(updatedArticle, id);
  }
};
export const deleteArticle = async (slug: string, id: number) => {
  if (stryMutAct_9fa48("266")) {
    {}
  } else {
    stryCov_9fa48("266");
    const existingArticle = await await prisma.article.findFirst(stryMutAct_9fa48("267") ? {} : (stryCov_9fa48("267"), {
      where: stryMutAct_9fa48("268") ? {} : (stryCov_9fa48("268"), {
        slug
      }),
      select: stryMutAct_9fa48("269") ? {} : (stryCov_9fa48("269"), {
        author: stryMutAct_9fa48("270") ? {} : (stryCov_9fa48("270"), {
          select: stryMutAct_9fa48("271") ? {} : (stryCov_9fa48("271"), {
            id: stryMutAct_9fa48("272") ? false : (stryCov_9fa48("272"), true),
            username: stryMutAct_9fa48("273") ? false : (stryCov_9fa48("273"), true)
          })
        })
      })
    }));
    if (stryMutAct_9fa48("276") ? false : stryMutAct_9fa48("275") ? true : stryMutAct_9fa48("274") ? existingArticle : (stryCov_9fa48("274", "275", "276"), !existingArticle)) {
      if (stryMutAct_9fa48("277")) {
        {}
      } else {
        stryCov_9fa48("277");
        throw new HttpException(404, {});
      }
    }
    if (stryMutAct_9fa48("280") ? existingArticle.author.id === id : stryMutAct_9fa48("279") ? false : stryMutAct_9fa48("278") ? true : (stryCov_9fa48("278", "279", "280"), existingArticle.author.id !== id)) {
      if (stryMutAct_9fa48("281")) {
        {}
      } else {
        stryCov_9fa48("281");
        throw new HttpException(403, stryMutAct_9fa48("282") ? {} : (stryCov_9fa48("282"), {
          message: stryMutAct_9fa48("283") ? "" : (stryCov_9fa48("283"), 'You are not authorized to delete this article')
        }));
      }
    }
    await prisma.article.delete(stryMutAct_9fa48("284") ? {} : (stryCov_9fa48("284"), {
      where: stryMutAct_9fa48("285") ? {} : (stryCov_9fa48("285"), {
        slug
      })
    }));
  }
};
export const getCommentsByArticle = async (slug: string, id?: number) => {
  if (stryMutAct_9fa48("286")) {
    {}
  } else {
    stryCov_9fa48("286");
    const queries = stryMutAct_9fa48("287") ? ["Stryker was here"] : (stryCov_9fa48("287"), []);
    queries.push(stryMutAct_9fa48("288") ? {} : (stryCov_9fa48("288"), {
      author: stryMutAct_9fa48("289") ? {} : (stryCov_9fa48("289"), {
        demo: stryMutAct_9fa48("290") ? false : (stryCov_9fa48("290"), true)
      })
    }));
    if (stryMutAct_9fa48("292") ? false : stryMutAct_9fa48("291") ? true : (stryCov_9fa48("291", "292"), id)) {
      if (stryMutAct_9fa48("293")) {
        {}
      } else {
        stryCov_9fa48("293");
        queries.push(stryMutAct_9fa48("294") ? {} : (stryCov_9fa48("294"), {
          author: stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
            id
          })
        }));
      }
    }
    const comments = await prisma.article.findUnique(stryMutAct_9fa48("296") ? {} : (stryCov_9fa48("296"), {
      where: stryMutAct_9fa48("297") ? {} : (stryCov_9fa48("297"), {
        slug
      }),
      include: stryMutAct_9fa48("298") ? {} : (stryCov_9fa48("298"), {
        comments: stryMutAct_9fa48("299") ? {} : (stryCov_9fa48("299"), {
          where: stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
            OR: queries
          }),
          select: stryMutAct_9fa48("301") ? {} : (stryCov_9fa48("301"), {
            id: stryMutAct_9fa48("302") ? false : (stryCov_9fa48("302"), true),
            createdAt: stryMutAct_9fa48("303") ? false : (stryCov_9fa48("303"), true),
            updatedAt: stryMutAct_9fa48("304") ? false : (stryCov_9fa48("304"), true),
            body: stryMutAct_9fa48("305") ? false : (stryCov_9fa48("305"), true),
            author: stryMutAct_9fa48("306") ? {} : (stryCov_9fa48("306"), {
              select: stryMutAct_9fa48("307") ? {} : (stryCov_9fa48("307"), {
                username: stryMutAct_9fa48("308") ? false : (stryCov_9fa48("308"), true),
                bio: stryMutAct_9fa48("309") ? false : (stryCov_9fa48("309"), true),
                image: stryMutAct_9fa48("310") ? false : (stryCov_9fa48("310"), true),
                followedBy: stryMutAct_9fa48("311") ? false : (stryCov_9fa48("311"), true)
              })
            })
          })
        })
      })
    }));
    const result = stryMutAct_9fa48("312") ? comments.comments.map((comment: any) => ({
      ...comment,
      author: {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image,
        following: comment.author.followedBy.some((follow: any) => follow.id === id)
      }
    })) : (stryCov_9fa48("312"), comments?.comments.map(stryMutAct_9fa48("313") ? () => undefined : (stryCov_9fa48("313"), (comment: any) => stryMutAct_9fa48("314") ? {} : (stryCov_9fa48("314"), {
      ...comment,
      author: stryMutAct_9fa48("315") ? {} : (stryCov_9fa48("315"), {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image,
        following: stryMutAct_9fa48("316") ? comment.author.followedBy.every((follow: any) => follow.id === id) : (stryCov_9fa48("316"), comment.author.followedBy.some(stryMutAct_9fa48("317") ? () => undefined : (stryCov_9fa48("317"), (follow: any) => stryMutAct_9fa48("320") ? follow.id !== id : stryMutAct_9fa48("319") ? false : stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318", "319", "320"), follow.id === id))))
      })
    }))));
    return result;
  }
};
export const addComment = async (body: string, slug: string, id: number) => {
  if (stryMutAct_9fa48("321")) {
    {}
  } else {
    stryCov_9fa48("321");
    if (stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : stryMutAct_9fa48("322") ? body : (stryCov_9fa48("322", "323", "324"), !body)) {
      if (stryMutAct_9fa48("325")) {
        {}
      } else {
        stryCov_9fa48("325");
        throw new HttpException(422, stryMutAct_9fa48("326") ? {} : (stryCov_9fa48("326"), {
          errors: stryMutAct_9fa48("327") ? {} : (stryCov_9fa48("327"), {
            body: stryMutAct_9fa48("328") ? [] : (stryCov_9fa48("328"), [stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), "can't be blank")])
          })
        }));
      }
    }
    const article = await prisma.article.findUnique(stryMutAct_9fa48("330") ? {} : (stryCov_9fa48("330"), {
      where: stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
        slug
      }),
      select: stryMutAct_9fa48("332") ? {} : (stryCov_9fa48("332"), {
        id: stryMutAct_9fa48("333") ? false : (stryCov_9fa48("333"), true)
      })
    }));
    const comment = await prisma.comment.create(stryMutAct_9fa48("334") ? {} : (stryCov_9fa48("334"), {
      data: stryMutAct_9fa48("335") ? {} : (stryCov_9fa48("335"), {
        body,
        article: stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
          connect: stryMutAct_9fa48("337") ? {} : (stryCov_9fa48("337"), {
            id: article.id
          })
        }),
        author: stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
          connect: stryMutAct_9fa48("339") ? {} : (stryCov_9fa48("339"), {
            id: id
          })
        })
      }),
      include: stryMutAct_9fa48("340") ? {} : (stryCov_9fa48("340"), {
        author: stryMutAct_9fa48("341") ? {} : (stryCov_9fa48("341"), {
          select: stryMutAct_9fa48("342") ? {} : (stryCov_9fa48("342"), {
            username: stryMutAct_9fa48("343") ? false : (stryCov_9fa48("343"), true),
            bio: stryMutAct_9fa48("344") ? false : (stryCov_9fa48("344"), true),
            image: stryMutAct_9fa48("345") ? false : (stryCov_9fa48("345"), true),
            followedBy: stryMutAct_9fa48("346") ? false : (stryCov_9fa48("346"), true)
          })
        })
      })
    }));
    return stryMutAct_9fa48("347") ? {} : (stryCov_9fa48("347"), {
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
      author: stryMutAct_9fa48("348") ? {} : (stryCov_9fa48("348"), {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image,
        following: stryMutAct_9fa48("349") ? comment.author.followedBy.every((follow: any) => follow.id === id) : (stryCov_9fa48("349"), comment.author.followedBy.some(stryMutAct_9fa48("350") ? () => undefined : (stryCov_9fa48("350"), (follow: any) => stryMutAct_9fa48("353") ? follow.id !== id : stryMutAct_9fa48("352") ? false : stryMutAct_9fa48("351") ? true : (stryCov_9fa48("351", "352", "353"), follow.id === id))))
      })
    });
  }
};
export const deleteComment = async (id: number, userId: number) => {
  if (stryMutAct_9fa48("354")) {
    {}
  } else {
    stryCov_9fa48("354");
    const comment = await prisma.comment.findFirst(stryMutAct_9fa48("355") ? {} : (stryCov_9fa48("355"), {
      where: stryMutAct_9fa48("356") ? {} : (stryCov_9fa48("356"), {
        id,
        author: stryMutAct_9fa48("357") ? {} : (stryCov_9fa48("357"), {
          id: userId
        })
      }),
      select: stryMutAct_9fa48("358") ? {} : (stryCov_9fa48("358"), {
        author: stryMutAct_9fa48("359") ? {} : (stryCov_9fa48("359"), {
          select: stryMutAct_9fa48("360") ? {} : (stryCov_9fa48("360"), {
            id: stryMutAct_9fa48("361") ? false : (stryCov_9fa48("361"), true),
            username: stryMutAct_9fa48("362") ? false : (stryCov_9fa48("362"), true)
          })
        })
      })
    }));
    if (stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : stryMutAct_9fa48("363") ? comment : (stryCov_9fa48("363", "364", "365"), !comment)) {
      if (stryMutAct_9fa48("366")) {
        {}
      } else {
        stryCov_9fa48("366");
        throw new HttpException(404, {});
      }
    }
    if (stryMutAct_9fa48("369") ? comment.author.id === userId : stryMutAct_9fa48("368") ? false : stryMutAct_9fa48("367") ? true : (stryCov_9fa48("367", "368", "369"), comment.author.id !== userId)) {
      if (stryMutAct_9fa48("370")) {
        {}
      } else {
        stryCov_9fa48("370");
        throw new HttpException(403, stryMutAct_9fa48("371") ? {} : (stryCov_9fa48("371"), {
          message: stryMutAct_9fa48("372") ? "" : (stryCov_9fa48("372"), 'You are not authorized to delete this comment')
        }));
      }
    }
    await prisma.comment.delete(stryMutAct_9fa48("373") ? {} : (stryCov_9fa48("373"), {
      where: stryMutAct_9fa48("374") ? {} : (stryCov_9fa48("374"), {
        id
      })
    }));
  }
};
export const favoriteArticle = async (slugPayload: string, id: number) => {
  if (stryMutAct_9fa48("375")) {
    {}
  } else {
    stryCov_9fa48("375");
    const {
      _count,
      ...article
    } = await prisma.article.update(stryMutAct_9fa48("376") ? {} : (stryCov_9fa48("376"), {
      where: stryMutAct_9fa48("377") ? {} : (stryCov_9fa48("377"), {
        slug: slugPayload
      }),
      data: stryMutAct_9fa48("378") ? {} : (stryCov_9fa48("378"), {
        favoritedBy: stryMutAct_9fa48("379") ? {} : (stryCov_9fa48("379"), {
          connect: stryMutAct_9fa48("380") ? {} : (stryCov_9fa48("380"), {
            id: id
          })
        })
      }),
      include: stryMutAct_9fa48("381") ? {} : (stryCov_9fa48("381"), {
        tagList: stryMutAct_9fa48("382") ? {} : (stryCov_9fa48("382"), {
          select: stryMutAct_9fa48("383") ? {} : (stryCov_9fa48("383"), {
            name: stryMutAct_9fa48("384") ? false : (stryCov_9fa48("384"), true)
          })
        }),
        author: stryMutAct_9fa48("385") ? {} : (stryCov_9fa48("385"), {
          select: stryMutAct_9fa48("386") ? {} : (stryCov_9fa48("386"), {
            username: stryMutAct_9fa48("387") ? false : (stryCov_9fa48("387"), true),
            bio: stryMutAct_9fa48("388") ? false : (stryCov_9fa48("388"), true),
            image: stryMutAct_9fa48("389") ? false : (stryCov_9fa48("389"), true),
            followedBy: stryMutAct_9fa48("390") ? false : (stryCov_9fa48("390"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("391") ? false : (stryCov_9fa48("391"), true),
        _count: stryMutAct_9fa48("392") ? {} : (stryCov_9fa48("392"), {
          select: stryMutAct_9fa48("393") ? {} : (stryCov_9fa48("393"), {
            favoritedBy: stryMutAct_9fa48("394") ? false : (stryCov_9fa48("394"), true)
          })
        })
      })
    }));
    const result = stryMutAct_9fa48("395") ? {} : (stryCov_9fa48("395"), {
      ...article,
      author: profileMapper(article.author, id),
      tagList: article.tagList.map(stryMutAct_9fa48("396") ? () => undefined : (stryCov_9fa48("396"), (tag: Tag) => tag.name)),
      favorited: stryMutAct_9fa48("397") ? article.favoritedBy.every((favorited: any) => favorited.id === id) : (stryCov_9fa48("397"), article.favoritedBy.some(stryMutAct_9fa48("398") ? () => undefined : (stryCov_9fa48("398"), (favorited: any) => stryMutAct_9fa48("401") ? favorited.id !== id : stryMutAct_9fa48("400") ? false : stryMutAct_9fa48("399") ? true : (stryCov_9fa48("399", "400", "401"), favorited.id === id)))),
      favoritesCount: _count.favoritedBy
    });
    return result;
  }
};
export const unfavoriteArticle = async (slugPayload: string, id: number) => {
  if (stryMutAct_9fa48("402")) {
    {}
  } else {
    stryCov_9fa48("402");
    const {
      _count,
      ...article
    } = await prisma.article.update(stryMutAct_9fa48("403") ? {} : (stryCov_9fa48("403"), {
      where: stryMutAct_9fa48("404") ? {} : (stryCov_9fa48("404"), {
        slug: slugPayload
      }),
      data: stryMutAct_9fa48("405") ? {} : (stryCov_9fa48("405"), {
        favoritedBy: stryMutAct_9fa48("406") ? {} : (stryCov_9fa48("406"), {
          disconnect: stryMutAct_9fa48("407") ? {} : (stryCov_9fa48("407"), {
            id: id
          })
        })
      }),
      include: stryMutAct_9fa48("408") ? {} : (stryCov_9fa48("408"), {
        tagList: stryMutAct_9fa48("409") ? {} : (stryCov_9fa48("409"), {
          select: stryMutAct_9fa48("410") ? {} : (stryCov_9fa48("410"), {
            name: stryMutAct_9fa48("411") ? false : (stryCov_9fa48("411"), true)
          })
        }),
        author: stryMutAct_9fa48("412") ? {} : (stryCov_9fa48("412"), {
          select: stryMutAct_9fa48("413") ? {} : (stryCov_9fa48("413"), {
            username: stryMutAct_9fa48("414") ? false : (stryCov_9fa48("414"), true),
            bio: stryMutAct_9fa48("415") ? false : (stryCov_9fa48("415"), true),
            image: stryMutAct_9fa48("416") ? false : (stryCov_9fa48("416"), true),
            followedBy: stryMutAct_9fa48("417") ? false : (stryCov_9fa48("417"), true)
          })
        }),
        favoritedBy: stryMutAct_9fa48("418") ? false : (stryCov_9fa48("418"), true),
        _count: stryMutAct_9fa48("419") ? {} : (stryCov_9fa48("419"), {
          select: stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
            favoritedBy: stryMutAct_9fa48("421") ? false : (stryCov_9fa48("421"), true)
          })
        })
      })
    }));
    const result = stryMutAct_9fa48("422") ? {} : (stryCov_9fa48("422"), {
      ...article,
      author: profileMapper(article.author, id),
      tagList: article.tagList.map(stryMutAct_9fa48("423") ? () => undefined : (stryCov_9fa48("423"), (tag: Tag) => tag.name)),
      favorited: stryMutAct_9fa48("424") ? article.favoritedBy.every((favorited: any) => favorited.id === id) : (stryCov_9fa48("424"), article.favoritedBy.some(stryMutAct_9fa48("425") ? () => undefined : (stryCov_9fa48("425"), (favorited: any) => stryMutAct_9fa48("428") ? favorited.id !== id : stryMutAct_9fa48("427") ? false : stryMutAct_9fa48("426") ? true : (stryCov_9fa48("426", "427", "428"), favorited.id === id)))),
      favoritesCount: _count.favoritedBy
    });
    return result;
  }
};