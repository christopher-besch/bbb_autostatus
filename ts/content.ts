declare let browser: any;

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
        // match with "You" in aria-label
        const aria_labels = (user.getAttribute("aria-label") as string).split(" ");
        if (aria_labels.indexOf("You") > -1 || aria_labels.indexOf("Sie") > -1) return user;
    }
    // default return first user
    console.log("can't find current user; defaulting to first user.");
    return users[0];
}

function get_status(user: HTMLDivElement): number {
    const parent = user.parentElement as HTMLDivElement;
    const avatar = (parent.getElementsByClassName(
        "avatar--Z2lyL8K"
    ) as HTMLCollectionOf<HTMLDivElement>)[0];
    const avatar_status = avatar.children[1] as HTMLDivElement;
    // none status if no icon
    if (avatar_status.childElementCount == 0) return 1;
    // other status according to displayed icon
    const avatar_icon = avatar_status.children[0] as HTMLElement;
    for (let icon in status_icons)
        if (avatar_icon.classList.contains(icon)) return status_icons[icon];
    throw new Error("unable to find status icon");
}

// get most popular status under all users
function get_best_status(forbidden_statuses: { [status: number]: boolean }): number {
    const users = get_all_users();
    let scores: number[][] = [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [8, 0],
        [9, 0],
        [10, 0],
    ];
    for (let user of users) {
        const status = get_status(user);
        // forbidden statuses get ignored
        if (!forbidden_statuses[status]) scores[get_status(user) - 1][1]++;
    }
    scores.sort((a, b) => {
        return b[1] - a[1];
    });
    return scores[0][0];
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
    if (
        // should be collapsed?
        (status == 1 && pallet_options.length == 11) ||
        // should be expanded?
        (status != 1 && pallet_options.length != 11)
    )
        pallet_options[0].click();

    // click status icon or remove status button
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
// todo: debug
document.body.style.border = "5px solid green";
// handle content message
browser.runtime.onMessage.addListener((msg: any) => {
    switch (msg.command) {
        case "update_status": {
            update_status(msg.status);
            break;
        }
        case "blend_in": {
            let best_status = get_best_status(msg.forbidden_statuses);
            update_status(best_status);
            console.log("best status is: " + best_status);
            break;
        }
        case "toggle_raise": {
            const current_user = get_current_user();
            const current_status = get_status(current_user);
            if (current_status == 3) update_status(1);
            else update_status(3);
        }
    }
});
