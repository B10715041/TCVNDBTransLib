// ==UserScript==
// @name         VNDBTranslatorLib
// @namespace    http://tampermonkey.net/
// @version      4.3.10
// @description  VNDB優先原文和中文化的庫
// @author       aotmd
// @license MIT
// ==/UserScript==
/*todo 效率文字:新增粗翻標記°:查詢:(".*?")(: )"(.*?)"(,.*?)$ 替換:$1$2"$3°"$4*/
/*todo 效率文字:將鍵值對轉換為只有值:查詢:(".*?")(: )"(.*?)(",?.*?)$ 替換:$3*/
/*todo 翻譯最後加°號表示粗翻,加'號表示無法找到準確翻譯*/
/**-------------------------------資料部分[850行]-------------------------------------*/
/*通用主map,作用在全域性*/
let mainMap = {
    /**左側欄[常駐]*/
    /*選單*/
    "Support VNDB": "贊助 VNDB",
    "Patreon": "Patreon",
    "SubscribeStar": "SubscribeStar",
    "Menu": "選單",
    "Home": "首頁",
    "Visual novels": "視覺小說",
    "Tags": "標籤",
    "Releases": "版本",
    "Producers": "製作人",
    "Staff": "工作人員",
    "Characters": "人物",
    "Traits": "特徵",
    "Users": "使用者",
    "Recent changes": "最近更改",
    "Discussion board": "討論區",
    "FAQ": "常見問題",
    "Random visual novel": "隨機視覺小說",
    "Dumps": "轉儲",
    "API": "API",
    "Query": "查詢",
    "Search": "搜尋",
    "search": "搜尋",
    /*我的*/
    "My Profile": "我的個人資料",
    "My Visual Novel List": "我的視覺小說列表",
    "My Votes": "我的評分",
    "My Wishlist": "我的願望單",
    "My Notifications": "我的通知",
    "My Recent Changes": "我的最近更改",
    "My Tags": "我的標籤",
    "Image Flagging": "圖片標記",
    "Add Visual Novel": "新增視覺小說",
    "Add Producer": "新增製作人",
    "Add Staff": "新增工作人員",
    "Logout": "退出登入",
    /*未登陸狀態*/
    "User menu": "使用者選單",
    "Login": "登入",
    "Password reset": "重置密碼",
    "Register": "註冊",

    /*資料庫統計*/
    "Database Statistics": "資料庫統計",
    "Visual Novels": "視覺小說",

    /** 標題和,底部[常駐] */
    "the visual novel database": "視覺小說資料庫",
    "about us": "關於我們",

    /** 額外map提升*/
    /*個人頁相關*/
    "Arabic": "阿拉伯語",
    "Bulgarian": "保加利亞語",
    "Catalan": "加泰羅尼亞語",
    "Chinese": "中文",
    "Chinese (simplified)": "中文(簡體)",
    "Chinese (traditional)": "中文(繁體)",
    "Croatian": "克羅埃西亞語",
    "Czech": "捷克語",
    "Danish": "丹麥語",
    "Dutch": "荷蘭語",
    "English": "英語",
    "Esperanto": "世界語",
    "Finnish": "芬蘭語",
    "French": "法語",
    "German": "德語",
    "Greek": "希臘語",
    "Hebrew": "希伯來語",
    "Hindi": "印地語",
    "Hungarian": "匈牙利語",
    "Indonesian": "印尼語",
    "Irish": "愛爾蘭語",
    "Italian": "義大利語",
    "Japanese": "日語",
    "Korean": "韓語",
    "Latin": "拉丁語",
    "Latvian": "拉脫維亞語",
    "Lithuanian": "立陶宛語",
    "Macedonian": "馬其頓語",
    "Malay": "馬來語",
    "Norwegian": "挪威語",
    "Persian": "波斯語",
    "Polish": "波蘭語",
    "Portuguese (Brazil)": "葡萄牙語(巴西)",
    "Portuguese (Portugal)": "葡萄牙語(葡萄牙)",
    "Romanian": "羅馬尼亞語",
    "Russian": "俄語",
    "Scottish Gaelic": "蘇格蘭蓋爾語",
    "Slovak": "斯洛伐克語",
    "Slovene": "斯洛維尼亞語",
    "Spanish": "西班牙語",
    "Swedish": "瑞典語",
    "Tagalog": "塔加洛語",
    "Thai": "泰語",
    "Turkish": "土耳其語",
    "Ukrainian": "烏克蘭語",
    "Urdu": "烏爾都語",
    "Vietnamese": "越南語",

    /*評分說明*/
    "masterpiece": "傑作|超神作",
    "excellent": "極好|神作",
    "so-so": "一般般|不過不失",
    "very good": "很好|力薦",
    "good": "好|推薦",
    "decent": "不錯|還行",
    "weak": "不太行|較差",
    "bad": "糟糕|差",
    "awful": "很壞|很差",
    "worst ever": "最差|不忍直視",

    "Vote stats": "評分統計",
    "Recent votes": "最近評分",
    "show all": "顯示全部",

    "Report an issue on this page.": "在此頁面上報告問題。",

    /*標籤狀態*/
    "Playing": "在玩",
    "Finished": "玩過",
    "Stalled": "擱置",
    "Dropped": "拋棄",
    "Wishlist": "願望單",
    "Blacklist": "黑名單",

};
/**
 * 用以替換title的值,若mainMap有則會自動替換,不需要再重複在這寫一遍
 * @type {{Object}}
 */
let titleMap={

};

/** 特殊全域性map,用以替換變動的文字節點[正則],
 * value出現的%%$1%%為需要繼續翻譯值
 * vlaue出現的%%@@$1@@%%將$1轉小寫,然後繼續翻譯值
 * */
let specialMap = {
    /*轉小寫再匹配map,範圍太廣不使用*/
    // "^([a-zA-Z -]+)$":"%%@@$1@@%%",
    /** 遊戲詳情頁,評分統計 /v\d+ */
    "^(\\d+) vote[s]? total, average ([\\d.]+) \\(([a-zA-Z -]+)\\)$": "總共$1票, 平均分$2 (%%$3%%)",
    /** 討論  */
    "^discussions \\((\\d+)\\)$": "討論 ($1)",

    /**上移->個人頁相關 評分說明(下拉列表,選擇分數時)*/
    "^(\\d+) \\(([a-zA-Z -]+)\\)$": "$1 (%%$2%%)",
    /**我的通知*/
    "^My Notifications \\((\\d+)\\)$":"我的通知 ($1)"
};


/*額外map,作用在指定頁面*/
let otherPageRules = [
    {
        /*作用頁說明*/
        name: '個人頁相關',
        /*正則表示式*/
        regular: /\/u\d+/i,
        /*mainMap k->v*/
        map: {
            /** 使用者頁頂欄   /ID */
            "edit": "編輯",
            "list": "列表",
            "votes": "評分",
            "wishlist": "願望單",
            "reviews": "評論",
            "posts": "帖子",
            "history": "歷史",
            /** 個人資料頁   /ID */
            "Username": "使用者名稱",
            "Registered": "註冊日期",
            "Edits": "編輯",
            "Votes": "評分",
            "Browse votes »": "瀏覽評分 »",
            "Play times": "遊戲時間",
            "List stats": "列表統計",
            "Browse list »": "瀏覽列表 »",
            "Reviews": "評論",
            "Browse reviews »": "瀏覽評論 »",
            "Browse tags »":"瀏覽標籤 »",
            "Images": "圖片",
            "Browse image votes »": "瀏覽圖片投票 »",
            "Forum stats": "論壇統計",
            "Browse posts »": "瀏覽帖子 »",
            "Vote statistics": "評分統計",
            // "Vote stats": "評分統計",
            // "Recent votes": "最近評分",
            // "show all": "顯示全部",
            /** 編輯頁 /ID/edit */
            "My Account": "我的賬號",
            "Account settings": "賬號設定",
            "change": "修改",
            "E-Mail": "電子郵箱",
            "Change password": "更改密碼",
            "Preferences": "偏好",
            "NSFW": "NSFW",
            "Hide sexually suggestive or explicit images": "隱藏性暗示或色情圖片",
            "Hide all images": "隱藏所有圖片",
            "Hide only sexually explicit images": "只隱藏色情圖片",
            "Don't hide suggestive or explicit images": "不隱藏性暗示或色情圖片",
            "Hide violent or brutal images": "隱藏暴力或殘暴圖片",
            "Hide only brutal images": "只隱藏殘暴的圖片",
            "Don't hide violent or brutal images": "不隱藏暴力或殘暴的圖片",
            "Show sexual traits by default on character pages": "預設情況下在人物頁面上顯示性特徵",
            "Title language": "標題語言",
            "Add language": "新增語言",
            "Original language": "原始語言",
            "romanized": "羅馬化",
            "Alternative title": "副標題",
            "The alternative title is displayed below the main title and as tooltip for links.": "副標題顯示在主標題下方，並作為連結的提示",
            /*語言相關已提升至主map*/
            "remove": "移除",
            "Show all tags by default on visual novel pages (don't summarize)": "在視覺小說頁面上預設顯示所有標籤(不彙總)",
            "Default tag categories on visual novel pages:": "視覺小說頁面上預設顯示的標籤類別:",
            "Content": "內容",
            "Sexual content": "色情內容",
            "Technical": "技術相關",
            "Spoiler level": "劇透級別",
            "Hide spoilers": "隱藏劇透",
            "Show only minor spoilers": "僅顯示輕微劇透",
            "Show all spoilers": "顯示所有劇透",
            "Skin": "皮膚",
            "AIR (sky blue)": "AIR(天藍)",
            "Angelic Serenade (dark blue)": "エンジェリックセレナーデ 天使小夜曲(深藍色)",
            "EIeL (peach-orange)": "電脳妖精エルファン (桃橙色)",
            "Eien no Aselia (falu red)": "永遠のアセリア 永遠的艾塞莉婭 (法魯紅)",
            "Ever17 (bondi blue)": "ever17 (邦迪藍)",
            "Fate/stay night (pale carmine)": "fate/stay night (淡胭脂紅)",
            "Fate/stay night (seal brown)": "fate/stay night (海豹棕)",
            "Gekkou no Carnevale (black)": "月光のカルネヴァーレ 月光嘉年華(黑色)",
            "Higanbana no Saku Yoru ni (maroon)": "彼岸花の咲く夜に 彼岸花盛開之夜 (栗色)",
            "Higurashi no Naku Koro ni (orange)": "ひぐらしのなく頃に 寒蟬鳴泣之時 (橙色)",
            "Little Busters! (lemon chiffon)": "リトルバスターズ！ little busters! (檸檬雪紡)",
            "Little Busters! (pink)": "リトルバスターズ！ little busters! (粉色)",
            "Neon (black)": "熒光 (黑色)",
            "Primitive Link (pale chestnut)": "プリミティブ リンク primitive link (淡栗子)",
            "Saya no Uta (dark scarlet)": "沙耶の唄 沙耶之歌 (深紅)",
            "Seinarukana (white)": "聖なるかな -The Spirit of Eternity Sword 2- (白色)",
            "Sora no Iro, Mizu no Iro (turquoise)": "そらのいろ、みずのいろ 空之色，水之色 (綠松石)",
            "Teal (teal)": "青色 (青色)",
            "Touhou (grey)": "東方 (灰色)",
            "Tsukihime (black)": "月姫 (黑色)",
            "Tsukihime (midnight blue)": "月姫 (午夜藍)",
            "Custom CSS": "自定義CSS",
            "Public profile": "公開資料",
            "You can add": "您可以新增",
            "character traits": "性格特徵",
            "to your account. These will be displayed on your public profile.": "到您的帳戶。這些資料會公開顯示。",
            "No results": "無結果",
            "Add trait...": "新增特徵...",
            "Submit": "提交",
            /*在選擇後出現的新文字:*/
            "Only if original title": "僅當是原始標題時",
            "Only if official title": "僅當是官方標題時",
            "Include non-official titles": "也包括非官方標題",
            "New username": "新使用者名稱",
            "You may only change your username once a day. Your old username(s) will be displayed on your profile for a month after the change.": "您每天只能更改一次使用者名稱。更改使用者名稱後,舊使用者名稱會在個人資料中顯示一個月。",
            "Old password": "舊密碼",
            "New password": "新密碼",
            "Repeat": "重複新密碼",

            /** 列表頁 /ID/ulist?vnlist=1 */
            "My list": "我的列表",
            "ALL": "顯示全部",
            "Voted": "已評分",
            "No label": "無標籤",
            "Multi-select": "多選",
            "Update filters": "更新過濾器",
            /*標籤管理*/
            "Manage labels": "標籤管理",
            "How to use labels": "如何使用標籤",
            "You can assign multiple labels to a visual novel": "您可以為視覺小說分配多個標籤",
            "You can create custom labels or just use the built-in labels": "您可以建立自定義標籤或僅使用內建標籤",
            "Private labels will not be visible to other users": "其他使用者看不見私有標籤",
            "Your vote and notes will be public when at least one non-private label has been assigned to the visual novel": "當視覺小說分配了至少一個非私有標籤時，您的評分和筆記將是公開狀態",
            "VNs": "VN數量",
            "Label": "標籤",
            "Private": "私有性",
            "New label": "新建標籤 ",
            "Save changes": "儲存更改",
            "private": "私有",
            "built-in": "內建的",
            "applied when you vote": "當你評分時更新",
            /*儲存為預設值*/
            "Save as default": "儲存為預設值",
            "This will change the default label selection, visible columns and table sorting options for the selected page to the currently applied settings.": "這將把所選頁面的預設標籤選擇、可見列和排序方式更改為當前的設定。",
            "The saved view will also apply to users visiting your lists.": "儲存的檢視也會應用於訪問您列表的使用者。",
            "(If you just changed the label filters, make sure to hit \"Update filters\" before saving)": "(如果您剛剛更改了標籤過濾器，請在儲存預設設定之前點選\"更新過濾器\")",
            "Save": "儲存",
            /*匯出*/
            "Export": "匯出",
            "Export your list": "匯出您的列表",
            "This function will export all visual novels and releases in your list, even those marked as private (there is currently no import function, more export options may be added later).": "此功能將匯出您列表中的所有視覺小說和發行版本，包括標籤為私有的(目前沒有匯入功能，以後可能會新增更多匯出選項)",
            "Download XML export.": "下載XML匯出.",
            /*顯示選項*/
            "display options": "顯示選項",
            "Order by": "排序方式",
            "Results": "顯示數量",
            "Update": "更新",
            "Visible": "可見",
            "columns": "列",
            /*排序標記*/
            "Title": "標題",
            "Vote date": "評分時間",
            "Vote": "評分",
            "Rating": "評價",
            "Labels": "標籤",
            "Added": "新增時間",
            "Modified": "修改時間",
            "Start date": "開始日期",
            "Finish date": "完成日期",
            "Release date": "釋出日期",



            /*Opt*/
            "Opt": "選擇",
            'Notes': '筆記',
            'Remove VN': '刪除 VN',
            '-- add release --': '--新增版本--',
            'Add release': '新增版本',
            /*版本,狀態*/
            "Obtained": "已得到",
            "Unknown": "未知",
            "Pending": "待定",
            "On loan": "外借",
            "Deleted": "已刪除",
            /*翻頁按鈕*/
            "next ›": "下一頁 ›",
            "last »": "尾頁 »",
            "« first":"« 首頁",
            "‹ previous":"‹ 上一頁",
            /*其他動態資訊*/
            "Loading releases...":"正在載入版本...",
            "Keep label": "保留標籤",
            "Delete label but keep VNs in my list": "刪除標籤,但保留VN在我的列表中",
            "Delete label and VNs with only this label": "刪除標籤,也刪除只有這個標籤的所有VN",
            "Delete label and all VNs with this label": "刪除標籤,也刪除帶有這個標籤的所有VN",
            "WARNING: ":"警告: ",
            "Your vote is still public if you assign a non-private label to the visual novel.":"如果你給視覺小說指定了非私有標籤，你的評分仍然是公開的。",
            /** 評論*/
            "You have not submitted any reviews yet.": "您還沒有提交任何評論。",
            /** 帖子*/
            "My posts": "我的帖子",
            "You have not posted anything on the forums yet.": "您還沒有在論壇上釋出任何內容。",
            /** 歷史*/
            "Docs": "文件",
            "All": "全部",
            "Only changes to existing items": "僅更改的專案",
            "Only newly created items": "僅新建立的專案",
            "Only public items": "僅限公共專案",
            "Only deleted": "僅刪除",
            "Only unapproved": "僅未批准",
            "Rev.": "修訂版.",
            "Date": "日期",
            "User": "使用者",
            "Page": "頁面",
            /** 我的通知 /notifies*/
            "My notifications": "我的通知",
            "Unread notifications": "未讀通知",
            "All notifications": "所有通知",
            "No notifications!": "沒有通知!",
            "Settings": "設定",
            "Notify me about edits of database entries I contributed to.": "通知關於我參與的資料庫條目的編輯。",
            "Notify me about replies to threads I posted in.": "通知關於我釋出的主題的回覆。",
            "Notify me about comments to my reviews.": "通知關於我的評論的評論。",
            "Notify me about site announcements.": "通知有關站點公告的資訊。",
        },
        titleMap:{
            "This item is public": "此項是公開的",
        },
        specialMap: {
            /** 個人資料頁   /ID */
            "^(.+)'s profile$": "$1 的個人資料",
            "^(\\d+)h$": "$1小時",
            "^(\\d+)m$": "$1分鐘",
            "^from (\\d+) submitted play times.$": ",來自$1個遊戲.",
            "^(\\d+) release[s]? of (\\d+) visual novels.$": "$1個版本,$2部視覺小說.",
            "^(\\d+) review[s]?.":"$1個評論.",
            "^(\\d+) vote[s]? on (\\d+) distinct tag[s]? and (\\d+) visual novel[s]?.":"在$2個不同標籤和$3部視覺小說上投了$1票。",
            "^(\\d+) images flagged.$": "標記了$1個圖片.",
            "^(\\d+) post[s]?, (\\d+) new thread[s]?.": "$1個帖子, $2個新主題.",
            /*評分統計*/
            "^(\\d+) votes, ([\\d.]+) average.$": "$1個評分, 平均$2分.",
            "^(\\d+) votes total, average ([\\d.]+)$": "$1個評分, 平均$2分",
            /*他人主頁*/
            "^(\\d+)h from (\\d+) submitted play times.$": "$1小時,來自$1個遊戲.",
            /** 列表頁 /ID/ulist?vnlist=1 */
            /*排序頭*/
            "^([a-zA-Z ]+) ▴$":"%%$1%% ▴",
            /** 評論*/
            "^Reviews by (.+)$": "$1的評論",
            /** 歷史*/
            "^Edit history of (.+)$": "$1的編輯歷史",
        },
    },
    {
        name: '登入|註冊|重置密碼',
        regular: /\/u\/(login|newpass|register)/i,
        map: {
            /*登陸頁*/
            "Username": "使用者名稱",
            "No account yet?": "還沒有賬號?",
            "Password": "密碼",
            "Forgot your password?": "忘記密碼?",
            "Submit": "提交",
            /*重置密碼*/
            "E-Mail": "電子郵箱",
            "Forgot Password": "忘記密碼",
            "Forgot your password and can't login to VNDB anymore?": "忘記密碼，登入不了VNDB？",
            "Don't worry! Just give us the email address you used to register on VNDB": "別擔心！只需提供您在VNDB上註冊時的電子郵箱地址",
            "and we'll send you instructions to set a new password within a few minutes!": "我們將在幾分鐘內向您傳送設定新密碼的說明！",
            /*註冊賬號*/
            "Create an account": "建立賬號",
            "Preferred username. Must be between 2 and 15 characters long and consist entirely of alphanumeric characters or a dash.": "首選使用者名稱。長度必須在2到15個字元之間，由字母數字或-組成。",
            "Names that look like database identifiers (i.e. a single letter followed by several numbers) are also disallowed.": "看起來像資料庫識別符號的名稱（即一個字母后跟幾個數字）也不允許使用。",
            "A valid address is required in order to activate and use your account.": "需要有效地址才能啟用和使用您的帳戶。",
            "Other than that, your address is only used in case you lose your password,": "除此之外，您的地址僅在您丟失密碼的情況下使用，",
            "we will never send spam or newsletters unless you explicitly ask us for it or we get hacked.": "我們永遠不會發送垃圾資訊或時事通訊，除非您明確要求我們這樣做，要不就是我們被駭客攻擊了。",
            "Anti-bot question: How many visual novels do we have in the database? (Hint: look to your left)": "反機器人問題：資料庫中有多少視覺小說？（提示：向左看）",
            "Answer": "回答",
        },
        titleMap:{
        },
        specialMap: {

        },
    },
    {
        name:'首頁右側主機板',
        regular:/^\/$/i,
        map:{
            "The Visual Novel Database": "視覺小說資料庫",
            "VNDB.org strives to be a comprehensive database for information about visual novels.": "VNDB.org致力於成為一個全面的視覺小說資訊資料庫。",
            "This website is built as a wiki, meaning that anyone can freely add\n                  and contribute information to the database, allowing us to create the\n                  largest, most accurate and most up-to-date visual novel database on the web.": "這個網站是作為一個維基建立的，這意味著任何人都可以自由地向資料庫新增和貢獻資訊，這讓我們能夠建立網路上最大、最準確和最新的視覺小說資料庫。",
            "Recent Changes": "最近更改",
            "Announcements": "公告",
            "VNDB": "VNDB",
            "DB Discussions": "資料庫討論",
            "Forums": "論壇",
            "VN Discussions": "VN討論",
            "Latest Reviews": "最新評論",
            "Upcoming Releases": "即將釋出的版本",
            "Just Released": "剛剛釋出的版本",
        },
        titleMap:{
        },
        specialMap:{

        },
    },
    {
        name:'討論板|討論區',
        regular:/^\/t\/.+/i,
        map:{
            /** 自己的討論*/
            "Index": "主頁",
            "All boards": "全部板塊",
            "VNDB discussions": "VNDB 討論",
            "General discussions": "一般討論",
            "Start a new thread": "建立一個新帖子",
            "An empty board": "空的板塊",
            "Nobody's started a discussion on this board yet. Why not": "還沒有人在這塊板上開始討論。為什麼不",
            "create a new thread": "建立一個新帖子",
            "yourself?": ",由你自己?",
            /** 全部討論*/
            "Search!": "搜尋!",
            "Topic": "主題",
            "Replies": "回覆",
            "Starter": "發表人",
            "Last post": "最近回覆",
            "Discussion board index":"討論區主頁",
            /* 主題標題標籤*/
            "[poll]":"[投票]",
            /** 建立一個新帖子*/
            "Create new thread": "建立新帖子",
            "Thread title": "帖子標題",
            "Boards": "板塊",
            "You can link this thread to multiple boards. Every visual novel, producer and user in the database has its own board,": "你可以將這個帖子連結到多個版塊。資料庫中的每個視覺小說、製片人和使用者都有自己的版塊，",
            "but you can also use the \"General Discussions\" and \"VNDB Discussions\" boards for threads that do not fit at a particular database entry.": "但您也可以使用\"一般討論\"或\"VNDB討論\"板來處理不適合特定資料庫條目的帖子。",
            "Add boards...": "新增板塊...",
            "Message": "資訊",
            "(English please!)": "(請用英語!)",
            "Formatting": "可用的格式程式碼",
            "Edit": "編輯",
            "Preview": "預覽",
            "Add poll": "新增投票",
            /*一些表單提示資訊*/
            "Please add at least one board.": "請新增至少一個板塊。",
            "The form contains errors, please fix these before submitting.": "表單包含錯誤，請在提交前修復這些錯誤。",
            "List contains duplicates.":"列表包含重複項",
            /*投票*/
            "Poll question": "投票問題",
            "Options": "選項",
            "Add option": "新增選項",
            "Number of options people are allowed to choose.": "允許使用者選擇的選項數量。",
            /* 檢視其他人的帖子*/
            "Posted in": "發表於",
            "report": "舉報",
            "Quick reply": "快速回復",
        },
        titleMap:{

        },
        specialMap:{
            /** 自己的討論*/
            "^Related discussions for (.+)$": "$1的相關討論",
            /** 建立一個新帖子*/
            /*投票*/
            "^Option #(\\d+)$": "選項 #$1",

        },
    },
    {
        name:'我的標籤|標籤',
        regular:/^\/g\/links/i,
        map:{
            /*我的標籤*/
            "Tag link browser": "標籤連結瀏覽器",
            "Active filters:": "活動過濾器:",
            "] User:": "] 使用者:",
            "No tag votes matching the requested filters.": "沒有與要求的過濾器匹配的標籤評分。",
            /*表頭*/
            "Click the arrow before a user, tag or VN to add it as a filter.": "單擊使用者、標籤或視覺小說之前的箭頭，可以將其新增為篩選器。",
            "Tag": "標籤",
            "Spoiler": "劇透",
            "Visual novel": "視覺小說",
            "Note": "筆記",
            /*劇透級別*/
            "minor spoiler": "輕微劇透",
            "no spoiler": "沒有劇透",
            "major spoiler": "嚴重劇透",
        },
        titleMap:{},
        specialMap:{},
    },
    {
        name:'舉報頁面',
        regular:/^\/report/i,
        map:{
            "Submit report": "提交舉報",
            "Subject": "主題",
            "Comment": "評論",
            "Your report will be forwarded to a moderator.": "您的舉報將轉發給版主。",
            "Keep in mind that not every report will be acted upon, we may decide that the problem you reported is still within acceptable limits.": "請記住，並非每個舉報都會被處理，我們可能會認為您舉報的問題仍在可接受的範圍內。",
            "We generally do not provide feedback on reports, but a moderator may decide to contact you for clarification.": "我們通常不會對舉報提供反饋，但版主可能會決定與您聯絡以進行解釋。",
            "Reason": "理由",
            "-- Select --": "-- 選擇 --",
            "Spam": "垃圾郵件",
            "Links to piracy or illegal content": "盜版或非法內容連結",
            "Off-topic": "與主題無關",
            "Unwelcome behavior": "不受歡迎的行為",
            "Unmarked spoilers": "沒有標記劇透",
            "Other": "其他",
        },
        titleMap:{},
        specialMap:{},
    },
    {
        name:'特徵頁|標籤頁|作品詳情頁|使用者主頁|人物頁|人物搜尋頁|作品搜尋頁',
        regular:/^\/(i|g|v\d+|u\d+$|c\d+|c|v)/i,
        map:{
            /*大類*/
            "Hair":"毛髮",
            "Eyes":"眼睛",
            "Body":"身體",
            "Clothes":"服裝",
            "Items":"物品",
            "Personality":"性格",
            "Role":"角色",
            "Engages in (Sexual)":"主動(性)",
            "Subject of (Sexual)":"被動(性)",
            "Engages in":"主動",
            "Subject of":"被動",


            /*TagTree*/
            "Theme":"主題",
            "Style":"開發特點",
            "Character":"角色",
            "Hero":"男主角",
            "Heroine":"女主角",
            "Major Antagonist":"主要對手",
            "Plot":"劇情",
            "Ending":"結局",
            "Routes":"路線",
            "Type":"型別",
            "Setting":"設定",
            "Scene":"場景",
            "Time Period":"時間段",
            "Universe":"宇宙",

            //<editor-fold desc="IDEA摺疊4.3.2">
            /*細分*/
            "Sexual Content":"色情內容",
            // "ADV":"ADV",
            "Hakama":"袴",
            "Landlord":"地主",
            "Mole":"痣",
            "Albino Heroine":"白化症女主角",
            "Male Protagonist":"男性主角",
            "Penetrative Sex":"插入式做愛",
            "No Sexual Content":"無色情內容",
            "Student":"學生",
            "Multiple Endings":"多分支結局",
            "High Sexual Content":"大量色情內容",
            "Fantasy":"奇幻",
            "Romance":"戀愛",
            "Female Protagonist":"女性主角",
            "Drama":"戲劇",
            "Nukige":"拔作",
            "Non-penetrative Sex":"非插入式做愛",
            "Protagonist with a Face":"主角露過正臉",
            "Blowjob":"陰莖口交",
            "Group Sex":"群交",
            "Student Heroine":"學生女主",
            "Darker Sexual Contents":"黑暗的色情內容",
            "Sexual Harassment":"性騷擾",
            "Defloration":"破處",
            "Rape":"強姦",
            "School":"學校",
            "Other Gameplay Elements":"其他遊戲性元素",
            "High School Student":"高中生",
            "Fictional Beings":"虛構物種",
            "Doggy Style":"狗交式體位",
            // "BDSM":"BDSM",
            "Earth":"地球",
            "Cowgirl":"女上位體位",
            "Big Breast Sizes Heroine":"大胸女主角",
            "Sexual Devices":"性玩具",
            "High School Student Heroine":"高中生女主角",
            "Customization":"捏人或捏物",
            "Comedy":"喜劇",
            "Bad Ending(s)":"壞結局",
            "Modern Day":"現代",
            "Anal Penetration":"肛門插入",
            "Student Protagonist":"學生主角",
            "Group Sex of One Male and Several Females":"一男多女群交",
            "Linear Plot":"無分支/選項無影響",
            "Nameable Character(s)":"角色可命名",
            "Nameable Protagonist":"主角可命名",
            "Incest":"亂倫",
            "Boobjob":"乳交",
            "Missionary Position":"男上位體位",
            "Otome Game":"乙女類遊戲",
            "Health Issues":"角色身體健康問題",
            "Cunnilingus":"舔穴",
            "Mystery":"懸疑",
            "Single Blowjob":"單人陰莖口交",
            "Non-human Heroine":"非人類女主角",
            "Single Ending":"單結局",
            "Outdoor Sex":"室外做愛",
            "Changing Perspective":"視角切換",
            "Modern Day Earth":"現代地球",
            "Psychological Problems":"心理健康問題",
            "Handjob":"陰莖手交",
            "Organizations":"組織",
            "Bondage":"捆綁",
            "Heroine with Big Breasts":"大胸女主角",
            "Masturbation":"自慰",
            "Sex in Public Places":"公共場所做愛",
            "Group Sex of One Female and Several Males":"一女多男群交",
            "Fingering":"指交",
            "Crime":"犯罪情節",
            "Science Fiction":"科幻",
            "Voice Acting":"配音",
            "Lesbian Sex":"女性之間做愛",
            "Standing Sex":"站立式體位",
            "Naked Sprites":"裸體立繪",
            "Sitting Sex":"坐姿做愛",
            "Only a Single Heroine":"單女主",
            "Adult Heroine":"成人女主角",
            "Loli Heroine":"蘿莉女主角",
            "Sixty-nine":"69式體位",
            "Branching Plot":"分支劇情",
            "Monsters":"怪物",
            "Relationship Problems":"感情危機",
            "Adult Protagonist":"成人主角",
            "Kinetic Novel":"視覺小說(無選項)",
            "Multiple Penetration":"多重插入",
            "Vibrators":"振動棒",
            "Event CGs":"事件CG",
            "Pregnancy":"懷孕",
            "Protagonist's Sister as a Heroine":"主角的姐姐或妹妹為女主角",
            "Anal Sex":"肛交",
            "Heroine with Glasses":"眼鏡娘女主角",
            "Quickie Fix Position":"站立後入",
            "Fighting Heroine":"有武力的女主角",
            "Mythical Setting":"取材自神話傳說",
            "Only Virgin Heroines":"全處女主角",
            "Harem Ending":"後宮結局",
            "Brother/Sister Incest":"兄弟姐妹間做愛",
            "Protagonist's Childhood Friend as a Heroine":"幼馴染女主角",
            "Other Perspectives":"其他人視角",
            "Blood-related Incest":"血緣亂倫",
            "Modern Day Japan":"現代日本",
            "Sex with Protagonist Only":"僅主角有性愛場景",
            "Side Portraits":"文字框旁副立繪",
            "Divine Beings":"神性眾生",
            "Bukkake":"精液沐浴",
            "Violence":"暴力",
            "Twin Tail Heroine":"雙馬尾女主角",
            "Pregnant Sex":"孕交",
            "Immortal Heroine":"永生的女主角",
            "Jealousy":"嫉妒",
            "High School":"高中",
            "Tsundere Heroine":"傲嬌女主角",
            "Protagonist with a Sprite":"主角有立繪",
            "High School Student Protagonist":"高中生主角",
            "Action":"動作",
            "Sex With Monsters":"與怪物做愛",
            "Single Boobjob":"單人乳交",
            "Bathroom Sex":"浴室做愛",
            "Urination Fetish":"排尿性愛",
            "Early Sexual Content":"遊戲前期出現性內容",
            "Footjob":"足交",
            "Heroine with Sexual Experience":"有過性經驗的女主角",
            "Protagonist's Younger Sister as a Heroine":"妹妹女主角",
            "Life and Death Drama":"生死劇",
            "Lactation During Sex":"做愛時泌乳",
            "Past":"過去",
            "Unlockable Routes":"可解鎖路線",
            "Boy x Boy Romance":"男性和男性的戀愛",
            "Sex with Tentacles":"與觸手做愛",
            "Monster Rape":"怪物強姦",
            "Sex with Others":"有角色和非主角的人做愛",
            "Protagonist with Voice Acting":"有配音的主角",
            "Fighting Protagonist":"主角有武力",
            "Under the Same Roof":"同居",
            "Fan-fiction":"同人小說",
            "Sounds of Copulation":"做愛的音效",
            "Male on Male Sex":"男性對男性的性行為",
            "Dark Skinned Characters":"黑皮角色",
            "Christian Mythology":"基督教神話",
            "Gender Bending":"異裝/跨性別",
            "Female Ejaculation":"潮吹",
            "Ahegao":"啊嘿顏",
            "Twin Blowjob":"兩人共同口交",
            "Lolicon":"蘿莉控",
            "Single Handjob":"單人手交",
            "Tentacle Rape":"觸手強姦",
            "Vaginal Fingering":"陰道指交",
            "Map Movement":"地圖移動",
            "Reverse Cowgirl":"反轉女上位體位",
            "Impregnation":"受精懷孕",
            "Protagonist's Blood-related Sister as a Heroine":"實姐實妹作為女主角",
            "Intercrural Sex":"腿間性行為",
            "Game Jam":"遊戲競賽中開發",
            "More Than Seven Endings":"多於七個結局",
            "Simulation Game":"SLG",
            "Multiple Protagonists":"可選擇多主角",
            "Photographic Assets":"靜態資源",
            "Leader Heroine":"領導者女主角",
            "Blood-related Brother/Sister Incest":"血親兄弟姐妹亂倫",
            "3D Graphics":"3D圖形",
            "Slice of Life":"日常片段",
            "NVL":"文字佔據大部分畫面",
            "Horror":"恐怖",
            "Teacher Heroine":"教師女主角",
            "Combat":"戰鬥",
            "Heroine with Health Issues":"有健康問題的女主角",
            "Photographic Backgrounds":"照片背景",
            "Married Heroine":"已婚女主角",
            "Sex Industry":"性產業",
            "Demons":"惡魔",
            "Anal Toys":"肛門玩具",
            "Sexual Slavery":"性奴",
            "Undead":"不死生物",
            "Single Footjob":"單人足交",
            "Few Choices":"選項少",
            "Gang Bang":"輪姦",
            "Heroine with Zettai Ryouiki":"有絕對領域的女主角",
            "Kemonomimi":"獸耳",
            "Protagonist's Full Sister as a Heroine":"同父同母的妹妹女主角",
            "Adult Hero":"成年英雄",
            "Girl x Girl Romance":"女女戀愛",
            "Unavoidable Rape":"不可避的強姦劇情",
            "Magic":"魔法",
            "Non-human Protagonist":"非人類主角",
            /*意譯*/
            "Perverted Heroine":"沉迷於性的女主角",
            "Fictional World":"架空世界",
            "Colored Name-tags":"姓名彩色標識",
            "Sex in Water":"水中做愛",
            "Netorare":"NTR",
            "One True End":"唯一真結局",
            "Ponytail Heroine":"馬尾女主角",
            "Threesome":"3p做愛",
            "Pre-rendered 3D Graphics":"非實時渲染3D",
            "Vaginal + Anal Penetration":"雙重插入",
            "Vaginal Masturbation":"陰道/陰蒂自慰",
            "Domicile":"住所裡",
            "Ojousama Heroine":"大小姐女主角",
            "Divine Heroine":"神話生物女主角",
            "Protagonist with Health Issues":"有健康問題的主角",
            "Bad Endings with Story":"BadEnd有劇情",
            "University Student":"大學生",
            "Non-blood-related Incest":"非血緣亂倫",
            "Dildos":"假陰莖",
            "Female Domination":"女性主導",
            "Game Saving Method":"存檔方法",
            "Incest Romance":"亂倫戀情",
            "Boy x Boy Romance Only":"僅男性與男性的戀情",
            "Background Moans":"背景呻吟音效",
            "Pissing":"排尿",
            "Past Earth":"過去地球",
            "Straight Lolicon":"蘿莉性愛和主題(正常性取向)",
            "Gang Rape":"輪姦",
            "Group Sex of Multiple Females and Males":"男女多人群交",
            "Superpowers":"超能力",
            "Anilingus":"肛門口交",
            "Non-human Hero":"非人類男主角",
            "Artist Heroine":"藝術家女主角",
            "Erotic Spanking":"情趣打屁股",
            "Protagonist in Relationship":"故事早期主角已有親密關係",
            "Homicide":"兇殺",
            "Villainous Protagonist":"反派主角",
            "Kissing Scene":"親吻場景",
            "Lots of Choices":"大量選項",
            "Threesome Ending":"三人行結局",
            "Double Penetration (Group Sex)":"雙重插入(群交)",
            "Small Breast Sizes Heroine (Non-Loli)":"貧乳女主角(非蘿莉)",
            "Object Insertion":"物體插入",
            "Spoons":"背面側入體位",
            "Student Club":"學生社團",
            "No Character Sprites":"無角色立繪",
            "Protagonist's Non-blood-related Sister as a Heroine":"主角有非血緣姐姐妹妹",
            "Anal Fingering":"肛門指交",
            "Heroine with Psychological Problems":"女主角有心理健康問題",
            "Maid Heroine":"女僕女主角",
            "Friendship":"友情",
            "Date Display":"日期顯示",
            "Bloody Scenes":"流血場景",
            "Game Over":"Game Over結局",
            "High Amounts of Rape":"大量強姦內容",
            "Pornography":"色情作品拍攝或消費",
            "Infidelity":"出軌",
            "Sex in Front of an Audience":"觀眾面前做愛",
            "Kemonomimi Heroine":"獸耳女主角",
            "Heroine Sisters":"姐妹花女主角",
            "Cross-dressing":"異裝癖",
            "Sensory Deprivation":"感官剝奪",
            "Super Deformed CG's":"Q版畫風CG",
            "Flat Tints Only":"僅平塗",
            "Sexual Blindfold":"性愛矇眼",
            "Non-blood-related Brother/Sister Incest":"非血緣兄弟姐妹亂倫",
            "Internal Exhibition of Sex":"性器官內部展示",
            "Deepthroat":"深喉",
            "Amnesia":"失憶症",
            "Interactive Adventure Game":"互動式AVG",
            "Future":"未來",
            "Exhibitionism":"暴露癖",
            "Hotel":"旅館場景",
            "Blackmail":"敲詐勒索",
            "Dark Skinned Heroine":"黑皮女主角",
            "Cosplay":"Cosplay",
            "Death of Protagonist":"主角死亡(路線或結局)",
            "Discreet Sex":"公開場合隱奸",
            "Flashback":"回憶倒敘",
            "Brother/Sister Romance":"兄弟姐妹戀情",
            "Mind Control":"精神控制",
            "University Student Protagonist":"大學生主角",
            "No Opening Movie":"無OP",
            "Ejaculation Choice":"射精位置選擇",
            "Sexual Roleplay":"情趣角色扮演",
            "Piledriver":"打樁機體位",
            "Body of Water":"水域",
            "From Other Media":"來自其他媒體",
            "Personal Armed Combat":"個人武裝戰鬥",
            "Production of Pornography":"色情作品製作",
            "Heroine with Huge Breasts":"巨乳女主角",
            "Only Adult Heroines":"僅有成年女主角",
            "Music Recollection":"音樂欣賞",
            "Tomboy Heroine":"假小子女主角",
            "Butterfly":"蝴蝶",
            "Scenario Selection":"場景選項",
            "Healer Heroine":"治療者女主角",
            //"RPG":"RPG",
            "White Haired Heroine":"白毛女主角",
            "Animals":"動物",
            "Netori":"NTL",
            "Student Hero":"學生男主角",
            "Leader Protagonist":"領導者主角",
            "Heroine with Pubic Hair":"有陰毛的女主角",
            "Constructs":"人造生物",
            "Death of Heroine":"女主角死亡",
            "No Gallery":"沒有畫廊",
            "Only Good Endings":"只有GoodEnd",
            "Brief NVL Scenes":"簡短文字為主的場景",
            "Musician Heroine":"音樂家女主角",
            "Heroine with Swimsuits":"泳衣女主角",
            "Episodic Story":"單元事件故事",
            "Deredere Heroine":"嬌羞女主角",
            "Legwear Footjob":"穿著褲襪/襪子足交",
            "Detective Work":"偵探工作",
            "Foreigner Heroine":"外國女主角",
            "Royal Heroine":"貴族女主角",
            "Lots of Event CGs":"大量事件CG",
            "Heroine with Tights":"緊身褲女主角",
            "Demon Heroine":"惡魔女主角",
            "Brocon Heroine":"兄控女主角",
            "Production of Pornography (Amateur)":"非專業色情作品製作",
            "Non-Japanese Voice Acting":"非日語配音",
            "Action Game":"動作遊戲",
            "Hero with Glasses":"戴眼鏡男主角",
            "Protagonist's Kouhai as a Heroine":"學妹/後輩女主角",
            "Proactive Protagonist":"積極主動的主角",
            "Petplay":"寵物角色扮演",
            "Third-person Narrative":"第三人稱敘事",
            "Double Handjob":"雙人陰莖手交",
            "Summer":"夏天",
            "Enema":"灌腸",
            "Protagonist's Senpai as a Heroine":"學姐/前輩女主角",
            "Condoms":"安全套",
            "Facesitting":"坐臉性交",
            "Low Sexual Content":"少量性愛內容",
            "Heroine with Ahoge":"有呆毛的女主角",
            "Strategy Game":"策略遊戲",
            "Pregnancy Ending":"懷孕結局",
            "Graphic Violence":"明確的暴力影象",
            "Unlockable Side Stories":"可解鎖副線故事",
            "Excessive Semen":"過量精液",
            "Sex Involving Drugs":"藥物性交",
            "Scat":"糞便",
            "Naked Heroine with Apron":"裸體圍裙女主角",
            "Sex in a Classroom":"教室內做愛",
            "Hidden Vibrator":"隱藏震動器",
            "Corruption of Characters":"角色崩壞",
            "Girl x Girl Romance Only":"僅女性與女性的戀情",
            "Rape under Influence":"被外物影響下強姦",
            "Perverted Protagonist":"好色主角",
            "Miko Heroine":"巫女女主角",
            "Only Same-Sex Sexual Content":"僅同性性愛內容",
            "More Than Seven Heroines":"七位以上的女主角",
            "Protagonist's Older Sister as a Heroine":"主角的姐姐為女主角",
            "Immortal Protagonist":"永生的主角",
            "Only Adult Heroes":"僅成年男主角",
            "Time Travel":"時間旅行",
            "Deities":"神",
            "Shotacon":"正太",
            "Reverse Missionary":"反向傳教士體位",
            "Student Council":"學生會",
            "Obsession":"痴迷",
            "Superheroes":"超級英雄",
            "Nurse Heroine":"護士女主角",
            "Coodere Heroine":"冷嬌女主角",
            "Twin Boobjob":"雙女性乳交",
            "Past Setting in a Fictional World":"類似過去的虛構世界",
            "Prostitution":"賣淫",
            "Protagonist with Psychological Problems":"主角有心理健康問題",
            "Unavoidable Heroine Rape":"不可避女主被強姦",
            "Donkan Protagonist":"遲鈍系主角",
            "Ghost":"幽靈",
            "Teacher Protagonist":"老師女主角",
            "Metafiction":"元(Meta)小說",
            "Japanese Mythology":"日本神話",
            "Only a Single Hero":"單男主角",
            "Colored Texts":"彩色文字",
            "Mother/Son Incest":"母子亂倫",
            "Murder Mystery":"謀殺謎題",
            "Meaningless Choices":"無意義的選項",
            "Imouto-type Heroine":"妹妹式女主角(性格)",
            "Future Earth":"未來地球",
            "Family":"家庭",
            "Love Triangle":"三角戀",
            "Festival":"節日",
            "Adult Breast Feeding":"情趣成人哺乳",
            "Suicide":"自殺",
            "Fighting Hero":"有戰鬥力的男主角",
            "Fictional Modern Day Earth":"現代地球虛構地點",
            "Enforced Playing Order":"強制遊玩順序",
            "Bestiality":"獸交",
            "Princess Heroine":"公主女主角",
            "Early Branching Plot":"遊戲早期出現分支劇情",
            "Shy Heroine":"害羞的女主角",
            "Voyeurism":"窺淫癖",
            "Classic Tsundere Heroine":"古典傲嬌",
            "Rapist Protagonist":"強姦犯主角",
            "Protagonist with Sexual Experience":"有過性經驗的主角",
            "No Romance Plot":"無戀愛劇情",
            "Heroine with Small Breasts (Non-Loli)":"貧乳女主角(非蘿莉)",
            "Heroine Having Sex with Others":"女主角和非主角的人做愛",
            "Heroine Rape by Others":"女主角被主角之外的人強姦",
            "Netorare Type A":"NTR A型別(一開始背叛)",
            "Netorare Type B":"NTR B型別(反抗到享受)",
            "Netorare Type C":"NTR C型別(一直非自願)",
            "Artificial Intelligence":"人工智慧",
            "Clothing Damage":"衣服傷害/爆衣",
            "Vehicles":"交通工具",
            "Only Loli Heroines":"僅蘿莉女主角",
            "Singer Heroine":"歌手女主角",
            "Politics":"政治",
            "Revenge":"復仇",
            "Forbidden Love":"禁忌之愛",
            "Vampire":"吸血鬼",
            "Vampire Heroine":"吸血鬼女主角",
            "Vampire Hero":"吸血鬼男主角",
            "Vampire Protagonist":"吸血鬼主角",
            "Both Male and Female Love Interests":"男女皆可攻略",
            "High Amount of Bad Endings":"大量壞結局",
            "Body Writing":"身體文字",
            "Sister Support Character":"姐姐/妹妹配角",
            "Literary Adaptation":"文學改編",
            "Genius Heroine":"天才女主角",
            "Strap-on Dildos":"綁帶式假陰莖",
            "Protagonist with Glasses":"戴眼鏡的主角",
            "Protagonist's Mother as a Heroine":"主角的媽媽為女主角",
            "Promiscuity":"濫交",
            "Past Japan":"過去日本",
            "Unlockable Bonus Content":"可解鎖獎勵內容",
            "Confinement":"監禁",
            "Airhead Heroine":"笨蛋系女主角",
            "Modern Tsundere Heroine":"現代傲嬌女主角",
            "Mutual Masturbation":"相互手淫",
            "Dating Simulation":"約會模擬",
            "Combat with Bladed Weapons":"帶刃武器戰鬥",
            "Inflation":"腹部膨脹",
            "Pixel Art":"畫素風格",
            "Unoriginal Graphics":"非原創圖",
            "Undead Heroine":"不死生物女主角",
            "Breaking the Fourth Wall":"打破第四面牆",
            "Student Council Member Heroine":"學生會成員女主角",
            "Sex in a Vehicle":"交通工具內做愛",
            "Marriage Ending":"婚禮結局",
            "Sexual Corruption":"性墮落",
            "Microtransactions":"內購",
            "Late Sexual Content":"後期性愛內容",
            "Twin Sisters as Heroines":"雙胞胎女主角",
            "Oneesan-type Heroine":"大姐姐型女主角",
            "Rape with Blackmail":"勒索強姦",
            "Unlockable Choices":"可解鎖的選項",
            "Orphan Protagonist":"孤兒主角",
            "No Backlog":"沒有閱讀記錄",
            "Rope Bondage":"繩索捆綁",
            "Only Protagonist's Relatives as Heroine(s)":"所有女主角都是主角的親屬",
            "Varied Title Screens":"多種標題畫面",
            "Parody":"模仿",
            "Male on Male Sex Only":"僅男性與男性的性愛",
            "Cafe":"咖啡館",
            "Furry":"福瑞",
            "Heroine with Children":"有孩子的女主角",
            "Mother Support Character":"母親型配角",
            "Erotic Massage":"色情按摩",
            "Youkai":"日本妖怪",
            "Sword Wielding Heroine":"佩劍女主角",
            "NaNoRenO":"NaNoRenO比賽",
            "Shota Protagonist":"正太主角",
            "Protagonist's Childhood Friend as a Hero":"主角的竹馬男主角",
            "Hairjob":"發交",
            "Western-style Mansion":"西式公寓",
            "Central Heroine":"核心女主角",
            "School Life Comedy":"校園生活喜劇",
            "Idol Heroine":"偶像女主角",
            "Mindbreak":"頭腦風暴",
            "Energetic Heroine":"元氣滿滿型女主角",
            "French Kiss":"法式接吻",
            "Straight Shotacon":"正太性愛和主題(正常性取向)",
            "Torture":"酷刑",
            "Consensual Sex With Monsters":"與怪物合意做愛",
            "Floating Textbox":"浮動的文字框",
            "Waitress Heroine":"服務員女主角",
            "Soapy Massage":"身體海綿",
            "Gaping":"擴張",
            "Bokukko Heroine":"ボクっ娘",
            "Chikan":"痴漢",/*痴漢*/
            "Single-sex School":"單性別學校",
            "Few Event CGs":"少量事件CG",
            "Nekomimi Heroine":"獸耳女主角",
            "Ending List":"結局收集列表",
            "Rape by Others":"被主角之外的人強姦",
            "Multiple Route Mystery":"多線解密",
            "Elves":"精靈",
            "Student Council President Heroine":"學生會主席女主角",
            "Love Hotel":"愛情酒店",
            "Tribadism on Penis":"兩穴磨槍",
            "Heroine with Kimono":"和服女主角",
            "Bullying":"欺凌",
            "School Sports Club":"學校運動社團",
            "Protagonist's Cousin as a Heroine":"主角的表堂姐妹為女主角",
            "Island":"島",
            "Student Club Member Heroine":"學生社團成員女主角",
            "University Student Heroine":"大學生女主角",
            "Body Piercing":"身體穿孔",
            "Psychological Trauma":"心理創傷",
            "Huge Insertion":"巨大插入",
            "Erotic Mind Control":"精神控制做愛",
            "Otaku Heroine":"宅系女主角",
            "Sex on Toilet":"衛生間做愛",
            "Portrait Orientation":"縱向畫面比例",
            "Winter":"冬天",
            "Reverse Rape":"反向強姦",
            "Monster Heroine":"怪物女主角",
            "Piss Drinking":"飲尿",
            "Unlockable Harem Ending":"可解鎖後宮結局",
            "Avoidable Rape":"可避免的強姦",
            "Sex Under the Necessity":"因必要理由被迫做愛",
            "No Event CGs":"沒有事件CG",
            "Kidnapping":"綁架",
            "Lip Sync":"口型同步",
            "Heroine with Beauty Mark":"漂亮的痣的女主角",
            "Achievements":"成就係統",
            "Lesbian Heroine":"女同女主角",
            "Read Text Marking":"已讀文字標記",
            "Unlockable Gallery":"可解鎖畫廊",
            "Mahou Shoujo Heroine":"魔法少女女主角",
            "Nympho Heroine":"性癮女主角",
            "Magic/ESP Combat":"魔法/超能力戰鬥",
            "Feet Licking":"舔腳",
            "Wake-up Sex":"早安咬/交",
            "Food Play":"食物Play",
            "Suspension Bondage":"懸掛捆綁",
            "Suspense":"製造懸念",
            "War":"戰爭",
            "Police":"警察",
            "Medieval Fantasy":"中世紀奇幻",
            "Sexual Cosplay":"情趣Cosplay",
            "Angels":"天使",
            "Fast Mini-games":"反應小遊戲",
            "Blood-related Mother/Son Incest":"血親母子亂倫",
            "Leader Hero":"領導者男主角",
            "Short Sexual Scenes":"短性愛場景",
            "Only Non-Virgin Heroines":"僅非處女主角",
            "Slice of Life Comedy":"生活片段喜劇",
            "Wedding":"婚禮",
            "Alternate Dimensions":"平行宇宙",
            "Immortal Hero":"永生男主角",
            "Homosexual Protagonist":"同性戀主角",
            "Masturbation in front of an Audience":"觀眾面前自慰",
            "Hospital":"醫院",
            "Only Younger Heroines":"女主角都比主角年輕",
            "Physical Problems":"身體健康問題",
            "Birth":"生產",
            "AI Heroine":"AI女主角",
            "Long Sexual Scenes":"長性交場景",
            "Sexual Slavery (Choukyou Variation)":"性奴(調教)",
            "Betrayal":"背叛",
            "Group of Friends":"朋友團體",
            "Descriptions of Violence":"暴力文字描述",
            "Sword Combat":"用劍戰鬥",
            "Late Branching Plot":"遊戲後期出現分支劇情",
            "Non-twin Heroine Sisters":"非雙胞胎姐妹花女主角",
            "All-girls School":"女子學校",
            "Consensual Sex Involving Tentacles":"合意觸手性交",
            "Pure Love Story":"純愛故事",
            //</editor-fold>
            /**個人標籤(性徵)*/
            /*todo ----來源:https://vndb.org/v14924/chars#chars*/
            //<editor-fold desc="IDEA摺疊4.3.3">
            "Protagonist":"主角",
            "Kind": "善良",
            "Boyfriend": "男朋友",/*todo 未能理解含義*/
            "Son": "兒子",
            "Duel": "決鬥",
            "Investigation": "調查",
            "Planning": "策劃",
            "Description": "描述",
            "Main characters": "主要人物",
            "Measurements": "尺寸",
            "Birthday": "生日",
            "Brown": "棕色",
            "Ponytail": "馬尾辮",
            "Shoulder-length": "齊肩短髮",
            "Sidehair": "側發",
            "Amber": "琥珀色",
            "Pale": "白皙",
            "Slim": "苗條",
            "Teen": "青少年/女",
            "Beret": "貝雷帽",
            "Antisocial": "反社會",
            "Closet Pervert": "悶聲色狼",
            "Domestic Partner": "同居伴侶",
            "Whimsical": "気まぐれ",
            "High Heeled Sandals": "高跟涼鞋",
            "Lace Garter Belt Stockings": "蕾絲吊帶襪",
            "Student Council Vice President": "學生會副會長",
            "Apron": "圍裙",
            "Dress": "連衣裙",
            "School Uniform": "校服",
            "Mobile Phone": "手機",
            "Friendly": "友善",
            "Hardworker": "勤奮",
            "Outgoing": "外向",
            "Waitstaff": "服務員",
            "Voiced by": "聲優 ",/*新增間隔*/
            "Blunt Bangs": "平劉海",
            "Pink": "粉色",
            "Twin Tails": "雙馬尾",
            "Waist Length+": "齊腰長髮",
            "Blue": "藍色",
            "Big Breasts": "豐滿的胸部",
            "Hairpin": "髮夾",
            "Ribbon Hair Tie": "絲帶髮帶",
            "Ribbon Tie": "絲帶領帶",
            "Thigh-high Stockings": "長筒襪",
            "Carefree": "無憂無慮",
            "Pervert": "好色",
            "Strange": "奇怪",
            "Third Person": "以名自稱",
            "Friend": "朋友",
            "Kouhai": "後輩",
            "School \"Go Home Club\" Member": "學校\"回家部\"成員",
            "Tenth Grader": "十年級",
            "Flirting": "調情",
            "Black": "黑色",
            "Braided Crown": "皇冠辮子",
            "Straight": "直",
            "V Bangs": "V型劉海",
            "Knee-high Socks": "及膝襪",
            "Wings": "翅膀",
            "Refined": "文雅",
            "Strict": "嚴謹",
            "Classmate": "同班同學",
            "Eleventh Grader": "十一年級",
            "Student Council President": "學生會長",
            "Shopping": "購物",
            "Long": "長",
            "White": "白色",
            "Violet": "紫色",
            "Medium Breasts": "普通的胸部",
            "Boots": "靴子",
            "Capelet": "小披肩",
            "Cross Necklace": "十字型項鍊",
            "Habit": "修女長袍",
            "Hat": "帽子",
            "Necktie": "領帶",
            "Pantyhose": "連褲襪",
            "Unusual Hair Ornaments": "不同尋常的髮飾",
            "Boku": "以\"僕\"自稱",
            "Bookworm": "書呆子",
            "Otaku": "御宅族",/*お宅*/
            "Sweets Lover": "甜食愛好者",
            "Schoolmate": "同校同學",
            "Reading": "閱讀",
            "Teasing": "調戲",
            "Blond": "金髮",
            "Braided Headband": "辮子髮帶",
            "Ribbon Hair Accessory": "絲帶髮帶配件",
            "Relaxed": "輕鬆",
            "Popular": "受歡迎",
            "Senpai": "前輩",
            "Student Club Member": "學生社團成員",
            "Twelfth Grader": "十二年級",
            "Cooking": "烹飪",
            "Side characters": "次要人物",
            "Aliases": "別名",
            "Chuunibyou": "中二病",
            "Odango": "雙髮髻",
            "Short": "矮小/短",
            "Kid": "兒童",/*<12*/
            "Mysterious": "神秘",
            "Naive": "天真",
            "Green": "綠色",
            "Adult": "中年",/*40-65*/
            "Skirt Suit": "西裝裙",
            "Mother": "母親",
            "Teacher": "老師",
            "Ahoge": "呆毛(アホげ)",/*アホげ*/
            "Spiky Bun": "尖頂髮髻",
            "Hair Tie": "髮帶",
            "Makes an appearance": "露面",
            "Fang": "尖牙",
            "Body Ribbon": "身體絲帶",
            "Cuffs": "袖口",
            "Knee-high Boots": "及膝靴",
            "Miniskirt": "迷你裙",
            "Shawl": "披肩",
            "Mascot Character": "吉祥物",
            /*次要劇透*/
            "Show minor spoilers": "顯示輕微劇透",
            "Spoil me!": "顯示所有劇透",
            "Show sexual traits": "顯示性特徵",
            "Disappointment": "失望",
            "Secretive": "隱秘",
            "Graduation": "畢業",
            "<hidden by spoiler settings>": "<被劇透設定隱藏>",
            /*主要劇透*/
            "Attempted Homicide": "差點被殺",/*謀殺未遂*/
            "Injury": "受傷",
            "Part-time Worker": "兼職工",
            "Child Abuse": "虐待兒童",
            "Detective": "偵探",
            "Girlfriend": "女朋友",/*todo 未能理解含義*/
            "Childhood Friend": "青梅竹馬",
            "Pretending": "偽裝",
            "Researcher": "科研人員",
            "Disability": "殘疾",
            "Human Subject Research": "人體實驗",
            "Non-blood-related Sister": "沒有血緣關係的姐妹",
            "Avoidable Murder": "可避免的謀殺",
            /*性徵*/
            "Virgin Sex":"破處",
            "Missionary":"傳教士體位",
            "Sexual Masochism":"性受虐狂",
            "Anal Plug Tail":"肛門塞尾巴",
            "Seventh Posture":"七式",
            "Quickie Fix":"狗交變體",
            //</editor-fold>
            /*todo ----精翻,來源:https://vndb.org/v12849/chars#chars*/
            //<editor-fold desc="IDEA摺疊4.3.4">
            "Spiky Bangs": "尖劉海",
            "Tsurime": "吊眼",
            "Blazer": "運動夾克",
            "Shirt": "襯衫",
            "Sports Uniform": "運動服",
            "Trousers": "褲子",
            "T-shirt": "T恤",
            "Blunt": "直率",
            "Competitive": "爭強好勝",
            "Donkan": "遲鈍(鈍感)",/*鈍感*/
            "Genius": "天才",
            "Honest": "真誠",
            "Low Self-esteem": "自卑",
            "Ore": "以\"俺\"自稱",
            "Pragmatic": "務實",
            "Proactive": "積極主動",
            "Reserved": "含蓄",
            "Smart": "聰明",
            "Rival": "競爭對手",
            "Tsukkomi": "吐槽(突っ込み)",/*突っ込み*/
            "Competition": "競賽",
            "Flying": "飛行",
            "Sports": "體育",

            "Tareme": "垂眼",
            "Ankle Socks": "及踝襪",
            "Bikini": "比基尼",
            "Bracelet": "手鐲",
            "Cardigan": "開衫毛衣",
            "Catsuit": "緊身衣",
            "Detached Sleeves": "分離袖",
            "Garter Belt Stockings": "吊帶襪",
            "Glasses": "眼鏡",
            "Gloves": "手套",
            "Hoodie": "連帽衫",
            "Jumpsuit": "連身衣",
            "Kemonomimi Hat": "獸耳帽",/*獣耳*/
            "Kemonomimi Headband": "獸耳頭帶",
            "Loafers": "樂福鞋",
            "Maid's Dress": "女僕裝",
            "Maid's Headdress": "女僕頭飾",
            "Mini-dress": "迷你連衣裙",
            "Platform Shoes": "厚底鞋",
            "Sailor School Uniform": "水手校服(セーラー服)",/*セーラー服*/
            "School Swimsuit": "學校泳衣(スク水)",/*スク水*/
            /*todo 已解決 波蕾若/https://zh.moegirl.org.cn/波列羅夾克衫*/
            "Shrug": "短套領衫",
            "Sports Shoes": "運動鞋",
            "Yukata": "浴衣(ゆかた)",/*浴衣*/
            "Diary": "日記",
            "Pen": "筆",
            "School Backpack": "書包",
            "Stuffed Toy": "毛絨玩具",
            "Water Gun": "水槍",
            "Cat Person": "愛貓",
            "Clumsy": "笨拙",/*ドジっ子*/
            "Energetic": "精力充沛(元気)",/*元気*/
            "Flustered": "慌亂",
            "Possessive": "佔有慾",
            "Rude": "粗魯",
            "Short-tempered": "易怒",
            "Shy": "害羞",
            "Watashi": "以\"私\"自稱",
            "Daughter": "女兒",
            "Gamer": "遊戲玩家",
            /*https://zh.moegirl.org.cn/看板娘*/
            "Kanban Musume": "看板娘",
            "School Extraordinary Club Member": "學校不常見社團成員",
            // "Cosplay": "角色扮演",
            "Swimming": "游泳",


            "Intake": "進氣口髮型",/*インテーク*/
            "Clothing with Ribbons": "有絲帶的衣服",
            "Gym Shorts": "運動短褲",
            "Tank Top": "無袖襯衫",
            "Transparent": "透明",
            "Food Lover": "美食愛好者",
            "Serious": "嚴肅",/*まじめ*/
            "Sharp-tongued": "言辭犀利",/*伶牙俐齒*/
            "Timid": "膽小",
            "Honor Student": "優等生",
            "Neighbor": "鄰居",
            "Poor": "窮人",
            "Computering": "電腦",
            "Moving": "搬家",

            "Antenna": "多個呆毛",
            "Side Tail": "側單馬尾",
            "Halterneck Dress": "掛頸連衣裙",
            "Pajamas": "睡衣",
            "Pendant Necklace": "吊墜項鍊",
            "Sandals": "涼鞋",
            "Short Shorts": "超短褲",/*熱褲*/
            "String Ribbon Tie": "細繩絲帶領帶",
            "Sundress": "太陽裙",
            "Airhead": "笨蛋",/*傻瓜*/
            "Altruistic": "無私",/*利他主義*/
            "Curious": "好奇",/*求知慾強*/
            "Deredere": "一見鍾情(デレデレ)",/*todo 已解決 陷入愛情不能自拔,對喜歡的人撒嬌,自始至終不掩飾自己的喜愛的狀態。*/
            "Desu": "使用\"です結尾\"",
            "Emotional": "情緒化",
            "Optimist": "樂觀",
            "Talkative": "愛說話",
            "Pet Owner": "寵物的主人",
            "Transfer Student": "轉學生",
            "Athletics": "田徑",

            "Parted to Side": "偏分",
            "Big Breast Sizes": "大的胸部尺寸",
            "Baseball Cap": "棒球帽",
            "Belt": "腰帶",
            "Jeans": "牛仔褲",
            "Atashi": "以\"あたし\"自稱",
            "Funny": "幽默",
            "Lazy": "懶惰",
            "Mischievous": "頑皮",
            "Moody": "喜怒無常",/*情緒多變*/
            "Observant": "善於觀察",
            "Puns": "雙關語",
            "Sleepyhead": "睡懶覺",/*瞌睡蟲*/
            "Stubborn": "倔強",/*固執*/
            "Granddaughter": "孫女",
            "Half-orphan": "半孤兒",/*無父或無母*/
            "Dancing": "跳舞",

            "Parted in Middle": "中分",
            "Headband": "頭帶",
            "Jacket": "夾克",
            "Brocon": "兄控弟控",/*todo 已解決 兄弟情結 Brother complex,https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%A9%E3%82%B6%E3%83%BC%E3%82%B3%E3%83%B3%E3%83%97%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9*/
            "Confident": "自信",
            "Assertive": "獨斷專行",/*todo 自信/果敢/武斷*/
            "Insightful": "富有洞察力",/*精明*/
            "Sly": "狡猾",
            "Coach": "教練",
            "Full Sister": "親姐妹",
            "Younger Sister": "妹妹",/*妹*/
            "Not Sexually Involved": "不涉及性",/*沒有性行為*/

            "Curtained": "窗簾式劉海",/*https://en.wikipedia.org/wiki/Curtained_hair*/
            "Kitsuneme": "眯眯眼(キツネ目)",/*狐狸眼*/
            "Muscular": "肌肉發達",/*強健*/
            "Hotblooded": "熱血",
            "Loud": "大聲",/*大喊大叫*/
            "Full Brother": "親兄弟",
            "Older Brother": "哥哥",/*兄さん*/
            "Student Club President": "學生社團社長",

            "Young-adult": "青年",/*20-39*/
            "Bandanna": "頭巾",
            "Necklace": "項鍊",
            "Ara Ara": "經常使用\"あらあら\"",
            "Protective": "保護",/*保護傾向*/
            "Wise": "智慧",/*老練*/
            "Streetwise": "精明",
            "Cook": "廚師",
            "Shopkeeper": "店主",/*老闆,店鋪擁有者*/
            "Wife": "妻子",

            "Hidden": "隱藏",
            "Arrogant": "傲慢",
            "Narcissist": "自戀",
            "Grandiosit": "自大",
            "Overconfident": "自負",/*過於自信*/
            "No Name": "沒有名字",/*無名*/

            "Homosexual": "同性戀",

            "Wavy": "微卷",/*波浪,似卷非卷*/
            "Cyan": "青色",
            "Armband": "臂章",/*袖標*/
            "Microphone": "話筒",/*麥克風*/
            "School Committee Member":"校務委員會成員",
            "Broadcasting Committee Member": "廣播委員會成員",/*廣播站成員*/
            "Journalist": "記者",

            "Tiny Braid": "小辮子",
            "Twin Braids": "雙辮子",
            "Wristband": "腕帶",
            "Coodere": "冷嬌(クウデレ)",/*todo クウデレ 冷嬌 https://zh.moegirl.org.cn/%E5%86%B7%E5%A8%87,*/
            "Dandere": "默嬌(ダンデレ)",/*todo ダンデレ 默嬌 https://d.hatena.ne.jp/keyword/%E3%83%80%E3%83%B3%E3%83%87%E3%83%AC */
            "Loyal": "忠誠",
            "Stoic": "三無",/*todo https://zh.moegirl.org.cn/%E4%B8%89%E6%97%A0*/
            "Taciturn": "沉默寡言",

            "Dishonest": "不誠實",/*騙人*/
            "Foreigner": "外國人",/*外人*/
            "Ojousama": "大小姐(お嬢様)",/*お嬢様*/

            "Crop Top": "露臍上衣",
            "Cross Design": "十字架",
            "Lab Coat": "實驗服",/*白大褂*/
            "Shorts": "短褲",
            "Mentor": "導師",

            "Eye Covering": "遮眼",/*遮眼發*/
            "Red": "紅色",
            "Cold-hearted": "冷酷無情",/*冷酷*/
            "Haraguro": "腹黑",/*腹黒い https://zh.moegirl.org.cn/%E8%85%B9%E9%BB%91*/
            "Violent": "暴力",

            "Grey": "灰色",
            "Olive": "黃褐色",/*橄欖色*/
            "Collar": "衣領",/*領子/項圈*/
            "Spats": "緊身短褲",/*腳踏車短褲*/
            "Fanny Pack": "腰包",
            "Tomboy": "假小子",

            "Desu wa": "使用\"ですわ\"結尾",
            "Watakushi": "以\"わたくし\"自稱",

            "Hosome": "細眼(細目)",/*細目*/

            "Vendor": "供應商",

            "Pleated Skirt": "百褶裙",
            /*次要劇透*/
            "Envious": "嫉妒(羨慕)",/*吃醋*/
            "Nightgown": "睡衣",
            "Sun Hat": "太陽帽",
            "Turndown": "拒絕",
            "Weakness": "虛弱",/*體弱/病弱*/
            "Masochist": "受虐狂(M)",
            "Jealous": "嫉妒(嫉恨)",/*眼紅*/
            "Yandere": "病嬌(ヤンデレ)",
            /*主要劇透 無*/

            //</editor-fold>
            /*todo ----精翻,來源:https://vndb.org/v28666/chars#chars*/
            //<editor-fold desc="IDEA摺疊4.3.5">
            "Main character": "主要人物",
            "Turtleneck Shirt": "高領襯衫",/*卷領襯衫*/
            "Stethoscope": "聽診器",
            "No Sense of Direction": "沒有方向感",/*路痴/容易迷路*/
            "Pacifist": "愛好和平",/*和平主義者*/
            "Apprentice": "學徒",/*弟子/徒弟/學員*/
            "Onmyouji": "陰陽師",/*陰陽師*/
            "School Nurse": "護理老師",/*學校護士*/
            "Therapist": "心理治療師",/*心理醫生*/
            "Younger Brother": "弟弟",
            "Bridal Carry": "公主抱",
            "Drinking": "飲酒",/*喝酒*/

            "Flat Chest": "平胸",
            "Younger Appearance": "外表年輕",/*比看起來更老*/
            "Straw Hat": "草帽",
            "Wedge Sandals": "坡跟涼鞋",/*楔形涼鞋*/
            "Toy": "玩具",
            "Immature": "孩子氣",/*幼稚/不成熟/孩子氣*/
            "Tsundere":"傲嬌",/*つん‐でれ ツンデレ*/
            "Modern Tsundere": "現代傲嬌'",/*todo 在敵意與戀愛間相互切換*/
            "Magician": "魔術師",/*魔法師*/
            "Pre-Story Virginity Loss to Protagonist": "故事開始前童貞就給了主角",
            "Spirit": "靈魂",/*幽靈,靈魂*/
            "Fighting": "戰鬥",/*戰鬥/格鬥/對抗/搏鬥*/

            "No image": "沒有圖片",/*沒有圖片*/
            "Inn Manager": "客棧老闆",/*女將*/
            "Single Parent": "單身父母",/*單親*/
            "Widow": "寡婦",

            "Skirt": "裙子",
            "Waitstaff Uniform": "服務員制服",
            "Older Sister": "姐姐",
            "Twin Sister": "雙胞胎姐妹",/*孿生姐妹*/
            "Fainting": "昏厥",/*暈倒*/

            "Small Breasts": "小胸",
            "Blouse": "女式襯衫",
            "Coat": "外套",/*大衣*/
            "Hair Ribbon": "髮帶",
            "Health Committee Member": "健康委員會成員",/*保健委員會成員*/
            "Secretary": "秘書",/*行政助理*/

            "Camera": "照相機",
            "Prostitute": "妓女",/*婊子/蕩婦/賣淫者*/
            "Photography": "攝影",/*拍照/照相*/

            "Over The Knee Socks": "過膝襪",
            "Sweater": "毛衣",
            "Coward": "懦夫",/*膽小鬼*/
            "Unlucky": "倒黴",/*不幸/晦氣*/
            "Roommate": "室友",/*舍友*/
            "Student Council Member": "學生會成員",

            "Hair Flower": "花卉頭飾",/*花卉髮夾*/

            "Age": "年齡",
            "Brooch": "胸針",/*別針/飾針*/
            "Fingerless Gloves": "無指手套",/*不覆蓋手指的手套*/
            "Gothic": "哥特",/*哥特式*/
            "Headscarf": "頭巾",
            "Kimono": "和服",
            "Lolita": "洛麗塔",/*Lolita*/
            "Mini Hat": "哥特式洛麗塔帽",/*洛麗塔禮帽/哥特蘿莉帽/小禮帽*/
            "No Panties": "不穿內褲",/*真空/無內褲*/
            "Stockings": "長襪",
            "String Instrument": "絃樂器",
            "Civil Servant": "公務員",
            "Medical Doctor": "醫生",

            "Old": "老年",/*年長/年邁*/
            "Vice Principal": "副校長",
            "Guilt": "內疚",/*負罪感*/

            "Archaic Dialect": "古方言",/*古語言*/
            "Wagahai": "以\"吾輩\"自稱",
            "Wolf": "狼",
            "Henshin": "變身",

            "Coworker": "同事",

            "Shinto Priest": "神道教神主",/*神道教祭司/教士/牧師*/

            "Low Alcohol Tolerance": "酒量差",/*酒量不行/低酒精耐受性*/
            "Politician": "政治家",/*政客/從政者*/
            "Principal": "校長",

            "Off-The-Shoulder Shirt": "露肩襯衫",/*無肩襯衫*/

            "Spear": "長槍",/*長矛*/
            "Honorable": "榮譽",/*todo 正直/義/榮耀/光榮/武士道/騎士精神/公正*/
            /*次要劇透*/
            "Sex Education Teacher": "性教育老師",

            "Bedridden": "纏綿病榻",/*長期臥床/臥床不起*/

            "Mon": "使用\"もん\"結尾",
            "Nightmares": "惡夢",/*噩夢*/
            "Assault": "襲擊",/*突擊/攻擊*/
            /*主要劇透*/
            "Protagonists": "主角",
            "Reincarnation": "轉世",/*輪迴/投胎/轉生*/

            "Ambitious": "雄心勃勃",
            "Family Oriented": "家庭觀念",/*以家庭為重/注重家庭/家族觀念*/
            "Bisexual": "雙性戀",
            "Class President": "班長",
            "Middle School Student": "初中生",/*中學生*/
            "Cleaning": "清潔衛生",/*打掃*/
            "Accident": "意外事故",
            "Death": "死亡",

            "Disappearance": "消失",/*消逝/失蹤*/

            "Distrustful": "不信任他人",/*多疑*/
            "Superstitious": "迷信",
            "Living Alone": "獨居",/*一人暮らし,一個人住*/
            "Orphan": "孤兒",
            "Repeater": "留級生",
            "Skipping School": "逃學",/*逃課*/
            "Terminal Illness": "絕症",/*身患絕症/致命疾病*/

            "Half-breed": "混血兒",
            "Longevity": "長生",/*長命/長壽/長生不老*/
            "Attempted Murder": "謀殺未遂",/*企圖謀殺*/
            "Grief": "悲傷",/*悲痛*/

            "Sensitive": "敏感",/*脆弱*/
            /*性徵*/
            "Nipple Sucking": "吮吸乳頭",
            "Nipple Teasing": "逗弄乳頭",/*挑逗乳頭/玩弄乳頭*/
            "Ball-cupping": "逗弄球",/*逗弄陰囊*/
            "Bodysponge": "身體海綿",
            "Naked (Not Sexually Involved)": "裸體(不涉及性)",/*裸體(沒有性行為)*/
            "Naizuri": "銼刀",/*無效乳交/鐵板/貧乳乳交 https://zh.moegirl.org.cn/%E9%94%89%E5%88%80*/
            //</editor-fold>
            /*todo ----精翻,來源:https://vndb.org/v33099/chars#chars*/
            //<editor-fold desc="IDEA摺疊4.3.6">
            /*次要劇透*/
            "Exorcist": "祓魔師",/*驅魔人/驅邪師/祓魔師*/
            "Multilingual": "多語言",/*多語言精通*/
            "Pseudonym": "假名",/*化名*/
            "Soldier": "軍人",/*士兵*/

            "Antagonist": "對手",/*敵手/敵對者*/
            "Prisoner": "囚犯",/*犯人/囚徒/在押犯*/
            "Rebellion": "謀反",/*暴動/叛亂*/

            "Present in Flashbacks Only": "只出現在回憶中",/*閃回/回顧*/
            /*主要劇透*/
            "Demigod": "半神",

            "Self-sacrifice": "自我犧牲",/*殉道*/

            "Escape From Confinement": "逃離監禁",/*逃跑/越獄*/
            "Murder": "謀殺",
            //</editor-fold>
            /*todo ----精翻,來源:https://vndb.org/v12992/chars#chars*/
            //<editor-fold desc="IDEA摺疊4.3.7">
            "Cynic": "極端利己",/*認為人皆自私/極端利己而不講道義/只顧自己不顧他人,排除:憤世嫉俗,犬儒*/

            "Heterochromia": "異色眼",/*異色症,異色*/
            "Bell": "鈴鐺",
            "Bra": "胸罩",/*文胸,內衣*/
            "Decorative Belt": "裝飾腰帶",/*時尚腰帶*/
            "Shimapan": "條紋內褲",/*しまぱん/縞パンツ*/
            "Veil": "面紗",
            "Ane Act": "假裝姐姐",/*姐姐扮演/假裝姐姐*/

            "Central Heterochromia": "瞳孔異色",/*異色瞳孔/虹膜異色/中央異色症*/
            "Short (obsolete)": "矮小(過時)",
            "Naked Apron": "裸體圍裙",
            "Top Hat": "禮帽",/*高帽/圓帽/大禮帽*/

            "Crown": "王冠",/*皇冠*/
            "Evening Gloves": "晚裝手套",/*todo 歌劇手套 https://en.wikipedia.org/wiki/Evening_glove*/
            "High Heeled Shoes": "高跟鞋",
            "Ignorant": "缺乏常識",/*無知/不通世故*/
            "Nature Lover": "熱愛大自然",/*自然愛好者*/
            "Lonely": "孤獨",/*寂寞,孤單*/
            "Princess": "公主",

            "Torn Pantyhose (damaged)": "撕裂的褲襪(受損)",/*撕破*/
            "Book": "書",/*書籍/冊子*/
            "Stutter": "口吃",/*結巴*/
            "Rabbit": "兔子",
            "Nymphomania": "性慾亢進",/*性成癮/色情狂/慕男狂/性慾旺盛/性慾亢進*/

            "Ankle Length": "及地長髮",
            "BL Fan": "BL愛好者",/*腐女/腐男*/
            "Famous": "出名",/*著名,知名,有名,聞名,名人*/
            "Writer": "作家",/*文學家*/

            "Jitome": "鄙視眼(ジト目)",/*todo 半睜眼 https://zh.moegirl.org.cn/%E5%8D%8A%E7%9D%81%E7%9C%BC https://dic.nicovideo.jp/a/%E3%82%B8%E3%83%88%E7%9B%AE*/
            "Obedient": "順從",/*聽話,服從*/
            "Maid": "女僕",/*女傭*/
            "Robot": "機器人",
            "Domestic Violence": "家庭暴力",

            "Scar": "疤痕°",/*傷疤/傷痕*/

            "Butt Monkey": "搞笑角色",/*笑話角色*/

            "Sport Bloomers": "運動燈籠褲(ブルマー)",/*ブルマー*/
            /*主要劇透*/
            "Secret Identity": "秘密身份",
            "Memory Alteration": "記憶改變",

            "Dimensional Travel": "次元旅行",/*空間旅行/維度旅行*/
            "Forgotten": "遺忘",/*忘卻/忘記*/

            "Healer": "治療師",/*醫治者*/
            "Childbirth": "分娩",
            /*性徵*/
            "Tominagi": "跪式蜷縮蝴蝶'",/*とみなぎ*/
            "Balls Sucking": "吸球",/*吮吸蛋蛋*/
            "Boobs on Glass": "胸部壓在玻璃上",/*玻璃上的胸部/乳房*/
            "Vaginal/Anal Sexual Toys": "陰道/肛門性玩具",
            "Sadist": "虐待狂(S)",
            "Sexual Sadism": "性虐待狂",
            //</editor-fold>
            //一些常用的tag
            "Nakige":"暖人心田",//泣
            "Body Swapping":"身體互換",
            "Possession":"附體",//附身
            "Body Swap":"身體互換",
            "Panchira":"不小心漏出內褲(パンチラ)",//無意漏出內褲/不小心漏出內褲/內褲鏡頭
            "Baby-doll":"娃娃裝睡衣",//輕薄透明,揹帶裙睡衣
            "Open Cup Baby-doll":"漏胸娃娃裝睡衣",
            "Astral Projection":"靈魂出竅",
            "Sexual Dominant":"性主導",//性優勢
        },
        titleMap:{},
        specialMap:{
            /*匹配審批頁https://vndb.org/i/list*/
            "^([A-Za-z ()]+?) /$":"%%$1%% /",
            /*尺寸*/
            "^Height: ([\\dcm]+), Weight: ([\\dkg]+), Bust-Waist-Hips: ([\\dcm-]+)$": "身高: $1, 體重: $2, 三圍: $3",
            "^Height: ([\\dcm]+), Bust-Waist-Hips: ([\\dcm-]+)": "身高: $1, 三圍: $2",
            /*特徵|標籤導航欄尾部*/
            // "^> ([A-Za-z \(\)]+?)$":"> %%$1%%",
            /*VN頁工作人員,分詞翻譯*/
            "^([A-Za-z- ]+), ([A-Za-z- ]+), ([A-Za-z- ]+)$":"%%$1%%,%%$2%%,%%$3%%",
            /*圖片型別標記*/
            "^Safe / Tame \\((\\d+)\\)$":"健康 / 溫馴 ($1)",
        },
    },
    {
        name:'評論|他人的評論列表',
        regular:/^\/w/i,
        map:{
            /*列表頁*/
            "Type": "型別",
            "Review": "評論",
            "C#":"評論",
            "Last comment": "最後評論",
            "Full": "完全",
            "Mini": "迷你",
            /*評論詳情頁*/
            "Was this review helpful?": "此評論對您有用嗎？",
            "yes": "是",
            "no": "否",
            "Comments": "評論",
        },
        titleMap:{},
        specialMap:{
            /*評論詳情頁*/
            "Vote: (\\d+)": "評分: $1",
            "(\\d+) points": "$1個得分",
        },
    },
    {
        name:'封面外掛翻譯',
        regular:/^\/(v$|u\d+)/i,
        map:{
            /*VNDB封面外掛翻譯*/
            "Always Show the VN Info": "始終顯示 VN 資訊",
            "Show NSFW Covers": "顯示 NSFW 封面",
            "Disable tooltip": "禁用工具提示",
            "Skip Additional Info": "跳過附加資訊",
            "Async Cover": "非同步封面",
            "Query Mode": "查詢方式",
            "Legacy View": "舊版檢視",
            /*封面上的文字*/
            "Status:": "狀態:",
            "Release(s):": "版本:",
            "Rating:": "評價:",
            "Cast date:": "	新增時間:",
            "No English translation": "沒有英文翻譯",
            "Has English translation": "有英文翻譯",
            "Has partial English translation": "有部分英文翻譯",
            "English translation planned":"有英語翻譯的計劃",
            "Translation Planned.":"翻譯計劃完成",
            "Translation Available.":"翻譯可用",
            "No Translation Available":"沒有可用的翻譯",
            "Length unknown.": "長度未知.",
            "[ Read more... ]": "[閱讀更多...]",
        },
        titleMap:{},
        specialMap:{},
    },
    {
        name:'規則說明',
        regular:/^\//i,
        map:{},
        titleMap:{},
        specialMap:{},
    },
];
