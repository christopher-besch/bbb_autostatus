"use strict";
document.body.style.border = "5px solid green";
function expand(element) {
    // only if necessary
    const expanded = JSON.parse(element.getAttribute("aria-expanded"));
    if (!expanded)
        element.click();
}
function get_all_users() {
    const users = document.getElementsByClassName("userName--6aS3s");
    return users;
}
function get_current_user() {
    const users = get_all_users();
    for (let user of users) {
        const aria_labels = user.getAttribute("aria-label").split(" ");
        if (aria_labels.indexOf("You") > -1)
            return user;
    }
    throw new Error("unable to find current user");
}
function get_status(user) {
    const parent = user.parentElement;
    const avatar = parent.getElementsByClassName("avatar--Z2lyL8K")[0];
    const avatar_status = avatar.children[1];
    // none status
    if (avatar_status.childElementCount == 0)
        return 1;
    const avatar_icon = avatar_status.children[0];
    const avatar_icon_classes = avatar_icon.classList;
    for (let icon in status_icons)
        if (avatar_icon_classes.contains(icon))
            return status_icons[icon];
    throw new Error("unable to find status icon");
}
function update_status(status) {
    const current_user = get_current_user();
    // already satisfied?
    let current_status = get_status(current_user);
    if (status == current_status)
        return;
    expand(current_user);
    // get pallet
    const tertiary_parent = current_user.parentElement
        .parentElement.parentElement;
    const pallet = tertiary_parent.getElementsByClassName("verticalList--Ghtxj")[0];
    const pallet_options = pallet.children;
    switch (status) {
        case 1: {
            // collapse if necessary
            if (pallet_options.length == 11)
                pallet_options[0].click();
            break;
        }
        default: {
            // expand if necessary
            if (pallet_options.length != 11)
                pallet_options[0].click();
            break;
        }
    }
    pallet_options[status].click();
}
const status_icons = {
    "icon-bbb-time": 2,
    "icon-bbb-hand": 3,
    "icon-bbb-undecided": 4,
    "icon-bbb-confused": 5,
    "icon-bbb-sad": 6,
    "icon-bbb-happy": 7,
    "icon-bbb-applause": 8,
    "icon-bbb-thumbs_up": 9,
    "icon-bbb-thumbs_down": 10,
};
// handle content message
browser.runtime.onMessage.addListener((msg) => {
    switch (msg.command) {
        case "update_status": {
            update_status(msg.status);
            break;
        }
    }
});
//# sourceMappingURL=content.js.map