## 简介
这是一个 C2C 的网站系统，类似 [Patreon 可按月赞助创作者的平台](https://www.patreon.com/) 、[爱发电, 爱发电是一个让粉丝支持创作者，为创作者”发电“的地方。](https://afdian.net/)
当然我们做这个并不是完全为了运营，而且为了把这种模式的业务系统+应用做好，并且采用合适的技术实现。

当前系统将采用 Nestjs 做为服务端、vuejs 做网站端、小程序端采用 uni、app 端采用 fluter

这种模式的一个简单介绍

来源：知乎
大约从2008年起，美国的营销/互联网大师们提出了一个新概念：1000 True Fans（你猜对了，领头的就是中国互联网精神教父Kevin Kelly）大意是说搞创作的人有了互联网之后，只要有一个规模比较小的忠实粉丝群就可以维持生计，不必像大众媒体时代那样卖个几十万上百万张唱片/票房过亿才能生存。从根上讲，还是砍掉中间人的路线，跟电商、网上租房等等是一个思路，只不过应用领域变成了内容创作者。在这个过程中，你怎么维护这么一个规模的忠实粉丝群，是一整个新话题，这里不展开讲。只说跟patreon有关的。

其实类似的业务很多人都想到了。微信公众平台的赞赏就是想干这件事（订阅上线之后就完全一样了）。微博问答的围观某种程度上也是这回事。（知乎上有个朋友在2013年提出了几乎一样的构思：搭建这样一个可以支持/赞助音乐创作者的平台创业想法可行吗？不知这个爱发电跟ta有没有关系）关键是看怎么运营。而且越往下这种平台的需求会越强。
...

有兴趣的同学可以深度研究一下这种业务模式，更好的应用这个平台。

https://www.zhihu.com/search?type=content&q=patreon

## 
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  Nest is [MIT licensed](LICENSE).
