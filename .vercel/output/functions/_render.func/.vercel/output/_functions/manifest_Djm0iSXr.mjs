import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_NRtUXHCe.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.mdx","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"external/survey/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/external/survey","isIndex":false,"type":"page","pattern":"^\\/external\\/survey\\/?$","segments":[[{"content":"external","dynamic":false,"spread":false}],[{"content":"survey","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/external/survey.astro","pathname":"/external/survey","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"resume/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/resume","isIndex":false,"type":"page","pattern":"^\\/resume\\/?$","segments":[[{"content":"resume","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/resume.astro","pathname":"/resume","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.4.4_sass@1.71.1/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://brianmp.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/brian/Projects/brianmp.dev/src/components/Header.astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/layouts/BlogPostLayout.astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/about.mdx",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/about@_@mdx",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/index.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/resume.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/resume@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/components/ThemeSwitch.astro",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/components/Footer.astro",{"propagation":"in-tree","containsHead":false}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}],["/Users/brian/Projects/brianmp.dev/src/pages/external/survey.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-manifest":"manifest_Djm0iSXr.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.4.4_sass@1.71.1/node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_JsqqWNq7.mjs","\u0000@astro-page:src/pages/about@_@mdx":"chunks/about_hk7FBCh0.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"chunks/index_7wUN78K4.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"chunks/_.._ZqeMP6gk.mjs","\u0000@astro-page:src/pages/external/survey@_@astro":"chunks/survey_BLY6jbiA.mjs","\u0000@astro-page:src/pages/resume@_@astro":"chunks/resume_CjMGznnu.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"chunks/rss_2nfp7wDV.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_BZHaIX2W.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/0/index.mdx?astroContentCollectionEntry=true":"chunks/index_BtaSG6Mi.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/1/index.mdx?astroContentCollectionEntry=true":"chunks/index_Bh_M7G41.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/2/index.mdx?astroContentCollectionEntry=true":"chunks/index_DuPIZ8zL.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/3/index.mdx?astroContentCollectionEntry=true":"chunks/index_C5CIGwyn.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/just-build-something/index.mdx?astroContentCollectionEntry=true":"chunks/index_DFdjFC2A.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/0/index.mdx?astroPropagatedAssets":"chunks/index_CJorbjrE.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/1/index.mdx?astroPropagatedAssets":"chunks/index_Can5UpBn.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/2/index.mdx?astroPropagatedAssets":"chunks/index_IwWN-DcU.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/3/index.mdx?astroPropagatedAssets":"chunks/index__A_HNyuo.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/just-build-something/index.mdx?astroPropagatedAssets":"chunks/index_2h_TXTU-.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/0/index.mdx":"chunks/index_CFHfX7pm.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/1/index.mdx":"chunks/index_5ieVLwce.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/2/index.mdx":"chunks/index_Kp8gZ2s1.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/cool-stuff/3/index.mdx":"chunks/index_CB141c8K.mjs","/Users/brian/Projects/brianmp.dev/src/content/blog/just-build-something/index.mdx":"chunks/index_wSbYNFjo.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.CH5-uJBR.js","/astro/hoisted.js?q=1":"_astro/hoisted.DqR2iBSn.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/cosplay-pic.CoqjkNa8.jpg","/_astro/zed._d41uSu3.png","/_astro/oklch.WrlHlYXp.jpg","/_astro/blog-placeholder-about.QDHyddZ3.jpg","/_astro/just-build-something-2.CiHuAXqA.jpg","/_astro/cssbattle.DJtouyOA.png","/_astro/houston.lYlUGHhQ.webp","/_astro/astro-islands-example.Cji8vGkQ.png","/_astro/open-props.Bx08eHzM.png","/_astro/zed-gpui2.BbAnHc-0.png","/_astro/resume.BreIkX5C.png","/_astro/cssbattle-screenshot2.lYyyRSq4.png","/_astro/cssbattle-tldraw.DXuY2TaF.png","/_astro/zed-website.n7BZeFv7.png","/_astro/ipad-wireframe.ypvUUByO.png","/_astro/about.BTDjyhQn.css","/BrianPoblete_resume.pdf","/age-calculator-sm.mp4","/age-calculator-sm.webm","/apple-touch-icon.png","/blog-placeholder-1.jpg","/blog-placeholder-2.jpg","/blog-placeholder-3.jpg","/blog-placeholder-4.jpg","/blog-placeholder-5.jpg","/blog-placeholder-about.jpg","/br-fm.mp4","/br-fm.webm","/favicon.ico","/favicon.png","/favicon.svg","/og-banner-no-tag.png","/og-banner.jpg","/og-banner.png","/og-tech.jpg","/resume.png","/_astro/hoisted.DqR2iBSn.js","/fonts/atkinson_bold.woff","/fonts/atkinson_regular.woff","/fonts/space_grotesk.ttf","/about/index.html","/blog/index.html","/external/survey/index.html","/resume/index.html","/rss.xml","/index.html"],"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
