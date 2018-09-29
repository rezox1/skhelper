function getUUID(info, tab){
  console.log(JSON.stringify(info) + " " + JSON.stringify(tab));
  browser.tabs.sendMessage(tab.id, info);
}

browser.menus.create({
  id: "get-UUID",
  title: "Получить UUID",
  contexts: ["page"],
  icons: {
    "16": "icons/sk16.png",
    "32": "icons/sk32.png"
  },
  onclick: getUUID
});

browser.runtime.onMessage.addListener();
/*
попробовать ограничить отображение меню только на элементах смарт кит через contexts
*/
