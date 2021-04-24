declare var browser: any;
document.body.style.border = "5px solid green";

function expand(element: HTMLElement): void {
    // only if necessary
    const expanded = JSON.parse(element.getAttribute("aria-expanded") as string);
    if (!expanded) element.click();
}

function get_all_users(): HTMLCollectionOf<HTMLDivElement> {
    const users = document.getElementsByClassName(
        "userName--6aS3s"
    ) as HTMLCollectionOf<HTMLDivElement>;
    return users;
}

function get_current_user(): HTMLDivElement {
    const users = get_all_users();
    for (let user of users) {
        const aria_labels = (user.getAttribute("aria-label") as string).split(" ");
        if (aria_labels.indexOf("You") > -1) return user;
    }
    throw new Error("unable to find current user");
}

function get_status(user: HTMLDivElement): number {
    const parent = user.parentElement as HTMLDivElement;
    const avatar = (parent.getElementsByClassName(
        "avatar--Z2lyL8K"
    ) as HTMLCollectionOf<HTMLDivElement>)[0];
    const avatar_status = avatar.children[1] as HTMLDivElement;
    // none status
    if (avatar_status.childElementCount == 0) return 1;

    const avatar_icon = avatar_status.children[0] as HTMLElement;
    const avatar_icon_classes = avatar_icon.classList;
    for (let icon in status_icons)
        if (avatar_icon_classes.contains(icon)) return status_icons[icon];
    throw new Error("unable to find status icon");
}

function update_status(status: number): void {
    const current_user = get_current_user();
    // already satisfied?
    let current_status = get_status(current_user);
    if (status == current_status) return;

    expand(current_user);

    // get pallet
    const tertiary_parent = ((current_user.parentElement as HTMLDivElement)
        .parentElement as HTMLDivElement).parentElement as HTMLDivElement;

    const pallet = (tertiary_parent.getElementsByClassName(
        "verticalList--Ghtxj"
    ) as HTMLCollectionOf<HTMLUListElement>)[0];

    const pallet_options = pallet.children as HTMLCollectionOf<HTMLElement>;
    switch (status) {
        case 1: {
            // collapse if necessary
            if (pallet_options.length == 11) pallet_options[0].click();
            break;
        }
        default: {
            // expand if necessary
            if (pallet_options.length != 11) pallet_options[0].click();
            break;
        }
    }
    pallet_options[status].click();
}

const status_icons: { [name: string]: number } = {
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
browser.runtime.onMessage.addListener((msg: any) => {
    switch (msg.command) {
        case "update_status": {
            update_status(msg.status);
            break;
        }
    }
});
