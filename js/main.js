"use strict";
/* ハンバーガーメニュー */
function hamburger() {
  document.getElementById("line1").classList.toggle("line_1");
  document.getElementById("line2").classList.toggle("line_2");
  document.getElementById("line3").classList.toggle("line_3");
  document.getElementById("nav").classList.toggle("in");
  document.getElementById("bg").classList.toggle("open");
  document.querySelector("body").classList.toggle("hidden");
}
/* click */
document.getElementById("hamburger").addEventListener("click", function () {
  hamburger();
});
document.getElementById("bg").addEventListener("click", function () {
  hamburger();
});
// navメニュー
document.getElementById("nav").addEventListener("click", hamburger);

// バーガー色変化
window.addEventListener("scroll", function () {
  const line = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");
  const nowY = window.pageYOffset;
  const fv = document.getElementById("fv").clientHeight;
  line.classList.toggle("change", nowY > fv - 30);
  line2.classList.toggle("change", nowY > fv - 30);
  line3.classList.toggle("change", nowY > fv - 30);
});

// topへ戻るbtn
function scrollTop(el, duration) {
  const target = document.getElementById(el);
  target.addEventListener("click", function () {
    let currentY = window.pageYOffset; // 現在のスクロール位置を取得
    let step = duration / currentY > 1 ? 10 : 100; // 三項演算子
    let timeStep = (duration / currentY) * step; // スクロール時間
    let intervalId = setInterval(scrollUp, timeStep);
    // timeStepの間隔でscrollUpを繰り返す。再帰的
    // clearItervalのために返り値intervalIdを定義する。

    // setInterval()繰り返し処理
    // clearIterval()⇧ストップ

    function scrollUp() {
      currentY = window.pageYOffset;
      if (currentY === 0) {
        clearInterval(intervalId); // ページ最上部に来たら終了
      } else {
        scrollBy(0, -step); // step分上へスクロール
      }
    }
  });
}
// スクロールトップボタン
scrollTop("page-top", 180); // 遅すぎるとガクガクになるので注意

// スクロール表示
const pagetop = document.getElementById("page-top");
window.addEventListener("scroll", function () {
  const nowY = window.pageYOffset;

  if (nowY > 100) {
    setTimeout(function () {
      pagetop.style.opacity = 1;
    }, 10);
  } else {
    setTimeout(function () {
      pagetop.style.opacity = 0;
    }, 10);
  }
});

// 100vh
// 1.関数の定義
function setHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
// 2.初期化
setHeight();
// 3.ブラウザのサイズが変更された時・画面の向きを変えた時に再計算する
window.addEventListener("resize", setHeight);

// aタグ スムーズスクロール
/**
 * スムーススクロール実行関数
 */
let smoothScroll = (target) => {
  let toY;
  let nowY = window.pageYOffset; //現在のスクロール値
  const divisor = 10; //近づく割合（数値が大きいほどゆっくり近く）
  const range = divisor / 2 + 1; //どこまで近づけば処理を終了するか(無限ループにならないように divisor から算出)

  //ターゲットの座標
  const targetRect = target.getBoundingClientRect(); //ターゲットの座標取得
  const targetY = targetRect.top + nowY; //現在のスクロール値 座標
  //スクロール終了まで繰り返す処理
  function repeatScroll() {
    toY = nowY + Math.round((targetY - nowY) / divisor); //次に移動する場所（近く割合は除数による。）
    window.scrollTo(0, toY); //スクロールさせる
    nowY = toY; //nowY更新

    if (document.body.clientHeight - window.innerHeight < toY) {
      //最下部にスクロールしても対象まで届かない場合は下限までスクロールして強制終了
      window.scrollTo(0, document.body.clientHeight);
      return;
    }
    if (toY >= targetY + range || toY <= targetY - range) {
      //+-rangeの範囲内へ近くまで繰り返す
      window.setTimeout(function () {
        repeatScroll();
      }, 20);
    } else {
      //+-range の範囲内にくれば正確な値へ移動して終了。
      window.scrollTo(0, targetY);
    }
  }
  repeatScroll();
};

/**
 * アンカータグにクリックイベントを登録
 */

const links = document.querySelectorAll('a[href*="#"]'); //#がリンクに含まれているアンカータグを全て取得
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    const href = e.currentTarget.getAttribute("href"); //href取得
    const splitHref = href.split("#");
    const targetID = splitHref[1];
    const target = document.getElementById(targetID); //リンク先の要素（ターゲット）取得

    if (target) {
      smoothScroll(target);
    } else {
      return true;
    }
    return false;
  });
}

//スライダー
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const area = document.getElementById("area");

const area_item = document.querySelectorAll(".concept__box");

const listwidth = document.querySelector(".concept__box");
let width = listwidth.clientWidth;
let counter = 0;

// prevボタン処理
prev.addEventListener("click", function () {
  if (counter == area_item.length - area_item.length) return; //連打対策
  // 動いているタイマーをストップして再度タイマーを動かし直す（こうしないとページ送り後の秒間隔がズレる）
  stopTimer();
  startTimer();
  next.style.opacity = 1;
  counter--;
  area.style.transform = "translateX(" + -width * counter + "px)";

  area.addEventListener("transitionend", function () {
    if (counter == area_item.length - area_item.length) {
      prev.style.opacity = 0;
    }
  });
});

// nextボタン処理
next.addEventListener("click", function () {
  if (counter >= area_item.length - 1) {
    next.style.opacity = 0;
    return; //連打対策
  }
  // 動いているタイマーをストップして再度タイマーを動かし直す（こうしないとページ送り後の秒間隔がズレる）
  stopTimer();
  startTimer();
  prev.style.opacity = 1;
  counter++;
  area.style.transform = "translateX(" + -width * counter + "px)";
  // console.log(counter);
});

// 最後のliタグ（画像）が表示された時の処理
area.addEventListener("transitionend", function () {
  if (counter == area_item.length - 1) {
    next.style.opacity = 0;
  }
});

/* 自動スライダー */

function slide() {
  if (counter == area_item.length - 1) {
    counter = 0;
    area.style.transform = "translateX(0)";
    next.style.opacity = 1;
    prev.style.opacity = 0;
  } else {
    // console.log(counter);
    counter++;
    area.style.transform = "translateX(" + -width * counter + "px)";
  }
  if (counter == 1) {
    prev.style.opacity = 1;
  }
}
/* slide関数を○秒ごとに実行 clearInterval(タイマーID)のためにintervalへ*/
// スタート
let interval = setInterval(slide, 5000);
function startTimer() {
  interval = setInterval(slide, 5000);
}
// ストップ
function stopTimer() {
  clearInterval(interval); // clearInterval・・・setIntervalで設定したタイマーを取り消す
}

/* window幅変化対応 */
(function () {
  let timer = "";
  window.onresize = function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      width = listwidth.clientWidth;
      //ページを更新する
      // document.location.reload();
    }, 300);
  };
})();

// アコーディオンメニュー
// DOMContentLoadedイベントはDOMツリーの構築が完了した時点で発火
document.addEventListener("DOMContentLoaded", () => {
  // 1. ‘.js-acd-title’=クリックする要素を取得
  const title = document.querySelectorAll(".js-acd-title");
  // 定義
  function toggle() {
    const content = this.nextElementSibling;
    this.classList.toggle("is-active");
    content.classList.toggle("is-open");
  }
  // 2. for分で要素一つ一つに対して、クリックイベント
  for (let i = 0; i < title.length; i++) {
    title[i].addEventListener("click", toggle);
  }
});

// input[type="date"] の初期値日付
window.onload = function () {
  var today = new Date();
  today.setDate(today.getDate());
  var yyyy = today.getFullYear();
  var mm = ("0" + (today.getMonth() + 1)).slice(-2);
  var dd = ("0" + today.getDate()).slice(-2);
  document.getElementById("date").value = yyyy + "-" + mm + "-" + dd;
};
