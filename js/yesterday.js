$(document).ready(function () {
  var d = new Date();
  d.setDate(d.getDate() - 1);
  var day = d.toISOString().slice(0, 10);
  $.getJSON("./Tweets/" + day + ".json", function (twt) {
    for (key in twt.tweets) {
      tweetUrl = twt.tweets[key];
      console.log(key);
      generate1(tweetUrl);
    }
  });
});

const generate1 = async (tweetUrl) => {
  var outputArea;
  if (validURL1(tweetUrl)) {
    const iframeCodeStr = await getIframeCodeFromTweet1(tweetUrl);
    outputArea = iframeCodeStr;
    // previewArea.innerHTML = iframeCodeStr;
  } else {
    alert("Please enter a valid URL 🙃");
  }
  $("#yesterday").append("<div>" + outputArea + "</div>");
};

function validURL1(myURL) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
      "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return pattern.test(myURL);
}

const getIframeCodeFromTweet1 = async (tweetUrl) => {
  const embedInfo = await getOEmbed1(tweetUrl);
  let { html, width, height } = embedInfo;
  let iframeCodeStr = "";
  html = html.replace(/<script[^<]+<\/script>/gi, "");
  iframeCodeStr = html;

  return iframeCodeStr;
};

const getOEmbed1 = async (tweetIdOrUrl, optParams = {}) => {
  const endpoint = "https://publish.twitter.com/oembed";
  /** @type {GetOEmbedParams} */
  const params = {
    ...optParams,
    url: tweetIdOrUrl,
  };
  const url = new URL(endpoint);
  // @ts-ignore
  url.search = new URLSearchParams(params);

  // Use JSONP to get around missing CORs headers
  return new Promise((res, rej) => {
    let resolved = false;
    fetchViaJsonp1(url.toString(), (data) => {
      resolved = true;
      res(data);
    });
    setTimeout(() => {
      if (!resolved) {
        rej(new Error("fetch timeout or error"));
      }
    }, 5000);
  });
};

const fetchViaJsonp1 = (url, callback) => {
  var callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
  window[callbackName] = function (data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  var script = document.createElement("script");
  script.src =
    url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + callbackName;
  document.body.appendChild(script);
};
