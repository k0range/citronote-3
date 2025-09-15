export function cacheTheme() {
  const style = getComputedStyle(document.body);
  const colorBackground1 = style
    .getPropertyValue("--color-background-1")
    .trim();
  const colorColor = style.getPropertyValue("--color-color").trim();
  localStorage.setItem(
    "themeCache",
    JSON.stringify({
      background1: colorBackground1,
      color: colorColor,
    }),
  );
}

export function clearLoading() {
  // ロード画面を削除
  const loadingElem = document.getElementById("loading");
  if (loadingElem) {
    loadingElem.classList.add("fadeout");
    loadingElem.addEventListener("transitionend", () => {
      loadingElem.remove();
    });
  }

  // ロード画面のスタイル変数を削除
  document.documentElement.style.removeProperty("--color-background-1");
  document.documentElement.style.removeProperty("--color-color");
}
