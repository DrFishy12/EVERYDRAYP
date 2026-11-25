# EVERYDRAYP

דף נחיתה לנועה, מדריכת פילאטיס מוסמכת: אימונים פרטיים לנשים, עד הבית.

אתר סטטי (HTML, CSS, JavaScript) בלי שלב בנייה. אפשר לפתוח את `index.html` ישירות בדפדפן.

## מבנה

```
index.html        כל התוכן של הדף
css/style.css     עיצוב ואנימציות
js/main.js        מספר טלפון, וואטסאפ ואינטראקציות
assets/           אייקון ותמונות
```

## עדכון מספר הטלפון וההודעה בוואטסאפ

כל ההגדרות נמצאות בראש הקובץ `js/main.js`, באובייקט `CONFIG`:

```js
const CONFIG = {
  phoneIntl: '972547761974',     // 972 + המספר בלי ה-0 בהתחלה
  phoneDisplay: '054-776-1974',  // איך המספר מוצג באתר
  waMessage: 'היי נועה! ...'     // ההודעה המוכנה בוואטסאפ
};
```

שינוי במקום אחד מעדכן את כל הכפתורים באתר: וואטסאפ, חיוג והעתקת המספר.

## תמונה של נועה

בכרטיס "היי, אני נועה" יש עיגול עם האות נ. כדי לשים תמונה במקומו, שמרו את התמונה בשם `assets/noa.jpg`
והחליפו ב-`index.html` את השורה `<span class="avatar-in" aria-hidden="true">נ</span>` בשורה:

```html
<img src="assets/noa.jpg" alt="נועה">
```

## העלאה לאוויר (GitHub Pages)

ב-GitHub: Settings ← Pages ← Source: Deploy from a branch ← Branch: `main`, תיקייה `/ (root)` ← Save.
האתר יעלה בכתובת https://drfishy12.github.io/EVERYDRAYP/

## הרצה מקומית

```bash
python3 -m http.server 8000
```

ואז לפתוח בדפדפן: http://localhost:8000
