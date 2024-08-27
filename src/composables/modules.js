const setLocalStorage = (key, value) => {
  const item = {
    value,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// API 驗證
const getAuthHeader = async () => {
  const test = JSON.parse(localStorage.getItem("taiwan-travel"));
  console.log(test);

  if (test && test.value.expired_at > Date.now()) {
    return { Authorization: `Bearer ${test.value.access_token}` };
  }

  const url =
    "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "bpud50122-7e35618d-05d6-44de",
      client_secret: "7c253da8-acde-48e3-9a02-b7c10a34b240",
    }),
  });
  let data = await response.json();
  data = { ...data, expired_at: Date.now() + data.expires_in * 1000 };
  setLocalStorage("taiwan-travel", data);
  return { Authorization: `Bearer ${data.access_token}` };
};

const perPage = 6;

const getDetail = (id) => {
  let url = "https://tdx.transportdata.tw/api/basic/v2/Tourism/";
  url += `${getMode(id, true)}/?$format=JSON&$filter=${getMode(
    id,
    true
  )}ID eq '${id}'`;
  return fetch(url, { headers: getAuthHeader() })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.length == 0) {
        throw new Error();
      }
      if (res[0].StartTime === res[0].EndTime) res[0].Date = res[0].EndTime;
      return res[0];
    });
};

const getMode = (id, en) => {
  const tag = id.split("_")[0];
  if (tag === "C1") {
    return en ? "ScenicSpot" : "景點";
  }
  if (tag === "C2") {
    return en ? "Activity" : "活動";
  }
  if (tag === "C3") {
    return en ? "Restaurant" : "餐廳";
  }
  if (tag === "C4") {
    return en ? "Hotel" : "旅宿";
  }
};

const dataFilter = (arr, count = 4) => {
  return new Promise((resolve) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      if (!arr.length) {
        return;
      }
      const idx = Math.floor(Math.random() * arr.length);
      result.push(arr[idx]);
      arr.splice(idx, 1);
    }
    resolve(result);
  });
};

// const handleTime = (arr)

const handleTime = (arr) => {
  return new Promise((resolve) => {
    arr.forEach((item) => {
      if (item.StartTime) {
        item.StartTime = item.StartTime.split("T")[0];
      }
      if (item.EndTime) {
        item.EndTime = item.EndTime.split("T")[0];
      }
      if (item.StartTime === item.EndTime) {
        item.Date = item.EndTime;
      }
    });
    resolve(arr);
  });
};

const getData = (mode, city, page = 1, keyword = null) => {
  console.log(keyword);
  city = city === "Taiwan" ? "" : city;
  let url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/${mode}/${city}?$top=${perPage}&$skip=${
    (page - 1) * perPage
  }&$format=JSON`;
  url += `&$select=${mode}ID,${mode}Name,Address,Picture`;
  if (mode === "ScenicSpot") url += ",Class1,Class2,Class3,OpenTime,TicketInfo";
  if (mode === "Restaurant") url += ",Class,OpenTime";
  if (mode === "Hotel") url += ",Class";
  if (mode === "Activity") url += ",Class1,Class2";
  url += `&$filter=Picture/PictureUrl1 ne null`;
  if (keyword) {
    let filter = "";
    keyword.split(",").forEach((k) => {
      filter += ` or contains(${mode}Name, '${k}') `;
      if (mode === "Restaurant" || mode === "Hotel")
        filter += ` or contains(Class,'${k}')`;
      if (mode === "ScenicSpot" || mode === "Activity")
        filter += ` or contains(Class1,'${k}') or contains(Class2,'${k}')`;
      if (mode === "ScenicSpot") filter += ` or contains(Class3,'${k}')`;
    });
    filter = filter.replace(" or ", "");
    url += ` and (${filter})`;
  }
  console.log(url);
  return fetch(url, { headers: getAuthHeader() }).then((res) => res.json());
};

const getNearInfo = (mode, lat, lon, page) => {
  let url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/${mode}?`;
  url += `$top=${perPage}&$skip=${(page - 1) * perPage}&$format=JSON`;
  url += `&$select=${mode}ID,${mode}Name,Address,Picture`;
  if (mode === "ScenicSpot") url += ",Class1,Class2,Class3,OpenTime,TicketInfo";
  if (mode === "Restaurant") url += ",Class,OpenTime";
  if (mode === "Hotel") url += ",Class";
  if (mode === "Activity") url += ",Class1,Class2";
  url += `&$spatialFilter=nearby(${lat},${lon},50000)`;
  console.log("near info");
  return fetch(url, { headers: getAuthHeader() }).then((res) => res.json());
};

export { dataFilter, getData, handleTime, getDetail, getMode, getNearInfo };
