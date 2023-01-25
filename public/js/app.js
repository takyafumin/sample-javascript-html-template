// selector
const SELECTOR_BTN_ADD = '.btn-add-template';
const SELECTOR_FLEXBLE_ITEM = '.flexble-item';
const SELECTOR_TMPL_BTN_DEL = '#flexble-btn-delete-0';
const SELECTOR_TMPL_TXT_NOTE = '#flexble-txt-note-0';
const SELECTOR_TMPL_LBL_NOTE = '#flexble-lbl-note-0';

// Flexble-container Element
// Template Element
const containerElement = document.getElementById('flexble-container');
const templateElement = document.querySelector('#template');


/**
 * 画面初期化処理
 */
const initForm = function () {
    // 追加ボタン
    document.querySelector(SELECTOR_BTN_ADD)
        .addEventListener('click', addTemplate);
}


/**
 * テンプレート追加処理
 */
const addTemplate = function () {

    // Template Elementをclone
    const cloneItem = templateElement.content.cloneNode(true);

    // cloneを書き換え
    const renumberdItem = rewriteFlexbleItemAttributes(
        cloneItem,
        SELECTOR_TMPL_LBL_NOTE,
        SELECTOR_TMPL_TXT_NOTE,
        SELECTOR_TMPL_BTN_DEL,
        document.querySelectorAll(SELECTOR_FLEXBLE_ITEM).length + 1
    );

    // render(追加)
    containerElement.appendChild(renumberdItem);
}


/**
 * Flexble Item削除処理
 */
const deleteOwnFlexbleItem = function () {
    // Flexble Item削除
    const flexbleItem = this.parentNode.parentNode;
    flexbleItem.remove();

    // index番号を採番しなおす
    renumberFlexbleItems();
}


/**
 * Flexble Itemの番号を採番しなおす
 */
const renumberFlexbleItems = function () {
    // Flexble Items
    const items = document.querySelectorAll(SELECTOR_FLEXBLE_ITEM);
    if (items.length === 0) {
        // Itemが無ければ終了
        return;
    }

    // 採番しなおし用にclone
    const clonedItems = Array.from(items).map(function (item) {
        return item.cloneNode(true);
    });

    // 採番しなおし
    const renumberedItems = clonedItems.map(function (item, index) {
        const number = index + 1;
        const selectorLabelNote = "[id^='flexble-lbl-note']";
        const selectorTextNote = "[id^='flexble-txt-note']";
        const selectorButton = "[id^='flexble-btn-delete']";

        return rewriteFlexbleItemAttributes(
            item,
            selectorLabelNote,
            selectorTextNote,
            selectorButton,
            number
        );
    });

    // --------------------
    // 元のFlexble Itemsを削除して
    // ナンバリング後のFlexble Itemsをrender
    // --------------------
    items.forEach((item) => item.remove());
    for (let i = 0; i < renumberedItems.length; i++) {
        containerElement.appendChild(renumberedItems[i]);
    }
}


/**
 * Flexble Itemの属性を書き換える
 *
 * @param {Node} flexbleItem Flexble Item Node
 * @param {string} selectorLabelNote ラベルのセレクタ
 * @param {string} selectorTextNote テキストのセレクタ
 * @param {string} selectorButton ボタンのセレクタ
 * @param {string} number 番号
 * @returns Node
 */
const rewriteFlexbleItemAttributes = function (flexbleItem, selectorLabelNote, selectorTextNote, selectorButton, number) {

    const label = flexbleItem.querySelector(selectorLabelNote);
    label.id = renumberAttribute(label.id, number);
    label.htmlFor = renumberAttribute(label.htmlFor, number);
    label.innerText = '備考' + number;

    const text = flexbleItem.querySelector(selectorTextNote);
    text.id = renumberAttribute(text.id, number);

    const btn = flexbleItem.querySelector(selectorButton);
    btn.id = renumberAttribute(btn.id, number);
    btn.addEventListener('click', deleteOwnFlexbleItem);

    return flexbleItem;
}


/**
 * ナンバリングしなおす
 *
 * @param string target 書き換え対象の属性文字列
 * @param string number 設定するナンバー
 * @param string sepalator 区切り文字
 */
const renumberAttribute = function (target, number, sepalator = '-') {
    // 区切り文字でtokenに分割
    // xxx-xxx-xx-99 => [xxx, xxx, xx, 99]
    const tokens = target.split(sepalator);

    // 最後のtokenを差し替え
    tokens[tokens.length - 1] = number;

    // 文字列結合して返却
    return tokens.join(sepalator);
}


// 画面初期化
initForm();

