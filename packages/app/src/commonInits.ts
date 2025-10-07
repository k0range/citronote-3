export function cacheTheme() {
  if (typeof window === "undefined" || !document?.body) return;
  const style = getComputedStyle(document.body);
  
  try {
    const colorBackground1 = style
      .getPropertyValue("--color-background-1")
      .trim();
    const colorColor = style.getPropertyValue("--color-color").trim ();
    localStorage.setItem(
      "themeCache",
      JSON.stringify({
        background1: colorBackground1,
        color: colorColor,
      }),
    );
  } catch {
    // ignore: localStorageが無い場合など
  }
}

export function clearLoading() {
  // ロード画面を削除
  const loadingElem = document.getElementById("loading");
  if (loadingElem) {
    loadingElem.classList.add("fadeout");
    loadingElem.addEventListener("transitionend", () => {
      loadingElem.remove();
    }, { once: true });
  }

  // ロード画面のスタイル変数を削除
  document.documentElement.style.removeProperty("--color-background-1");
  document.documentElement.style.removeProperty("--color-color");
}
