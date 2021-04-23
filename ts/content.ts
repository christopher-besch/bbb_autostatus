declare var browser: any;
document.body.style.border = "5px solid green";

function expand(element: HTMLElement): void {
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
    // update status
    for (let user of users) {
        const aria_labels = (user.getAttribute("aria-label") as string).split(" ");
        if (aria_labels.indexOf("You") > -1) return user;
    }
    throw new Error("unable to find current user");
}

function get_status_pallet(user: HTMLDivElement): HTMLCollectionOf<HTMLElement> {
    const tertiary_parent = ((user.parentElement as HTMLDivElement).parentElement as HTMLDivElement)
        .parentElement as HTMLDivElement;

    const pallet = (tertiary_parent.getElementsByClassName(
        "verticalList--Ghtxj"
    ) as HTMLCollectionOf<HTMLUListElement>)[0];

    const pallet_options = pallet.children as HTMLCollectionOf<HTMLElement>;
    // expand
    if (pallet_options.length != 11) pallet_options[0].click();
    return pallet_options;
}

function update_status(status: string): void {
    const current_user = get_current_user();
    expand(current_user);
    const pallet = get_status_pallet(current_user);

    pallet[status_codes[status]].click();
}

const status_codes: { [name: string]: number } = {
    time: 2,
    hand: 3,
    undecided: 4,
    confused: 5,
    sad: 6,
    happy: 7,
    applause: 8,
    thumbs_up: 9,
    thumbs_down: 10,
};
// read message from background
browser.runtime.onMessage.addListener((msg: any) => {
    switch (msg.command) {
        case "update_status": {
            update_status(msg.status);
            break;
        }
    }
});

// todo: remove status
