const options = {
  includeScore: true,
  includeMatches: true,
  useExtendedSearch: false,
  threshold: 0.6,
  keys: [
    { name: "title", weight: 3 },
    { name: "description.firstName", weight: 2 },
    { name: "description.lastName", weight: 1 },
    { name: "keywords.keyword", weight: 4 },
  ],
};

var allSearchKeywords = data;

clearSearch = () => {
  console.log("clear");
  document.getElementById("textSearch").value = "";
  document.getElementById("results").innerHTML = "";
};

search = () => {
  let text = document.getElementById("textSearch").value;
  const fuse = new Fuse(allSearchKeywords, options);
  const res = fuse.search(text);
  //console.log("Search results>>>>>", res)
  const finalSearchResults = sortByWeight(res, text); // custom function for sort the resuly by keywords
  var html = "";
  if (res.length) {
    html += `<h4><b>${res.length} search result(s) found</b></h4>`;
    for (let i = 0; i < res.length; i++) {
      html += `<div class="searches"><p><b>Title: </b>${finalSearchResults[i].item.title}</p><p><b>First name: </b>${finalSearchResults[i].item.description.firstName} , <b>Last name: </b>${finalSearchResults[i].item.description.lastName}</p></div>`;
    }
    document.getElementById("results").innerHTML = html;
  } else {
    document.getElementById("results").innerHTML =
      "<h4> <b>No result found </b></h4>";
  }
};

sortByWeight = (searchRes, searchKeyword) => {
  searchRes.forEach((element) => {
    element.matches.forEach((match) => {
      if (
        match.key === "keywords.keyword" &&
        (match.value.indexOf(searchKeyword.toLowerCase()) > -1 ||
          searchKeyword.indexOf(match.value.toLowerCase()) > -1)
      ) {
        element.isMatchKeyword = true;
      }
    });
  });
  // console.log("searchRes>>>KEYWORDS", searchRes);
  searchRes.forEach((element) => {
    if (element.isMatchKeyword) {
      element.item.keywords.forEach((item) => {
        if (
          item.keyword.toLowerCase().indexOf(searchKeyword.toLowerCase()) >
            -1 ||
          searchKeyword.toLowerCase().indexOf(item.keyword.toLowerCase()) > -1
        ) {
          element.searchKeywordWeight = item.weight;
        }
      });
    }
  });
  //console.log("searchRes>>>KEYWORDS", searchRes);
  searchRes.sort((a, b) => {
    return b.searchKeywordWeight - a.searchKeywordWeight;
  });
  console.log("FINAL>>>", searchRes);
  return searchRes;
};

debounce = (cb, interval, immediate) => {
  var timeout;

  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) cb.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, interval);

    if (callNow) cb.apply(context, args);
  };
};

document.getElementById("textSearch").onkeyup = debounce(search, 300);
